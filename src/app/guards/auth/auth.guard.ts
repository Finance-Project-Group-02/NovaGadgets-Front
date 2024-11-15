import { CanActivateFn } from '@angular/router';
import { LoginService } from '../../user/services/login/login.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(LoginService);
  const router = inject(Router);

  if (!authService.isUserLogged()) {
    console.log('User is not logged');
    router.navigate(['/login']);
    return false;
  }

  const requiredRole = route.data['role'];
  console.log('Required role:', requiredRole);

  if (requiredRole && !authService.hasRole(requiredRole)) {
    console.log(`User does not have the required role: ${requiredRole}`);
    router.navigate(['/home']);
    return false;
  }

  console.log('Si tienes permiso y tu rol es:', authService.hasRole(requiredRole));
  console.log('el rol al que quieres acceder es:', requiredRole);


  return true;
};
