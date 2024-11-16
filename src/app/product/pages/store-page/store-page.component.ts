import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Product } from '../../models/Product';
import { MatTableDataSource } from '@angular/material/table';
import { NgFor } from '@angular/common';
import { ProductService } from '../../services/product/product.service';
import { RouterLink } from '@angular/router';
import { ProductStorageService } from '../../../shopping_cart/services/product-storage/product-storage.service';
import { LoginService } from '../../../user/services/login/login.service';

@Component({
  selector: 'app-store-page',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: './store-page.component.html',
  styleUrl: './store-page.component.css'
})
export class StorePageComponent implements OnInit, AfterViewInit {

  dataSourcePr: MatTableDataSource<Product> = new MatTableDataSource();
  totalQuantity: number = 0;
  totalPrice: number = 0;

  constructor(
    private prS: ProductService,
    private cdr: ChangeDetectorRef,
    private productStorage: ProductStorageService,
    private loginService: LoginService
  ) {}
  
  ngOnInit(): void {    
    this.prS.list().subscribe(data => {
      this.dataSourcePr.data = data;
    });
    
    this.prS.getList().subscribe(data => {
      this.dataSourcePr.data = data;
    });

    // Inicializar los totales basados en el contenido del carrito actual
    this.updateTotals();
  }
  
  ngAfterViewInit(): void {}

  scrollLeft(): void {
    const container = document.querySelector('.card-container') as HTMLElement;
    container.scrollBy({ left: -200, behavior: 'smooth' });
  }

  scrollRight(): void {
    const container = document.querySelector('.card-container') as HTMLElement;
    container.scrollBy({ left: 200, behavior: 'smooth' });
  }

  addProductShoppingCart(product: Product): void {
    // Obtén los productos existentes en el carrito
    const existingProducts = this.productStorage.getProducts();
  
    // Verifica si el producto ya está en el carrito
    const existingProduct = existingProducts.find(p => p.id === product.id);
  
    if (existingProduct) {
      // Si el producto ya está en el carrito, incrementa su cantidad
      existingProduct.quantity += 1;
    } else {
      // Si no está en el carrito, establece la cantidad inicial a 1 y agrégalo
      product.quantity = 1;
      existingProducts.push(product);
    }
  
    // Guarda el carrito actualizado en el almacenamiento local
    this.productStorage.saveProducts(existingProducts);
  
    // Actualiza los totales
    this.updateTotals();
  
    console.log('Product added to shopping cart');
    console.log(this.productStorage.getProducts());
  }  

  updateTotals(): void {
    const cartProducts = this.productStorage.getProducts();
    this.totalQuantity = cartProducts.reduce((sum, product) => sum + product.quantity, 0);
    this.totalPrice = cartProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  }

  cambiarMoneda(money: number): string {
    return this.loginService.cambiarDivisaPrecio(money);
  }


/*
  
  dataSourcePr: MatTableDataSource<Product> = new MatTableDataSource();

  constructor(private prS: ProductService, private cdr: ChangeDetectorRef, private productStorage: ProductStorageService) {}
  
  ngOnInit(): void {    
    this.prS.list().subscribe(data => {
      this.dataSourcePr.data = data;
    });
    
    this.prS.getList().subscribe(data => {
      this.dataSourcePr.data = data;
    });

  }
  
  

  ngAfterViewInit(): void {}

  scrollLeft(): void {
    const container = document.querySelector('.card-container') as HTMLElement;
    container.scrollBy({ left: -200, behavior: 'smooth' });
  }

  scrollRight(): void {
    const container = document.querySelector('.card-container') as HTMLElement;
    container.scrollBy({ left: 200, behavior: 'smooth' });
  }

  addProductShoppingCart(product: Product): void {
    // Obtén los productos existentes en el carrito
    const existingProducts = this.productStorage.getProducts();
  
    // Verifica si el producto ya está en el carrito
    const existingProduct = existingProducts.find(p => p.id === product.id);
  
    if (existingProduct) {
      // Si el producto ya está en el carrito, incrementa su cantidad
      existingProduct.quantity += 1;
    } else {
      // Si no está en el carrito, establece la cantidad inicial a 1 y agrégalo
      product.quantity = 1;
      existingProducts.push(product);
    }
  
    // Guarda el carrito actualizado en el almacenamiento local
    this.productStorage.saveProducts(existingProducts);
  
    console.log('Product added to shopping cart');
    console.log(this.productStorage.getProducts());
  }  */

}
