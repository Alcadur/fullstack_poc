import { TestBed } from '@angular/core/testing';
import { TaskStore } from './task-store';
import { TaskHttpService } from '@/utils/taskHttp.service';
import { Task } from '@/models/task.model';
import { schedulerFactory } from '@/utils/test-helpers';
import { of, throwError } from 'rxjs';

describe('TaskStore', () => {
  let store: InstanceType<typeof TaskStore>;
  let mockHttpService: any;

  const mockToDoTasks: Task[] = [
    { uuid: '1', title: 'Task 1', authorUuid: 'user1', description: 'Description 1', completed: false, steps: [] },
    { uuid: '2', title: 'Task 2', authorUuid: 'user1', description: 'Description 2', completed: false, steps: [] },
  ];

  const mockCompletedTasks: Task[] = [
    { uuid: '3', title: 'Task 3', authorUuid: 'user1', description: 'Description 3', completed: true, steps: [] },
    { uuid: '4', title: 'Task 4', authorUuid: 'user1', description: 'Description 4', completed: true, steps: [] },
  ];

  beforeEach(() => {
    mockHttpService = {
      getTasksByCompleted: vi.fn(),
      updateTask: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        TaskStore,
        { provide: TaskHttpService, useValue: mockHttpService },
      ],
    });

    store = TestBed.inject(TaskStore);
  });

  describe('Initial State', () => {
    it('should have initial state with no tasks and loading flags set to false', () => {
      expect(store.areToDoTasksLoading()).toBe(false);
      expect(store.areCompletedTasksLoading()).toBe(false);
      expect(store.entities()).toEqual([]);
      expect(store.ids()).toEqual([]);
    });
  });

  describe('loadToDoTasks', () => {
    it('should set areToDoTasksLoading to true while loading', () => {
      schedulerFactory(expect).run(({ cold, flush }) => {
        mockHttpService.getTasksByCompleted.mockReturnValue(cold('--x--a|', { x: null, a: mockToDoTasks }));

        store.loadToDoTasks();

        expect(store.areToDoTasksLoading()).toBe(true);
        flush();
        expect(store.areToDoTasksLoading()).toBe(false);
      });
    });

    it('should load to-do tasks successfully and set entities', () => {
      mockHttpService.getTasksByCompleted.mockReturnValue(of(mockToDoTasks));

      store.loadToDoTasks();

      expect(mockHttpService.getTasksByCompleted).toHaveBeenCalledWith(false);
      expect(store.entities()).toEqual(mockToDoTasks);
      expect(store.ids()).toEqual(['1', '2']);
      expect(store.areToDoTasksLoading()).toBe(false);
    });

    it('should remove all entities on error', () => {
      mockHttpService.getTasksByCompleted.mockReturnValue(
        throwError(() => new Error('Network error'))
      );

      store.loadToDoTasks();

      expect(store.entities()).toEqual([]);
      expect(store.ids()).toEqual([]);
      expect(store.areToDoTasksLoading()).toBe(false);
    });

    it('should replace existing entities with new tasks', () => {
      schedulerFactory(expect).run(({ cold, flush }) => {
        mockHttpService.getTasksByCompleted.mockReturnValue(cold('a|', { a: mockToDoTasks }));

        store.loadToDoTasks();
        flush();

        expect(store.entities()).toEqual(mockToDoTasks);

        const newTasks: Task[] = [
          { uuid: '5', title: 'Task 5', description: 'Description 5', completed: false, steps: [], authorUuid: 'user1',},
        ];
        mockHttpService.getTasksByCompleted.mockReturnValue(cold('a|', { a: newTasks }));
        store.loadToDoTasks();
        flush();

        expect(store.entities()).toEqual(newTasks);
        expect(store.ids()).toEqual(['5']);
      });
    });

    describe('loadCompetedTasks', () => {
      it('should set areCompletedTasksLoading to true while loading', () => {
        schedulerFactory(expect).run(({ cold, flush }) => {
          mockHttpService.getTasksByCompleted.mockReturnValue(cold('--x--a|', {
            x: null,
            a: mockToDoTasks
          }));

          store.loadCompetedTasks();

          expect(store.areCompletedTasksLoading()).toBe(true);

          flush();
          expect(store.areCompletedTasksLoading()).toBe(false);
        });
      });

      it('should load completed tasks successfully and add entities', () => {
        mockHttpService.getTasksByCompleted.mockReturnValue(of(mockToDoTasks));
        store.loadToDoTasks();

        mockHttpService.getTasksByCompleted.mockReturnValue(of(mockCompletedTasks));
        store.loadCompetedTasks();

        expect(mockHttpService.getTasksByCompleted).toHaveBeenCalledWith(true);
        expect(store.entities().length).toBe(4);
        expect(store.ids()).toEqual(['1', '2', '3', '4']);
        expect(store.areCompletedTasksLoading()).toBe(false);
      });

      it('should not modify entities on error', () => {
        mockHttpService.getTasksByCompleted.mockReturnValue(of(mockToDoTasks));
        store.loadToDoTasks();

        mockHttpService.getTasksByCompleted.mockReturnValue(
          throwError(() => new Error('Network error'))
        );
        store.loadCompetedTasks();

        expect(store.entities()).toEqual(mockToDoTasks);
        expect(store.areCompletedTasksLoading()).toBe(false);
      });
    });

    describe('updateTask', () => {
      beforeAll(() => {
        vi.useFakeTimers();
      });

      afterAll(() => {
        vi.useRealTimers();
      });

      beforeEach(() => {
        mockHttpService.getTasksByCompleted.mockReturnValue(of(mockToDoTasks));
        store.loadToDoTasks();
      });

      it('should set areToDoTasksLoading to false on HTTP error', () => {
        mockHttpService.updateTask.mockReturnValue(
          throwError(() => new Error('Network error'))
        );

        store.updateTask({...mockToDoTasks[1], completed: true});
        vi.advanceTimersByTime(1000);

        expect(store.areToDoTasksLoading()).toBe(false);
      });

      it('should update multiple tasks independently', () => {
        mockHttpService.updateTask.mockReturnValue(
          of({ ...mockToDoTasks[0], completed: true })
        );

        store.updateTask({...mockToDoTasks[0], completed: true});
        vi.advanceTimersByTime(1000);

        mockHttpService.updateTask.mockReturnValue(
          of({ ...mockToDoTasks[1], completed: true })
        );

        store.updateTask({...mockToDoTasks[1], completed: true});
        vi.advanceTimersByTime(1000);

        expect(store.entityMap()['1'].completed).toBe(true);
        expect(store.entityMap()['2'].completed).toBe(true);
        expect(mockHttpService.updateTask).toHaveBeenCalledTimes(2);
      });

      it('should toggle task from completed to uncompleted', () => {
        mockHttpService.updateTask.mockReturnValue(
          of({ ...mockToDoTasks[0], completed: true })
        );

        store.updateTask({...mockToDoTasks[0], completed: true});
        vi.advanceTimersByTime(1000);

        mockHttpService.updateTask.mockReturnValue(
          of({ ...mockToDoTasks[0], completed: false })
        );

        store.updateTask({...mockToDoTasks[0], completed: false});
        vi.advanceTimersByTime(1000);

        expect(store.entityMap()['1'].completed).toBe(false);
        expect(mockHttpService.updateTask).toHaveBeenCalledWith({...mockToDoTasks[0], completed: false});
      });
    });

    describe('Integration scenarios', () => {

      beforeEach(() => {
        vi.useFakeTimers();
      });

      afterAll(() => {
        vi.useRealTimers();
      });

      it('should handle loading both to-do and completed tasks', () => {
        mockHttpService.getTasksByCompleted.mockReturnValue(of(mockToDoTasks));
        store.loadToDoTasks();

        mockHttpService.getTasksByCompleted.mockReturnValue(of(mockCompletedTasks));
        store.loadCompetedTasks();

        expect(store.entities().length).toBe(4);
        expect(store.ids()).toEqual(['1', '2', '3', '4']);
      });

      it('should maintain entity state after toggle', () => {
        mockHttpService.getTasksByCompleted.mockReturnValue(of(mockToDoTasks));
        store.loadToDoTasks();

        mockHttpService.updateTask.mockReturnValue(
          of({ ...mockToDoTasks[0], completed: true })
        );

        store.updateTask({...mockToDoTasks[0], completed: true});
        vi.advanceTimersByTime(1000);

        expect(store.entities().length).toBe(2);
        expect(store.entityMap()['1'].title).toBe('Task 1');
        expect(store.entityMap()['1'].description).toBe('Description 1');
      });
    });
  });
});
