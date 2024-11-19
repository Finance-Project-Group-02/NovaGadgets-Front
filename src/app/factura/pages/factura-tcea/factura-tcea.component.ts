import { Component } from '@angular/core';
import { FacturaSummary } from '../../models/facturaSummary';
import {  MatExpansionModule} from '@angular/material/expansion';
import {  MatCardModule} from '@angular/material/card';
import { MatIconModule} from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FacturaService } from '../../services/factura/factura.service';
import { LoginService } from '../../../user/services/login/login.service';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-factura-tcea',
  standalone: true,
  imports: [MatExpansionModule, MatCardModule, MatIconModule,CommonModule, RouterModule, MatButtonModule],
  templateUrl: './factura-tcea.component.html',
  styleUrl: './factura-tcea.component.css'
})
export class FacturaTceaComponent {
  dsFacturas!: FacturaSummary[];
  selectFirst: boolean = false;

  constructor(private facturaService: FacturaService, private loginService: LoginService) { }

  ngOnInit() {
    this.cargarFacturas();
  }

  cargarFacturas(){
    this.facturaService.getFacturaState("ACEPTADO").subscribe({
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

  cambiarDivisaPrecio(monto: number) : String{
    return this.loginService.cambiarDivisaPrecio(monto);
  }

  generarMensaje(){
    Swal.fire({
      icon: 'question',
      text: 'Se muestra la lista de facturas con estado "Aceptado". Seleccione una para iniciar el cálculo de la TCEA de la cartera.',
      showConfirmButton: true,
      confirmButtonText: 'Aceptar'
    });
  }
}
