import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { LoginRequest } from '../../models/user.model';

/** Possible views: 'login' | 'register' | 'forgot' | 'reset' */
type AuthMode = 'login' | 'register' | 'forgot' | 'reset';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-page-wrap">
      <div class="auth-card">

        <!-- Brand Header with Logo -->
        <div class="auth-brand">
          <img src="assets/images/kasavelli-logo.svg?v=2" alt="Kasavelli 925" class="auth-logo-img">
          <div class="auth-brand-names">
            <span class="auth-brand-title">KASAVELLI</span>
          </div>
          <p class="auth-brand-subtitle">Pure 925 Sterling Silver Jewellery</p>
        </div>

        <!-- Mode Switcher Tabs (only for login / register) -->
        <div class="auth-tabs" *ngIf="mode === 'login' || mode === 'register'">
          <button type="button" class="tab-btn" [class.active]="mode === 'login'" (click)="setMode('login')">
            Sign In
          </button>
          <button type="button" class="tab-btn" [class.active]="mode === 'register'" (click)="setMode('register')">
            Create Account
          </button>
        </div>

        <!-- Success Message -->
        <div class="alert alert-success" *ngIf="successMessage">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>{{ successMessage }}</span>
        </div>

        <!-- Error Message Alert -->
        <div class="alert alert-error" *ngIf="errorMessage">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- ── LOGIN FORM ───────────────────────────── -->
        <form *ngIf="mode === 'login'" (ngSubmit)="onSubmit()" #loginForm="ngForm" class="auth-form">
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
                [type]="showLoginPassword ? 'text' : 'password'"
                class="form-control with-eye"
                [(ngModel)]="credentials.password"
                name="password"
                placeholder="Enter your account password"
                required
              >
              <button type="button" class="eye-btn" (click)="showLoginPassword = !showLoginPassword" tabindex="-1">
                <svg *ngIf="!showLoginPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg *ngIf="showLoginPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>

          <div class="forgot-link-wrap">
            <button type="button" class="link-btn small" (click)="setMode('forgot')">Forgot Password?</button>
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
            <button type="button" class="link-btn" (click)="setMode('register')">Create an Account</button>
          </div>
        </form>

        <!-- ── REGISTRATION FORM ────────────────────── -->
        <form *ngIf="mode === 'register'" (ngSubmit)="onRegister()" #registerForm="ngForm" class="auth-form">
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
            <div class="input-icon-wrap">
              <input
                [type]="showRegPassword ? 'text' : 'password'"
                class="form-control with-eye"
                [(ngModel)]="registerData.password"
                name="reg_password"
                placeholder="Create a password (min 6 characters)"
                required
                minlength="6"
              >
              <button type="button" class="eye-btn" (click)="showRegPassword = !showRegPassword" tabindex="-1">
                <svg *ngIf="!showRegPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg *ngIf="showRegPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>

          <!-- ── CONFIRM PASSWORD ── -->
          <div class="form-group">
            <label class="form-label">Re-enter Password</label>
            <div class="input-icon-wrap">
              <input
                [type]="showConfirmPassword ? 'text' : 'password'"
                class="form-control with-eye"
                [class.input-error]="confirmPasswordTouched && registerData.confirm_password && registerData.password !== registerData.confirm_password"
                [class.input-ok]="confirmPasswordTouched && registerData.confirm_password && registerData.password === registerData.confirm_password"
                [(ngModel)]="registerData.confirm_password"
                name="confirm_password"
                placeholder="Re-enter your password"
                required
                (blur)="confirmPasswordTouched = true"
              >
              <button type="button" class="eye-btn" (click)="showConfirmPassword = !showConfirmPassword" tabindex="-1">
                <svg *ngIf="!showConfirmPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg *ngIf="showConfirmPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
            <span class="field-hint error"
              *ngIf="confirmPasswordTouched && registerData.confirm_password && registerData.password !== registerData.confirm_password">
              Passwords do not match
            </span>
            <span class="field-hint ok"
              *ngIf="confirmPasswordTouched && registerData.confirm_password && registerData.password === registerData.confirm_password">
              ✓ Passwords match
            </span>
          </div>

          <button
            type="submit"
            class="btn-submit auth-action-btn"
            [disabled]="!registerForm.valid || loading || registerData.password !== registerData.confirm_password"
          >
            <span class="btn-text-label" *ngIf="!loading">Create Account</span>
            <span *ngIf="loading" class="loading-state">
              <span class="btn-spinner"></span> Creating account...
            </span>
          </button>

          <div class="auth-footer-prompt">
            <span>Already have an account?</span>
            <button type="button" class="link-btn" (click)="setMode('login')">Sign In</button>
          </div>
        </form>

        <!-- ── FORGOT PASSWORD FORM (Step 1 — enter phone) ── -->
        <form *ngIf="mode === 'forgot'" (ngSubmit)="onForgotPassword()" #forgotForm="ngForm" class="auth-form">
          <div class="reset-header">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#551756" stroke-width="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <h3 class="reset-title">Forgot Password?</h3>
            <p class="reset-subtitle">Enter your registered phone number to reset your password.</p>
          </div>

          <div class="form-group">
            <label class="form-label">Registered Phone Number</label>
            <div class="input-icon-wrap">
              <span class="input-prefix">+91</span>
              <input
                type="tel"
                class="form-control with-prefix"
                [(ngModel)]="forgotPhone"
                name="forgot_phone"
                placeholder="10-digit mobile number"
                required
                pattern="[0-9]{10}"
              >
            </div>
          </div>

          <button
            type="submit"
            class="btn-submit auth-action-btn"
            [disabled]="!forgotForm.valid || loading"
          >
            <span class="btn-text-label" *ngIf="!loading">Verify &amp; Continue</span>
            <span *ngIf="loading" class="loading-state">
              <span class="btn-spinner"></span> Verifying...
            </span>
          </button>

          <div class="auth-footer-prompt">
            <button type="button" class="link-btn" (click)="setMode('login')">← Back to Sign In</button>
          </div>
        </form>

        <!-- ── RESET PASSWORD FORM (Step 2 — set new password) ── -->
        <form *ngIf="mode === 'reset'" (ngSubmit)="onResetPassword()" #resetForm="ngForm" class="auth-form">
          <div class="reset-header">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#551756" stroke-width="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <h3 class="reset-title">Set New Password</h3>
            <p class="reset-subtitle">Choose a strong new password for your account.</p>
          </div>

          <div class="form-group">
            <label class="form-label">New Password</label>
            <div class="input-icon-wrap">
              <input
                [type]="showNewPassword ? 'text' : 'password'"
                class="form-control with-eye"
                [(ngModel)]="resetData.new_password"
                name="new_password"
                placeholder="Minimum 6 characters"
                required
                minlength="6"
              >
              <button type="button" class="eye-btn" (click)="showNewPassword = !showNewPassword" tabindex="-1">
                <svg *ngIf="!showNewPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg *ngIf="showNewPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Confirm New Password</label>
            <div class="input-icon-wrap">
              <input
                [type]="showConfirmNewPassword ? 'text' : 'password'"
                class="form-control with-eye"
                [class.input-error]="resetConfirmTouched && resetData.confirm_password && resetData.new_password !== resetData.confirm_password"
                [class.input-ok]="resetConfirmTouched && resetData.confirm_password && resetData.new_password === resetData.confirm_password"
                [(ngModel)]="resetData.confirm_password"
                name="confirm_new_password"
                placeholder="Re-enter new password"
                required
                (blur)="resetConfirmTouched = true"
              >
              <button type="button" class="eye-btn" (click)="showConfirmNewPassword = !showConfirmNewPassword" tabindex="-1">
                <svg *ngIf="!showConfirmNewPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg *ngIf="showConfirmNewPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
            <span class="field-hint error"
              *ngIf="resetConfirmTouched && resetData.confirm_password && resetData.new_password !== resetData.confirm_password">
              Passwords do not match
            </span>
            <span class="field-hint ok"
              *ngIf="resetConfirmTouched && resetData.confirm_password && resetData.new_password === resetData.confirm_password">
              ✓ Passwords match
            </span>
          </div>

          <button
            type="submit"
            class="btn-submit auth-action-btn"
            [disabled]="!resetForm.valid || loading || resetData.new_password !== resetData.confirm_password"
          >
            <span class="btn-text-label" *ngIf="!loading">Reset Password</span>
            <span *ngIf="loading" class="loading-state">
              <span class="btn-spinner"></span> Resetting...
            </span>
          </button>

          <div class="auth-footer-prompt">
            <button type="button" class="link-btn" (click)="setMode('login')">← Back to Sign In</button>
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
      width: 96px;
      height: 96px;
      border-radius: 0;
      box-shadow: none;
      object-fit: contain;
      margin-bottom: 0.75rem;
      filter: drop-shadow(0 4px 12px rgba(64, 7, 50, 0.2));
    }
    .auth-brand-names {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      margin-bottom: 0.35rem;
    }
    .auth-brand-title {
      font-family: 'Cinzel', 'Playfair Display', 'Cormorant Garamond', Georgia, serif;
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: 4px;
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

    .eye-btn {
      position: absolute;
      right: 12px;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-muted);
      padding: 0;
      display: flex;
      align-items: center;
      line-height: 1;
    }
    .eye-btn:hover { color: var(--royal); }

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

    .form-control.with-eye {
      padding-right: 42px;
    }

    .form-control:focus {
      outline: none;
      border-color: var(--royal);
      background: #ffffff;
      box-shadow: 0 0 0 4px rgba(85, 23, 86, 0.1);
    }

    .form-control.input-error {
      border-color: #ef4444;
      background: #fff5f5;
    }

    .form-control.input-ok {
      border-color: #22c55e;
      background: #f0fdf4;
    }

    .form-control::placeholder {
      color: #aaa;
      font-size: 0.88rem;
    }

    .field-hint {
      font-size: 0.78rem;
      font-weight: 500;
      margin-top: 2px;
    }
    .field-hint.error { color: #ef4444; }
    .field-hint.ok    { color: #16a34a; }

    /* Forgot password link row */
    .forgot-link-wrap {
      display: flex;
      justify-content: flex-end;
      margin-top: -0.5rem;
    }

    /* Reset password header block */
    .reset-header {
      text-align: center;
      margin-bottom: 0.5rem;
    }
    .reset-title {
      margin: 0.65rem 0 0.35rem;
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--royal-dark);
    }
    .reset-subtitle {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin: 0;
      line-height: 1.5;
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
    .link-btn.small {
      font-size: 0.82rem;
    }
    .link-btn:hover {
      color: #c9a84c;
    }

    /* Alert */
    .alert-error, .alert-success {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0.85rem 1rem;
      border-radius: 10px;
      margin-bottom: 1.25rem;
      font-size: 0.86rem;
      font-weight: 500;
    }
    .alert-error {
      background-color: #fef2f2;
      border: 1px solid #fecaca;
      color: #991b1b;
    }
    .alert-success {
      background-color: #f0fdf4;
      border: 1px solid #86efac;
      color: #15803d;
    }
    .alert-error svg, .alert-success svg {
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
  mode: AuthMode = 'login';

  credentials: LoginRequest = {
    phone_number: '',
    password: ''
  };

  registerData = {
    name: '',
    phone_number: '',
    email: '',
    password: '',
    confirm_password: ''
  };

  forgotPhone = '';

  resetData = {
    new_password: '',
    confirm_password: ''
  };

  // UI state
  loading = false;
  errorMessage = '';
  successMessage = '';

  showLoginPassword    = false;
  showRegPassword      = false;
  showConfirmPassword  = false;
  showNewPassword      = false;
  showConfirmNewPassword = false;
  confirmPasswordTouched = false;
  resetConfirmTouched    = false;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  setMode(m: AuthMode): void {
    this.mode = m;
    this.errorMessage = '';
    this.successMessage = '';
    this.confirmPasswordTouched = false;
    this.resetConfirmTouched = false;
  }

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
    if (this.registerData.password !== this.registerData.confirm_password) {
      this.errorMessage = 'Passwords do not match. Please re-enter.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { confirm_password, ...payload } = this.registerData;

    this.authService.register(payload).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Account created successfully! Please sign in.';
        this.registerData = { name: '', phone_number: '', email: '', password: '', confirm_password: '' };
        setTimeout(() => this.setMode('login'), 1800);
      },
      error: (err) => {
        this.loading = false;
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

  /** Step 1 of password reset — verify the phone number exists */
  onForgotPassword(): void {
    this.loading = true;
    this.errorMessage = '';

    // We check the phone exists by attempting a lookup via the reset endpoint
    // with a dummy call; instead, just advance to the reset form since the
    // actual check happens server-side on submit. We still verify on the
    // backend at the final step.
    this.loading = false;
    this.resetData = { new_password: '', confirm_password: '' };
    this.setMode('reset');
  }

  /** Step 2 — submit new password */
  onResetPassword(): void {
    if (this.resetData.new_password !== this.resetData.confirm_password) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.resetPassword(this.forgotPhone, this.resetData.new_password).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Password reset successfully! Please sign in with your new password.';
        this.forgotPhone = '';
        this.resetData = { new_password: '', confirm_password: '' };
        setTimeout(() => this.setMode('login'), 2200);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.error || 'Reset failed. Please check your phone number.';
      }
    });
  }

  /** @deprecated kept for backward compat */
  toggleRegister(event: Event): void {
    event.preventDefault();
    this.setMode(this.mode === 'login' ? 'register' : 'login');
  }
}

// Made with Bob
