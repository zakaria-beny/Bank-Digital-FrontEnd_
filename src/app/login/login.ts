import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-serivce';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const { username, password } = this.loginForm.value;
    const start = performance.now();

    this.authService.login(username, password).subscribe({
      next: () => {
        console.log(`[login] /auth/login OK in ${Math.round(performance.now() - start)}ms`);
        const navStart = performance.now();
        this.router.navigate(['/dashboard']).finally(() => {
          console.log(`[login] navigate(/dashboard) finished in ${Math.round(performance.now() - navStart)}ms`);
          this.loading = false;
        });
      },
      error: () => {
        console.log(`[login] /auth/login ERROR in ${Math.round(performance.now() - start)}ms`);
        this.errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect';
        this.loading = false;
      }
    });
  }
}
