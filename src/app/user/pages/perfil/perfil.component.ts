import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login/login.service';
import { User } from '../../models/user.model';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatSelectModule} from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

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
  constructor(private loginService: LoginService) {
  }

  ngOnInit() {
    this.loginService.getUser().subscribe( user => {
      this.user = user;
      console.log('Usuario:', this.user);
    }
    );
  }
}
