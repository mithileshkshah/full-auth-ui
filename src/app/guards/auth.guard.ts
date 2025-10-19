import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.authenticated().pipe(
    map((res: any) => {
      // If we get a valid user response, allow access
      if (res?.user?.id) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    }),
    catchError(() => {
      // If API fails (e.g., expired token, unauthorized)
      router.navigate(['/login']);
      return of(false);
    })
  );
};
