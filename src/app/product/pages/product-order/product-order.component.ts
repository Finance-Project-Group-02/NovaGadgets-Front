import { Component, Inject, OnInit } from '@angular/core';
import { ProductStore } from '../../models/productStore';

import { Order } from '../../models/Order'; // Importa el modelo de la orden
import { HttpClient } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Route, RouterModule } from '@angular/router';
import { Product } from '../../models/Product';
import { ProductstoreserviceService } from '../../services/product/productstoreservice.service';
import { ProductService } from '../../services/product/product.service';
import { OrderDetail } from '../../models/OrderDetail';
import { LoginService } from '../../../user/services/login/login.service';
import { ProductStorageService } from '../../../shopping_cart/services/product-storage/product-storage.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-order',
  standalone: true,
  imports: [MatExpansionModule, MatCardModule, MatIconModule, CommonModule, RouterModule],
  templateUrl: './product-order.component.html',
  styleUrls: ['./product-order.component.css']
})
export class ProductOrderComponent implements OnInit {
  selectedProduct?: Product ;
  totalPrice: number = 0;
  curriermoney: number=10;

  constructor(
    private productStorageService: ProductStorageService,
    private productService: ProductService, 
    private http: HttpClient,
    private route: ActivatedRoute,
    private loginService: LoginService// Inyectar el LoginService,
    ,private router: Router
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
      this.loginService.getUser().subscribe({
        next: (user) => {
          if (user) {
            const order = new Order();
            order.idUser = user.id; // Asignar el ID del usuario logueado
            order.orderDate = new Date().toISOString();
            order.totalInvoiced = this.totalPrice;
  
            // Crear la orden
            this.http.post('http://localhost:8080/api/v1/order', order).subscribe({
              next: (response: any) => {
                console.log('Order saved successfully', response);
  
                if (this.selectedProduct) {
                  const orderDetail = new OrderDetail();
                  orderDetail.quantity = 1;
                  orderDetail.productId = this.selectedProduct.id;
  
                  // Crear detalles de la orden
                  this.http.post(`http://localhost:8080/api/v1/orderDetail/orderId/${response.id}`, orderDetail).subscribe({
                    next: (orderDetailResponse) => {
                      console.log('OrderDetail created successfully', orderDetailResponse);
  
                      // Mostrar mensaje de éxito con SweetAlert2
                      Swal.fire({
                        icon: 'success',
                        title: '¡Pedido realizado con éxito!',
                        text: 'Gracias por su compra.',
                        showConfirmButton: true,
                        confirmButtonText: 'Aceptar'
                      }).then(() => {
                        // Navegar a la página de la tienda después de cerrar el mensaje
                        this.router.navigate(['store-page']);
                      });
                    },
                    error: (error) => {
                      console.error('Error al crear el OrderDetail', error);
  
                      // Mostrar mensaje de error con SweetAlert2
                      Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Ocurrió un error al crear los detalles de la orden.',
                        showConfirmButton: true,
                        confirmButtonText: 'Aceptar'
                      });
                    }
                  });
                }
              },
              error: (error) => {
                console.error('Error al guardar la orden', error);
  
                let errorMessage = '';
                if (error.status === 0) {
                  errorMessage = 'No se pudo conectar al servidor.';
                } else {
                  errorMessage = `Error: ${error.status} - ${error.message}`;
                }
  
                // Mostrar mensaje de error con SweetAlert2
                Swal.fire({
                  icon: 'error',
                  title: 'Error al realizar el pedido',
                  text: errorMessage,
                  showConfirmButton: true,
                  confirmButtonText: 'Aceptar'
                });
              }
            });
          } else {
            // Mostrar mensaje de error cuando el usuario no está autenticado
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo autenticar al usuario. Por favor, inicie sesión nuevamente.',
              showConfirmButton: true,
              confirmButtonText: 'Aceptar'
            });
          }
        },
        error: (error) => {
          console.error('Error al obtener la información del usuario', error);
  
          // Mostrar mensaje de error al obtener el usuario
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al obtener la información del usuario.',
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
        }
      });
    }
  }
  
  cambiarMoneda(money: number): string {
    return this.loginService.cambiarDivisaPrecio(money);
  }
}
