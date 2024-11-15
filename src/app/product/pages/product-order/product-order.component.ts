import { Component, Inject, OnInit } from '@angular/core';
import { ProductStore } from '../../models/productStore';

import { Order } from '../../models/Order'; // Importa el modelo de la orden
import { HttpClient } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Product } from '../../models/Product';
import { ProductstoreserviceService } from '../../services/product/productstoreservice.service';
import { ProductService } from '../../services/product/product.service';
import { OrderDetail } from '../../models/OrderDetail';
import { LoginService } from '../../../user/services/login/login.service';

@Component({
  selector: 'app-product-order',
  standalone: true,
  imports: [MatExpansionModule, MatCardModule, MatIconModule, CommonModule, RouterModule],
  templateUrl: './product-order.component.html',
  styleUrls: ['./product-order.component.css']
})
export class ProductOrderComponent implements OnInit {
  selectedProduct: Product | null = null;
  totalPrice: number = 0;

  constructor(
    private productService: ProductService, 
    private http: HttpClient,
    private route: ActivatedRoute,
    private loginService: LoginService // Inyectar el LoginService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');

    if (productId) {
      this.productService.getProductById(productId).subscribe((productselect: Product) => {
        this.selectedProduct = productselect;
        this.totalPrice = productselect.price + 10;
      });
    }
  }

  createOrder(): void {
    if (this.selectedProduct) {
      // Obtener usuario logueado
      this.loginService.getUser().subscribe((user) => {
        if (user) {
          const order = new Order();
          order.idUser = user.id; // Asignar el ID del usuario logueado
          order.orderDate = new Date().toISOString();
          order.totalInvoiced = this.totalPrice;

          this.http.post('http://localhost:8080/api/v1/order', order).subscribe({
            next: (response: any) => {
              alert('Pedido realizado con éxito');
              console.log('Order saved successfully', response);

              if (this.selectedProduct) {
                const orderDetail = new OrderDetail();
                orderDetail.quantity = 1;
                orderDetail.productId = this.selectedProduct.id;

                this.http.post(`http://localhost:8080/api/v1/orderDetail/orderId/${response.id}`, orderDetail).subscribe({
                  next: (orderDetailResponse) => {
                    console.log('OrderDetail created successfully', orderDetailResponse);
                  },
                  error: (error) => {
                    console.error('Error al crear el OrderDetail', error);
                  }
                });
              }
            },
            error: (error) => {
              console.error('Error al guardar la orden', error);
              if (error.status === 0) {
                alert('No se pudo conectar al servidor');
              } else {
                alert(`Error: ${error.status} - ${error.message}`);
                console.log('Error details:', error);
              }
            }
          });
        } else {
          alert('Usuario no autenticado. No se puede crear la orden.');
        }
      });
    }
  }
}
