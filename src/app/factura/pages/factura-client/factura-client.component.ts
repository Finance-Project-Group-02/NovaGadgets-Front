import { Component, OnInit } from '@angular/core';
import { FacturaSummary } from '../../models/facturaSummary';
import { FacturaService } from '../../services/factura/factura.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-factura-client',
  templateUrl: './factura-client.component.html',
  standalone: true,
  imports: [
    MatCardModule, CommonModule
  ],
  styleUrls: ['./factura-client.component.css']
})
export class FacturaClientComponent implements OnInit {
  dsFacturas!: FacturaSummary[];

  constructor(private facturaService: FacturaService) { }

  ngOnInit() {
    this.cargarFacturas();
  }

  cargarFacturas() {
    this.facturaService.getFacturas().subscribe({
      next: (data: FacturaSummary[]) => {
        this.dsFacturas = data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
