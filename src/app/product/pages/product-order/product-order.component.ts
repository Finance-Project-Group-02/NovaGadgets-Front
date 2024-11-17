import { Component, Inject, OnInit } from '@angular/core';
import { ProductStore } from '../../models/productStore';

import { Order } from '../../models/Order'; // Importa el modelo de la orden
import { HttpClient } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product } from '../../models/Product';
import { ProductstoreserviceService } from '../../services/product/productstoreservice.service';
import { ProductService } from '../../services/product/product.service';
import { OrderDetail } from '../../models/OrderDetail';
import { LoginService } from '../../../user/services/login/login.service';
import { ProductStorageService } from '../../../shopping_cart/services/product-storage/product-storage.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-order',
  standalone: true,
  imports: [MatExpansionModule, MatCardModule, MatIconModule, CommonModule, RouterModule, FormsModule],
  templateUrl: './product-order.component.html',
  styleUrls: ['./product-order.component.css']
})
export class ProductOrderComponent implements OnInit {
  selectedProduct: Product = new Product();
  totalPrice: number = 0;
  curriermoney: number = 10;
  policyAccepted: boolean = false;

  constructor(
    private productStorageService: ProductStorageService,
    private productService: ProductService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');

    if (productId) {
      this.productService.getProductById(productId).subscribe((productselect: Product) => {
        this.selectedProduct = productselect;
        productselect.quantity = 1,
        this.totalPrice = productselect.price * productselect.quantity + this.curriermoney;
      });
    }
  }

  increaseQuantity(): void {
    if (this.selectedProduct && this.selectedProduct.quantity < 99) {
      this.selectedProduct.quantity += 1;
      this.updateTotalPrice();
    }
  }

  decreaseQuantity(): void {
    if (this.selectedProduct && this.selectedProduct.quantity > 1) {
      this.selectedProduct.quantity -= 1;
      this.updateTotalPrice();
    }
  }

  updateTotalPrice(): void {
    if (this.selectedProduct) {
      this.totalPrice = this.selectedProduct.price * this.selectedProduct.quantity + this.curriermoney;
    }
  }

  createOrder(): void {
    const addressInput = (document.getElementById('address') as HTMLInputElement)?.value;
    const districtSelect = (document.getElementById('district') as HTMLSelectElement)?.value;
    const referenceInput = (document.getElementById('reference') as HTMLInputElement)?.value;

    if (!addressInput || !districtSelect || !referenceInput) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos obligatorios',
        text: 'Por favor, complete todos los campos obligatorios: Dirección, Distrito y Referencias.',
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    if (!this.policyAccepted) {
      Swal.fire({
        icon: 'warning',
        title: 'Términos no aceptados',
        text: 'Debe aceptar los términos y condiciones para continuar.',
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    if (this.selectedProduct) {
      this.loginService.getUser().subscribe({
        next: (user) => {
          if (user) {
            const order = new Order();
            order.idUser = user.id;
            order.orderDate = new Date().toISOString();
            order.totalInvoiced = this.totalPrice;

            this.http.post('http://localhost:8080/api/v1/order', order).subscribe({
              next: (response: any) => {
                const orderDetail = new OrderDetail();
                orderDetail.quantity = this.selectedProduct!.quantity;
                orderDetail.productId = this.selectedProduct?.id;

                this.http.post(`http://localhost:8080/api/v1/orderDetail/orderId/${response.id}`, orderDetail).subscribe({
                  next: () => {
                    Swal.fire({
                      icon: 'success',
                      title: '¡Pedido realizado con éxito!',
                      text: 'Gracias por su compra.',
                      showConfirmButton: true,
                      confirmButtonText: 'Aceptar'
                    }).then(() => {
                      this.router.navigate(['store-page']);
                    });
                  },
                  error: () => {
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
                Swal.fire({
                  icon: 'error',
                  title: 'Error al realizar el pedido',
                  text: error.message,
                  showConfirmButton: true,
                  confirmButtonText: 'Aceptar'
                });
              }
            });
          }
        }
      });
    }
  }

  cambiarMoneda(money: number): string {
    return this.loginService.cambiarDivisaPrecio(money);
  }
}
