import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment.development';
import { BehaviorSubject, catchError, Observable, retry, throwError, tap, of} from 'rxjs';
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
    else {
      this.user = JSON.parse(this.cookieService.get('user'));
      console.log('Usuario cargado:', this.user);
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
    this.cookieService.set('login', 'logged', 1);
    this.cookieService.set('user', JSON.stringify(usuario), 1);

    console.log("Usuario logeado");
    console.log('Cookie user:', this.cookieService.get('user'));

    // Redirigir a home
    this.router.navigate(['/home']);
  }

  hasRole(role: string): boolean {
    const userRoles = this.user.roles.map((role) => role.nameRole);
    return userRoles.includes(role);
  }

  isUserLogged() {
    return this.cookieService.get('login') === 'logged';
  }

  logout() {
    this.cookieService.set('login', 'unlogged');
    this.cookieService.delete('user');
    this.isUserLogin.next(false);
    this.router.navigate(['/login']);
  }

  //Validar////////////////////////
  getUser(): Observable<User | null> {
    if (this.cookieService.check('user')) {
        const user = JSON.parse(this.cookieService.get('user')) as User;
        return of(user);
    } else {
        return of(null);
    }
}

//Change Currency Money
  ///users/{id}/currency-type/{currencyType}

  changeCurrencyType(id: number, currencyType: string): Observable<User> {
    return this.http
      .put<User>(
        `${environment.baseUrl}/users/${id}/currency-type/${currencyType}`,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  //Change currency money in the user and cookie
  changeCurrencyTypeUser(id: number, currencyType: string): User {
    this.changeCurrencyType(id, currencyType).subscribe((user) => {
      this.user = user;
      this.cookieService.set('user', JSON.stringify(user));
    });
    return this.user;
  }

  cambiarDivisaPrecio(precio: number): string {
    const moneda = this.user.currencyType || 'PEN'; 
    if (moneda === 'USD') {
      precio = precio / 3.81;
      return `$ ${precio.toFixed(2)}`;
    } else if (moneda === 'PEN') {
      return `S/ ${precio.toFixed(2)}`;
    }
    return `${precio.toFixed(2)}`;
  }
  
}
