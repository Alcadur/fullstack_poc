import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStore } from '@/stores/user-store/user-store';
import { RoutesList } from '@/routes.model';

export const authGuard: CanActivateFn = () => {
  const userStore = inject(UserStore);
  const router = inject(Router);

  if (userStore.isLoggedIn()) {
    return true;
  }

  return router.parseUrl(RoutesList.LOGIN);
};
