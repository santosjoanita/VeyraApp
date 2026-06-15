import { Routes } from '@angular/router';
import { Workers } from './workers';
import { Details } from '../details/details';

export const WORKERS_ROUTES: Routes = [
  {
    path: '',
    component: Workers,
  },
  {
    path: 'details/:id',
    component: Details,
  },
];
