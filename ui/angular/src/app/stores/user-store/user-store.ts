import { User } from '@/models/user.model';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { of, pipe, switchMap, tap } from 'rxjs';
import { UserHttpService } from '@/utils/userHttp.service';
import { tapResponse } from '@ngrx/operators';

type UserStore = {
  user: User | null,
  areDemoUsersLoading: boolean,
  demoUsers: User[]
}

const initialState: UserStore = {
  user: null,
  areDemoUsersLoading: false,
  demoUsers: []
};

export const UserStore = signalStore(
  { providedIn: 'root', protectedState: true },
  withState(initialState),
  withComputed(store => ({
    isLoggedIn: computed(() => Boolean(store.user()))
  })),
  withMethods((
    store,
    userHttpService = inject(UserHttpService)
  ) => ({
    setUser(user: User | null): void {
      patchState(store, { user });
    },
    getDemoUserByUsername(username: string): User | undefined {
      return store.demoUsers().find(user => user.username === username);
    },
    loadDemoUsers: rxMethod<void | boolean>(
      pipe(
        switchMap((forceRefetch?: void | boolean) => {
          if (store.demoUsers().length && !forceRefetch) {
            return of(store.demoUsers());
          }

          return userHttpService.getDemoUsers().pipe(
            tap(() => patchState(store, { areDemoUsersLoading: true })),
            tapResponse({
              next: demoUsers => patchState(store, { demoUsers }),
              error: () => patchState(store, { demoUsers: [] }),
              finalize: () => patchState(store, { areDemoUsersLoading: false })
            })
          );
        }),
      )
    )
  }))
);
