import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { ProductService } from './services/product.service';
import { SpinWheelService } from './services/spin-wheel.service';
import { SpinWheelComponent } from './components/spin-wheel/spin-wheel.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { Product } from './models/product.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, FormsModule, SpinWheelComponent, ChatbotComponent],
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
          <!-- Search icon -->
          <button class="nav-search-btn" (click)="openSearch()" aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
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
        <!-- Mobile search -->
        <a (click)="openSearch(); menuOpen=false" class="mob-search-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          Search
        </a>
      </div>
    </header>

    <!-- ── Search Panel ───────────────────────── -->
    <div class="search-backdrop" [class.open]="searchOpen" (click)="closeSearch()"></div>
    <div class="search-panel" [class.open]="searchOpen" role="dialog" aria-label="Search">
      <!-- Panel Header -->
      <div class="sp-header">
        <h2 class="sp-title">Search Our Site</h2>
        <button class="sp-close" (click)="closeSearch()" aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Search Input -->
      <div class="sp-input-wrap">
        <svg class="sp-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          #searchInput
          type="text"
          class="sp-input"
          placeholder="I'm looking for..."
          [(ngModel)]="searchQuery"
          (ngModelChange)="onSearchChange($event)"
          (keydown.escape)="closeSearch()"
          autocomplete="off"
        >
        <button class="sp-clear" *ngIf="searchQuery" (click)="clearSearch()" aria-label="Clear">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Results -->
      <div class="sp-body">
        <!-- Searching indicator -->
        <div class="sp-searching" *ngIf="searching">
          <div class="sp-spinner"></div>
        </div>

        <!-- Empty state before typing -->
        <p class="sp-hint" *ngIf="!searchQuery && !searching">
          Start typing to search products…
        </p>

        <!-- Search label -->
        <p class="sp-search-for" *ngIf="searchQuery && !searching">
          Search for <strong>"{{ searchQuery }}"</strong>
        </p>

        <!-- No results -->
        <p class="sp-no-results" *ngIf="searchQuery && !searching && searchResults.length === 0">
          No products found for "{{ searchQuery }}"
        </p>

        <!-- Results list -->
        <div class="sp-results" *ngIf="searchResults.length > 0 && !searching">
          <a class="sp-result-item"
             *ngFor="let p of searchResults"
             [routerLink]="['/products', p.id]"
             (click)="closeSearch()">
            <div class="sp-result-img">
              <img *ngIf="p.image" [src]="p.image" [alt]="p.title">
              <div *ngIf="!p.image" class="sp-result-img-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="22" height="22">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
            </div>
            <div class="sp-result-info">
              <span class="sp-result-cat">{{ p.category_name }}</span>
              <p class="sp-result-title">{{ p.title }}</p>
              <div class="sp-result-price">
                <span class="sp-price-strike" *ngIf="p.discounted_price">₹{{ p.price }}</span>
                <span class="sp-price-main">₹{{ p.final_price }}</span>
              </div>
            </div>
          </a>

          <!-- View all link -->
          <a class="sp-view-all" [routerLink]="['/products']"
             [queryParams]="{search: searchQuery}" (click)="closeSearch()">
            View all results for "{{ searchQuery }}"
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </a>
        </div>
      </div>
    </div>

    <!-- ── Spin Discount Notification Bar ───────── -->
    <div class="spin-notif" *ngIf="spinNotifVisible && spinResult && spinResult.percentage > 0">
      <div class="spin-notif-inner">
        <span class="spin-notif-icon">🎰</span>
        <span class="spin-notif-text">
          Your <strong>{{ spinResult.percentage }}% spin discount</strong> is active!
          <span class="spin-notif-expiry" *ngIf="spinExpiryLabel">Expires {{ spinExpiryLabel }}</span>
        </span>
        <a routerLink="/cart" class="spin-notif-cta">Shop Now</a>
        <button class="spin-notif-close" (click)="spinNotifVisible = false" aria-label="Dismiss">✕</button>
      </div>
    </div>

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

    <!-- ── Chatbot (Disabled for now) ────────── -->
    <!-- <app-chatbot></app-chatbot> -->

    <!-- ── Spin Wheel (once per login session) ── -->
    <app-spin-wheel *ngIf="showSpinWheel" (closed)="showSpinWheel = false"></app-spin-wheel>
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
      font-family: 'Raleway', sans-serif;
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
      font-family: 'Raleway', sans-serif;
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
      font-family: 'Raleway', sans-serif;
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
      font-family: 'Raleway', sans-serif;
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
      font-family: 'Raleway', sans-serif;
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

    /* ── Search icon button in nav ── */
    .nav-search-btn {
      background: none; border: none; cursor: pointer;
      color: rgba(239,235,225,0.85);
      display: flex; align-items: center; justify-content: center;
      padding: 0.55rem 0.75rem; border-radius: 2px;
      transition: color 0.25s, background 0.25s;
    }
    .nav-search-btn:hover { color: var(--gold); background: rgba(202,178,115,0.1); }
    .mob-search-link { cursor: pointer; }

    /* ── Search Backdrop ── */
    .search-backdrop {
      position: fixed; inset: 0; z-index: 1099;
      background: rgba(0,0,0,0.45);
      opacity: 0; pointer-events: none;
      transition: opacity 0.3s;
    }
    .search-backdrop.open { opacity: 1; pointer-events: all; }

    /* ── Search Panel ── */
    .search-panel {
      position: fixed; top: 0; right: 0;
      width: min(480px, 100vw);
      height: 100vh;
      background: #fff;
      z-index: 1100;
      display: flex; flex-direction: column;
      transform: translateX(100%);
      transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: -4px 0 32px rgba(0,0,0,0.18);
    }
    .search-panel.open { transform: translateX(0); }

    .sp-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 1.25rem 1.5rem 1rem;
      border-bottom: 1px solid #f0eaee;
      flex-shrink: 0;
    }
    .sp-title {
      font-family: 'Raleway', sans-serif;
      font-size: 1.3rem; font-weight: 700;
      color: #1a1a2e; margin: 0;
    }
    .sp-close {
      background: none; border: none; cursor: pointer;
      color: #888; padding: 0.35rem;
      display: flex; align-items: center; justify-content: center;
      border-radius: 50%; transition: color 0.2s, background 0.2s;
    }
    .sp-close:hover { color: #1a1a2e; background: #f5f5f5; }

    .sp-input-wrap {
      display: flex; align-items: center;
      margin: 1rem 1.5rem;
      border: 1.5px solid #e0d5e0; border-radius: 8px;
      background: #faf8fa;
      padding: 0 0.75rem;
      flex-shrink: 0;
      transition: border-color 0.2s;
    }
    .sp-input-wrap:focus-within { border-color: #551756; }
    .sp-input-icon { color: #888; flex-shrink: 0; }
    .sp-input {
      flex: 1; border: none; background: transparent;
      padding: 0.7rem 0.5rem;
      font-size: 0.95rem; color: #1a1a2e;
      outline: none;
    }
    .sp-input::placeholder { color: #aaa; }
    .sp-clear {
      background: none; border: none; cursor: pointer;
      color: #aaa; padding: 0.25rem;
      display: flex; align-items: center;
      transition: color 0.2s;
    }
    .sp-clear:hover { color: #551756; }

    .sp-body {
      flex: 1; overflow-y: auto;
      padding: 0 1.5rem 1.5rem;
    }

    .sp-searching {
      display: flex; justify-content: center; padding: 2.5rem;
    }
    .sp-spinner {
      width: 28px; height: 28px;
      border: 2.5px solid #e0d5e0;
      border-top-color: #551756;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .sp-hint {
      text-align: center; color: #aaa;
      font-size: 0.88rem; padding: 2.5rem 0;
      margin: 0;
    }
    .sp-search-for {
      font-size: 0.82rem; color: #888;
      margin: 0 0 1rem; line-height: 1.5;
    }
    .sp-search-for strong { color: #1a1a2e; }
    .sp-no-results {
      text-align: center; color: #aaa;
      font-size: 0.9rem; padding: 2rem 0; margin: 0;
    }

    /* Result items */
    .sp-results { display: flex; flex-direction: column; }
    .sp-result-item {
      display: flex; align-items: center; gap: 1rem;
      padding: 0.85rem 0;
      border-bottom: 1px solid #f5f0f5;
      text-decoration: none; color: inherit;
      transition: background 0.2s;
      border-radius: 6px;
      margin: 0 -0.5rem; padding-left: 0.5rem; padding-right: 0.5rem;
    }
    .sp-result-item:hover { background: #faf5fa; }
    .sp-result-img {
      width: 62px; height: 62px; flex-shrink: 0;
      border-radius: 6px; overflow: hidden;
      background: #f5f0f5;
    }
    .sp-result-img img { width: 100%; height: 100%; object-fit: cover; }
    .sp-result-img-placeholder {
      width: 100%; height: 100%;
      display: flex; align-items: center; justify-content: center;
      color: rgba(85,23,86,0.25);
    }
    .sp-result-info { flex: 1; min-width: 0; }
    .sp-result-cat {
      font-size: 0.68rem; letter-spacing: 1.5px; text-transform: uppercase;
      color: #888; display: block; margin-bottom: 0.2rem;
    }
    .sp-result-title {
      font-size: 0.9rem; font-weight: 600; color: #1a1a2e;
      margin: 0 0 0.3rem;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .sp-result-price { display: flex; align-items: center; gap: 0.4rem; }
    .sp-price-main { font-size: 0.9rem; font-weight: 700; color: #551756; }
    .sp-price-strike { font-size: 0.78rem; color: #aaa; text-decoration: line-through; }

    .sp-view-all {
      display: flex; align-items: center; justify-content: center; gap: 0.4rem;
      margin-top: 1.25rem; padding: 0.75rem;
      border: 1.5px solid #551756; border-radius: 6px;
      color: #551756; font-size: 0.82rem; font-weight: 600;
      text-decoration: none; transition: background 0.2s, color 0.2s;
    }
    .sp-view-all:hover { background: #551756; color: #fff; }

    /* ── Spin Discount Notification Bar ── */
    .spin-notif {
      background: linear-gradient(90deg, #3a0e3b 0%, #551756 50%, #3a0e3b 100%);
      border-bottom: 2px solid #c9a84c;
      position: sticky; top: 72px; z-index: 990;
      animation: slideDown 0.35s ease;
    }
    @keyframes slideDown {
      from { transform: translateY(-100%); opacity: 0; }
      to   { transform: translateY(0);     opacity: 1; }
    }
    .spin-notif-inner {
      max-width: 1200px; margin: 0 auto;
      display: flex; align-items: center; gap: 0.75rem;
      padding: 0.55rem 1.5rem;
      flex-wrap: wrap;
    }
    .spin-notif-icon { font-size: 1.1rem; flex-shrink: 0; }
    .spin-notif-text {
      flex: 1; font-size: 0.82rem; color: #fff;
      display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;
    }
    .spin-notif-text strong { color: #e8c547; font-weight: 800; }
    .spin-notif-expiry {
      font-size: 0.72rem; color: rgba(232,197,71,0.75);
      background: rgba(255,255,255,0.08);
      padding: 0.15rem 0.5rem; border-radius: 20px;
      white-space: nowrap;
    }
    .spin-notif-cta {
      background: #c9a84c; color: #3a0e3b;
      font-size: 0.72rem; font-weight: 800; letter-spacing: 1.5px;
      text-transform: uppercase; padding: 0.35rem 1rem;
      border-radius: 2px; text-decoration: none;
      transition: background 0.2s; flex-shrink: 0;
      white-space: nowrap;
    }
    .spin-notif-cta:hover { background: #e8c547; }
    .spin-notif-close {
      background: rgba(255,255,255,0.1); border: none;
      border-radius: 50%; width: 22px; height: 22px;
      font-size: 0.65rem; color: rgba(232,197,71,0.8);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: background 0.2s; flex-shrink: 0;
    }
    .spin-notif-close:hover { background: rgba(255,255,255,0.22); color: #e8c547; }
    @media (max-width: 600px) {
      .spin-notif-inner { padding: 0.5rem 1rem; gap: 0.5rem; }
      .spin-notif-text { font-size: 0.77rem; }
    }

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

  searchOpen = false;
  searchQuery = '';
  searchResults: Product[] = [];
  searching = false;

  showSpinWheel = false;
  spinNotifVisible = true;

  /** Reactive spin result from service */
  get spinResult() { return this.spinService.currentResult; }

  /** Human-readable expiry label, e.g. "in 18h 42m" */
  get spinExpiryLabel(): string {
    const expiresAt = this.spinResult?.expiresAt;
    if (!expiresAt) return '';
    const ms = new Date(expiresAt).getTime() - Date.now();
    if (ms <= 0) return '';
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    if (h > 0) return `in ${h}h ${m}m`;
    return `in ${m}m`;
  }

  private searchSubject = new Subject<string>();

  constructor(
    public authService: AuthService,
    private cartService: CartService,
    private productService: ProductService,
    private spinService: SpinWheelService,
    private router: Router
  ) {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.scrolled = window.scrollY > 40;
      });
    }

    // On app boot, if user is already logged in, refresh profile so spin fields are current
    if (this.authService.isAuthenticated) {
      this.authService.refreshCurrentUser();
    }

    // Debounced live search
    this.searchSubject.pipe(
      debounceTime(320),
      distinctUntilChanged(),
      switchMap(q => {
        if (!q.trim()) { this.searchResults = []; return of([]); }
        this.searching = true;
        return this.productService.searchProducts(q).pipe(
          catchError(() => of([]))
        );
      })
    ).subscribe((results: any) => {
      this.searching = false;
      this.searchResults = Array.isArray(results) ? results.slice(0, 8) : [];
    });

    // After every navigation, if user is logged in, check DB spin state and show wheel if needed
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.authService.isAuthenticated) {
        const user = this.authService.currentUserValue;
        if (user) {
          const needsSpin = this.spinService.loadFromUser(user);
          if (needsSpin) {
            setTimeout(() => { this.showSpinWheel = true; }, 600);
          } else {
            // Has active discount — ensure notification bar is visible
            this.spinNotifVisible = true;
          }
        }
      }
    });
  }

  get isAuthenticated(): boolean { return this.authService.isAuthenticated; }
  get isAdmin(): boolean { return this.authService.isAdmin; }

  logout(): void {
    this.spinService.clear();
    this.spinNotifVisible = true;  // reset so it shows again on next login
    this.authService.logout();
    window.location.href = '/';
  }

  openSearch(): void {
    this.searchOpen = true;
    // Focus input after panel animates in
    setTimeout(() => {
      const el = document.querySelector('.sp-input') as HTMLInputElement;
      if (el) el.focus();
    }, 340);
  }

  closeSearch(): void {
    this.searchOpen = false;
  }

  onSearchChange(q: string): void {
    if (!q.trim()) { this.searchResults = []; this.searching = false; return; }
    this.searching = true;
    this.searchSubject.next(q);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
    this.searching = false;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void { this.closeSearch(); }
}

// Made with Bob
