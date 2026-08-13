import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <header>
      <div class="container header-content">
        <div class="logo">
          <a routerLink="/">
            <img src="assets/images/kasavelli-logo.svg" alt="KASAVELLI" class="logo-img">
            <span class="logo-text">KASAVELLI</span>
          </a>
        </div>
        
        <nav>
          <ul>
            <li><a routerLink="/">Home</a></li>
            <li><a routerLink="/products">Products</a></li>
            <li *ngIf="isAuthenticated">
              <a routerLink="/cart" class="cart-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Cart <span class="cart-badge" *ngIf="(cartCount$ | async) as count">{{ count }}</span>
              </a>
            </li>
            <li *ngIf="isAdmin">
              <a routerLink="/admin">Admin</a>
            </li>
            <li *ngIf="!isAuthenticated">
              <a routerLink="/login" class="btn-login">Login</a>
            </li>
            <li *ngIf="isAuthenticated">
              <a (click)="logout()" class="btn-logout">Logout</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <main>
      <router-outlet></router-outlet>
    </main>

    <footer>
      <div class="container footer-content">
        <div class="footer-section">
          <div class="footer-logo">
            <img src="assets/images/kasavelli-logo.svg" alt="KASAVELLI" class="footer-logo-img">
            <h3>KASAVELLI</h3>
          </div>
          <p class="footer-tagline">Premium 925 Silver Collection</p>
          <p class="footer-description">Exquisite handcrafted silver jewellery for the modern woman</p>
        </div>
        
        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul class="footer-links">
            <li><a routerLink="/">Home</a></li>
            <li><a routerLink="/products">Products</a></li>
            <li><a routerLink="/cart">Cart</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>Categories</h4>
          <ul class="footer-links">
            <li><a routerLink="/products">Chains & Pendants</a></li>
            <li><a routerLink="/products">Earrings</a></li>
            <li><a routerLink="/products">Rings</a></li>
            <li><a routerLink="/products">Bracelets</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>Contact</h4>
          <p>Email: info&#64;kasavelli.com</p>
          <p>Phone: +91 XXXXX XXXXX</p>
          <div class="social-links">
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="WhatsApp">💬</a>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="container">
          <p>&copy; 2024 KASAVELLI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    /* Header Styles */
    header {
      background: linear-gradient(135deg, #8B3A62 0%, #A94B76 50%, #C77BA1 100%);
      box-shadow: 0 4px 20px rgba(139, 58, 98, 0.3);
      position: sticky;
      top: 0;
      z-index: 100;
      border-bottom: 3px solid #4A7C59;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 0;
    }

    .logo a {
      display: flex;
      align-items: center;
      gap: 1rem;
      text-decoration: none;
      color: #FFFFFF;
      transition: all 0.3s ease;
    }

    .logo a:hover {
      transform: scale(1.02);
    }

    .logo-img {
      width: 50px;
      height: 50px;
      filter: brightness(0) invert(1);
    }

    .logo-text {
      font-family: 'Playfair Display', serif;
      font-size: 1.5rem;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    nav ul {
      display: flex;
      list-style: none;
      gap: 1.5rem;
      margin: 0;
      padding: 0;
      align-items: center;
    }

    nav a {
      color: #FFFFFF;
      text-decoration: none;
      font-family: 'Lato', sans-serif;
      font-weight: 500;
      font-size: 0.95rem;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    nav a:hover {
      background-color: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
    }

    nav a.active {
      background-color: rgba(255, 255, 255, 0.2);
      font-weight: 600;
    }

    .cart-link {
      position: relative;
    }

    .cart-badge {
      background-color: #4A7C59;
      color: white;
      border-radius: 50%;
      padding: 0.125rem 0.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      margin-left: 0.25rem;
    }

    .btn-login, .btn-logout {
      background-color: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      cursor: pointer;
    }

    .btn-login:hover, .btn-logout:hover {
      background-color: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
    }

    /* Main Content */
    main {
      min-height: calc(100vh - 400px);
      background-color: #FAF8F9;
    }

    /* Footer Styles */
    footer {
      background: linear-gradient(135deg, #6B2A4A 0%, #8B3A62 100%);
      color: #FFFFFF;
      padding: 3rem 0 0;
      margin-top: 4rem;
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }

    .footer-section h3, .footer-section h4 {
      color: #FFFFFF;
      font-family: 'Playfair Display', serif;
      margin-bottom: 1rem;
      font-size: 1.25rem;
    }

    .footer-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .footer-logo-img {
      width: 40px;
      height: 40px;
      filter: brightness(0) invert(1);
    }

    .footer-tagline {
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #4A7C59;
    }

    .footer-description {
      font-size: 0.9rem;
      opacity: 0.9;
      line-height: 1.6;
    }

    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-links li {
      margin-bottom: 0.75rem;
    }

    .footer-links a {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      transition: color 0.3s ease;
      font-size: 0.95rem;
    }

    .footer-links a:hover {
      color: #FFFFFF;
      padding-left: 0.5rem;
    }

    .social-links {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }

    .social-links a {
      font-size: 1.5rem;
      transition: transform 0.3s ease;
    }

    .social-links a:hover {
      transform: scale(1.2);
    }

    .footer-bottom {
      background-color: rgba(0, 0, 0, 0.2);
      padding: 1.5rem 0;
      text-align: center;
      margin-top: 2rem;
    }

    .footer-bottom p {
      margin: 0;
      font-size: 0.9rem;
      opacity: 0.8;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1rem;
      }

      nav ul {
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
      }

      .logo-text {
        font-size: 1.5rem;
      }

      .footer-content {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .footer-logo {
        justify-content: center;
      }

      .social-links {
        justify-content: center;
      }
    }
  `]
})
export class AppComponent {
  title = 'KASAVELLI - Premium 925 Silver Jewellery';
  cartCount$ = this.cartService.cartCount$;

  constructor(
    public authService: AuthService,
    private cartService: CartService
  ) {}

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/';
  }
}

// Made with Bob
