import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment.development';
import { BehaviorSubject, catchError, Observable, retry, throwError, tap} from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

import { User } from '../../models/user.model';
import { Login } from '../../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) {
    // Verificar si la cookie existe
    const cookieLoginExists = this.cookieService.check('login');
    const cookieUserExists = this.cookieService.check('user');

    console.log('Cookie exists: ', cookieLoginExists);
    console.log(cookieService.get('login'));
    console.log('Cookie user exists: ', cookieUserExists);
    console.log(cookieService.get('user'));

    if (!cookieLoginExists || !cookieUserExists) {
      this.cookieService.set('login', 'unlogged');
    }
  }

  isUserLogin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  user!: User;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log(`An error occurred: ${error.error.message}`);
    } else {
      console.log(
        `Backend returned code ${error.status}, body was: ${JSON.stringify(
          error.error
        )}`
      );
    }

    return throwError(() => error);
  }

  login(user: Login): Observable<User> {
    return this.http
      .post<User>(
        `${environment.baseUrl}${environment.login}`,
        user,
        this.httpOptions
      )
      .pipe(retry(1), tap(() => this.isUserLogin.next(true)), catchError(this.handleError),
    );
  }

  getUserLogin(): Observable<boolean> {
    return this.isUserLogin.asObservable();
  }

  loadUser(usuario: User) {
    this.user = usuario;
    console.log('Usuario cargado:', this.user);

    // Guardar en cookie
    this.cookieService.set('login', 'logged');
    this.cookieService.set('user', JSON.stringify(usuario));

    console.log('Cookie user:', this.cookieService.get('user'));

    // Redirigir a home
    this.router.navigate(['/home']);
  }

  isUserLogged() {
    return this.cookieService.get('login') === 'logged';
  }

  logout() {
    this.cookieService.set('login', 'unlogged');
    this.cookieService.delete('user');
    this.router.navigate(['/login']);
  }

  //Validar////////////////////////
  getUser(): User | null {
    const userData = this.cookieService.get('user');

    if (userData) {
      try {
        return JSON.parse(userData) as User;
      } catch (error) {
        console.log('Holaas');
        console.error('Error parsing JSON in getUser:', error);
        return null;
      }
    } else {
      console.log('Holaas123');
      console.warn('No user data found in cookies');
      return null;
    }
  }
}
