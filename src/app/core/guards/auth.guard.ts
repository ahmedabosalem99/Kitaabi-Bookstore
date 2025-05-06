import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isLoggedIn()
    ? true
    : router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url },
      });
};
