import { Routes } from '@angular/router';
import { Details } from './pages/private/details/details';
import { ProjectDetails } from './pages/private/project-details/project-details';

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
    loadComponent: () => import('./pages/private/dashboard/dashboard').then(m => m.Dashboard)       
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/private/profile/profile').then(m => m.Profile)
  },
  {
    path: 'workerslist',
    loadComponent:() => import('./pages/private/workers/workers').then(m => m.Workers)
  },
  {
    path: 'clientslist',
    loadComponent:() => import('./pages/private/clients/clients').then(m => m.Clients)
  },
  {
    path: 'details',
    loadComponent:() => import('./pages/private/details/details').then(m => m.Details)
  },
  {
    path: 'projectslist',
    loadComponent:() => import('./pages/private/projects/projects').then(m => m.Projects)
  },

  { 
    path: 'details/project/:id', component: ProjectDetails
  },

  { 
    path: 'details/:type/:id', component: Details
  },
  {
    path: 'not-permitted',
    loadComponent: () => import('./pages/public/not-permitted/not-permitted').then(m => m.NotPermitted)
  }
];