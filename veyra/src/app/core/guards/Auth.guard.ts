import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('accessToken');
  const userRole = localStorage.getItem('userRole');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  // Bloqueia quem não tem a permissão certa para a página
  const expectedRole = route.data?.['expectedRole'];
  if (expectedRole && expectedRole !== userRole) {
    router.navigate(['/not-permitted']);
    return false;
  }

  return true;
};
