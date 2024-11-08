import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Store } from '../../models/Store';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

const base_url = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class StoreserviceService {
  private listaCambio = new Subject<Store[]>();
  constructor(private http: HttpClient) { }

  list(){
    return this.http.get<Store[]>(`${base_url}/stores`);
  }
  setList(listaNueva: Store[]){
    this.listaCambio.next(listaNueva);
  }
  getList(){
    return this.listaCambio.asObservable();
  }
}
