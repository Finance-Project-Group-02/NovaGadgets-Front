import { Component, OnInit } from '@angular/core';
import { FacturaSummary } from '../../models/facturaSummary';
import { FacturaService } from '../../services/factura/factura.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { User } from '../../../user/models/user.model';
import { LoginService } from '../../../user/services/login/login.service';

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
  user!: User | null;

  constructor(private facturaService: FacturaService, private loginService: LoginService){}

  ngOnInit() {
    this.loginService.getUser().subscribe( user => {
      this.user = user;
      console.log('Usuario:', this.user);
    }
    );

    this.cargarFacturas(this.user?.id);
  }

  cargarFacturas(invoiceId: number | undefined) {
    this.facturaService.getFacturasByClient(invoiceId || 0).subscribe({
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

  cambiarDivisaPrecio(monto: number) : String{
    return this.loginService.cambiarDivisaPrecio(monto);
  }
}
