import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from './public/components/toolbar/toolbar.component';
import { CommonModule } from '@angular/common';
import { LoginService } from './user/services/login/login.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToolbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'NovaGadgets-Front';
  isLoggedIn: boolean = false;

  constructor(private authService: LoginService) {}

  ngOnInit() {
    // Verificar autenticación
    this.authService.getUserLogin().subscribe({
      next: (loggedIn) => {
        this.isLoggedIn = loggedIn;
      },
      error: (err) => {
        console.error('Error en la suscripción de isLoggedIn:', err);
      }
    });

    // Actualizar el estado de isLoggedIn y obtener el usuario
    this.isLoggedIn = this.authService.isUserLogged();
  }
}
