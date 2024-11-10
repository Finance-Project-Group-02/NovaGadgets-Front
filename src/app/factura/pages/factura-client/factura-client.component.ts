import { Component, OnInit } from '@angular/core';
import { FacturaSummary } from '../../models/facturaSummary';
import { FacturaService } from '../../services/factura/factura.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-factura-client',
  templateUrl: './factura-client.component.html',
  standalone: true,
  imports: [
    MatCardModule, CommonModule, MatFormFieldModule, MatSelectModule
  ],
  styleUrls: ['./factura-client.component.css']
})
export class FacturaClientComponent implements OnInit {
  dsFacturas!: FacturaSummary[];
  facturasFiltradas!: FacturaSummary[];
  estados: string[] = ['ACEPTADO', 'PENDIENTE', 'RECHAZADO'];
  selectedState: string = '';

  constructor(private facturaService: FacturaService) { }

  ngOnInit() {
    this.cargarFacturas();
  }

  cargarFacturas() {
    this.facturaService.getFacturas().subscribe({
      next: (data: FacturaSummary[]) => {
        this.dsFacturas = data;
        this.facturasFiltradas = data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  filtrarFacturas() {
    if (this.selectedState) {
      this.facturasFiltradas = this.dsFacturas.filter(factura => factura.state === this.selectedState)
    }
    else {
      this.facturasFiltradas = this.dsFacturas;
    }
  }
}
