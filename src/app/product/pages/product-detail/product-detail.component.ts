import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { ProductstoreserviceService } from '../../services/product/productstoreservice.service';
import { ProductStore } from '../../models/productStore';
import { Product } from '../../models/Product';
import { ProductStorageService } from '../../../shopping_cart/services/product-storage/product-storage.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit{
  product: Product = new Product(); // Cambia el tipo según tu modelo

  constructor(private route: ActivatedRoute, private psS: ProductService, private router: Router, private productStorage: ProductStorageService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.psS.getProductById(id).subscribe(data => {
      this.product = data;
    });
  }
  goBack(): void {
    this.router.navigate(['/store-page']);
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
  }  
  
}
