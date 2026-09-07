import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product, Category, Banner } from '../../models/product.model';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="landing">

      <!-- ── Hero Video Banner ────────────────── -->
      <section class="hero">
        <video autoplay muted loop playsinline class="hero-video">
          <source src="assets/images/WhatsApp Video 2026-05-17 at 2.58.52 PM.mp4" type="video/mp4">
        </video>
        <div class="hero-overlay">
          <p class="hero-eyebrow">Since 2024 · Handcrafted in India</p>
          <h1 class="hero-title">KASAVELLI<br><span>9 2 5</span></h1>
          <p class="hero-sub">Pure Silver. Timeless Elegance.</p>
          <div class="hero-actions">
            <a routerLink="/products" class="btn btn-gold btn-lg">Explore Collection</a>
            <a routerLink="/products" class="btn btn-hero-outline btn-lg">View All</a>
          </div>
        </div>
        <div class="hero-scroll-hint">
          <span></span>
        </div>
      </section>

      <!-- ── Image Banners ────────────────────── -->
      <section class="banners" *ngIf="banners.length > 0">
        <div class="banner-card" *ngFor="let banner of banners">
          <img [src]="banner.image" [alt]="banner.title" class="banner-img">
          <div class="banner-info">
            <h3>{{ banner.title }}</h3>
            <p>{{ banner.description }}</p>
            <span class="discount-badge" *ngIf="banner.discount_offer">{{ banner.discount_offer }}</span>
          </div>
        </div>
      </section>

      <!-- ── Trust Bar ─────────────────────────── -->
      <section class="trust-bar">
        <div class="container trust-inner">
          <div class="trust-item">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>925 Certified Silver</span>
          </div>
          <div class="trust-divider"></div>
          <div class="trust-item">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <rect x="1" y="3" width="15" height="13" rx="1"/>
              <path d="M16 8h4l3 5v3h-7V8zM5.5 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm13 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
            </svg>
            <span>Free Shipping ₹999+</span>
          </div>
          <div class="trust-divider"></div>
          <div class="trust-item">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
            <span>30-Day Easy Returns</span>
          </div>
          <div class="trust-divider"></div>
          <div class="trust-item">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span>Handcrafted with Love</span>
          </div>
        </div>
      </section>

      <!-- ── Shop by Category ──────────────────── -->
      <section class="categories-section">
        <div class="container">
          <div class="section-head">
            <h2>Shop by Category</h2>
            <span class="gold-divider"></span>
            <p class="section-sub">Discover our curated silver collections</p>
          </div>
        </div>
        <div class="category-scroll-wrap">
          <div class="category-track">
            <div class="category-tile" *ngFor="let cat of categories"
                 [routerLink]="['/products']" [queryParams]="{category: cat.id}">
              <div class="cat-img-ring">
                <img [src]="cat.image || 'assets/placeholder.jpg'" [alt]="cat.display_name" class="cat-img">
              </div>
              <p class="cat-name">{{ cat.display_name }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Featured Products ─────────────────── -->
      <section class="featured-section">
        <div class="container">
          <div class="section-head">
            <h2>Featured Collection</h2>
            <span class="gold-divider"></span>
            <p class="section-sub">Bestsellers loved by our customers</p>
          </div>

          <div class="products-grid">
            <div class="product-card" *ngFor="let p of featuredProducts" [routerLink]="['/products', p.id]">
              <div class="product-img-wrap">
                <img [src]="p.image" [alt]="p.name" class="product-img">
                <span class="off-badge" *ngIf="p.discount_percentage > 0">{{ p.discount_percentage }}% OFF</span>
                <div class="hover-overlay">
                  <span class="quick-view">Quick View</span>
                </div>
              </div>
              <div class="product-body">
                <p class="prod-category">{{ p.category_name }}</p>
                <h3 class="prod-title">{{ p.title }}</h3>
                <p class="prod-purity">{{ p.purity }}</p>
                <div class="prod-price">
                  <span class="price-strike" *ngIf="p.discounted_price">₹{{ p.price }}</span>
                  <span class="price-main">₹{{ p.final_price }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="view-all-wrap">
            <a routerLink="/products" class="btn btn-outline btn-lg">View All Collections</a>
          </div>
        </div>
      </section>

      <!-- ── Quality Promise ──────────────────── -->
      <section class="promise-section">
        <div class="container promise-inner">
          <div class="promise-text">
            <p class="promise-eyebrow">Our Promise</p>
            <h2>Every Piece, A Work of Art</h2>
            <p>At Kasavelli, each piece of jewellery is handcrafted by skilled artisans using 925 hallmarked silver. We blend traditional Indian craftsmanship with modern design sensibilities to create pieces that are truly timeless.</p>
            <a routerLink="/products" class="btn btn-primary mt-3">Discover More</a>
          </div>
          <div class="promise-stats">
            <div class="stat">
              <span class="stat-num">925</span>
              <span class="stat-label">Silver Purity</span>
            </div>
            <div class="stat">
              <span class="stat-num">100+</span>
              <span class="stat-label">Unique Designs</span>
            </div>
            <div class="stat">
              <span class="stat-num">500+</span>
              <span class="stat-label">Happy Customers</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  `,
  styles: [`
    .landing { background: var(--cream); }

    /* ── Hero ───────────────────────────────── */
    .hero {
      position: relative;
      height: 92vh;
      min-height: 560px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .hero-video {
      position: absolute; inset: 0;
      width: 100%; height: 100%;
      object-fit: cover;
    }
    .hero-overlay {
      position: relative;
      z-index: 2;
      text-align: center;
      padding: 2rem;
      background: rgba(58, 14, 59, 0.55);
      width: 100%; height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .hero-eyebrow {
      font-size: 0.78rem;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: var(--gold-light);
      margin-bottom: 1.5rem;
      font-weight: 500;
    }
    .hero-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(3.5rem, 9vw, 7rem);
      font-weight: 700;
      color: var(--cream);
      line-height: 1;
      letter-spacing: 6px;
      margin: 0 0 0.5rem;
    }
    .hero-title span {
      display: block;
      font-size: 0.38em;
      letter-spacing: 14px;
      color: var(--gold);
      font-weight: 400;
      margin-top: 0.3rem;
    }
    .hero-sub {
      font-size: 1.05rem;
      letter-spacing: 2px;
      color: rgba(239,235,225,0.8);
      margin: 1.25rem 0 2.5rem;
      font-weight: 300;
    }
    .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }
    .btn-hero-outline {
      background: transparent;
      border: 2px solid rgba(239,235,225,0.5);
      color: var(--cream);
      letter-spacing: 1.5px;
      font-size: 0.9rem;
      font-weight: 600;
      text-transform: uppercase;
      padding: 0.8rem 1.75rem;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      transition: all 0.3s;
    }
    .btn-hero-outline:hover { border-color: var(--gold); color: var(--gold); }
    .hero-scroll-hint {
      position: absolute;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 3;
    }
    .hero-scroll-hint span {
      display: block;
      width: 1px;
      height: 50px;
      background: linear-gradient(to bottom, transparent, var(--gold));
      animation: scrollLine 1.5s ease-in-out infinite;
    }
    @keyframes scrollLine {
      0% { opacity: 0; transform: scaleY(0); transform-origin: top; }
      50% { opacity: 1; transform: scaleY(1); transform-origin: top; }
      100% { opacity: 0; transform: scaleY(0); transform-origin: bottom; }
    }

    /* ── Banners ─────────────────────────────── */
    .banners {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: 0;
    }
    .banner-card {
      position: relative;
      overflow: hidden;
    }
    .banner-img {
      width: 100%;
      height: 380px;
      object-fit: cover;
      display: block;
      transition: transform 0.5s ease;
    }
    .banner-card:hover .banner-img { transform: scale(1.04); }
    .banner-info {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      background: linear-gradient(transparent, rgba(58,14,59,0.9));
      padding: 2rem 1.75rem 1.5rem;
      color: var(--cream);
    }
    .banner-info h3 {
      color: var(--cream);
      font-size: 1.4rem;
      margin-bottom: 0.35rem;
    }
    .banner-info p { font-size: 0.9rem; opacity: 0.85; margin: 0 0 0.75rem; }

    /* ── Trust Bar ────────────────────────────── */
    .trust-bar {
      background: var(--royal);
      padding: 1.35rem 0;
    }
    .trust-inner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0;
      flex-wrap: wrap;
    }
    .trust-item {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.6rem 2rem;
      color: var(--gold-light);
    }
    .trust-item svg { flex-shrink: 0; }
    .trust-item span {
      font-size: 0.82rem;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: var(--gold-light);
    }
    .trust-divider {
      width: 1px;
      height: 28px;
      background: rgba(202,178,115,0.3);
    }

    /* ── Section Head ─────────────────────────── */
    .section-head {
      text-align: center;
      margin-bottom: 2.5rem;
    }
    .section-head h2 {
      font-size: 2.2rem;
      color: var(--royal);
      letter-spacing: 1px;
    }
    .section-sub {
      margin-top: 0.75rem;
      color: var(--text-light);
      font-size: 0.95rem;
      letter-spacing: 0.5px;
    }

    /* ── Categories ───────────────────────────── */
    .categories-section {
      padding: 4rem 0;
      background: var(--cream);
    }
    .category-scroll-wrap {
      overflow-x: auto;
      padding: 0.5rem 2rem 1.5rem;
      scrollbar-width: thin;
      scrollbar-color: var(--gold) transparent;
    }
    .category-track {
      display: flex;
      gap: 2rem;
      width: max-content;
      padding: 0.5rem 0;
    }
    .category-tile {
      width: 140px;
      text-align: center;
      cursor: pointer;
      transition: transform 0.3s ease;
      flex-shrink: 0;
    }
    .category-tile:hover { transform: translateY(-8px); }
    .cat-img-ring {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      overflow: hidden;
      margin: 0 auto 0.85rem;
      border: 3px solid var(--gold);
      background: var(--white);
      transition: border-color 0.3s, box-shadow 0.3s;
    }
    .category-tile:hover .cat-img-ring {
      border-color: var(--royal);
      box-shadow: 0 8px 24px rgba(85,23,86,0.2);
    }
    .cat-img {
      width: 100%; height: 100%;
      object-fit: cover;
      transition: transform 0.35s ease;
    }
    .category-tile:hover .cat-img { transform: scale(1.1); }
    .cat-name {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--royal);
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    /* ── Featured Products ────────────────────── */
    .featured-section {
      padding: 4rem 0 3rem;
      background: var(--white);
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    .product-card {
      background: var(--white);
      border: 1px solid var(--cream-dark);
      border-radius: 4px;
      overflow: hidden;
      transition: box-shadow 0.35s, border-color 0.35s, transform 0.35s;
      cursor: pointer;
    }
    .product-card:hover {
      box-shadow: 0 16px 40px rgba(85,23,86,0.12);
      border-color: var(--gold);
      transform: translateY(-6px);
    }
    .product-img-wrap {
      position: relative;
      height: 290px;
      overflow: hidden;
      background: var(--cream);
    }
    .product-img {
      width: 100%; height: 100%;
      object-fit: cover;
      transition: transform 0.45s ease;
    }
    .product-card:hover .product-img { transform: scale(1.07); }
    .off-badge {
      position: absolute;
      top: 12px; left: 12px;
      background: var(--royal);
      color: var(--gold-light);
      font-size: 0.72rem;
      font-weight: 700;
      padding: 0.3rem 0.65rem;
      border-radius: 2px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .hover-overlay {
      position: absolute;
      inset: 0;
      background: rgba(58,14,59,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .product-card:hover .hover-overlay { opacity: 1; }
    .quick-view {
      background: var(--gold);
      color: var(--royal-dark);
      padding: 0.65rem 1.5rem;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      border-radius: 2px;
    }
    .product-body {
      padding: 1.1rem 1.25rem 1.4rem;
    }
    .prod-category {
      font-size: 0.72rem;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--text-light);
      margin-bottom: 0.35rem;
    }
    .prod-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.2rem;
      color: var(--royal);
      margin-bottom: 0.3rem;
      line-height: 1.3;
    }
    .prod-purity {
      font-size: 0.82rem;
      color: var(--text-light);
      margin-bottom: 0.75rem;
    }
    .prod-price {
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }
    .price-main {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--royal);
      font-family: 'Jost', sans-serif;
    }
    .price-strike {
      font-size: 0.9rem;
      color: var(--text-light);
      text-decoration: line-through;
    }
    .view-all-wrap {
      text-align: center;
      margin-top: 3rem;
    }

    /* ── Promise ──────────────────────────────── */
    .promise-section {
      background: var(--royal-dark);
      padding: 5rem 0;
    }
    .promise-inner {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
    }
    .promise-eyebrow {
      font-size: 0.75rem;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 1rem;
    }
    .promise-text h2 {
      color: var(--cream);
      font-size: 2.2rem;
      margin-bottom: 1.25rem;
    }
    .promise-text p {
      color: rgba(239,235,225,0.7);
      line-height: 1.8;
      margin-bottom: 0;
    }
    .promise-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }
    .stat {
      text-align: center;
      padding: 2rem 1rem;
      border: 1px solid rgba(202,178,115,0.25);
      border-radius: 4px;
    }
    .stat-num {
      display: block;
      font-family: 'Cormorant Garamond', serif;
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--gold);
      line-height: 1;
      margin-bottom: 0.5rem;
    }
    .stat-label {
      font-size: 0.75rem;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: rgba(239,235,225,0.6);
    }

    /* ── Responsive ───────────────────────────── */
    @media (max-width: 900px) {
      .promise-inner { grid-template-columns: 1fr; gap: 2.5rem; }
      .promise-stats { grid-template-columns: repeat(3, 1fr); }
      .trust-divider { display: none; }
      .trust-inner { gap: 1rem; }
      .trust-item { padding: 0.5rem 1rem; }
    }
    @media (max-width: 640px) {
      .hero { height: 85vh; }
      .hero-title { font-size: 3.2rem; }
      .hero-actions { flex-direction: column; align-items: center; }
      .products-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
      .promise-stats { grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
    }
    @media (max-width: 400px) {
      .products-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class LandingComponent implements OnInit {
  categories: Category[] = [];
  featuredProducts: Product[] = [];
  banners: Banner[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getCategories().subscribe({
      next: (d: any) => this.categories = Array.isArray(d) ? d : (d.results || []),
      error: (e) => console.error('Categories:', e)
    });
    this.productService.getFeaturedProducts().subscribe({
      next: (d: any) => this.featuredProducts = Array.isArray(d) ? d : (d.results || []),
      error: (e) => console.error('Featured:', e)
    });
    this.productService.getBanners().subscribe({
      next: (d: any) => this.banners = Array.isArray(d) ? d : (d.results || []),
      error: (e) => console.error('Banners:', e)
    });
  }
}

// Made with Bob
