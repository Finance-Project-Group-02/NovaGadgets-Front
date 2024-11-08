import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Login } from '../../models/login.model';


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule, RouterLink]
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  login: Login = {
    username: '',
    password: ''
  }

  constructor( private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  onSubmit() {
    console.log('Loginform submitted');
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
