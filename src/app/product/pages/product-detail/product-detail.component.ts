import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { ProductstoreserviceService } from '../../services/product/productstoreservice.service';
import { ProductStore } from '../../models/productStore';
import { Product } from '../../models/Product';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit{
  productstore: ProductStore = new ProductStore(); // Cambia el tipo según tu modelo

  constructor(private route: ActivatedRoute, private psS: ProductstoreserviceService, private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.psS.getProductById(id).subscribe(data => {
      this.productstore = data;
    });
  }
  goBack(): void {
    this.router.navigate(['/store-page']);
  }
  
}
