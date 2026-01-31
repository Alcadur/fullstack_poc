import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TaskListRow } from './task-list-row';
import { Task } from '@/models/task.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskStore } from '@/stores/task-store/task-store';

describe('TaskListRow', () => {
  let component: TaskListRow;
  let mockTaskStore: any;
  let mockTask: Task;
  let mockEvent: MouseEvent;
  let fixture: ComponentFixture<TaskListRow>;

  beforeEach(async () => {
    mockTaskStore = {
      updateTask: vi.fn()
    };

    mockTask = {
      uuid: 'test-uuid-123',
      title: 'Test Task',
      description: 'Test Description',
      completed: false,
      authorUuid: 'user1',
      steps: [],
    };

    mockEvent = {
      stopPropagation: vi.fn()
    } as unknown as MouseEvent;

    await TestBed.configureTestingModule({
      imports: [TaskListRow],
      providers: [
        { provide: TaskStore, useValue: mockTaskStore },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListRow);
    component = fixture.componentInstance;
    component.task = vi.fn(() => mockTask) as any;
  });

  describe('toggleCompleted', () => {
    it('should stop event propagation', () => {
      const mockEvent = {
        stopPropagation: vi.fn()
      } as unknown as MouseEvent;
      fixture.detectChanges()

      component.toggleCompleted(mockEvent);

      expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
    });

    it('should call taskStore.updateTask with correct parameters when task is not completed', () => {
      mockTask = { ...mockTask, completed: false };
      fixture.detectChanges()

      component.toggleCompleted(mockEvent);

      expect(mockTaskStore.updateTask).toHaveBeenCalledWith({...mockTask, completed: true});
    });

    it('should call taskStore.updateTask with correct parameters when task is completed', () => {
      mockTask = { ...mockTask, completed: true };
      fixture.detectChanges()

      component.toggleCompleted(mockEvent);

      expect(mockTaskStore.updateTask).toHaveBeenCalledWith({ ...mockTask, completed: false });
    });

    it('should toggle completed state correctly', () => {
      const task1 = { ...mockTask, completed: false };
      component.task = vi.fn(() => task1) as any;
      fixture.detectChanges()
      component.toggleCompleted(mockEvent);

      expect(mockTaskStore.updateTask).toHaveBeenCalledWith({...task1, completed: true});

      mockTaskStore.updateTask.mockClear();

      const task2 = { ...mockTask,  uuid: 'new-uuid-321', completed: true };
      component.task = vi.fn(() => task2) as any;
      component.ngOnInit();
      component.toggleCompleted(mockEvent);

      expect(mockTaskStore.updateTask).toHaveBeenCalledWith({...task2, completed: false});
    });
  });

  describe('taskStore', () => {
    it('should have updateTask method on taskStore', () => {
      expect(component.taskStore.updateTask).toBeDefined();
      expect(typeof component.taskStore.updateTask).toBe('function');
    });
  });
});
