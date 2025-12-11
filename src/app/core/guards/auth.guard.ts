import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { isTokenExpired } from '../interfaz/token.util';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('authToken');

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    router.navigate(['/login']);
    return false;
  }

  return true;
};