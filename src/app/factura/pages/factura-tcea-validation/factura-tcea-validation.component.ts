import { Component } from '@angular/core';
import { FacturaService } from '../../services/factura/factura.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FacturaSummary } from '../../models/facturaSummary';
import {  MatExpansionModule} from '@angular/material/expansion';
import {  MatCardModule} from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TCEACarteraDTO } from '../../models/TCEACarteraDTO';

@Component({
  selector: 'app-factura-tcea-validation',
  standalone: true,
  imports: [MatExpansionModule, MatCardModule, CommonModule],
  templateUrl: './factura-tcea-validation.component.html',
  styleUrl: './factura-tcea-validation.component.css'
})
export class FacturaTceaValidationComponent {
  facturaId: number = 0;
  facturaSeleccionada!: FacturaSummary;
  dsFacturas!: FacturaSummary[];
  tceaCartera!: TCEACarteraDTO;
  facturasArray: number[] =[];

  constructor(private facturaService: FacturaService, private snackbar: MatSnackBar, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.facturaId = parseInt(this.activatedRoute.snapshot.params["id"]);
    this.cargarFactura();
    this.cargarFacturasValidas();
  }

  cargarFactura(){
    this.facturaService.getFacturaById(this.facturaId).subscribe({
      next: (data: FacturaSummary) =>{
        this.facturaSeleccionada = data;
        this.facturasArray.push(this.facturaId);
        this.calcularTCEACartera();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  cargarFacturasValidas(){
    this.facturaService.getFacturaValidas(this.facturaId).subscribe({
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

  calcularTCEACartera(){
    this.facturaService.getTCEAcartera(this.facturasArray).subscribe({
      next: (data: TCEACarteraDTO) =>{
        this.tceaCartera = data;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  onCardClick(facturaId: number){
    const index = this.facturasArray.indexOf(facturaId);   
    if (index === -1) {
        this.facturasArray.push(facturaId);
        this.calcularTCEACartera();
    } else {
        this.facturasArray.splice(index, 1);
        this.calcularTCEACartera();
    }
  }

  isFacturaSelected(facturaId: number): boolean {
      return this.facturasArray.includes(facturaId);
  }
}
