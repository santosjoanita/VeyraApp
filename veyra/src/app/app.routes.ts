import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () => import('./pages/public/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/public/register/register').then((m) => m.Register),
  },
  {
    path: 'not-permitted',
    loadComponent: () =>
      import('./pages/private/not-permitted/not-permitted').then((m) => m.NotPermitted),
  },

  {
    path: 'dashboard',
    loadChildren: () =>
      import('./pages/private/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: 'clients',
    loadChildren: () =>
      import('./pages/private/clients/clients.routes').then((m) => m.CLIENTS_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: 'projects',
    loadChildren: () =>
      import('./pages/private/projects/projects.routes').then((m) => m.PROJECTS_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: 'workers',
    loadChildren: () =>
      import('./pages/private/workers/workers.routes').then((m) => m.WORKERS_ROUTES),
    canActivate: [authGuard],
    data: { expectedRole: 'admin' },
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./pages/private/profile/profile.routes').then((m) => m.PROFILE_ROUTES),
    canActivate: [authGuard],
  },

  { path: '**', redirectTo: 'login' },
];
