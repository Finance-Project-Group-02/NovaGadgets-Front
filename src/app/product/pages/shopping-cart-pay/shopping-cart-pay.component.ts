import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/Product';
import { ProductStorageService } from '../../../shopping_cart/services/product-storage/product-storage.service';
import { FormsModule, NgModel } from '@angular/forms';
import { IMAGE_CONFIG, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-shopping-cart-pay',
  standalone: true,
  imports: [NgIf, FormsModule, NgFor],
  templateUrl: './shopping-cart-pay.component.html',
  styleUrl: './shopping-cart-pay.component.css'
})
export class ShoppingCartPayComponent implements OnInit {
  cartProducts: Product[] = [];
  shippingCost: number = 50; // Costo de envío fijo, puedes ajustarlo según necesidad
  order = {
    address: '',
    paymentMethod: 'creditCard'
  };

  constructor(
    private productStorageService: ProductStorageService,
    private http: HttpClient // Inyectar HttpClient
  ) {}

  ngOnInit(): void {
    this.cartProducts = this.productStorageService.getProducts();
  }

  calculateSubtotal(): number {
    return this.cartProducts.reduce((total, product) => total + product.price * product.quantity, 0);
  }

  calculateTotalWithShipping(): number {
    return this.calculateSubtotal() + this.shippingCost;
  }

  placeOrder(): void {
    const order = {
      idUser: 1,  // ID de usuario, este puede variar según tu implementación
      orderDate: new Date().toISOString(), // Fecha actual
      totalInvoiced: this.calculateTotalWithShipping(), // Total incluyendo envío
      address: this.order.address,
      paymentMethod: this.order.paymentMethod
    };

    // Crear la orden
    this.http.post('http://localhost:8080/api/v1/order', order).subscribe({
      next: (response: any) => {
        console.log('Order created successfully', response);

        // Crear los detalles de la orden para cada producto en el carrito
        this.cartProducts.forEach(product => {
          const orderDetail = {
            quantity: product.quantity,
            productId: product.id
          };

          this.http.post(`http://localhost:8080/api/v1/orderDetail/orderId/${response.id}`, orderDetail).subscribe({
            next: (orderDetailResponse) => {
              console.log('OrderDetail created successfully', orderDetailResponse);
            },
            error: (error) => {
              console.error('Error creating OrderDetail', error);
            }
          });
        });

        // Limpiar el carrito después de realizar el pedido
        alert('Pedido realizado con éxito!');
        this.clearCart();
      },
      error: (error) => {
        console.error('Error creating order', error);
        if (error.status === 0) {
          alert('No se pudo conectar al servidor');
        } else {
          alert(`Error: ${error.status} - ${error.message}`);
        }
      }
    });
  }

  clearCart(): void {
    this.productStorageService.saveProducts([]);
    this.cartProducts = [];
  }
}
