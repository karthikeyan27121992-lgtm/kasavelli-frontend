import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { LoginRequest } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="login-container">
        <h2 class="text-center">Login</h2>
        
        <div class="alert alert-error" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <input 
              type="tel" 
              class="form-control" 
              [(ngModel)]="credentials.phone_number" 
              name="phone_number"
              placeholder="Enter your phone number"
              required
            >
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input 
              type="password" 
              class="form-control" 
              [(ngModel)]="credentials.password" 
              name="password"
              placeholder="Enter your password"
              required
            >
          </div>

          <button 
            type="submit" 
            class="btn btn-primary" 
            [disabled]="!loginForm.valid || loading"
            style="width: 100%;"
          >
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>

        <p class="text-center mt-3">
          Don't have an account? <a href="#" (click)="toggleRegister($event)">Register</a>
        </p>

        <!-- Registration Form -->
        <div *ngIf="showRegister" class="mt-4">
          <h3 class="text-center">Register</h3>
          <form (ngSubmit)="onRegister()" #registerForm="ngForm">
            <div class="form-group">
              <label class="form-label">Name</label>
              <input 
                type="text" 
                class="form-control" 
                [(ngModel)]="registerData.name" 
                name="name"
                required
              >
            </div>

            <div class="form-group">
              <label class="form-label">Phone Number</label>
              <input 
                type="tel" 
                class="form-control" 
                [(ngModel)]="registerData.phone_number" 
                name="reg_phone"
                required
              >
            </div>

            <div class="form-group">
              <label class="form-label">Email (Optional)</label>
              <input 
                type="email" 
                class="form-control" 
                [(ngModel)]="registerData.email" 
                name="email"
              >
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <input 
                type="password" 
                class="form-control" 
                [(ngModel)]="registerData.password" 
                name="reg_password"
                required
              >
            </div>

            <button 
              type="submit" 
              class="btn btn-primary" 
              [disabled]="!registerForm.valid || loading"
              style="width: 100%;"
            >
              {{ loading ? 'Registering...' : 'Register' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(139, 58, 98, 0.05) 0%, rgba(169, 75, 118, 0.05) 100%);
    }

    .login-container {
      max-width: 450px;
      width: 100%;
      margin: 2rem;
      padding: 3rem;
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(139, 58, 98, 0.15);
      border: 1px solid rgba(139, 58, 98, 0.1);
    }

    h2, h3 {
      color: var(--primary-purple);
      font-family: 'Raleway', sans-serif;
      margin-bottom: 2rem;
      font-size: 2rem;
    }

    h3 {
      font-size: 1.5rem;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 2px solid rgba(139, 58, 98, 0.1);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: var(--primary-purple);
      font-family: 'Raleway', sans-serif;
    }

    .form-control {
      width: 100%;
      padding: 0.875rem;
      border: 2px solid rgba(139, 58, 98, 0.2);
      border-radius: 8px;
      font-family: 'Raleway', sans-serif;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: var(--primary-purple);
      box-shadow: 0 0 0 4px rgba(139, 58, 98, 0.1);
    }

    .btn-primary {
      width: 100%;
      padding: 1rem;
      margin-top: 1rem;
      background: linear-gradient(135deg, var(--primary-purple) 0%, var(--primary-magenta) 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1.125rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(139, 58, 98, 0.3);
    }

    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, var(--dark-purple) 0%, var(--primary-purple) 100%);
      box-shadow: 0 6px 16px rgba(139, 58, 98, 0.4);
      transform: translateY(-2px);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .alert-error {
      background-color: rgba(211, 47, 47, 0.1);
      border: 1px solid rgba(211, 47, 47, 0.3);
      color: #D32F2F;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      font-weight: 500;
    }

    .text-center {
      text-align: center;
    }

    .mt-3 {
      margin-top: 1.5rem;
    }

    .mt-4 {
      margin-top: 2rem;
    }

    p {
      color: var(--dark-gray);
      font-family: 'Raleway', sans-serif;
    }

    a {
      color: var(--primary-purple);
      font-weight: 600;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    a:hover {
      color: var(--primary-magenta);
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .login-container {
        padding: 2rem;
        margin: 1rem;
      }

      h2 {
        font-size: 1.75rem;
      }
    }
  `]
})
export class LoginComponent {
  credentials: LoginRequest = {
    phone_number: '',
    password: ''
  };

  registerData = {
    name: '',
    phone_number: '',
    email: '',
    password: ''
  };

  showRegister = false;
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.loading = false;
        this.cartService.loadCartCount();
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.error || 'Login failed. Please try again.';
      }
    });
  }

  onRegister(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.loading = false;
        this.showRegister = false;
        alert('Registration successful! Please login.');
      },
      error: (err) => {
        this.loading = false;
        // DRF returns field-level errors as { field: ["msg"] } or a top-level { error: "msg" }
        if (err.error?.error) {
          this.errorMessage = err.error.error;
        } else if (err.error && typeof err.error === 'object') {
          const messages = Object.entries(err.error)
            .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`)
            .join(' | ');
          this.errorMessage = messages;
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      }
    });
  }

  toggleRegister(event: Event): void {
    event.preventDefault();
    this.showRegister = !this.showRegister;
    this.errorMessage = '';
  }
}

// Made with Bob
