import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { PaymentService, RazorpayOrder } from '../../services/payment.service';
import { AuthService } from '../../services/auth.service';
import { SpinWheelService } from '../../services/spin-wheel.service';
import { CartItem } from '../../models/product.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="cart-page">

      <!-- ── Page Header ───────────────────── -->
      <div class="page-header">
        <div class="page-header-inner">
          <a routerLink="/products" class="back-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </a>
          <div>
            <h1>My Bag</h1>
            <p class="item-count" *ngIf="cartItems.length > 0">{{ cartItems.length }} item{{ cartItems.length !== 1 ? 's' : '' }}</p>
          </div>
        </div>
      </div>

      <!-- ── Empty State ───────────────────── -->
      <div class="empty-state" *ngIf="cartItems.length === 0">
        <div class="empty-icon">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        </div>
        <h2>Your bag is empty</h2>
        <p>Discover our handcrafted 925 silver collection</p>
        <a routerLink="/products" class="btn-shop">Start Shopping</a>
      </div>

      <!-- ── Main Layout ───────────────────── -->
      <div class="cart-body" *ngIf="cartItems.length > 0">

        <!-- Left: Cart Cards -->
        <div class="cart-cards">

          <!-- Cart Item Card -->
          <div class="cart-card" *ngFor="let item of cartItems">
            <!-- Product Image -->
            <div class="card-img-wrap" [routerLink]="['/products', item.product_id || item.product]">
              <img [src]="item.product_image" [alt]="item.product_name" class="card-img">
            </div>

            <!-- Product Details -->
            <div class="card-content">
              <div class="card-top">
                <div class="card-meta">
                  <span class="card-category">925 Silver</span>
                  <h3 class="card-title">{{ item.product_name }}</h3>
                </div>
                <button class="wish-btn" (click)="removeItem(item.id)" title="Remove">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <div class="card-price-row">
                <div class="card-prices">
                  <span class="price-strike" *ngIf="item.discounted_price && item.discounted_price < item.product_price">
                    ₹{{ item.product_price }}
                  </span>
                  <span class="price-main">₹{{ item.discounted_price || item.product_price }}</span>
                </div>
              </div>

              <div class="card-bottom">
                <!-- Qty Stepper -->
                <div class="qty-stepper">
                  <button class="qty-btn" (click)="decreaseQty(item)" [disabled]="item.quantity <= 1">−</button>
                  <span class="qty-val">{{ item.quantity }}</span>
                  <button class="qty-btn" (click)="increaseQty(item)">+</button>
                </div>

                <!-- Line Total -->
                <span class="line-total">₹{{ (item.discounted_price || item.product_price) * item.quantity }}</span>
              </div>
            </div>
          </div>

          <!-- Promo badge -->
          <div class="promo-strip" *ngIf="cartTotal < 999">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="3" width="15" height="13" rx="1"/>
              <path d="M16 8h4l3 5v3h-7V8z"/>
            </svg>
            Add ₹{{ 999 - cartTotal }} more for <strong>free shipping</strong>
          </div>
          <div class="promo-strip success" *ngIf="cartTotal >= 999">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <strong>Free shipping</strong> applied!
          </div>
        </div>

        <!-- Right: Order Summary + Checkout Form -->
        <div class="summary-panel">

          <!-- Summary Card -->
          <div class="summary-card">
            <h3 class="summary-title">Order Summary</h3>

            <div class="summary-lines">
              <div class="summary-line">
                <span>Subtotal ({{ cartItems.length }} items)</span>
                <span>₹{{ cartTotal }}</span>
              </div>
              <div class="summary-line">
                <span>Shipping</span>
                <span class="free-tag" *ngIf="cartTotal >= 999">Free</span>
                <span *ngIf="cartTotal < 999">₹99</span>
              </div>
              <div class="summary-line discount" *ngIf="hasDiscount">
                <span>Product savings</span>
                <span class="saving-amt">−₹{{ totalSavings }}</span>
              </div>
              <!-- Spin wheel discount row -->
              <div class="summary-line spin-discount" *ngIf="spinDiscountPct > 0">
                <span class="spin-label">
                  <span class="spin-badge">🎰 {{ spinDiscountPct }}% Spin Offer</span>
                </span>
                <span class="saving-amt">−₹{{ spinDiscountAmount }}</span>
              </div>
            </div>

            <div class="summary-total">
              <span>Total</span>
              <span>₹{{ finalTotal }}</span>
            </div>
          </div>

          <!-- Shipping Form -->
          <div class="shipping-card">
            <h3 class="shipping-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Delivery Details
            </h3>

            <!-- Row 1: Door / Flat number -->
            <div class="field-group">
              <label class="field-label">Door / Flat No. <span class="req">*</span></label>
              <input type="text" class="field-input" [(ngModel)]="addrDoor"
                placeholder="e.g. 4B, 12/3A" autocomplete="address-line1">
            </div>

            <!-- Row 2: Area / Street -->
            <div class="field-group">
              <label class="field-label">Area / Street <span class="req">*</span></label>
              <input type="text" class="field-input" [(ngModel)]="addrArea"
                placeholder="Street name, Colony" autocomplete="address-line2">
            </div>

            <!-- Row 3: Locality / Landmark -->
            <div class="field-group">
              <label class="field-label">Locality / Landmark</label>
              <input type="text" class="field-input" [(ngModel)]="addrLocality"
                placeholder="Landmark or locality">
            </div>

            <!-- Row 4: PIN + City (side by side) -->
            <div class="field-row-2">
              <div class="field-group">
                <label class="field-label">PIN Code <span class="req">*</span></label>
                <input type="text" class="field-input" [(ngModel)]="addrPin"
                  placeholder="6-digit PIN" maxlength="6" pattern="[0-9]{6}"
                  autocomplete="postal-code">
              </div>
              <div class="field-group">
                <label class="field-label">City <span class="req">*</span></label>
                <input type="text" class="field-input" [(ngModel)]="addrCity"
                  placeholder="City" autocomplete="address-level2">
              </div>
            </div>

            <!-- Row 5: State dropdown -->
            <div class="field-group">
              <label class="field-label">State <span class="req">*</span></label>
              <select class="field-input field-select" [(ngModel)]="addrState"
                autocomplete="address-level1">
                <option value="">— Select State —</option>
                <option *ngFor="let s of indianStates" [value]="s">{{ s }}</option>
              </select>
            </div>

            <!-- Mobile Number -->
            <div class="field-group">
              <label class="field-label">Mobile Number <span class="req">*</span></label>
              <div class="phone-wrap">
                <span class="phone-prefix">+91</span>
                <input
                  type="tel"
                  class="field-input phone-input"
                  [(ngModel)]="phoneNumber"
                  placeholder="10-digit number"
                  maxlength="10"
                >
              </div>
            </div>
          </div>

          <!-- Pay Button -->
          <button
            class="pay-btn"
            (click)="proceedToCheckout()"
            [disabled]="processing || !isAddressComplete || !phoneNumber"
          >
            <span *ngIf="!processing">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
              Pay ₹{{ finalTotal }}
            </span>
            <span class="pay-loading" *ngIf="processing">
              <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            </span>
          </button>

          <p class="secure-note">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
            Secured by Razorpay · 256-bit encryption
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ── Page shell ───────────────────────────── */
    .cart-page {
      min-height: 100vh;
      background: var(--cream);
      padding-bottom: 4rem;
    }

    /* ── Header ───────────────────────────────── */
    .page-header {
      background: var(--white);
      border-bottom: 1px solid var(--cream-dark);
      padding: 1.25rem 0;
      margin-bottom: 2rem;
    }
    .page-header-inner {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .back-btn {
      width: 38px; height: 38px;
      border: 1px solid var(--cream-dark);
      background: var(--cream);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      color: var(--royal);
      text-decoration: none;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .back-btn:hover { border-color: var(--gold); background: var(--white); }
    .page-header h1 {
      font-family: 'Raleway', sans-serif;
      font-size: 1.8rem;
      color: var(--royal);
      margin: 0;
      letter-spacing: 0.5px;
    }
    .item-count {
      font-size: 0.8rem;
      letter-spacing: 1px;
      color: var(--text-light);
      text-transform: uppercase;
      margin: 0;
    }

    /* ── Empty State ──────────────────────────── */
    .empty-state {
      text-align: center;
      padding: 5rem 2rem;
      max-width: 400px;
      margin: 0 auto;
    }
    .empty-icon {
      width: 90px; height: 90px;
      background: var(--white);
      border: 1px solid var(--cream-dark);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 1.5rem;
      color: var(--text-light);
    }
    .empty-state h2 {
      font-family: 'Raleway', sans-serif;
      font-size: 1.8rem;
      color: var(--royal);
      margin-bottom: 0.5rem;
    }
    .empty-state p { font-size: 0.95rem; color: var(--text-light); margin-bottom: 2rem; }
    .btn-shop {
      display: inline-block;
      padding: 0.9rem 2.5rem;
      background: var(--royal);
      color: var(--cream);
      font-family: 'Raleway', sans-serif;
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
      text-decoration: none;
      border-radius: 2px;
      transition: opacity 0.2s;
    }
    .btn-shop:hover { opacity: 0.88; }

    /* ── Main layout ──────────────────────────── */
    .cart-body {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 1.5rem;
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 2rem;
      align-items: start;
    }

    /* ── Cart Cards ───────────────────────────── */
    .cart-cards { display: flex; flex-direction: column; gap: 1rem; }

    .cart-card {
      background: var(--white);
      border-radius: 16px;
      display: flex;
      gap: 0;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(85,23,86,0.06);
      transition: box-shadow 0.3s, transform 0.3s;
    }
    .cart-card:hover {
      box-shadow: 0 8px 28px rgba(85,23,86,0.12);
      transform: translateY(-2px);
    }

    /* Image */
    .card-img-wrap {
      width: 140px;
      flex-shrink: 0;
      background: var(--cream);
      cursor: pointer;
      overflow: hidden;
    }
    .card-img {
      width: 100%; height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }
    .cart-card:hover .card-img { transform: scale(1.06); }

    /* Content */
    .card-content {
      flex: 1;
      padding: 1.1rem 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.5rem;
    }
    .card-meta { flex: 1; }
    .card-category {
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--gold-dark);
      display: block;
      margin-bottom: 0.25rem;
    }
    .card-title {
      font-family: 'Raleway', sans-serif;
      font-size: 1.15rem;
      color: var(--royal);
      line-height: 1.3;
      margin: 0;
    }

    .wish-btn {
      width: 32px; height: 32px;
      background: var(--cream);
      border: none;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      color: var(--text-light);
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .wish-btn:hover { background: #fdecea; color: var(--error); }

    /* Prices */
    .card-price-row { display: flex; align-items: center; }
    .card-prices { display: flex; align-items: baseline; gap: 0.5rem; }
    .price-main {
      font-family: 'Raleway', sans-serif;
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--royal);
    }
    .price-strike {
      font-size: 0.88rem;
      color: var(--text-light);
      text-decoration: line-through;
    }

    /* Bottom row: stepper + total */
    .card-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: auto;
    }

    /* Qty Stepper */
    .qty-stepper {
      display: flex;
      align-items: center;
      gap: 0;
      background: var(--cream);
      border-radius: 100px;
      overflow: hidden;
      border: 1px solid var(--cream-dark);
    }
    .qty-btn {
      width: 34px; height: 34px;
      background: none;
      border: none;
      font-size: 1.2rem;
      font-weight: 300;
      color: var(--royal);
      cursor: pointer;
      transition: background 0.2s;
      display: flex; align-items: center; justify-content: center;
    }
    .qty-btn:hover:not(:disabled) { background: var(--gold-light); color: var(--royal-dark); }
    .qty-btn:disabled { color: var(--text-light); cursor: not-allowed; }
    .qty-val {
      min-width: 28px;
      text-align: center;
      font-family: 'Raleway', sans-serif;
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--royal);
    }

    .line-total {
      font-family: 'Raleway', sans-serif;
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--royal);
    }

    /* Promo strip */
    .promo-strip {
      background: var(--white);
      border-radius: 10px;
      padding: 0.9rem 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 0.85rem;
      color: var(--text-mid);
      border: 1px dashed var(--gold);
      box-shadow: 0 2px 8px rgba(85,23,86,0.04);
    }
    .promo-strip svg { color: var(--gold-dark); flex-shrink: 0; }
    .promo-strip strong { color: var(--royal); }
    .promo-strip.success {
      border-color: #2e7d32;
      background: #f1f8f2;
    }
    .promo-strip.success svg { color: #2e7d32; }
    .promo-strip.success strong { color: #2e7d32; }

    /* ── Summary Panel ────────────────────────── */
    .summary-panel {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      position: sticky;
      top: 90px;
    }

    /* Summary Card */
    .summary-card {
      background: var(--white);
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 2px 12px rgba(85,23,86,0.06);
    }
    .summary-title {
      font-family: 'Raleway', sans-serif;
      font-size: 1.25rem;
      color: var(--royal);
      margin-bottom: 1.25rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--cream-dark);
      letter-spacing: 0.5px;
    }
    .summary-lines { display: flex; flex-direction: column; gap: 0; }
    .summary-line {
      display: flex;
      justify-content: space-between;
      padding: 0.55rem 0;
      border-bottom: 1px solid var(--cream-dark);
      font-size: 0.9rem;
      color: var(--text-mid);
    }
    .summary-line:last-child { border-bottom: none; }
    .free-tag {
      font-size: 0.78rem;
      font-weight: 700;
      background: #e8f5e9;
      color: #2e7d32;
      padding: 0.15rem 0.55rem;
      border-radius: 100px;
      letter-spacing: 0.5px;
    }
    .summary-line.discount { color: #2e7d32; }
    .summary-line.spin-discount { color: #551756; }
    .saving-amt { font-weight: 700; }
    .spin-badge {
      display: inline-block;
      background: #fdf5ff; border: 1px solid #d4a0d4;
      color: #551756; font-size: 0.72rem; font-weight: 700;
      padding: 0.15rem 0.5rem; border-radius: 20px;
    }

    .summary-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 2px solid var(--royal);
      font-family: 'Raleway', sans-serif;
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--royal);
    }

    /* Shipping Card */
    .shipping-card {
      background: var(--white);
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 2px 12px rgba(85,23,86,0.06);
    }
    .shipping-title {
      font-family: 'Raleway', sans-serif;
      font-size: 1.1rem;
      color: var(--royal);
      margin-bottom: 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .shipping-title svg { color: var(--gold-dark); }

    .field-group { margin-bottom: 1rem; }
    .field-row-2 {
      display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;
    }
    .req { color: #c0392b; font-weight: 700; }
    .field-select { appearance: none; cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23551756' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 0.85rem center; padding-right: 2rem; }
    .field-label {
      display: block;
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: var(--royal);
      margin-bottom: 0.45rem;
    }
    .field-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1.5px solid var(--cream-dark);
      border-radius: 10px;
      font-family: 'Raleway', sans-serif;
      font-size: 0.95rem;
      background: var(--cream);
      color: var(--text-dark);
      resize: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .field-input:focus {
      outline: none;
      border-color: var(--gold);
      box-shadow: 0 0 0 3px rgba(202,178,115,0.18);
      background: var(--white);
    }
    .phone-wrap {
      display: flex;
      align-items: center;
      border: 1.5px solid var(--cream-dark);
      border-radius: 10px;
      overflow: hidden;
      background: var(--cream);
      transition: border-color 0.2s;
    }
    .phone-wrap:focus-within {
      border-color: var(--gold);
      box-shadow: 0 0 0 3px rgba(202,178,115,0.18);
      background: var(--white);
    }
    .phone-prefix {
      padding: 0 0.85rem;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--royal);
      border-right: 1.5px solid var(--cream-dark);
      height: 100%;
      display: flex;
      align-items: center;
      background: var(--white);
      white-space: nowrap;
    }
    .phone-input {
      border: none !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      background: transparent !important;
      flex: 1;
    }
    .phone-input:focus { box-shadow: none !important; }

    /* Pay Button */
    .pay-btn {
      width: 100%;
      padding: 1.1rem;
      background: var(--royal);
      color: var(--cream);
      border: none;
      border-radius: 14px;
      font-family: 'Raleway', sans-serif;
      font-weight: 700;
      font-size: 1rem;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
      box-shadow: 0 6px 20px rgba(85,23,86,0.3);
    }
    .pay-btn:hover:not(:disabled) {
      background: var(--royal-mid);
      transform: translateY(-2px);
      box-shadow: 0 10px 28px rgba(85,23,86,0.38);
    }
    .pay-btn:disabled {
      opacity: 0.45;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    /* Loading dots */
    .pay-loading { display: flex; gap: 5px; align-items: center; }
    .dot {
      width: 7px; height: 7px;
      background: var(--cream);
      border-radius: 50%;
      animation: bounce 0.6s infinite alternate;
    }
    .dot:nth-child(2) { animation-delay: 0.2s; }
    .dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-5px); } }

    .secure-note {
      text-align: center;
      font-size: 0.75rem;
      color: var(--text-light);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      letter-spacing: 0.3px;
    }
    .secure-note svg { color: #2e7d32; }

    /* ── Responsive ───────────────────────────── */
    @media (max-width: 900px) {
      .cart-body { grid-template-columns: 1fr; }
      .summary-panel { position: static; }
    }
    @media (max-width: 560px) {
      .card-img-wrap { width: 110px; }
      .cart-card { border-radius: 12px; }
      .card-title { font-size: 1rem; }
      .price-main { font-size: 1.1rem; }
    }
    @media (max-width: 420px) {
      .card-img-wrap { width: 90px; }
      .card-content { padding: 0.9rem 1rem; }
    }
  `]
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartTotal = 0;
  phoneNumber = '';
  processing = false;

  // Structured address fields
  addrDoor     = '';
  addrArea     = '';
  addrLocality = '';
  addrPin      = '';
  addrCity     = '';
  addrState    = '';

  readonly indianStates = [
    'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
    'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
    'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
    'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
    'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
    'Andaman & Nicobar Islands','Chandigarh','Dadra & Nagar Haveli and Daman & Diu',
    'Delhi','Jammu & Kashmir','Ladakh','Lakshadweep','Puducherry'
  ];

  get isAddressComplete(): boolean {
    return !!(this.addrDoor.trim() && this.addrArea.trim() &&
              this.addrPin.trim().length === 6 && this.addrCity.trim() && this.addrState);
  }

  get shippingAddress(): string {
    const parts = [
      this.addrDoor.trim(),
      this.addrArea.trim(),
      this.addrLocality.trim(),
      this.addrCity.trim(),
      this.addrState,
      `PIN: ${this.addrPin.trim()}`
    ].filter(Boolean);
    return parts.join(', ');
  }

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private spinService: SpinWheelService,
    private router: Router
  ) {}

  ngOnInit(): void { this.loadCart(); }

  loadCart(): void {
    this.cartService.getCartItems().subscribe({
      next: (data) => { this.cartItems = data; this.calculateTotal(); },
      error: (err) => console.error('Error loading cart:', err)
    });
  }

  calculateTotal(): void {
    this.cartTotal = this.cartItems.reduce((sum, item) => {
      return sum + ((item.discounted_price || item.product_price) * item.quantity);
    }, 0);
  }

  get hasDiscount(): boolean {
    return this.cartItems.some(i => i.discounted_price && i.discounted_price < i.product_price);
  }

  get totalSavings(): number {
    return this.cartItems.reduce((sum, item) => {
      if (item.discounted_price && item.discounted_price < item.product_price) {
        return sum + ((item.product_price - item.discounted_price) * item.quantity);
      }
      return sum;
    }, 0);
  }

  /** Spin wheel discount percentage (0 if no spin or Better Luck) */
  get spinDiscountPct(): number {
    return this.spinService.currentResult?.percentage ?? 0;
  }

  /** Amount deducted by spin wheel discount */
  get spinDiscountAmount(): number {
    if (!this.spinDiscountPct) return 0;
    return Math.round(this.cartTotal * this.spinDiscountPct / 100);
  }

  /** Final total including shipping and spin discount */
  get finalTotal(): number {
    const shipping = this.cartTotal >= 999 ? 0 : 99;
    return Math.max(0, this.cartTotal + shipping - this.spinDiscountAmount);
  }

  increaseQty(item: CartItem): void {
    item.quantity++;
    this.cartService.updateCartItem(item.id, item.quantity).subscribe({
      next: () => this.calculateTotal(),
      error: (err) => { item.quantity--; console.error(err); }
    });
  }

  decreaseQty(item: CartItem): void {
    if (item.quantity <= 1) return;
    item.quantity--;
    this.cartService.updateCartItem(item.id, item.quantity).subscribe({
      next: () => this.calculateTotal(),
      error: (err) => { item.quantity++; console.error(err); }
    });
  }

  removeItem(id: number): void {
    this.cartService.removeFromCart(id).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Error removing item:', err)
    });
  }

  proceedToCheckout(): void {
    this.processing = true;
    this.paymentService.createOrder({
      shipping_address: this.shippingAddress,
      phone_number: this.phoneNumber,
      spin_discount_pct: this.spinDiscountPct
    }).subscribe({
      next: (razorpayOrder: RazorpayOrder) => this.initiatePayment(razorpayOrder),
      error: (err) => {
        this.processing = false;
        console.error('Error creating order:', err);
        alert('Failed to create order. Please try again.');
      }
    });
  }

  initiatePayment(orderData: RazorpayOrder): void {
    const user = this.authService.currentUserValue;
    this.paymentService.initiatePayment(
      orderData,
      { name: user?.name || '', email: user?.email || '', contact: user?.phone_number || '' },
      (response) => {
        this.paymentService.verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        }).subscribe({
          next: (result) => {
            this.processing = false;
            this.router.navigate(['/order-confirmation'], { queryParams: { id: result.order_id } });
          },
          error: (err) => {
            this.processing = false;
            console.error('Payment verification failed:', err);
            alert('Payment verification failed. Please contact support.');
          }
        });
      },
      () => {
        this.processing = false;
        this.paymentService.paymentFailed(orderData.order_id).subscribe();
        alert('Payment failed or cancelled.');
      }
    );
  }
}

// Made with Bob
