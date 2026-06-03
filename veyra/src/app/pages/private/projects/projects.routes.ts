import { Routes } from '@angular/router';
import { Projects } from './projects';
import { ProjectDetails } from '../project-details/project-details';

export const PROJECTS_ROUTES: Routes = [
  {
    path: '',
    component: Projects,
  },
  {
    path: 'details/:id',
    component: ProjectDetails,
  },
];
