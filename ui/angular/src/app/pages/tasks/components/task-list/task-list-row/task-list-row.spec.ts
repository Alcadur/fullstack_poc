import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TaskListRow } from './task-list-row';
import { Task } from '@/models/task.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskStore } from '@/stores/task-store/task-store';
import { MatCheckboxChange } from '@angular/material/checkbox';

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

  describe('ngOnInit', () => {
    it('should clone the input task into localTask', () => {
      fixture.detectChanges();

      expect(component.localTask).toEqual(mockTask);
      expect(component.localTask).not.toBe(mockTask);
    });
  });

  describe('toggleCompleted', () => {
    it('should stop event propagation', () => {
      const mockEvent = {
        stopPropagation: vi.fn()
      } as unknown as MouseEvent;
      fixture.detectChanges();

      component.toggleCompleted(mockEvent);

      expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
    });

    it('should toggle completed state on the local task and call updateTask', () => {
      mockTask = { ...mockTask, completed: false };
      fixture.detectChanges();

      component.toggleCompleted(mockEvent);

      expect(mockTaskStore.updateTask).toHaveBeenCalledWith({
        ...mockTask,
        completed: true
      });
      expect(mockTask.completed).toBe(false);
    });

    it('should toggle back to incomplete for a completed task', () => {
      mockTask = { ...mockTask, completed: true };
      fixture.detectChanges();

      component.toggleCompleted(mockEvent);

      expect(mockTaskStore.updateTask).toHaveBeenCalledWith({
        ...mockTask,
        completed: false
      });
      expect(mockTask.completed).toBe(true);
    });
  });

  describe('toggleStepsStatus', () => {
    it('should update step completion and call updateTask', () => {
      mockTask = {
        ...mockTask,
        steps: [
          { title: 'Step 1', completed: false },
          { title: 'Step 2', completed: true }
        ]
      };
      component.task = vi.fn(() => mockTask) as any;
      fixture.detectChanges();

      const event = { checked: true } as MatCheckboxChange;
      component.toggleStepsStatus(event, 0);

      expect(mockTaskStore.updateTask).toHaveBeenCalledWith({
        ...mockTask,
        steps: [
          { title: 'Step 1', completed: true },
          { title: 'Step 2', completed: true }
        ]
      });
      expect(mockTask.steps[0].completed).toBe(false);
    });
  });

  describe('taskStore', () => {
    it('should have updateTask method on taskStore', () => {
      expect(component.taskStore.updateTask).toBeDefined();
      expect(typeof component.taskStore.updateTask).toBe('function');
    });
  });
});
