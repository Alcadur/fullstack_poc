import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login-page';
import { authGuard } from './guards/auth.guard';
import { TasksPage } from './pages/tasks/tasks-page';
import { RoutesList } from '@/routes.model';

export const routes: Routes = [
  { path: RoutesList.LOGIN, component: LoginPage },
  { path: RoutesList.TASKS, component: TasksPage, canActivate: [authGuard] },
  { path: '', redirectTo: RoutesList.LOGIN, pathMatch: 'full'}
];
