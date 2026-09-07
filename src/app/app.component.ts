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
    <!-- ── Header ───────────────────────────── -->
    <header [class.scrolled]="scrolled">
      <div class="header-inner container">

        <!-- Logo -->
        <a routerLink="/" class="logo">
          <img src="assets/images/kasavelli-logo.svg" alt="KASAVELLI" class="logo-img">
          <span class="logo-text">KASAVELLI</span>
        </a>

        <!-- Desktop Nav -->
        <nav class="desktop-nav">
          <a routerLink="/">Home</a>
          <a routerLink="/products">Collections</a>
          <a routerLink="/cart" *ngIf="isAuthenticated" class="nav-cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Cart
            <span class="cart-badge" *ngIf="(cartCount$ | async) as c">{{ c }}</span>
          </a>
          <a routerLink="/admin" *ngIf="isAdmin">Admin</a>
          <a routerLink="/login" class="btn-nav" *ngIf="!isAuthenticated">Login</a>
          <a (click)="logout()" class="btn-nav btn-nav-outline" *ngIf="isAuthenticated">Logout</a>
        </nav>

        <!-- Hamburger -->
        <button class="hamburger" (click)="menuOpen = !menuOpen" [class.open]="menuOpen" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>

      <!-- Mobile Nav -->
      <div class="mobile-nav" [class.open]="menuOpen">
        <a routerLink="/"         (click)="menuOpen=false">Home</a>
        <a routerLink="/products" (click)="menuOpen=false">Collections</a>
        <a routerLink="/cart"     (click)="menuOpen=false" *ngIf="isAuthenticated">
          Cart <span class="cart-badge-m" *ngIf="(cartCount$ | async) as c">{{ c }}</span>
        </a>
        <a routerLink="/admin"    (click)="menuOpen=false" *ngIf="isAdmin">Admin</a>
        <a routerLink="/login"    (click)="menuOpen=false" *ngIf="!isAuthenticated">Login</a>
        <a (click)="logout(); menuOpen=false" *ngIf="isAuthenticated">Logout</a>
      </div>
    </header>

    <!-- ── Page Content ──────────────────────── -->
    <main>
      <router-outlet></router-outlet>
    </main>

    <!-- ── Footer ───────────────────────────── -->
    <footer>
      <div class="footer-top container">

        <!-- Brand -->
        <div class="footer-col brand-col">
          <div class="footer-logo">
            <img src="assets/images/kasavelli-logo.svg" alt="KASAVELLI" class="footer-logo-img">
            <span>KASAVELLI</span>
          </div>
          <p class="tagline">Premium 925 Silver Collection</p>
          <p class="footer-desc">Exquisite handcrafted silver jewellery, ethically sourced and made to last a lifetime.</p>
          <div class="social-row">
            <a href="https://instagram.com" target="_blank" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor"/>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="https://wa.me/91XXXXXXXXXX" target="_blank" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a routerLink="/">Home</a></li>
            <li><a routerLink="/products">All Collections</a></li>
            <li><a routerLink="/cart">Cart</a></li>
          </ul>
        </div>

        <!-- Categories -->
        <div class="footer-col">
          <h4>Categories</h4>
          <ul>
            <li><a routerLink="/products">Chains & Pendants</a></li>
            <li><a routerLink="/products">Earrings</a></li>
            <li><a routerLink="/products">Rings</a></li>
            <li><a routerLink="/products">Bracelets</a></li>
            <li><a routerLink="/products">Anklets</a></li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="footer-col">
          <h4>Contact</h4>
          <p class="contact-line">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            info&#64;kasavelli.com
          </p>
          <p class="contact-line">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.4 19.79 19.79 0 0 1 1.61 4.84 2 2 0 0 1 3.58 2.64h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.18a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            +91 XXXXX XXXXX
          </p>
          <p class="badge-925">925 Silver Certified</p>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="container">
          <p>&copy; {{ year }} KASAVELLI. All rights reserved.</p>
          <p class="footer-note">Handcrafted with ❤ in India</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    /* ── Header ───────────────────────────────────── */
    header {
      background: var(--royal-dark);
      position: sticky;
      top: 0;
      z-index: 1000;
      transition: background 0.3s ease, box-shadow 0.3s ease;
    }
    header.scrolled {
      background: var(--royal);
      box-shadow: 0 4px 20px rgba(58, 14, 59, 0.4);
    }

    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 1rem;
      padding-bottom: 1rem;
    }

    /* Logo */
    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: var(--cream);
      transition: opacity 0.2s;
    }
    .logo:hover { opacity: 0.85; color: var(--cream); }
    .logo-img {
      width: 44px;
      height: 44px;
      filter: brightness(0) invert(1);
    }
    .logo-text {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.5rem;
      font-weight: 600;
      letter-spacing: 3px;
      text-transform: uppercase;
    }

    /* Desktop Nav */
    .desktop-nav {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    .desktop-nav a {
      color: rgba(239,235,225,0.85);
      font-family: 'Jost', sans-serif;
      font-size: 0.88rem;
      font-weight: 500;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      padding: 0.55rem 1rem;
      border-radius: 2px;
      text-decoration: none;
      transition: all 0.25s ease;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      cursor: pointer;
    }
    .desktop-nav a:hover {
      color: var(--gold);
      background: rgba(202,178,115,0.1);
    }
    .nav-cart { position: relative; }
    .cart-badge {
      background: var(--gold);
      color: var(--royal-dark);
      border-radius: 50%;
      min-width: 18px;
      height: 18px;
      padding: 0 4px;
      font-size: 0.7rem;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .btn-nav {
      background: var(--gold);
      color: var(--royal-dark) !important;
      font-weight: 700 !important;
      padding: 0.5rem 1.2rem !important;
    }
    .btn-nav:hover { background: var(--gold-light) !important; }
    .btn-nav-outline {
      background: transparent !important;
      border: 1px solid rgba(202,178,115,0.5) !important;
      color: rgba(239,235,225,0.7) !important;
    }
    .btn-nav-outline:hover {
      border-color: var(--gold) !important;
      color: var(--gold) !important;
    }

    /* Hamburger */
    .hamburger {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
    }
    .hamburger span {
      display: block;
      width: 24px;
      height: 2px;
      background: var(--cream);
      transition: all 0.3s ease;
    }
    .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .hamburger.open span:nth-child(2) { opacity: 0; }
    .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

    /* Mobile Nav */
    .mobile-nav {
      display: none;
      flex-direction: column;
      background: var(--royal-dark);
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.35s ease, padding 0.35s ease;
    }
    .mobile-nav.open {
      display: flex;
      max-height: 400px;
      padding: 0.5rem 0 1rem;
      border-top: 1px solid rgba(202,178,115,0.2);
    }
    .mobile-nav a {
      color: rgba(239,235,225,0.85);
      padding: 0.75rem 1.5rem;
      text-decoration: none;
      font-family: 'Jost', sans-serif;
      font-size: 0.9rem;
      letter-spacing: 1px;
      text-transform: uppercase;
      cursor: pointer;
      transition: color 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .mobile-nav a:hover { color: var(--gold); }
    .cart-badge-m {
      background: var(--gold);
      color: var(--royal-dark);
      border-radius: 50%;
      min-width: 18px; height: 18px;
      padding: 0 4px;
      font-size: 0.7rem; font-weight: 700;
      display: inline-flex; align-items: center; justify-content: center;
    }

    /* ── Main ───────────────────────────────────── */
    main {
      min-height: calc(100vh - 380px);
      background: var(--cream);
    }

    /* ── Footer ─────────────────────────────────── */
    footer {
      background: var(--royal-dark);
      color: rgba(239,235,225,0.8);
    }
    .footer-top {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1.5fr;
      gap: 3rem;
      padding-top: 3.5rem;
      padding-bottom: 2.5rem;
      border-bottom: 1px solid rgba(202,178,115,0.15);
    }
    .footer-logo {
      display: flex; align-items: center; gap: 0.75rem;
      margin-bottom: 1rem;
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--cream);
      letter-spacing: 2px;
    }
    .footer-logo-img {
      width: 36px; height: 36px;
      filter: brightness(0) invert(1);
    }
    .tagline {
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 0.75rem;
    }
    .footer-desc {
      font-size: 0.9rem;
      line-height: 1.7;
      opacity: 0.7;
      margin-bottom: 1.25rem;
    }
    .social-row {
      display: flex; gap: 1rem;
    }
    .social-row a {
      width: 36px; height: 36px;
      border: 1px solid rgba(202,178,115,0.3);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: rgba(239,235,225,0.7);
      transition: all 0.25s ease;
    }
    .social-row a:hover {
      border-color: var(--gold);
      color: var(--gold);
      background: rgba(202,178,115,0.1);
    }
    .social-row svg { width: 16px; height: 16px; }

    .footer-col h4 {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1rem;
      color: var(--gold-light);
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 1.25rem;
    }
    .footer-col ul { list-style: none; padding: 0; }
    .footer-col ul li { margin-bottom: 0.6rem; }
    .footer-col ul a {
      color: rgba(239,235,225,0.65);
      font-size: 0.9rem;
      text-decoration: none;
      transition: color 0.2s, padding-left 0.2s;
    }
    .footer-col ul a:hover { color: var(--gold); padding-left: 6px; }

    .contact-line {
      display: flex; align-items: center; gap: 0.6rem;
      font-size: 0.88rem;
      margin-bottom: 0.6rem;
      color: rgba(239,235,225,0.65);
    }
    .contact-line svg { flex-shrink: 0; opacity: 0.6; }
    .badge-925 {
      display: inline-block;
      margin-top: 1rem;
      padding: 0.35rem 0.85rem;
      border: 1px solid rgba(202,178,115,0.4);
      border-radius: 2px;
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--gold-light);
    }

    .footer-bottom {
      padding: 1.25rem 0;
      background: rgba(0,0,0,0.2);
    }
    .footer-bottom .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .footer-bottom p {
      font-size: 0.82rem;
      opacity: 0.55;
      margin: 0;
      color: var(--cream);
    }
    .footer-note { opacity: 0.45 !important; }

    /* ── Responsive ──────────────────────────────── */
    @media (max-width: 900px) {
      .desktop-nav { display: none; }
      .hamburger   { display: flex; }
      .footer-top  { grid-template-columns: 1fr 1fr; gap: 2rem; }
    }
    @media (max-width: 600px) {
      .footer-top { grid-template-columns: 1fr; gap: 1.5rem; padding-top: 2.5rem; }
      .footer-bottom .container { flex-direction: column; gap: 0.25rem; text-align: center; }
    }
  `]
})
export class AppComponent {
  title = 'KASAVELLI - Premium 925 Silver Jewellery';
  cartCount$ = this.cartService.cartCount$;
  menuOpen = false;
  scrolled = false;
  year = new Date().getFullYear();

  constructor(public authService: AuthService, private cartService: CartService) {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.scrolled = window.scrollY > 40;
      });
    }
  }

  get isAuthenticated(): boolean { return this.authService.isAuthenticated; }
  get isAdmin(): boolean { return this.authService.isAdmin; }

  logout(): void {
    this.authService.logout();
    window.location.href = '/';
  }
}

// Made with Bob
