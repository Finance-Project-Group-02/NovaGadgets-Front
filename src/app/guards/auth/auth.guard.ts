import { CanActivateFn } from '@angular/router';
import { LoginService } from '../../user/services/login/login.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(LoginService);
  const router = inject(Router);

  if (authService.isUserLogged()) {
    return true;
  } else {
    console.log('User is not logged');
    router.navigate(['/login']);
    return false;
  }
};
