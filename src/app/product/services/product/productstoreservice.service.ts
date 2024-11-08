import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { ProductStore } from '../../models/productStore';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const base_url = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class ProductstoreserviceService {
  private listaCambio = new Subject<ProductStore[]>();
  constructor(private http: HttpClient) { }

  list(){
    return this.http.get<ProductStore[]>(`${base_url}/productStore`);
  }
  setList(listaNueva: ProductStore[]){
    this.listaCambio.next(listaNueva);
  }
  getList(){
    return this.listaCambio.asObservable();
  }
  getProductById(id: string | null){
    return this.http.get<ProductStore>(`${base_url}/productStore/id/${id}`);
  }
}
