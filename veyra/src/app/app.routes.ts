import { Routes } from '@angular/router';

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

  //private
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/private/dashboard/dashboard').then(m => m.Dashboard)      
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/private/profile/profile').then(m => m.Profile)
  }
];