import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login/login.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  user?: User | null;

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
