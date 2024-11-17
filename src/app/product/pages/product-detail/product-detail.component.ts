import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../models/Product';
import { ProductStorageService } from '../../../shopping_cart/services/product-storage/product-storage.service';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { LoginService } from '../../../user/services/login/login.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink], // Agregar CommonModule a los imports
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product = new Product();
  cartProducts: Product[] = [];
  constructor(
    private route: ActivatedRoute,
    private psS: ProductService,
    private router: Router,
    private productStorage: ProductStorageService,
    private loginService: LoginService,
    private toastr: ToastrService
  ) {}

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
    const existingProducts = this.productStorage.getProducts();
    const existingProduct = existingProducts.find(p => p.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      product.quantity = 1;
      existingProducts.push(product);
    }

    this.productStorage.saveProducts(existingProducts);

    this.toastr.success(`Producto añadido al carrito de compras`, `¡${product.name} añadido!`);
    console.log('Product added to shopping cart');
    console.log(this.productStorage.getProducts());
  }

  cambiarMoneda(money: number): string {
    return this.loginService.cambiarDivisaPrecio(money);
  }
}

