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
      toggleTaskCompleted: vi.fn()
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

      component.toggleCompleted(mockEvent);

      expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
    });

    it('should call taskStore.toggleTaskCompleted with correct parameters when task is not completed', () => {
      mockTask = { ...mockTask, completed: false };

      component.toggleCompleted(mockEvent);

      expect(mockTaskStore.toggleTaskCompleted).toHaveBeenCalledWith([
        'test-uuid-123',
        true
      ]);
    });

    it('should call taskStore.toggleTaskCompleted with correct parameters when task is completed', () => {
      mockTask = { ...mockTask, completed: true };

      component.toggleCompleted(mockEvent);

      expect(mockTaskStore.toggleTaskCompleted).toHaveBeenCalledWith([
        'test-uuid-123',
        false
      ]);
    });

    it('should toggle completed state correctly', () => {
      const task1 = { ...mockTask, completed: false };
      component.task = vi.fn(() => task1) as any;
      component.toggleCompleted(mockEvent);

      expect(mockTaskStore.toggleTaskCompleted).toHaveBeenCalledWith([
        'test-uuid-123',
        true
      ]);


      mockTaskStore.toggleTaskCompleted.mockClear();

      const task2 = { ...mockTask, completed: true };
      component.task = vi.fn(() => task2) as any;
      component.toggleCompleted(mockEvent);

      expect(mockTaskStore.toggleTaskCompleted).toHaveBeenCalledWith([
        'test-uuid-123',
        false
      ]);
    });

    it('should work with different task UUIDs', () => {
      const differentTask = {
        uuid: 'different-uuid-456',
        title: 'Different Task',
        description: 'Different Description',
        completed: false
      };

      component.task = vi.fn(() => differentTask) as any;
      component.toggleCompleted(mockEvent);

      expect(mockTaskStore.toggleTaskCompleted).toHaveBeenCalledWith([
        'different-uuid-456',
        true
      ]);
    });
  });

  describe('taskStore', () => {
    it('should have toggleTaskCompleted method on taskStore', () => {
      expect(component.taskStore.toggleTaskCompleted).toBeDefined();
      expect(typeof component.taskStore.toggleTaskCompleted).toBe('function');
    });
  });
});
