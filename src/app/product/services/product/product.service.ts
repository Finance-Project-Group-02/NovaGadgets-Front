import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Product } from '../../models/Product';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

const base_url = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private listaCambio = new Subject<Product[]>();
  constructor(private http: HttpClient) { }

  list(){
    return this.http.get<Product[]>(`${base_url}/products`);
  }
  setList(listaNueva: Product[]){
    this.listaCambio.next(listaNueva);
  }
  getList(){
    return this.listaCambio.asObservable();
  }
  getProductById(id: string | null){
    return this.http.get<Product>(`${base_url}/products/id/${id}`);
  }

}
