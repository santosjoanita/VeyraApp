import { Routes } from '@angular/router';
import { Clients } from './clients';
import { Details } from '../details/details';

export const CLIENTS_ROUTES: Routes = [
  {
    path: '',
    component: Clients,
  },
  {
    path: 'details/:id',
    component: Details,
  },
];
