import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  apiUrl: string  ="http://localhost:8080/api/v1"
  recurso: string = "users"

  constructor(
    private http: HttpClient) { }

  newUser(user: User){
    return this.http.post<User>(this.apiUrl+"/"+this.recurso,user);
  }
}
