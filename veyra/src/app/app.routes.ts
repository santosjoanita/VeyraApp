import { Routes } from '@angular/router';

export const routes: Routes = [
  // Redireciona logo para o login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  //página de login, ou pública
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
    path: 'app',
    loadComponent: () => import('./pages/private/main-layout/main-layout').then(m => m.MainLayout),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/private/dashboard/dashboard').then(m => m.Dashboard)
      }
    ]
  }
];