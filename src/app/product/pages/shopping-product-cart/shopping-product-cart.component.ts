import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/Product';
import { ProductStorageService } from '../../../shopping_cart/services/product-storage/product-storage.service';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { LoginService } from '../../../user/services/login/login.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-shopping-product-cart',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink , MatCardModule, MatButtonModule],
  templateUrl: './shopping-product-cart.component.html',
  styleUrl: './shopping-product-cart.component.css'
})
export class ShoppingProductCartComponent implements OnInit {
  cartProducts: Product[] = [];

  constructor(
    private productStorageService: ProductStorageService,
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.cartProducts = this.productStorageService.getProducts();
  }

  calculateTotal(): number {
    return this.cartProducts.reduce((total, product) => total + product.price * product.quantity, 0);
  }

  removeProductFromCart(productId: number): void {
    this.cartProducts = this.cartProducts.filter(product => product.id !== productId);
    this.productStorageService.saveProducts(this.cartProducts);
  }

  increaseQuantity(product: Product): void {
    if (product.quantity < 99) {
      product.quantity += 1;
      this.productStorageService.saveProducts(this.cartProducts);
    }
  }

  decreaseQuantity(product: Product): void {
    if (product.quantity > 1) {
      product.quantity -= 1;
      this.productStorageService.saveProducts(this.cartProducts);
    }
  }

  cambiarMoneda(money: number): string {
    return this.loginService.cambiarDivisaPrecio(money);
  }

  
}
