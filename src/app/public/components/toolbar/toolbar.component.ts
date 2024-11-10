import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../user/services/login/login.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
  imports: [RouterLinkActive, RouterLink]
})
export class ToolbarComponent implements OnInit {

  constructor(private loginService: LoginService) { }

  ngOnInit() {
  }

  logout() {
    this.loginService.logout();
  }

}
