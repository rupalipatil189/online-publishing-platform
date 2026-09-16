import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { firebaseAuth } from '../config/firebase.config';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  const user = firebaseAuth.currentUser;

  if (user) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
