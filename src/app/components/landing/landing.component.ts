import { Component, OnInit, OnDestroy } from '@angular/core';
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

      <!-- ── Hero Carousel ────────────────────── -->
      <section class="hero-carousel">
        <div class="carousel-track" [style.transform]="'translateX(-' + (activeSlide * 100) + '%)'">

          <!-- Slide 1 — Deep Royal Purple -->
          <div class="carousel-slide slide-1">
            <div class="slide-inner">
              <div class="slide-content">
                <p class="slide-eyebrow">Since 2024 · Handcrafted in India</p>
                <h1 class="slide-title">Where Silver<br><span class="accent">Meets Soul</span></h1>
                <p class="slide-sub">925 Sterling Silver jewellery crafted for the modern woman who carries tradition with grace.</p>
                <div class="slide-actions">
                  <a routerLink="/products" class="btn btn-gold btn-lg">Shop Now</a>
                  <a routerLink="/products" class="btn btn-ghost btn-lg">View All</a>
                </div>
              </div>
              <div class="slide-badge-wrap">
                <div class="slide-badge">
                  <span class="badge-num">925</span>
                  <span class="badge-lbl">Pure Silver</span>
                </div>
              </div>
            </div>
            <div class="slide-deco deco-circles">
              <div class="deco-c c1"></div>
              <div class="deco-c c2"></div>
              <div class="deco-c c3"></div>
            </div>
          </div>

          <!-- Slide 2 — Warm Gold Gradient -->
          <div class="carousel-slide slide-2">
            <div class="slide-inner">
              <div class="slide-content">
                <p class="slide-eyebrow">New Collection 2026</p>
                <h1 class="slide-title">Timeless<br><span class="accent-dark">Elegance</span></h1>
                <p class="slide-sub">Each piece tells a story — handforged by artisans who have mastered the art of silver for generations.</p>
                <div class="slide-actions">
                  <a routerLink="/products" class="btn btn-royal btn-lg">Explore</a>
                  <a routerLink="/products" class="btn btn-ghost-dark btn-lg">Our Story</a>
                </div>
              </div>
              <div class="slide-ornament">
                <svg viewBox="0 0 200 200" class="ornament-svg">
                  <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(85,23,86,0.15)" stroke-width="1"/>
                  <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(85,23,86,0.1)" stroke-width="1"/>
                  <circle cx="100" cy="100" r="40" fill="none" stroke="rgba(85,23,86,0.08)" stroke-width="1"/>
                  <path d="M100 20 L100 180 M20 100 L180 100 M44 44 L156 156 M156 44 L44 156"
                        stroke="rgba(85,23,86,0.08)" stroke-width="0.8"/>
                </svg>
              </div>
            </div>
            <div class="slide-deco deco-diamonds">
              <div class="deco-d d1"></div>
              <div class="deco-d d2"></div>
            </div>
          </div>

          <!-- Slide 3 — Deep Teal/Emerald -->
          <div class="carousel-slide slide-3">
            <div class="slide-inner">
              <div class="slide-content">
                <p class="slide-eyebrow">Festive Season Specials</p>
                <h1 class="slide-title">Crafted for<br><span class="accent-light">Every Occasion</span></h1>
                <p class="slide-sub">From bridal sets to everyday wear — discover the perfect silver piece for every moment that matters.</p>
                <div class="slide-actions">
                  <a routerLink="/products" class="btn btn-light btn-lg">Discover</a>
                  <a routerLink="/products" class="btn btn-ghost-light btn-lg">Gift Guide</a>
                </div>
              </div>
              <div class="slide-stats">
                <div class="hstat">
                  <span class="hstat-n">100+</span>
                  <span class="hstat-l">Designs</span>
                </div>
                <div class="hstat-div"></div>
                <div class="hstat">
                  <span class="hstat-n">500+</span>
                  <span class="hstat-l">Happy Customers</span>
                </div>
                <div class="hstat-div"></div>
                <div class="hstat">
                  <span class="hstat-n">925</span>
                  <span class="hstat-l">Silver Purity</span>
                </div>
              </div>
            </div>
            <div class="slide-deco deco-lines">
              <div class="deco-l l1"></div>
              <div class="deco-l l2"></div>
              <div class="deco-l l3"></div>
            </div>
          </div>

        </div>

        <!-- Dots -->
        <div class="carousel-dots">
          <button class="dot" [class.active]="activeSlide === 0" (click)="goTo(0)"></button>
          <button class="dot" [class.active]="activeSlide === 1" (click)="goTo(1)"></button>
          <button class="dot" [class.active]="activeSlide === 2" (click)="goTo(2)"></button>
        </div>

        <!-- Arrows -->
        <button class="carousel-arrow arrow-prev" (click)="prev()" aria-label="Previous">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <button class="carousel-arrow arrow-next" (click)="next()" aria-label="Next">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>

        <!-- Progress bar -->
        <div class="carousel-progress">
          <div class="progress-bar" [style.animation-duration]="autoDuration + 'ms'" [class.running]="autoRunning"></div>
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

    /* ══════════════════════════════════════════
       HERO CAROUSEL
    ══════════════════════════════════════════ */
    .hero-carousel {
      position: relative;
      height: 92vh;
      min-height: 580px;
      overflow: hidden;
    }
    .carousel-track {
      display: flex;
      height: 100%;
      transition: transform 0.75s cubic-bezier(0.77, 0, 0.175, 1);
      will-change: transform;
    }
    .carousel-slide {
      flex: 0 0 100%;
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      align-items: center;
      overflow: hidden;
    }

    /* Slide colour themes */
    .slide-1 {
      background: linear-gradient(135deg, #3a0e3b 0%, #551756 40%, #7a2278 70%, #3a0e3b 100%);
    }
    .slide-2 {
      background: linear-gradient(135deg, #b8860b 0%, #d4a017 35%, #e8c547 65%, #c9951a 100%);
    }
    .slide-3 {
      background: linear-gradient(135deg, #0d4f4f 0%, #0a7c7c 40%, #12a3a3 70%, #0d5f5f 100%);
    }

    /* Slide inner layout */
    .slide-inner {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 3rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 3rem;
    }
    .slide-content { max-width: 600px; }

    .slide-eyebrow {
      font-size: 0.75rem;
      letter-spacing: 3.5px;
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }
    .slide-1 .slide-eyebrow { color: #e8c547; }
    .slide-2 .slide-eyebrow { color: #551756; }
    .slide-3 .slide-eyebrow { color: #e8f8f8; }

    .slide-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(3rem, 7vw, 5.5rem);
      font-weight: 700;
      line-height: 1.05;
      letter-spacing: 2px;
      margin: 0 0 1.5rem;
    }
    .slide-1 .slide-title { color: #efebe1; }
    .slide-2 .slide-title { color: #3a0e3b; }
    .slide-3 .slide-title { color: #ffffff; }

    .accent       { color: #e8c547; display: block; }
    .accent-dark  { color: #551756; display: block; }
    .accent-light { color: #7fffd4; display: block; }

    .slide-sub {
      font-size: 1.05rem;
      line-height: 1.75;
      font-weight: 300;
      margin-bottom: 2.5rem;
      max-width: 480px;
    }
    .slide-1 .slide-sub { color: rgba(239,235,225,0.8); }
    .slide-2 .slide-sub { color: rgba(58,14,59,0.75); }
    .slide-3 .slide-sub { color: rgba(255,255,255,0.8); }

    .slide-actions { display: flex; gap: 1rem; flex-wrap: wrap; }

    /* Buttons */
    .btn-gold {
      background: #e8c547; color: #3a0e3b;
      font-weight: 700; letter-spacing: 1.5px; font-size: 0.88rem;
      text-transform: uppercase; border: none;
      padding: 0.9rem 2rem; cursor: pointer;
      text-decoration: none; display: inline-block;
      transition: all 0.3s; border-radius: 2px;
    }
    .btn-gold:hover { background: #f5d560; transform: translateY(-2px); }

    .btn-ghost {
      background: transparent; color: rgba(239,235,225,0.9);
      border: 2px solid rgba(239,235,225,0.4);
      font-weight: 600; letter-spacing: 1.5px; font-size: 0.88rem;
      text-transform: uppercase; padding: 0.9rem 2rem;
      cursor: pointer; text-decoration: none; display: inline-block;
      transition: all 0.3s; border-radius: 2px;
    }
    .btn-ghost:hover { border-color: #e8c547; color: #e8c547; }

    .btn-royal {
      background: #551756; color: #efebe1;
      font-weight: 700; letter-spacing: 1.5px; font-size: 0.88rem;
      text-transform: uppercase; border: none;
      padding: 0.9rem 2rem; cursor: pointer;
      text-decoration: none; display: inline-block;
      transition: all 0.3s; border-radius: 2px;
    }
    .btn-royal:hover { background: #3a0e3b; transform: translateY(-2px); }

    .btn-ghost-dark {
      background: transparent; color: #551756;
      border: 2px solid rgba(85,23,86,0.4);
      font-weight: 600; letter-spacing: 1.5px; font-size: 0.88rem;
      text-transform: uppercase; padding: 0.9rem 2rem;
      cursor: pointer; text-decoration: none; display: inline-block;
      transition: all 0.3s; border-radius: 2px;
    }
    .btn-ghost-dark:hover { border-color: #551756; background: rgba(85,23,86,0.08); }

    .btn-light {
      background: #ffffff; color: #0d4f4f;
      font-weight: 700; letter-spacing: 1.5px; font-size: 0.88rem;
      text-transform: uppercase; border: none;
      padding: 0.9rem 2rem; cursor: pointer;
      text-decoration: none; display: inline-block;
      transition: all 0.3s; border-radius: 2px;
    }
    .btn-light:hover { background: #e0fafa; transform: translateY(-2px); }

    .btn-ghost-light {
      background: transparent; color: rgba(255,255,255,0.9);
      border: 2px solid rgba(255,255,255,0.4);
      font-weight: 600; letter-spacing: 1.5px; font-size: 0.88rem;
      text-transform: uppercase; padding: 0.9rem 2rem;
      cursor: pointer; text-decoration: none; display: inline-block;
      transition: all 0.3s; border-radius: 2px;
    }
    .btn-ghost-light:hover { border-color: #7fffd4; color: #7fffd4; }

    /* Slide 1 — badge */
    .slide-badge-wrap { flex-shrink: 0; }
    .slide-badge {
      width: 160px; height: 160px;
      border-radius: 50%;
      border: 2px solid rgba(232,197,71,0.5);
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      background: rgba(255,255,255,0.06);
      backdrop-filter: blur(8px);
    }
    .badge-num {
      font-family: 'Cormorant Garamond', serif;
      font-size: 3rem; font-weight: 700;
      color: #e8c547; line-height: 1;
    }
    .badge-lbl {
      font-size: 0.72rem; letter-spacing: 2.5px;
      text-transform: uppercase; color: rgba(239,235,225,0.7);
      margin-top: 0.4rem;
    }

    /* Slide 2 — ornament */
    .slide-ornament { flex-shrink: 0; width: 220px; height: 220px; }
    .ornament-svg { width: 100%; height: 100%; }

    /* Slide 3 — stats row */
    .slide-stats {
      display: flex; align-items: center; gap: 0;
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 8px; padding: 1.5rem 2rem;
      flex-shrink: 0;
    }
    .hstat { text-align: center; padding: 0 2rem; }
    .hstat-n {
      display: block;
      font-family: 'Cormorant Garamond', serif;
      font-size: 2.5rem; font-weight: 700;
      color: #7fffd4; line-height: 1;
    }
    .hstat-l {
      font-size: 0.72rem; letter-spacing: 1.5px;
      text-transform: uppercase; color: rgba(255,255,255,0.7);
      margin-top: 0.4rem; display: block;
    }
    .hstat-div { width: 1px; height: 50px; background: rgba(255,255,255,0.2); }

    /* Decorative shapes */
    .slide-deco { position: absolute; inset: 0; z-index: 1; pointer-events: none; }

    /* Circles for slide 1 */
    .deco-c {
      position: absolute; border-radius: 50%;
      border: 1px solid rgba(232,197,71,0.12);
    }
    .c1 { width: 500px; height: 500px; right: -150px; top: -100px; }
    .c2 { width: 320px; height: 320px; right: -20px; bottom: -80px; border-color: rgba(232,197,71,0.08); }
    .c3 { width: 180px; height: 180px; right: 200px; top: 60px; border-color: rgba(232,197,71,0.15); }

    /* Diamonds for slide 2 */
    .deco-d {
      position: absolute;
      transform: rotate(45deg);
      border: 1px solid rgba(85,23,86,0.1);
    }
    .d1 { width: 350px; height: 350px; right: -80px; top: -80px; }
    .d2 { width: 200px; height: 200px; left: -60px; bottom: -60px; border-color: rgba(85,23,86,0.07); }

    /* Lines for slide 3 */
    .deco-l {
      position: absolute;
      background: rgba(255,255,255,0.05);
      transform: rotate(-30deg);
    }
    .l1 { width: 3px; height: 100vh; right: 25%; top: -50%; }
    .l2 { width: 2px; height: 100vh; right: 35%; top: -50%; }
    .l3 { width: 1px; height: 100vh; right: 20%; top: -50%; }

    /* Navigation dots */
    .carousel-dots {
      position: absolute; bottom: 1.75rem; left: 50%;
      transform: translateX(-50%);
      display: flex; gap: 0.6rem; z-index: 10;
    }
    .dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: rgba(255,255,255,0.35);
      border: none; cursor: pointer; padding: 0;
      transition: all 0.3s;
    }
    .dot.active { background: #e8c547; width: 28px; border-radius: 4px; }

    /* Arrows */
    .carousel-arrow {
      position: absolute; top: 50%; transform: translateY(-50%);
      width: 44px; height: 44px; border-radius: 50%;
      background: rgba(255,255,255,0.15);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.2);
      color: #fff; cursor: pointer; z-index: 10;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.3s;
    }
    .carousel-arrow:hover { background: rgba(232,197,71,0.3); border-color: #e8c547; }
    .arrow-prev { left: 1.5rem; }
    .arrow-next { right: 1.5rem; }

    /* Progress bar */
    .carousel-progress {
      position: absolute; bottom: 0; left: 0; right: 0;
      height: 3px; background: rgba(255,255,255,0.1); z-index: 10;
    }
    .progress-bar {
      height: 100%; background: #e8c547;
      width: 0; transform-origin: left;
    }
    .progress-bar.running {
      animation: progressFill linear forwards;
    }
    @keyframes progressFill {
      from { width: 0; }
      to   { width: 100%; }
    }

    /* ── Banners ─────────────────────────────── */
    .banners {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: 0;
    }
    .banner-card { position: relative; overflow: hidden; }
    .banner-img {
      width: 100%; height: 380px;
      object-fit: cover; display: block;
      transition: transform 0.5s ease;
    }
    .banner-card:hover .banner-img { transform: scale(1.04); }
    .banner-info {
      position: absolute; bottom: 0; left: 0; right: 0;
      background: linear-gradient(transparent, rgba(58,14,59,0.9));
      padding: 2rem 1.75rem 1.5rem; color: var(--cream);
    }
    .banner-info h3 { color: var(--cream); font-size: 1.4rem; margin-bottom: 0.35rem; }
    .banner-info p  { font-size: 0.9rem; opacity: 0.85; margin: 0 0 0.75rem; }

    /* ── Trust Bar ────────────────────────────── */
    .trust-bar { background: var(--royal); padding: 1.35rem 0; }
    .trust-inner {
      display: flex; align-items: center;
      justify-content: center; gap: 0; flex-wrap: wrap;
    }
    .trust-item {
      display: flex; align-items: center;
      gap: 0.6rem; padding: 0.6rem 2rem;
      color: var(--gold-light);
    }
    .trust-item svg { flex-shrink: 0; }
    .trust-item span {
      font-size: 0.82rem; font-weight: 600;
      letter-spacing: 1px; text-transform: uppercase;
      color: var(--gold-light);
    }
    .trust-divider { width: 1px; height: 28px; background: rgba(202,178,115,0.3); }

    /* ── Section Head ─────────────────────────── */
    .section-head { text-align: center; margin-bottom: 2.5rem; }
    .section-head h2 { font-size: 2.2rem; color: var(--royal); letter-spacing: 1px; }
    .section-sub {
      margin-top: 0.75rem; color: var(--text-light);
      font-size: 0.95rem; letter-spacing: 0.5px;
    }

    /* ── Categories ───────────────────────────── */
    .categories-section { padding: 4rem 0; background: var(--cream); }
    .category-scroll-wrap {
      overflow-x: auto; padding: 0.5rem 2rem 1.5rem;
      scrollbar-width: thin; scrollbar-color: var(--gold) transparent;
    }
    .category-track { display: flex; gap: 2rem; width: max-content; padding: 0.5rem 0; }
    .category-tile {
      width: 140px; text-align: center;
      cursor: pointer; transition: transform 0.3s ease; flex-shrink: 0;
    }
    .category-tile:hover { transform: translateY(-8px); }
    .cat-img-ring {
      width: 130px; height: 130px; border-radius: 50%;
      overflow: hidden; margin: 0 auto 0.85rem;
      border: 3px solid var(--gold); background: var(--white);
      transition: border-color 0.3s, box-shadow 0.3s;
    }
    .category-tile:hover .cat-img-ring {
      border-color: var(--royal);
      box-shadow: 0 8px 24px rgba(85,23,86,0.2);
    }
    .cat-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s ease; }
    .category-tile:hover .cat-img { transform: scale(1.1); }
    .cat-name {
      font-size: 0.8rem; font-weight: 600;
      color: var(--royal); letter-spacing: 1px; text-transform: uppercase;
    }

    /* ── Featured Products ────────────────────── */
    .featured-section { padding: 4rem 0 3rem; background: var(--white); }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 2rem; max-width: 1400px; margin: 0 auto;
    }
    .product-card {
      background: var(--white); border: 1px solid var(--cream-dark);
      border-radius: 4px; overflow: hidden;
      transition: box-shadow 0.35s, border-color 0.35s, transform 0.35s;
      cursor: pointer;
    }
    .product-card:hover {
      box-shadow: 0 16px 40px rgba(85,23,86,0.12);
      border-color: var(--gold); transform: translateY(-6px);
    }
    .product-img-wrap {
      position: relative; height: 290px;
      overflow: hidden; background: var(--cream);
    }
    .product-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.45s ease; }
    .product-card:hover .product-img { transform: scale(1.07); }
    .off-badge {
      position: absolute; top: 12px; left: 12px;
      background: var(--royal); color: var(--gold-light);
      font-size: 0.72rem; font-weight: 700;
      padding: 0.3rem 0.65rem; border-radius: 2px;
      letter-spacing: 0.5px; text-transform: uppercase;
    }
    .hover-overlay {
      position: absolute; inset: 0;
      background: rgba(58,14,59,0.35);
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: opacity 0.3s ease;
    }
    .product-card:hover .hover-overlay { opacity: 1; }
    .quick-view {
      background: var(--gold); color: var(--royal-dark);
      padding: 0.65rem 1.5rem; font-size: 0.8rem;
      font-weight: 700; letter-spacing: 1.5px;
      text-transform: uppercase; border-radius: 2px;
    }
    .product-body { padding: 1.1rem 1.25rem 1.4rem; }
    .prod-category {
      font-size: 0.72rem; letter-spacing: 1.5px;
      text-transform: uppercase; color: var(--text-light); margin-bottom: 0.35rem;
    }
    .prod-title {
      font-family: 'Cormorant Garamond', serif; font-size: 1.2rem;
      color: var(--royal); margin-bottom: 0.3rem; line-height: 1.3;
    }
    .prod-purity { font-size: 0.82rem; color: var(--text-light); margin-bottom: 0.75rem; }
    .prod-price  { display: flex; align-items: center; gap: 0.65rem; }
    .price-main  { font-size: 1.25rem; font-weight: 700; color: var(--royal); font-family: 'Jost', sans-serif; }
    .price-strike { font-size: 0.9rem; color: var(--text-light); text-decoration: line-through; }
    .view-all-wrap { text-align: center; margin-top: 3rem; }

    /* ── Promise ──────────────────────────────── */
    .promise-section { background: var(--royal-dark); padding: 5rem 0; }
    .promise-inner {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 4rem; align-items: center;
    }
    .promise-eyebrow {
      font-size: 0.75rem; letter-spacing: 3px;
      text-transform: uppercase; color: var(--gold); margin-bottom: 1rem;
    }
    .promise-text h2 { color: var(--cream); font-size: 2.2rem; margin-bottom: 1.25rem; }
    .promise-text p  { color: rgba(239,235,225,0.7); line-height: 1.8; margin-bottom: 0; }
    .promise-stats   { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
    .stat {
      text-align: center; padding: 2rem 1rem;
      border: 1px solid rgba(202,178,115,0.25); border-radius: 4px;
    }
    .stat-num {
      display: block; font-family: 'Cormorant Garamond', serif;
      font-size: 2.5rem; font-weight: 700; color: var(--gold); line-height: 1; margin-bottom: 0.5rem;
    }
    .stat-label {
      font-size: 0.75rem; letter-spacing: 1.5px;
      text-transform: uppercase; color: rgba(239,235,225,0.6);
    }

    /* ── Responsive ───────────────────────────── */
    @media (max-width: 900px) {
      .slide-inner { padding: 0 2rem; }
      .slide-badge-wrap, .slide-ornament, .slide-stats { display: none; }
      .promise-inner { grid-template-columns: 1fr; gap: 2.5rem; }
      .trust-divider { display: none; }
      .trust-inner   { gap: 1rem; }
      .trust-item    { padding: 0.5rem 1rem; }
    }
    @media (max-width: 640px) {
      .hero-carousel { height: 88vh; min-height: 520px; }
      .slide-title   { font-size: clamp(2.4rem, 10vw, 3.5rem); }
      .slide-actions { flex-direction: column; align-items: flex-start; }
      .carousel-arrow { display: none; }
      .products-grid  { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
      .promise-stats  { grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
    }
    @media (max-width: 400px) {
      .products-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class LandingComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  featuredProducts: Product[] = [];
  banners: Banner[] = [];

  activeSlide = 0;
  readonly totalSlides = 3;
  readonly autoDuration = 5000;
  autoRunning = false;
  private autoTimer: any;

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
    this.startAuto();
  }

  ngOnDestroy(): void {
    this.stopAuto();
  }

  goTo(index: number): void {
    this.activeSlide = index;
    this.restartAuto();
  }

  next(): void {
    this.activeSlide = (this.activeSlide + 1) % this.totalSlides;
    this.restartAuto();
  }

  prev(): void {
    this.activeSlide = (this.activeSlide - 1 + this.totalSlides) % this.totalSlides;
    this.restartAuto();
  }

  private startAuto(): void {
    this.autoRunning = false;
    setTimeout(() => { this.autoRunning = true; }, 50);
    this.autoTimer = setInterval(() => {
      this.activeSlide = (this.activeSlide + 1) % this.totalSlides;
      this.autoRunning = false;
      setTimeout(() => { this.autoRunning = true; }, 50);
    }, this.autoDuration);
  }

  private stopAuto(): void {
    clearInterval(this.autoTimer);
    this.autoRunning = false;
  }

  private restartAuto(): void {
    this.stopAuto();
    this.startAuto();
  }
}
