import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';

import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';

import { UserModel } from '../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [MatSelectModule, FormsModule, MatInputModule, MatFormFieldModule, CommonModule]
})
export class RegisterComponent{
  user: UserModel = new UserModel();

  constructor( private renderer: Renderer2, private el: ElementRef) {}

  onSubmit(registerForm: any) {
    if (registerForm.valid) {
      // Lógica para registrar al usuario
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
