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

@Component({
  selector: 'app-product-order',
  standalone: true,
  imports: [MatExpansionModule, MatCardModule, MatIconModule, CommonModule, RouterModule],
  templateUrl: './product-order.component.html',
  styleUrls: ['./product-order.component.css']
})
export class ProductOrderComponent implements OnInit {
  selectedProduct: ProductStore | null = null;  // Producto seleccionado
  totalPrice: number = 0;  // Total de la compra

  constructor(
    private productStoreService: ProductstoreserviceService, 
    private productService: ProductService, 
    private http: HttpClient,
    private route: ActivatedRoute  // Inyectamos ActivatedRoute para leer parámetros de la URL
  ) { }

  ngOnInit(): void {
    // Obtener el ID del ProductStore desde la URL
    const productId = this.route.snapshot.paramMap.get('id');  // 'id' es el parámetro de la URL

    if (productId) {
      this.productStoreService.getProductById(productId).subscribe((productStore: ProductStore) => {
        this.selectedProduct = productStore;  // Asignamos el ProductStore obtenido
        this.totalPrice = productStore.price + 10;  // Calculamos el precio total con el costo de envío
      });
    }
  }

  // Método para crear y guardar la orden
  createOrder(): void {
    if (this.selectedProduct) {
      const order = new Order();
      order.idUser = 1;  // ID del usuario (en este caso siempre 1)
      order.orderDate = new Date().toISOString();  // Fecha actual (en formato ISO)
      order.totalInvoiced = this.totalPrice;  // Precio total (producto + envío)
  
      // Realizamos la petición para guardar la orden en la base de datos
      this.http.post('http://localhost:8080/api/v1/order', order).subscribe({
        next: (response) => {
          alert('Pedido realizado con éxito');
          console.log('Order saved successfully', response);
        },
        error: (error) => {
          // Mostrar más detalles sobre el error
          console.error('Error al guardar la orden', error);
          if (error.status === 0) {
            alert('No se pudo conectar al servidor');
          } else {
            alert(`Error: ${error.status} - ${error.message}`);
            console.log('Error details:', error);
          }
        }
      });
    }
  }
  
}
