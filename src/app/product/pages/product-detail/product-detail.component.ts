import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { ProductstoreserviceService } from '../../services/product/productstoreservice.service';
import { ProductStore } from '../../models/productStore';
import { Product } from '../../models/Product';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit{
  product: Product = new Product(); // Cambia el tipo según tu modelo

  constructor(private route: ActivatedRoute, private psS: ProductService, private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.psS.getProductById(id).subscribe(data => {
      this.product = data;
    });
  }
  goBack(): void {
    this.router.navigate(['/store-page']);
  }
  
}
