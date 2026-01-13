import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { inject } from '@angular/core';
import { UserHttpService } from '@/utils/userHttp.service';
import { tapResponse } from '@ngrx/operators';

type TaskStore = {
  areTasksLoading: boolean,
  tasks: any[]
}

const initialState: TaskStore = {
  areTasksLoading: false,
  tasks: []
};

export const TaskStore = signalStore(
  { providedIn: 'root', protectedState: true },
  withState(initialState),
  withMethods(
    (store, httpService = inject(UserHttpService)) =>
      ({
        loadTasks: rxMethod<string>(
          pipe(
            pipe(tap(() => patchState(store, { areTasksLoading: true }))),
            switchMap((userUuid: string) => httpService.getAllTasksByAuthorUuid(userUuid)),
            tap(tasks => console.log("tasks", tasks)),
            tapResponse({
              next: tasks => patchState(store, { tasks }),
              error: () => patchState(store, { tasks: [] }),
              finalize: () => patchState(store, { areTasksLoading: false })
            })
          )
        )
      })
  )
);
