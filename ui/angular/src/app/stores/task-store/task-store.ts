import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, pipe, switchMap, tap } from 'rxjs';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { Task } from '@/models/task.model';
import { TaskHttpService } from '@/utils/taskHttp.service';
import {
  addEntities,
  removeAllEntities,
  SelectEntityId,
  setAllEntities,
  updateEntity,
  withEntities
} from '@ngrx/signals/entities';

type TaskStore = {
  areToDoTasksLoading: boolean,
  areCompletedTasksLoading: boolean,
}

const initialState: TaskStore = {
  areToDoTasksLoading: false,
  areCompletedTasksLoading: false,
};

const selectId: SelectEntityId<Task> = (todo) => todo.uuid;

export const TaskStore = signalStore(
  { providedIn: 'root', protectedState: true },
  withState(initialState),
  withEntities<Task>(),
  withMethods(
    (store, httpService = inject(TaskHttpService)) =>
      ({
        loadToDoTasks: rxMethod<void>(
          pipe(
            pipe(tap(() => patchState(store, { areToDoTasksLoading: true }))),
            switchMap(() => httpService.getLoggedInUserTasksByCompleted(false).pipe(
              tapResponse({
                next: tasks => patchState(store, setAllEntities(tasks, { selectId })),
                error: () => patchState(store, removeAllEntities()),
                finalize: () => patchState(store, { areToDoTasksLoading: false })
              })
            )),
          )
        ),
        loadCompetedTasks: rxMethod<void>(
          pipe(
            pipe(tap(() => patchState(store, { areCompletedTasksLoading: true }))),
            switchMap(() => httpService.getLoggedInUserTasksByCompleted(true).pipe(
              tapResponse({
                next: tasks => patchState(store, addEntities(tasks, { selectId })),
                error: () => null,
                finalize: () => patchState(store, { areCompletedTasksLoading: false })
              })
            )),
          )
        ),
        toggleTaskCompleted: rxMethod<[string, boolean]>(
          pipe(
            tap(([taskUuid, completed]) => {
              let tasks: Task[] = store.entities();

              const task = tasks.find(task => task.uuid === taskUuid);

              if (!task) {
                throw new Error(`Task with UUID ${taskUuid} not found`);
              }

              patchState(store, updateEntity({
                  id: taskUuid,
                  changes: () => ({ completed }),
                }, { selectId })
              );
            }),
            debounceTime(1000),
            switchMap(([taskUuid, completed]) =>
              httpService.toggleTaskCompleted(taskUuid, completed).pipe(
                tapResponse({
                  next: () => patchState(store, { areToDoTasksLoading: false }),
                  error: () => patchState(store, { areToDoTasksLoading: false })
                })
              )
            ),
          )
        )
      })
  )
);
