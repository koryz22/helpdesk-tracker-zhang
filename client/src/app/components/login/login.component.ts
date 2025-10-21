import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/user.model';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials: LoginRequest = {
    email: '',
    password: ''
  };
  errorMessage = '';
  loading = false;
  currentYear = new Date().getFullYear();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Please enter email and password';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.loading = false;
        // Redirect based on role
        if (response.user.role === 'Admin') {
          this.router.navigate(['/dashboard/admin']);
        } else {
          this.router.navigate(['/dashboard/user']);
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Invalid email or password';
      }
    });
  }
}

