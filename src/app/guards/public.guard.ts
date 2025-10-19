import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const publicGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.authenticated().pipe(
    map((res: any) => {
      if (res?.user?.id) {
        // ✅ Already logged in → redirect to dashboard
        router.navigate(['/dashboard']);
        return false;
      } else {
        // ❌ Not logged in → allow access to login/signup
        return true;
      }
    }),
    catchError(() => of(true)) // if API fails, still allow to visit login
  );
};
