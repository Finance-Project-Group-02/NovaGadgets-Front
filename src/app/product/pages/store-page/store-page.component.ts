import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Product } from '../../models/Product';
import { MatTableDataSource } from '@angular/material/table';
import { NgFor } from '@angular/common';
import { ProductService } from '../../services/product/product.service';
import { ProductStore } from '../../models/productStore';
import { ProductstoreserviceService } from '../../services/product/productstoreservice.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-store-page',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: './store-page.component.html',
  styleUrl: './store-page.component.css'
})
export class StorePageComponent implements OnInit, AfterViewInit {
  dataSourcePr: MatTableDataSource<Product> = new MatTableDataSource();

  constructor(private prS: ProductService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    
    this.prS.list().subscribe(data => {
      this.dataSourcePr.data = data;
    });
    this.prS.getList().subscribe(data => {
      this.dataSourcePr.data = data;
    });
  }

  ngAfterViewInit(): void {}

  scrollLeft(): void {
    const container = document.querySelector('.card-container') as HTMLElement;
    container.scrollBy({ left: -200, behavior: 'smooth' });
  }

  scrollRight(): void {
    const container = document.querySelector('.card-container') as HTMLElement;
    container.scrollBy({ left: 200, behavior: 'smooth' });
  }
}
