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
    <div class="auth-page-wrap">
      <div class="auth-card">
        
        <!-- Brand Header with Logo -->
        <div class="auth-brand">
          <img src="assets/images/kasavelli-logo.svg" alt="Kasavelli 925" class="auth-logo-img">
          <div class="auth-brand-names">
            <span class="auth-brand-title">KASAVELLI</span>
          </div>
          <p class="auth-brand-subtitle">Pure 925 Sterling Silver Jewellery</p>
        </div>

        <!-- Mode Switcher Tabs -->
        <div class="auth-tabs">
          <button type="button" class="tab-btn" [class.active]="!showRegister" (click)="setMode(false)">
            Sign In
          </button>
          <button type="button" class="tab-btn" [class.active]="showRegister" (click)="setMode(true)">
            Create Account
          </button>
        </div>

        <!-- Error Message Alert -->
        <div class="alert alert-error" *ngIf="errorMessage">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- ── LOGIN FORM ───────────────────────────── -->
        <form *ngIf="!showRegister" (ngSubmit)="onSubmit()" #loginForm="ngForm" class="auth-form">
          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <div class="input-icon-wrap">
              <span class="input-prefix">+91</span>
              <input
                type="tel"
                class="form-control with-prefix"
                [(ngModel)]="credentials.phone_number"
                name="phone_number"
                placeholder="Enter 10-digit mobile number"
                required
              >
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="input-icon-wrap">
              <input
                type="password"
                class="form-control"
                [(ngModel)]="credentials.password"
                name="password"
                placeholder="Enter your account password"
                required
              >
            </div>
          </div>

          <button
            type="submit"
            class="btn-submit auth-action-btn"
            [disabled]="!loginForm.valid || loading"
          >
            <span class="btn-text-label" *ngIf="!loading">Sign In</span>
            <span *ngIf="loading" class="loading-state">
              <span class="btn-spinner"></span> Signing in...
            </span>
          </button>

          <div class="auth-footer-prompt">
            <span>New to Kasavelli?</span>
            <button type="button" class="link-btn" (click)="setMode(true)">Create an Account</button>
          </div>
        </form>

        <!-- ── REGISTRATION FORM ────────────────────── -->
        <form *ngIf="showRegister" (ngSubmit)="onRegister()" #registerForm="ngForm" class="auth-form">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input
              type="text"
              class="form-control"
              [(ngModel)]="registerData.name"
              name="name"
              placeholder="e.g. Priya Sharma"
              required
            >
          </div>

          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <div class="input-icon-wrap">
              <span class="input-prefix">+91</span>
              <input
                type="tel"
                class="form-control with-prefix"
                [(ngModel)]="registerData.phone_number"
                name="reg_phone"
                placeholder="10-digit mobile number"
                required
              >
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Email Address (Optional)</label>
            <input
              type="email"
              class="form-control"
              [(ngModel)]="registerData.email"
              name="email"
              placeholder="name@example.com"
            >
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input
              type="password"
              class="form-control"
              [(ngModel)]="registerData.password"
              name="reg_password"
              placeholder="Create a secure password"
              required
            >
          </div>

          <button
            type="submit"
            class="btn-submit auth-action-btn"
            [disabled]="!registerForm.valid || loading"
          >
            <span class="btn-text-label" *ngIf="!loading">Create Account</span>
            <span *ngIf="loading" class="loading-state">
              <span class="btn-spinner"></span> Creating account...
            </span>
          </button>

          <div class="auth-footer-prompt">
            <span>Already have an account?</span>
            <button type="button" class="link-btn" (click)="setMode(false)">Sign In</button>
          </div>
        </form>

      </div>
    </div>
  `,
  styles: [`
    :host {
      --royal: #551756;
      --royal-mid: #6e2370;
      --royal-dark: #3a0e3b;
      --gold: #c9a84c;
      --gold-light: #f5cf62;
      --cream-bg: #faf7f2;
      --card-bg: #ffffff;
      --text: #1a1a2e;
      --text-muted: #6b6b7b;
      --border: #e8e0ee;
    }

    .auth-page-wrap {
      min-height: 85vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3rem 1.5rem;
      background: radial-gradient(circle at 50% 20%, rgba(85, 23, 86, 0.06) 0%, rgba(250, 247, 242, 1) 75%);
    }

    .auth-card {
      max-width: 440px;
      width: 100%;
      background: var(--card-bg);
      border-radius: 20px;
      padding: 2.5rem 2.25rem 2.75rem;
      box-shadow: 0 16px 48px rgba(58, 14, 59, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04);
      border: 1.5px solid rgba(232, 197, 71, 0.35);
      position: relative;
    }

    /* Brand Header */
    .auth-brand {
      text-align: center;
      margin-bottom: 1.75rem;
    }
    .auth-logo-img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      box-shadow: 0 6px 20px rgba(64, 7, 50, 0.25);
      object-fit: contain;
      margin-bottom: 0.5rem;
    }
    .auth-brand-names {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      margin-bottom: 0.35rem;
    }
    .auth-brand-title {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Montserrat", sans-serif;
      font-size: 1.35rem;
      font-weight: 700;
      letter-spacing: 3.5px;
      color: var(--royal-dark);
      text-transform: uppercase;
    }
    .auth-brand-subtitle {
      font-size: 0.8rem;
      color: var(--text-muted);
      letter-spacing: 0.5px;
      margin: 0;
    }

    /* Tabs */
    .auth-tabs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      background: #f4edf5;
      padding: 4px;
      border-radius: 12px;
      margin-bottom: 2rem;
      border: 1px solid var(--border);
    }
    .tab-btn {
      padding: 0.65rem 1rem;
      border: none;
      background: transparent;
      font-family: inherit;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-muted);
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.25s ease;
    }
    .tab-btn.active {
      background: #ffffff;
      color: var(--royal);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    /* Form Fields */
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
    }

    .form-label {
      font-size: 0.82rem;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: var(--royal-dark);
    }

    .input-icon-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-prefix {
      position: absolute;
      left: 14px;
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--royal);
      pointer-events: none;
    }

    .form-control {
      width: 100%;
      padding: 0.85rem 1rem;
      font-family: inherit;
      font-size: 0.95rem;
      color: var(--text);
      background: #fcfbfe;
      border: 1.5px solid var(--border);
      border-radius: 10px;
      transition: all 0.2s ease;
      box-sizing: border-box;
    }

    .form-control.with-prefix {
      padding-left: 48px;
    }

    .form-control:focus {
      outline: none;
      border-color: var(--royal);
      background: #ffffff;
      box-shadow: 0 0 0 4px rgba(85, 23, 86, 0.1);
    }

    .form-control::placeholder {
      color: #aaa;
      font-size: 0.88rem;
    }

    /* Submit Button (High visibility) */
    .btn-submit.auth-action-btn {
      width: 100%;
      padding: 1.05rem 1.5rem;
      margin-top: 0.75rem;
      background: #551756 !important;
      color: #ffffff !important;
      border: 1.5px solid #e8c547 !important;
      border-radius: 10px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      font-size: 1rem;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      cursor: pointer;
      box-shadow: 0 6px 22px rgba(85, 23, 86, 0.4);
      transition: all 0.25s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .btn-submit.auth-action-btn .btn-text-label {
      color: #ffffff !important;
      font-weight: 800;
      font-size: 1.02rem;
      letter-spacing: 2px;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
      display: inline-block;
    }

    .btn-submit.auth-action-btn:hover:not(:disabled) {
      background: #3a0e3b !important;
      color: #ffffff !important;
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(58, 14, 59, 0.55);
      border-color: #f5cf62 !important;
    }

    .btn-submit.auth-action-btn:disabled {
      opacity: 0.65;
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
    }

    .loading-state {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #ffffff;
    }

    .btn-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Footer link */
    .auth-footer-prompt {
      text-align: center;
      margin-top: 1.25rem;
      font-size: 0.88rem;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .link-btn {
      background: none;
      border: none;
      color: var(--royal);
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      font-size: 0.88rem;
      padding: 0;
      text-decoration: underline;
      transition: color 0.2s;
    }
    .link-btn:hover {
      color: #c9a84c;
    }

    /* Alert */
    .alert-error {
      display: flex;
      align-items: center;
      gap: 10px;
      background-color: #fef2f2;
      border: 1px solid #fecaca;
      color: #991b1b;
      padding: 0.85rem 1rem;
      border-radius: 10px;
      margin-bottom: 1.25rem;
      font-size: 0.86rem;
      font-weight: 500;
    }
    .alert-error svg {
      flex-shrink: 0;
    }

    @media (max-width: 480px) {
      .auth-card {
        padding: 2rem 1.25rem;
        border-radius: 16px;
      }
      .auth-logo-img {
        width: 72px;
        height: 72px;
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

  setMode(registerMode: boolean): void {
    this.showRegister = registerMode;
    this.errorMessage = '';
  }

  toggleRegister(event: Event): void {
    event.preventDefault();
    this.showRegister = !this.showRegister;
    this.errorMessage = '';
  }
}

// Made with Bob
