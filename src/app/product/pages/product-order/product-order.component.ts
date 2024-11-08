import { Component } from '@angular/core';
import { ProductStore } from '../../models/productStore';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-order',
  standalone: true,
  imports: [MatExpansionModule, MatCardModule, MatIconModule,CommonModule, RouterModule],
  templateUrl: './product-order.component.html',
  styleUrl: './product-order.component.css'
})
export class ProductOrderComponent {
  dsProductStore!: ProductStore[];
}
