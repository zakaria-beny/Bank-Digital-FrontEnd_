import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavBar } from './nav-bar/nav-bar';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBar, CommonModule],
  template: `
    <app-nav-bar *ngIf="showNavbar"></app-nav-bar>
    <router-outlet></router-outlet>
  `
})
export class App {
  showNavbar = true;

  constructor(private router: Router) {
    // Hide navbar on initial load
    this.updateNavbarVisibility(this.router.url);

    // Hide navbar on route change
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateNavbarVisibility(event.urlAfterRedirects);
    });
  }

  private updateNavbarVisibility(url: string) {
    // Hide navbar for login and register routes
    this.showNavbar = !(url.startsWith('/login') || url.startsWith('/register'));
  }
}
