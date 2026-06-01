import { Routes } from '@angular/router';
import { Details } from './pages/private/details/details';
import { ProjectDetails } from './pages/private/project-details/project-details';
import { authGuard } from './core/guards/CanActivate-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  { 
    path: 'login', 
    loadComponent: () => import('./pages/public/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/public/register/register').then(m => m.Register)
  },

  {
    path: 'dashboard',
    loadComponent: () => import('./pages/private/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/private/profile/profile').then(m => m.Profile),
    canActivate: [authGuard]
  },
  {
    path: 'workerslist',
    loadComponent:() => import('./pages/private/workers/workers').then(m => m.Workers),
    canActivate: [authGuard]
  },
  {
    path: 'clientslist',
    loadComponent:() => import('./pages/private/clients/clients').then(m => m.Clients),
    canActivate: [authGuard]
  },
  {
    path: 'details',
    loadComponent:() => import('./pages/private/details/details').then(m => m.Details),
    canActivate: [authGuard]
  },
  {
    path: 'projectslist',
    loadComponent:() => import('./pages/private/projects/projects').then(m => m.Projects),
    canActivate: [authGuard]
  },

  { 
    path: 'details/project/:id',
    component: ProjectDetails,
    canActivate: [authGuard]
  },

  { 
    path: 'details/:type/:id',
    component: Details,
    canActivate: [authGuard]
  },
  {
    path: 'not-permitted',
    loadComponent: () => import('./pages/public/not-permitted/not-permitted').then(m => m.NotPermitted)
  }
];