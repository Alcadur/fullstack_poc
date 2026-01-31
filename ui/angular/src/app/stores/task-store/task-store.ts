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
            switchMap(() => httpService.getTasksByCompleted(false).pipe(
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
            switchMap(() => httpService.getTasksByCompleted(true).pipe(
              tapResponse({
                next: tasks => patchState(store, addEntities(tasks, { selectId })),
                error: () => null,
                finalize: () => patchState(store, { areCompletedTasksLoading: false })
              })
            )),
          )
        ),
        updateTask: rxMethod<Task>(
          pipe(
            debounceTime(1000),
            switchMap((task) =>
              httpService.updateTask(task).pipe(
                tapResponse({
                  next: () => {
                    patchState(store, { areToDoTasksLoading: false });
                    patchState(store, updateEntity({ id: task.uuid, changes: () => task }, { selectId }));
                  },
                  error: () => patchState(store, { areToDoTasksLoading: false })
                })
              )
            ),
          )
        )
      })
  )
);
