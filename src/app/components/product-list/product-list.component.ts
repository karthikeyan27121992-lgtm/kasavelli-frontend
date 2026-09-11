import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product, Category, CartItem } from '../../models/product.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="products-page">
      <!-- Top Collections Hero Header Banner -->
      <div class="collections-hero">
        <div class="hero-inner container">
          <div class="hero-badge">
            <span class="sparkle-icon">✦</span>
            <span>925 HALLMARKED SILVER</span>
            <span class="sparkle-icon">✦</span>
          </div>
          <h1 class="page-title">Our Exclusive Collection</h1>
          <div class="title-gold-line"></div>
          <p class="page-title-sub">Handcrafted by master artisans with pure 925 sterling silver</p>
        </div>
      </div>

      <div class="container main-content">
        <!-- Modern Floating Filter Bar -->
        <div class="filters-card">
          <div class="filter-group category-group">
            <label>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M7 12h10M10 18h4"/></svg>
              Filter Category
            </label>
            <div class="select-wrapper">
              <select class="filter-select" [(ngModel)]="selectedCategory" (change)="onFilterChange()">
                <option value="">All Collections</option>
                <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.display_name }}</option>
              </select>
            </div>
          </div>

          <div class="filter-group search-group">
            <label>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Search Designs
            </label>
            <div class="search-wrapper">
              <input
                type="text"
                class="filter-input"
                placeholder="Search rings, earrings, pendants..."
                [(ngModel)]="searchQuery"
                (input)="onSearch()"
              >
              <span class="search-icon">🔍</span>
            </div>
          </div>
        </div>

        <!-- Products Toolbar / Count -->
        <div class="products-toolbar" *ngIf="!loading">
          <div class="count-badge">
            <span class="count-num">{{ products.length }}</span>
            <span class="count-lbl">Designs Available</span>
          </div>
          <div class="purity-assurance">
            <span class="assurance-dot">●</span> 100% Certified 925 Silver
          </div>
        </div>

        <!-- Products Grid -->
        <div class="products-grid" *ngIf="!loading">
          <div class="product-card" *ngFor="let product of products">
            <!-- Glitter Star Accent -->
            <div class="card-glitter-star">✦</div>

            <div class="product-image-wrapper" [routerLink]="['/products', product.id]">
              <img *ngIf="product.image; else noProductImg"
                   [src]="product.image" [alt]="product.title" class="product-image">
              <ng-template #noProductImg>
                <div class="product-img-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" width="44" height="44">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
              </ng-template>

              <!-- Discount and Purity Badges -->
              <div class="product-overlay">
                <span class="discount-tag" *ngIf="product.discount_percentage > 0">
                  {{ product.discount_percentage }}% OFF
                </span>
                <span class="purity-tag">{{ product.purity || '925 Silver' }}</span>
              </div>

              <!-- Quick View Hover Button -->
              <div class="quick-view-hover">
                <span>View Design</span>
              </div>
            </div>
            
            <div class="product-info">
              <div class="cat-stock-row">
                <span class="product-category">{{ product.category_name }}</span>
                <span class="stock-badge" [class.in-stock]="product.in_stock" [class.out-of-stock]="!product.in_stock">
                  {{ product.in_stock ? 'In Stock' : 'Sold Out' }}
                </span>
              </div>

              <h3 class="product-title" [routerLink]="['/products', product.id]" [title]="product.title">
                {{ product.title }}
              </h3>
              
              <div class="product-pricing">
                <div class="price-wrap">
                  <span class="price-current">₹{{ product.final_price }}</span>
                  <span class="price-original" *ngIf="product.discounted_price">₹{{ product.price }}</span>
                </div>
                <span class="saved-amt" *ngIf="product.discounted_price">
                  Save ₹{{ product.price - product.final_price }}
                </span>
              </div>
              
              <!-- Add-to-cart: plain button or inline stepper -->
              <div class="action-wrap">
                <ng-container *ngIf="product.in_stock; else outOfStock">
                  <ng-container *ngIf="getCartItem(product.id) as item; else addBtn">
                    <div class="cart-stepper" (click)="$event.stopPropagation()">
                      <button class="step-btn" (click)="decrease(item, $event)" title="Decrease">−</button>
                      <span class="step-qty">{{ item.quantity }} in Cart</span>
                      <button class="step-btn" (click)="increase(item, $event)" title="Increase">+</button>
                    </div>
                  </ng-container>
                  <ng-template #addBtn>
                    <button class="btn-add-cart" (click)="addToCart(product, $event)">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                      Add to Cart
                    </button>
                  </ng-template>
                </ng-container>
                <ng-template #outOfStock>
                  <button class="btn-add-cart btn-disabled" disabled>Out of Stock</button>
                </ng-template>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading Spinner -->
        <div class="loading-spinner" *ngIf="loading">
          <div class="spinner"></div>
          <p>Loading products...</p>
        </div>

        <!-- No Products Message -->
        <div class="no-products" *ngIf="!loading && products.length === 0">
          <p>No products found matching your criteria.</p>
          <button class="btn-reset" (click)="resetFilters()">Reset Filters</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --royal: #551756;
      --royal-mid: #431044;
      --royal-dark: #270629;
      --gold: #c9a84c;
      --gold-light: #f5cf62;
      --gold-glow: rgba(245, 207, 98, 0.4);
      --bg: #faf7fc;
      --card-bg: #ffffff;
      --border: #ede4f0;
      --text: #1a1a2e;
      --muted: #6b6b7b;
      --green: #15803d;
      --green-bg: #dcfce7;
      --red: #b91c1c;
      --red-bg: #fee2e2;
    }

    .products-page {
      background: var(--bg);
      min-height: 100vh;
      padding-bottom: 5rem;
    }

    /* ══ 1. TOP COLLECTIONS HERO BANNER ══ */
    .collections-hero {
      background: linear-gradient(135deg, #300832 0%, #200422 65%, #18031a 100%);
      padding: 3.5rem 1.5rem 3.8rem;
      position: relative;
      overflow: hidden;
      border-bottom: 2px solid rgba(245, 207, 98, 0.35);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    }
    .collections-hero::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 80% 20%, rgba(245, 207, 98, 0.12) 0%, transparent 60%);
      pointer-events: none;
    }

    .hero-inner {
      text-align: center;
      position: relative;
      z-index: 2;
      max-width: 800px;
      margin: 0 auto;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(245, 207, 98, 0.12);
      border: 1px solid rgba(245, 207, 98, 0.4);
      padding: 0.35rem 1rem;
      border-radius: 20px;
      color: var(--gold-light);
      font-size: 0.74rem;
      font-weight: 700;
      letter-spacing: 2px;
      margin-bottom: 1rem;
    }
    .sparkle-icon {
      font-size: 0.75rem;
      color: var(--gold-light);
      text-shadow: 0 0 6px var(--gold-glow);
    }

    .page-title {
      font-family: 'Raleway', sans-serif;
      color: #ffffff;
      font-size: clamp(2rem, 4.5vw, 3rem);
      margin: 0;
      font-weight: 800;
      letter-spacing: 0.5px;
      text-shadow: 0 2px 10px rgba(0,0,0,0.4);
    }
    .title-gold-line {
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, var(--gold), var(--gold-light));
      margin: 1rem auto;
      border-radius: 2px;
      box-shadow: 0 0 8px var(--gold-glow);
    }
    .page-title-sub {
      color: rgba(239, 235, 225, 0.88);
      font-size: 1rem;
      font-weight: 300;
      margin: 0;
      letter-spacing: 0.5px;
    }

    /* ══ 2. MAIN CONTAINER & FILTERS CARD ══ */
    .container {
      max-width: 1360px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .main-content {
      margin-top: -1.75rem;
      position: relative;
      z-index: 4;
    }

    .filters-card {
      background: #ffffff;
      padding: 1.25rem 1.75rem;
      border-radius: 14px;
      border: 1.5px solid rgba(232, 197, 71, 0.35);
      box-shadow: 0 10px 30px rgba(85, 23, 86, 0.08), 0 0 15px rgba(245, 207, 98, 0.1);
      display: grid;
      grid-template-columns: 1fr 1.6fr;
      gap: 1.5rem;
      align-items: center;
      margin-bottom: 2rem;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .filter-group label {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-weight: 700;
      color: var(--royal-dark);
      font-size: 0.76rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .select-wrapper, .search-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .filter-select {
      width: 100%;
      padding: 0.75rem 1.1rem;
      border: 1.5px solid var(--border);
      border-radius: 8px;
      font-size: 0.92rem;
      background: #fbf9fd;
      color: var(--text);
      font-weight: 500;
      cursor: pointer;
      outline: none;
      transition: all 0.25s ease;
      box-sizing: border-box;
    }
    .filter-select:focus {
      border-color: var(--gold);
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(245, 207, 98, 0.2);
    }

    .filter-input {
      width: 100%;
      padding: 0.75rem 2.5rem 0.75rem 1.1rem;
      border: 1.5px solid var(--border);
      border-radius: 8px;
      font-size: 0.92rem;
      background: #fbf9fd;
      color: var(--text);
      outline: none;
      transition: all 0.25s ease;
      box-sizing: border-box;
    }
    .filter-input:focus {
      border-color: var(--gold);
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(245, 207, 98, 0.2);
    }
    .search-icon {
      position: absolute;
      right: 1rem;
      font-size: 0.95rem;
      opacity: 0.6;
      pointer-events: none;
    }

    /* ══ 3. PRODUCTS TOOLBAR ══ */
    .products-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding: 0 0.25rem;
    }
    .count-badge {
      display: inline-flex;
      align-items: baseline;
      gap: 0.45rem;
    }
    .count-num {
      font-family: 'Raleway', sans-serif;
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--royal-dark);
    }
    .count-lbl {
      font-size: 0.85rem;
      color: var(--muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    .purity-assurance {
      font-size: 0.82rem;
      color: var(--royal);
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(245, 207, 98, 0.15);
      border: 1px solid rgba(245, 207, 98, 0.45);
      padding: 0.35rem 0.85rem;
      border-radius: 20px;
    }
    .assurance-dot {
      color: #c9a84c;
      font-size: 0.65rem;
    }

    /* ══ 4. PRODUCT CARDS GRID (GLITTERING GOLDEN BORDER) ══ */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.75rem;
      margin-bottom: 3.5rem;
    }

    .product-card {
      background: #ffffff;
      border-radius: 14px;
      overflow: hidden;
      border: 1.5px solid rgba(232, 197, 71, 0.5);
      box-shadow: 0 4px 18px rgba(201, 168, 76, 0.12);
      transition: all 0.35s ease;
      display: flex;
      flex-direction: column;
      position: relative;
    }
    .product-card:hover {
      border-color: #f5cf62;
      box-shadow: 0 12px 32px rgba(85,23,86,0.15), 0 0 20px rgba(245, 207, 98, 0.45);
      transform: translateY(-6px);
    }

    /* Floating Glitter Star in corner */
    .card-glitter-star {
      position: absolute;
      top: 8px;
      right: 10px;
      color: #f5cf62;
      font-size: 0.75rem;
      opacity: 0.85;
      text-shadow: 0 0 8px rgba(245, 207, 98, 0.9);
      z-index: 5;
      pointer-events: none;
    }

    .product-image-wrapper {
      position: relative;
      width: 100%;
      height: 270px;
      overflow: hidden;
      cursor: pointer;
      background: #f7f2f8;
    }
    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    .product-card:hover .product-image {
      transform: scale(1.08);
    }
    .product-img-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(85,23,86,0.25);
    }

    /* Badges */
    .product-overlay {
      position: absolute;
      top: 10px;
      left: 10px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      z-index: 3;
    }
    .discount-tag {
      background: #e63946;
      color: #ffffff;
      padding: 0.25rem 0.55rem;
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      border-radius: 4px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    }
    .purity-tag {
      background: var(--royal-dark);
      color: var(--gold-light);
      padding: 0.22rem 0.55rem;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      border-radius: 4px;
      border: 1px solid rgba(245, 207, 98, 0.4);
    }

    /* Hover Quick Action */
    .quick-view-hover {
      position: absolute;
      inset: 0;
      background: rgba(42, 7, 44, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 2;
    }
    .quick-view-hover span {
      background: var(--gold-light);
      color: var(--royal-dark);
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      padding: 0.6rem 1.25rem;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transform: translateY(6px);
      transition: transform 0.3s ease;
    }
    .product-card:hover .quick-view-hover {
      opacity: 1;
    }
    .product-card:hover .quick-view-hover span {
      transform: translateY(0);
    }

    /* ══ 5. PRODUCT INFO ══ */
    .product-info {
      padding: 1.25rem 1.25rem 1.4rem;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    .cat-stock-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.45rem;
    }
    .product-category {
      font-size: 0.72rem;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: var(--muted);
      font-weight: 600;
    }
    .stock-badge {
      font-size: 0.68rem;
      font-weight: 700;
      padding: 0.2rem 0.55rem;
      border-radius: 12px;
      letter-spacing: 0.3px;
    }
    .stock-badge.in-stock {
      background: var(--green-bg);
      color: var(--green);
    }
    .stock-badge.out-of-stock {
      background: var(--red-bg);
      color: var(--red);
    }

    .product-title {
      font-family: 'Raleway', sans-serif;
      font-size: 1.08rem;
      font-weight: 700;
      color: var(--royal-dark);
      margin: 0 0 0.75rem;
      cursor: pointer;
      line-height: 1.35;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      transition: color 0.2s;
      min-height: 2.7rem;
    }
    .product-title:hover {
      color: var(--royal);
    }

    /* Pricing */
    .product-pricing {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.1rem;
      padding-top: 0.4rem;
      border-top: 1px dashed #f0eaee;
    }
    .price-wrap {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
    }
    .price-current {
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--royal-dark);
      font-family: 'Raleway', sans-serif;
    }
    .price-original {
      font-size: 0.88rem;
      color: var(--muted);
      text-decoration: line-through;
    }
    .saved-amt {
      font-size: 0.72rem;
      color: var(--green);
      font-weight: 700;
      background: var(--green-bg);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
    }

    /* ══ 6. ADD TO CART & STEPPER BUTTONS ══ */
    .action-wrap {
      margin-top: auto;
    }
    .btn-add-cart {
      width: 100%;
      padding: 0.85rem 1rem;
      background: var(--royal);
      color: #efebe1;
      border: 1.5px solid var(--royal);
      font-family: 'Raleway', sans-serif;
      font-weight: 700;
      font-size: 0.82rem;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.25s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      box-shadow: 0 4px 12px rgba(85, 23, 86, 0.2);
    }
    .btn-add-cart:hover:not(:disabled) {
      background: var(--royal-mid);
      border-color: var(--royal-mid);
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(85, 23, 86, 0.3);
    }
    .btn-disabled {
      background: #ede8f0 !important;
      border-color: #ede8f0 !important;
      color: var(--muted) !important;
      cursor: not-allowed;
      box-shadow: none !important;
    }

    /* Cart Stepper */
    .cart-stepper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      border: 1.5px solid var(--royal);
      border-radius: 8px;
      overflow: hidden;
      background: #ffffff;
      box-sizing: border-box;
      box-shadow: 0 4px 12px rgba(85, 23, 86, 0.12);
    }
    .step-btn {
      flex: 0 0 42px;
      height: 42px;
      background: var(--royal);
      color: #efebe1;
      border: none;
      font-size: 1.3rem;
      line-height: 1;
      cursor: pointer;
      font-family: inherit;
      transition: background 0.2s;
    }
    .step-btn:hover {
      background: var(--royal-mid);
    }
    .step-qty {
      flex: 1;
      text-align: center;
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--royal-dark);
      letter-spacing: 0.5px;
    }

    /* ══ 7. SPINNER & EMPTY STATE ══ */
    .loading-spinner {
      text-align: center;
      padding: 5rem 0;
    }
    .spinner {
      border: 3.5px solid #ede4f0;
      border-top: 3.5px solid var(--royal);
      border-radius: 50%;
      width: 48px;
      height: 48px;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 1.25rem;
    }
    @keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
    .loading-spinner p {
      color: var(--muted);
      font-size: 0.95rem;
      font-weight: 500;
    }

    .no-products {
      text-align: center;
      padding: 5rem 2rem;
      background: #ffffff;
      border-radius: 14px;
      border: 1.5px solid var(--border);
      max-width: 600px;
      margin: 2rem auto;
      box-shadow: 0 10px 30px rgba(0,0,0,0.04);
    }
    .no-products p {
      color: var(--muted);
      font-size: 1.1rem;
      margin-bottom: 1.5rem;
    }
    .btn-reset {
      padding: 0.85rem 2.25rem;
      background: var(--royal);
      color: #efebe1;
      border: 1.5px solid var(--royal);
      border-radius: 8px;
      font-family: 'Raleway', sans-serif;
      font-weight: 700;
      font-size: 0.85rem;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.3s;
    }
    .btn-reset:hover {
      background: var(--royal-mid);
    }

    /* ══ 8. RESPONSIVE MEDIA QUERIES ══ */
    @media (max-width: 1200px) {
      .products-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
      }
    }

    @media (max-width: 900px) {
      .products-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.25rem;
      }
      .filters-card {
        grid-template-columns: 1fr;
        gap: 1rem;
        padding: 1.25rem;
      }
      .collections-hero {
        padding: 2.8rem 1rem 3.2rem;
      }
    }

    @media (max-width: 600px) {
      .products-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.85rem;
      }
      .container {
        padding: 0 0.85rem;
      }
      .collections-hero {
        padding: 2.2rem 0.85rem 2.6rem;
      }
      .filters-card {
        padding: 1rem;
        border-radius: 10px;
      }
      .product-image-wrapper {
        height: 180px;
      }
      .product-info {
        padding: 0.9rem 0.75rem 1rem;
      }
      .product-title {
        font-size: 0.92rem;
        min-height: 2.4rem;
        margin-bottom: 0.5rem;
      }
      .price-current {
        font-size: 1.15rem;
      }
      .price-original {
        font-size: 0.78rem;
      }
      .btn-add-cart {
        padding: 0.65rem 0.5rem;
        font-size: 0.72rem;
        letter-spacing: 0.8px;
        gap: 0.3rem;
      }
      .btn-add-cart svg {
        width: 13px;
        height: 13px;
      }
      .step-btn {
        flex: 0 0 34px;
        height: 34px;
        font-size: 1.1rem;
      }
      .step-qty {
        font-size: 0.72rem;
      }
      .saved-amt {
        display: none;
      }
    }
  `]
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategory = '';
  searchQuery = '';
  loading = false;
  cartItems: CartItem[] = [];
  private cartSub!: Subscription;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnDestroy(): void {
    this.cartSub?.unsubscribe();
  }

  /** Returns the CartItem for a product if it is in the cart, else null */
  getCartItem(productId: number): CartItem | null {
    return this.cartItems.find(i => i.product === productId) ?? null;
  }

  ngOnInit(): void {
    this.loadCategories();

    // Keep local cartItems in sync so the stepper reacts immediately
    this.cartSub = this.cartService.cartItems$.subscribe(
      items => this.cartItems = items
    );

    // Check for category query param
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory = params['category'];
      }
      this.loadProducts();
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data: any) => {
        // Handle both array and paginated response
        this.categories = Array.isArray(data) ? data : (data.results || []);
        console.log('Categories loaded:', this.categories.length);
      },
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  loadProducts(): void {
    this.loading = true;
    
    // If category is selected, use the category-specific endpoint
    if (this.selectedCategory) {
      this.productService.getProductsByCategory(Number(this.selectedCategory)).subscribe({
        next: (data) => {
          this.products = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading products by category:', err);
          this.loading = false;
        }
      });
    } else {
      // Load all products
      this.productService.getProducts().subscribe({
        next: (data) => {
          this.products = data.results;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading products:', err);
          this.loading = false;
        }
      });
    }
  }

  onFilterChange(): void {
    this.loadProducts();
  }

  onSearch(): void {
    if (this.searchQuery.length > 2) {
      this.loading = true;
      this.productService.searchProducts(this.searchQuery).subscribe({
        next: (data) => {
          this.products = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error searching products:', err);
          this.loading = false;
        }
      });
    } else if (this.searchQuery.length === 0) {
      this.loadProducts();
    }
  }

  addToCart(product: Product, event: Event): void {
    event.stopPropagation(); // Prevent navigation to product detail
    
    // Check if user is authenticated
    if (!this.authService.isAuthenticated) {
      // Redirect to login page
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    this.cartService.addToCart(product.id, 1).subscribe({
      error: (err) => console.error('Error adding to cart:', err)
    });
  }

  increase(item: CartItem, event: Event): void {
    event.stopPropagation();
    this.cartService.updateCartItem(item.id, item.quantity + 1).subscribe({
      error: (err) => console.error('Error updating cart:', err)
    });
  }

  decrease(item: CartItem, event: Event): void {
    event.stopPropagation();
    if (item.quantity <= 1) {
      this.cartService.removeFromCart(item.id).subscribe({
        error: (err) => console.error('Error removing from cart:', err)
      });
    } else {
      this.cartService.updateCartItem(item.id, item.quantity - 1).subscribe({
        error: (err) => console.error('Error updating cart:', err)
      });
    }
  }

  resetFilters(): void {
    this.selectedCategory = '';
    this.searchQuery = '';
    this.loadProducts();
  }
}

// Made with Bob
