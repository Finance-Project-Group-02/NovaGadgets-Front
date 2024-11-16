import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/Product';
import { ProductStorageService } from '../../../shopping_cart/services/product-storage/product-storage.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Importar Router
import { forkJoin } from 'rxjs'; // Importar forkJoin
import Swal from 'sweetalert2'; // Importar SweetAlert2
import { LoginService } from '../../../user/services/login/login.service';

@Component({
  selector: 'app-shopping-cart-pay',
  standalone: true,
  imports: [NgIf, FormsModule, NgFor],
  templateUrl: './shopping-cart-pay.component.html',
  styleUrl: './shopping-cart-pay.component.css'
})
export class ShoppingCartPayComponent implements OnInit {
  cartProducts: Product[] = [];
  shippingCost: number = 50;
  districts:[] = [] // Costo de envío fijo, puedes ajustarlo según necesidad
  order = {
    address: '',
    paymentMethod: 'creditCard'
  };

  constructor(
    private productStorageService: ProductStorageService,
    private http: HttpClient,
    private router: Router,
    private loginService: LoginService // Inyectar LoginService
  ) {}

  ngOnInit(): void {
    this.cartProducts = this.productStorageService.getProducts();
  }

  calculateSubtotal(): number {
    return this.cartProducts.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  }

  calculateTotalWithShipping(): number {
    return this.calculateSubtotal() + this.shippingCost;
  }

  placeOrder(): void {
    this.loginService.getUser().subscribe({
      next: (user) => {
        if (user) {
          const order = {
            idUser: user.id, // Obtener dinámicamente el ID del usuario
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
              const orderDetailRequests = this.cartProducts.map((product) => {
                const orderDetail = {
                  quantity: product.quantity,
                  productId: product.id
                };

                return this.http.post(
                  `http://localhost:8080/api/v1/orderDetail/orderId/${response.id}`,
                  orderDetail
                );
              });

              // Esperar a que se completen todas las solicitudes de creación de detalles de orden
              forkJoin(orderDetailRequests).subscribe({
                next: () => {
                  // Limpiar el carrito después de realizar el pedido
                  this.clearCart();

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
                  console.error('Error creating OrderDetails', error);
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
            },
            error: (error) => {
              console.error('Error creating order', error);
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
        console.error('Error retrieving user', error);
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

  clearCart(): void {
    this.productStorageService.saveProducts([]);
    this.cartProducts = [];
  }

  cambiarMoneda(money: number): string {
    return this.loginService.cambiarDivisaPrecio(money);
  }

}
