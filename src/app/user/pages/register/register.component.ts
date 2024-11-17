import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';

import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';

import { User, UserModel } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { RegisterService } from '../../services/register/register.service';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [MatSelectModule, FormsModule, MatInputModule, MatFormFieldModule, CommonModule, RouterLink]
})
export class RegisterComponent{
  user: UserModel = new UserModel();

  constructor( private renderer: Renderer2, private el: ElementRef, private registerService: RegisterService,
    private router: Router) {}

  onSubmit(registerForm: any) {
    if (registerForm.valid) {
      // Lógica para registrar al usuario
      let genderValide! : string;

      if(this.user.gender == 'masculino'){
        genderValide= 'M';
      }
      else if(this.user.gender == 'femenino'){
        genderValide= 'F';
      }
      else{
        genderValide= 'O';
      }

      const user: User = {
        id: 0,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        address: this.user.address,
        username: this.user.username,
        password: this.user.password,
        email: this.user.email,
        birthday: this.user.birthday,
        phoneNumber: this.user.phoneNumber,
        dni: this.user.dni,
        gender: genderValide,
        ruc: this.user.ruc,
        currencyType: this.user.currencyType,
        roles: [{id: 0,nameRole: this.user.roles[0].nameRole}]
      };

      this.registerService.newUser(user).subscribe({
        next: (data: User) =>{
          Swal.fire({
            icon: 'success',
            title: '¡Se registro con éxito!',
            text: 'Gracias por su preferencia.',
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.router.navigate(['/login']);
          });
          console.log('Se creo el usuario', this.user);
        },
        error: (err)=>{
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error en el registro del usuario',
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
          console.log(err);
        }
      })
      console.log('Formulario válido:', this.user);
    } else {
      console.log('Formulario inválido');
    }
  }

  ngAfterViewInit(): void {
    const carouselContainer = this.el.nativeElement.querySelector("#carouselContainer");
    const carouselElement = this.el.nativeElement.querySelector("#backgroundCarousel");

    const colors = ["#241213", "#2B2211"];
    let colorIndex = 0;

    if (carouselElement) {
      this.renderer.listen(carouselElement, "slide.bs.carousel", () => {
        colorIndex = (colorIndex + 1) % colors.length;
        if (carouselContainer) {
          this.renderer.setStyle(carouselContainer, "backgroundColor", colors[colorIndex]);
        }
      });
    }
  }
}
