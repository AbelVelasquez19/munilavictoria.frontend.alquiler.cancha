import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { isTokenExpired } from '../interfaz/token.util';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('authToken');

  if (token) {
    if (isTokenExpired(token)) {
      // Token expirado: limpiar y redirigir
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      router.navigate(['/login']);
      // devolvemos la request sin headers para no romper el flujo
      return next(req);
    }

    // Token válido → se adjunta en headers
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Siempre devolver el flujo
  return next(req);
};
