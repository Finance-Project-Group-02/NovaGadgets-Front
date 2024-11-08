import { Component, OnInit } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { FacturaSummary } from '../../models/facturaSummary';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FacturaService } from '../../services/factura/factura.service';


@Component({
  selector: 'app-factura-admin',
  standalone: true,
  imports: [MatExpansionModule, MatCardModule, MatIconModule,CommonModule, RouterModule],
  templateUrl: './factura-admin.component.html',
  styleUrls: ['./factura-admin.component.css']
})
export class FacturaAdminComponent  {
  dsFacturas!: FacturaSummary[];

  constructor(private facturaService: FacturaService) { }

  ngOnInit() {
    this.cargarFacturas();
  }

  cargarFacturas(){
    this.facturaService.getFacturas().subscribe({
      next: (data: FacturaSummary[]) =>{
        this.dsFacturas = data;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getStateClass(state: String): string {
      switch (state) {
          case "ACEPTADO":
              return 'estado-aceptado';
          case "PENDIENTE":
              return 'estado-pendiente';
          case "RECHAZADO":
              return 'estado-rechazado';
          default:
              return '';
    }
  }

}
