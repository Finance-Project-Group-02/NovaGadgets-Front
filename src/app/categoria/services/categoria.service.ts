import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { CategoriaClass } from '../models/categoria';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

const base_url = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  private listaCambio = new Subject<CategoriaClass[]>();
  constructor(private http: HttpClient) { }

  list(){
    return this.http.get<CategoriaClass[]>(`${base_url}/categories`);
  }
  setList(listaNueva: CategoriaClass[]){
    this.listaCambio.next(listaNueva);
  }
  getList(){
    return this.listaCambio.asObservable();
  }
}
