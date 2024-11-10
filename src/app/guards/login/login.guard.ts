import { CanActivateFn } from '@angular/router';
import { LoginService } from '../../user/services/login/login.service';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(LoginService);

  if (authService.isUserLogged()) {
    return false;
  } else {
    return true;
  }
};
