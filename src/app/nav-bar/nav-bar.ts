import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth-serivce';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './nav-bar.html'
})
export class NavBar {

  constructor(public authService: AuthService) {}

  logout(): void {
    if (confirm('Voulez-vous vous déconnecter?')) {
      this.authService.logout();
    }
  }

  get username(): string {
    return this.authService.getUsername() || 'Admin';
  }
}
