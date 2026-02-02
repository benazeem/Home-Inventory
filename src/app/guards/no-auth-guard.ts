import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { inject } from '@angular/core';
import { map, take } from 'rxjs/operators';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.authState$.pipe(
    take(1),
    map(user => {
      if (user) {
        router.navigate(['/app/dashboard']);
        return false;
      }
      return true;
    })
  );
};
