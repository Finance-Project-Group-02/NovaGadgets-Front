import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../user/services/login/login.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
  imports: [RouterLinkActive, RouterLink, CommonModule]
})
export class ToolbarComponent implements OnInit {

  role: string | undefined;

  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.loginService.getUser().subscribe((user) => {
      this.role = user?.roles[0].nameRole;
      console.log('Role:', this.role);
    }
    );
  }

  logout() {
    this.loginService.logout();
  }

}
