import { Injectable } from '@angular/core';
import { Product } from '../../../product/models/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductStorageService {
  private localStorageKey = 'products';

  constructor() { }

  saveProducts(products: Product[]){
    localStorage.setItem(this.localStorageKey, JSON.stringify(products));
  } 

  getProducts(): Product[]{
    return JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
  }

  addProduct(product: Product){
    const products = this.getProducts();
    products.push(product);
    this.saveProducts(products);
  }
}
