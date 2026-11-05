
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.verifierSession().pipe(
    map((connecte) =>
      connecte ? true : router.createUrlTree(['/login'])
    ),
    catchError(() => of(router.createUrlTree(['/login'])))
  );
};
