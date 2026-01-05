import { User } from '../../models/user.model';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

type UserStore = {
  user: User | null
}

const initialState: UserStore = {
  user: null
}

export const UserStore = signalStore(
  { providedIn: 'root', protectedState: true },
  withState(initialState),
  withMethods(store => ({
    setUser(user: User | null): void {
      patchState(store, state => ({ user }));
    }
  }))
);
