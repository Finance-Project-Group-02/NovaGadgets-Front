import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Login } from '../../models/login.model';
import { LoginService } from '../../services/login/login.service';
import { User } from '../../models/user.model';


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule]
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  login: Login = {
    email: '',
    password: ''
  }

  constructor( private loginService: LoginService, private renderer: Renderer2, private el: ElementRef, private toastr: ToastrService) {}

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  onSubmit(loginForm: NgForm) {
    if (loginForm.invalid) {
      loginForm.controls['email'].markAsTouched();
      loginForm.controls['password'].markAsTouched();
      this.toastr.clear();
      this.toastr.warning('Por favor, complete los campos requeridos', 'Formulario Inválido');
      return;
    }
  
    this.loginService.login(this.login).subscribe({
      next: (response: User) => {
        console.log('Inicio de sesión exitoso:', response);
        this.loginService.loadUser(response);
  
        this.toastr.clear();
        this.toastr.success(`Inicio de sesión exitoso`, `¡Bienvenido ${response.firstName}!`);
      },
      error: (err) => {
        const mensajeError = err.error?.message || 'Error desconocido';
  
        this.toastr.clear();
        this.toastr.error(mensajeError, 'Error de Autenticación');
      }
    });
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
