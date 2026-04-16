import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from '../auth.models';
import { AuthService } from '../auth.service';

export const roleGuard = (expectedRole: UserRole): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isAuthenticated()) {
      return router.createUrlTree(['/acceso'], {
        queryParams: { mode: 'login' },
      });
    }

    const currentRole = auth.currentRole();

    if (currentRole === expectedRole) {
      return true;
    }

    return router.createUrlTree([auth.redirectForCurrentUser()]);
  };
};
