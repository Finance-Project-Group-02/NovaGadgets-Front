import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login/login.service';
import { User } from '../../models/user.model';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatSelectModule} from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  standalone: true,
  imports: [
    MatIconModule, MatFormFieldModule, MatSelectModule, MatButtonModule, CommonModule
  ],
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  user!: User | null;
  selectedCurrency: string = ''; 

  constructor(private loginService: LoginService) {
  }

  ngOnInit() {
    this.loginService.getUser().subscribe( user => {
      this.user = user;
      this.selectedCurrency = this.user?.currencyType || 'PEN'; 
      console.log('Usuario:', this.user);
    }
    );
  }

  //changeCurrencyTypeUser
  changeCurrencyTypeUser() {
    if (this.user) {
       this.loginService.changeCurrencyTypeUser(this.user.id, this.selectedCurrency);
       this.user.currencyType = this.selectedCurrency;
       console.log('Usuario:', this.user);
       console.log('Moneda:', this.selectedCurrency);
       console.log('Moneda Usuario:', this.user.currencyType);
       console.log('Usuario Login:', this.loginService.getUser());

       Swal.fire({
        icon: 'success',
        title: '¡Tipo de Moneda Actualizado!',
        text: 'Ahora podras visualizar el sistema con su divisa elegida.',
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      })

    }
  }

  generarMensaje(){
    Swal.fire({
      icon: 'question',
      text: 'Dentro del apartado del perfil usted puede visualizar todos sus datos que ha registrado en el sistema, ademas de poder cambiar el tipo de moneda con la que desea visualizar el sistema.',
      showConfirmButton: true,
      confirmButtonText: 'Aceptar'
    });
  }

}
