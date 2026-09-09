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

    <!-- ══ NOTIFICATION BAR ══════════════════════════════════════ -->
    <div class="notif-bar" *ngIf="notifVisible">
      <div class="notif-inner">
        <span class="notif-icon">✦</span>
        <span class="notif-text">Free shipping on orders above ₹999 &nbsp;·&nbsp; 30-Day easy returns &nbsp;·&nbsp; 925 Hallmarked Silver — Certified &amp; Authentic &nbsp;·&nbsp; Handcrafted in India</span>
        <span class="notif-icon">✦</span>
      </div>
      <button class="notif-close" (click)="notifVisible=false" aria-label="Close">✕</button>
    </div>

    <div class="landing">

      <!-- ══ 1. LEADSPACE ══════════════════════════════════════════ -->
      <section class="leadspace">
        <!-- LEFT: text content -->
        <div class="ls-text">
          <p class="ls-eyebrow">New Collection · 2026</p>
          <h1 class="ls-title">Vanki<br>Rings</h1>
          <div class="ls-rule"></div>
          <p class="ls-desc">Traditional South Indian finger rings, handcrafted in 925 sterling silver.</p>
          <p class="ls-desc">Worn with mehndi or bridal wear — a timeless symbol of grace.</p>
          <div class="ls-offer">
            <span class="ls-offer-pct">20% OFF</span>
            <span class="ls-offer-label">on all Vanki Rings · Limited Time</span>
          </div>
          <a routerLink="/products" class="ls-shop-btn">Shop Now</a>
        </div>
        <!-- RIGHT: image -->
        <div class="ls-img-wrap">
          <img src="assets/images/vanki-ring.webp" alt="Vanki Rings" class="ls-photo">
        </div>
      </section>

      <!-- ══ 2. CATEGORIES ═════════════════════════════════════════ -->
      <section class="cat-section">
        <div class="container">
          <div class="sec-head">
            <h2>Shop by Category</h2>
            <div class="sec-line"></div>
            <p class="sec-sub">Discover our handcrafted silver collections</p>
          </div>
          <div class="cat-grid">
            <div class="cat-card" *ngFor="let cat of categories"
                 [routerLink]="['/products']" [queryParams]="{category: cat.id}">
              <div class="cat-img-wrap">
                <img *ngIf="cat.image" [src]="cat.image" [alt]="cat.display_name" class="cat-img">
                <div *ngIf="!cat.image" class="cat-img-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" width="32" height="32">
                    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                </div>
                <div class="cat-overlay">
                  <span>Shop Now →</span>
                </div>
              </div>
              <div class="cat-info">
                <p class="cat-name">{{ cat.display_name }}</p>
                <p class="cat-count">{{ cat.products_count }} designs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ══ 3. ABOUT US ════════════════════════════════════════════ -->
      <section class="about-section">
        <div class="container about-inner">
          <div class="about-img-col">
            <div class="about-img-frame">
              <div class="about-img-bg"></div>
              <div class="about-badge">
                <span class="about-badge-num">925</span>
                <span class="about-badge-lbl">Hallmarked<br>Silver</span>
              </div>
            </div>
          </div>
          <div class="about-text-col">
            <p class="about-eyebrow">Our Story</p>
            <h2 class="about-title">Crafted with Passion,<br>Worn with Pride</h2>
            <p class="about-desc">Founded in 2024, Kasavelli was born from a love for traditional Indian jewellery-making. Every piece is handcrafted by skilled artisans using 925 hallmarked sterling silver — hypoallergenic, durable, and timeless.</p>
            <p class="about-desc">We blend centuries-old craftsmanship with modern design sensibilities to create jewellery that tells a story. From bridal sets to everyday wear, each Kasavelli piece is a work of art.</p>
            <div class="about-stats">
              <div class="astat">
                <span class="astat-n">100+</span>
                <span class="astat-l">Unique Designs</span>
              </div>
              <div class="astat-div"></div>
              <div class="astat">
                <span class="astat-n">500+</span>
                <span class="astat-l">Happy Customers</span>
              </div>
              <div class="astat-div"></div>
              <div class="astat">
                <span class="astat-n">925</span>
                <span class="astat-l">Silver Purity</span>
              </div>
            </div>
            <a routerLink="/products" class="about-btn">View Collection</a>
          </div>
        </div>
      </section>

      <!-- ══ 4. WHAT WE OFFER ══════════════════════════════════════ -->
      <section class="offers-section">
        <div class="container">
          <div class="sec-head">
            <h2>Why Choose Kasavelli</h2>
            <div class="sec-line"></div>
            <p class="sec-sub">Every piece is a promise of quality and craftsmanship</p>
          </div>
          <div class="offers-grid">
            <div class="offer-card">
              <div class="offer-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="28" height="28">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3>925 Certified Silver</h3>
              <p>Every piece is hallmarked 925 sterling silver — certified pure, hypoallergenic, and safe for all skin types.</p>
            </div>
            <div class="offer-card">
              <div class="offer-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="28" height="28">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <h3>Handpicked Designs</h3>
              <p>Each design is curated by our artisans — blending traditional Indian motifs with contemporary aesthetics.</p>
            </div>
            <div class="offer-card">
              <div class="offer-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="28" height="28">
                  <rect x="1" y="3" width="15" height="13" rx="1"/>
                  <path d="M16 8h4l3 5v3h-7V8zM5.5 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm13 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
                </svg>
              </div>
              <h3>Fast & Safe Delivery</h3>
              <p>Free shipping above ₹999. Secure packaging ensures your jewellery arrives safely across India in 5–7 days.</p>
            </div>
            <div class="offer-card">
              <div class="offer-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="28" height="28">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  <polyline points="17 6 23 6 23 12"/>
                </svg>
              </div>
              <h3>30-Day Returns</h3>
              <p>Not happy? Return within 30 days — no questions asked. Your satisfaction is our highest priority.</p>
            </div>
            <div class="offer-card">
              <div class="offer-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="28" height="28">
                  <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
              </div>
              <h3>Perfect for Gifting</h3>
              <p>Every order comes gift-ready with elegant packaging — ideal for birthdays, anniversaries, and festivities.</p>
            </div>
            <div class="offer-card">
              <div class="offer-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="28" height="28">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <h3>Made in India</h3>
              <p>Proudly handcrafted by Indian artisans — supporting traditional craft while delivering world-class quality.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ══ 5. NEW ARRIVALS ════════════════════════════════════════ -->
      <section class="arrivals-section">
        <div class="container">
          <div class="sec-head">
            <h2>New Arrivals</h2>
            <div class="sec-line"></div>
            <p class="sec-sub">Fresh designs just added to our collection</p>
          </div>

          <div class="arrivals-grid" *ngIf="newArrivals.length > 0">
            <div class="arrival-card" *ngFor="let p of newArrivals" [routerLink]="['/products', p.id]">
              <div class="arrival-img-wrap">
                <img *ngIf="p.image" [src]="p.image" [alt]="p.name" class="arrival-img">
                <div *ngIf="!p.image" class="arrival-img-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" width="36" height="36">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
                <div class="arrival-badges">
                  <span class="new-badge">New</span>
                  <span class="off-badge" *ngIf="p.discount_percentage > 0">{{ p.discount_percentage }}% OFF</span>
                </div>
                <div class="arrival-hover">
                  <span>Quick View</span>
                </div>
              </div>
              <div class="arrival-body">
                <p class="arrival-cat">{{ p.category_name }}</p>
                <h3 class="arrival-name">{{ p.title }}</h3>
                <div class="arrival-price">
                  <span class="price-strike" *ngIf="p.discounted_price">₹{{ p.price }}</span>
                  <span class="price-main">₹{{ p.final_price }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="no-arrivals" *ngIf="newArrivals.length === 0">
            <p>New designs coming soon — check back shortly!</p>
          </div>

          <div class="arrivals-cta">
            <a routerLink="/products" class="sec-btn">View All Collections</a>
          </div>
        </div>
      </section>

    </div>
  `,
  styles: [`
    /* ══ CSS VARIABLES (fallback if global not set) ══ */
    :host {
      --royal: #551756;
      --royal-dark: #3a0e3b;
      --gold: #c9a84c;
      --gold-light: #e8c547;
      --cream: #f9f5ef;
      --white: #ffffff;
      --text: #1a1a2e;
      --text-light: #6b6b7b;
    }

    /* ══ NOTIFICATION BAR ══ */
    .notif-bar {
      background: var(--royal-dark);
      display: flex; align-items: center;
      justify-content: center;
      padding: 0.6rem 3rem 0.6rem 1rem;
      position: relative; overflow: hidden;
    }
    .notif-inner {
      display: flex; align-items: center; gap: 0.75rem;
      white-space: nowrap; overflow: hidden;
      animation: marquee 28s linear infinite;
    }
    @keyframes marquee {
      0%   { transform: translateX(30%); }
      100% { transform: translateX(-100%); }
    }
    .notif-text { font-size: 0.78rem; letter-spacing: 1px; color: #e8c547; font-weight: 500; }
    .notif-icon { color: #e8c547; font-size: 0.65rem; flex-shrink: 0; }
    .notif-close {
      position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%);
      background: rgba(255,255,255,0.1); border: none; border-radius: 50%;
      width: 22px; height: 22px; font-size: 0.7rem;
      color: rgba(232,197,71,0.8); cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.2s; flex-shrink: 0;
    }
    .notif-close:hover { background: rgba(255,255,255,0.2); color: #e8c547; }

    /* ══ SHARED ══ */
    .landing { background: #fff; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
    .sec-head { text-align: center; margin-bottom: 3rem; }
    .sec-head h2 {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(1.8rem, 3.5vw, 2.4rem);
      color: var(--royal-dark); font-weight: 700; letter-spacing: 0.5px;
    }
    .sec-line {
      width: 48px; height: 3px;
      background: linear-gradient(90deg, var(--gold), var(--gold-light));
      margin: 0.75rem auto 0.75rem; border-radius: 2px;
    }
    .sec-sub { color: var(--text-light); font-size: 0.95rem; }

    /* ══ 1. LEADSPACE ══ */
    .leadspace {
      display: grid;
      grid-template-columns: 1fr 1fr;
      min-height: 460px;
      max-height: 580px;
      background: #faf7f2;
      overflow: hidden;
    }

    /* LEFT — text panel */
    .ls-text {
      display: flex; flex-direction: column; justify-content: center;
      padding: 3.5rem 3.5rem 3.5rem 4rem;
      background: #faf7f2;
    }
    .ls-eyebrow {
      font-size: 0.68rem; letter-spacing: 3.5px; text-transform: uppercase;
      color: var(--gold); font-weight: 700; margin: 0 0 1rem;
    }
    .ls-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(3rem, 5.5vw, 5rem);
      font-weight: 700; color: var(--royal-dark);
      line-height: 1.0; letter-spacing: 1px;
      margin: 0 0 1.1rem;
    }
    .ls-rule {
      width: 48px; height: 3px;
      background: var(--gold); margin-bottom: 1.1rem;
      border-radius: 2px;
    }
    .ls-desc {
      font-size: 0.88rem; color: #5a4e3c;
      line-height: 1.7; margin: 0 0 0.35rem;
      max-width: 340px;
    }
    .ls-offer {
      display: flex; align-items: baseline; gap: 0.6rem;
      margin: 1.4rem 0 1.6rem;
    }
    .ls-offer-pct {
      font-family: 'Cormorant Garamond', serif;
      font-size: 2.2rem; font-weight: 800;
      color: var(--royal-dark); line-height: 1;
    }
    .ls-offer-label {
      font-size: 0.73rem; color: #7a6e5e;
      letter-spacing: 0.5px; line-height: 1.4;
      max-width: 140px;
    }
    .ls-shop-btn {
      display: inline-block; align-self: flex-start;
      background: var(--royal-dark); color: #efebe1;
      font-size: 0.75rem; font-weight: 800; letter-spacing: 2.5px;
      text-transform: uppercase; padding: 0.8rem 2.2rem;
      border-radius: 2px; text-decoration: none;
      border: 2px solid var(--royal-dark);
      transition: background 0.25s, color 0.25s;
    }
    .ls-shop-btn:hover { background: transparent; color: var(--royal-dark); }

    /* RIGHT — image panel */
    .ls-img-wrap {
      overflow: hidden; position: relative;
    }
    .ls-photo {
      width: 100%; height: 100%;
      object-fit: cover; object-position: center 20%;
      display: block;
    }

    /* ══ 2. CATEGORIES ══ */
    .cat-section { padding: 5rem 0; background: #faf8f5; }
    .cat-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1.5rem;
    }
    .cat-card {
      border-radius: 12px; overflow: hidden;
      background: #fff; cursor: pointer;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
      transition: transform 0.3s, box-shadow 0.3s;
      text-decoration: none;
    }
    .cat-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 32px rgba(85,23,86,0.14);
    }
    .cat-img-wrap {
      position: relative; height: 180px; overflow: hidden;
      background: #f0e8f0;
    }
    .cat-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
    .cat-card:hover .cat-img { transform: scale(1.08); }
    .cat-img-placeholder {
      width: 100%; height: 100%;
      display: flex; align-items: center; justify-content: center;
      color: rgba(85,23,86,0.3);
    }
    .cat-overlay {
      position: absolute; inset: 0;
      background: rgba(58,14,59,0.45);
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: opacity 0.3s;
    }
    .cat-overlay span {
      color: var(--gold-light); font-size: 0.85rem;
      font-weight: 600; letter-spacing: 1px;
    }
    .cat-card:hover .cat-overlay { opacity: 1; }
    .cat-info { padding: 0.9rem 1rem; }
    .cat-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.05rem; font-weight: 700;
      color: var(--royal-dark); margin: 0 0 0.2rem;
    }
    .cat-count { font-size: 0.78rem; color: var(--text-light); margin: 0; }

    /* ══ 3. ABOUT US ══ */
    .about-section { padding: 5.5rem 0; background: #fff; }
    .about-inner {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 5rem; align-items: center;
    }
    .about-img-col { position: relative; }
    .about-img-frame {
      position: relative;
      width: 100%; padding-bottom: 110%;
      border-radius: 16px; overflow: hidden;
    }
    .about-img-bg {
      position: absolute; inset: 0;
      background: linear-gradient(145deg, #7a2278 0%, #3a0e3b 50%, #c9951a 100%);
    }
    /* Decorative offset box behind image */
    .about-img-frame::before {
      content: '';
      position: absolute; top: -16px; left: -16px; right: 16px; bottom: 16px;
      border: 2px solid rgba(201,148,26,0.35);
      border-radius: 16px; z-index: 0;
    }
    .about-badge {
      position: absolute; bottom: 1.5rem; right: -1rem;
      background: #fff; border-radius: 12px;
      padding: 0.75rem 1.25rem;
      box-shadow: 0 8px 28px rgba(0,0,0,0.12);
      display: flex; align-items: center; gap: 0.75rem; z-index: 2;
      border: 1px solid rgba(201,148,26,0.2);
    }
    .about-badge-num {
      font-family: 'Cormorant Garamond', serif;
      font-size: 2rem; font-weight: 700; color: var(--royal-dark); line-height: 1;
    }
    .about-badge-lbl { font-size: 0.72rem; color: var(--text-light); line-height: 1.4; }

    .about-text-col { padding-right: 1rem; }
    .about-eyebrow {
      font-size: 0.72rem; letter-spacing: 3px; text-transform: uppercase;
      color: var(--gold); font-weight: 600; margin-bottom: 1rem;
    }
    .about-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(1.8rem, 3vw, 2.6rem);
      font-weight: 700; color: var(--royal-dark); line-height: 1.2;
      margin-bottom: 1.5rem;
    }
    .about-desc {
      font-size: 0.95rem; color: var(--text-light);
      line-height: 1.85; margin-bottom: 1rem;
    }
    .about-stats {
      display: flex; align-items: center; gap: 0;
      margin: 2rem 0;
      background: #faf8f5; border-radius: 10px; padding: 1.25rem 1.5rem;
    }
    .astat { text-align: center; padding: 0 1.5rem; flex: 1; }
    .astat-n {
      display: block;
      font-family: 'Cormorant Garamond', serif;
      font-size: 2rem; font-weight: 700; color: var(--royal-dark); line-height: 1;
    }
    .astat-l { font-size: 0.72rem; color: var(--text-light); margin-top: 0.25rem; display: block; }
    .astat-div { width: 1px; height: 36px; background: #e0d8e0; flex-shrink: 0; }
    .about-btn {
      display: inline-block;
      background: var(--royal-dark); color: #efebe1;
      font-weight: 600; font-size: 0.88rem; letter-spacing: 1.5px;
      text-transform: uppercase; padding: 0.85rem 2rem;
      border-radius: 3px; text-decoration: none;
      transition: background 0.3s;
    }
    .about-btn:hover { background: var(--royal); }

    /* ══ 4. WHAT WE OFFER ══ */
    .offers-section { padding: 5rem 0; background: #faf8f5; }
    .offers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .offer-card {
      background: #fff; border-radius: 12px;
      padding: 2rem 1.75rem;
      border: 1px solid #f0eaee;
      transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
    }
    .offer-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 30px rgba(85,23,86,0.1);
      border-color: rgba(201,148,26,0.3);
    }
    .offer-icon {
      width: 52px; height: 52px; border-radius: 12px;
      background: linear-gradient(135deg, rgba(85,23,86,0.08), rgba(85,23,86,0.04));
      display: flex; align-items: center; justify-content: center;
      color: var(--royal-dark); margin-bottom: 1.25rem;
    }
    .offer-card h3 {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.2rem; font-weight: 700;
      color: var(--royal-dark); margin-bottom: 0.6rem;
    }
    .offer-card p { font-size: 0.88rem; color: var(--text-light); line-height: 1.7; margin: 0; }

    /* ══ 5. NEW ARRIVALS ══ */
    .arrivals-section { padding: 5rem 0; background: #fff; }
    .arrivals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 1.5rem; margin-bottom: 3rem;
    }
    .arrival-card {
      background: #fff; border-radius: 10px; overflow: hidden;
      border: 1px solid #f0eaee; cursor: pointer;
      transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
      text-decoration: none; color: inherit; display: block;
    }
    .arrival-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 32px rgba(85,23,86,0.12);
      border-color: var(--gold);
    }
    .arrival-img-wrap {
      position: relative; height: 260px; overflow: hidden;
      background: #f5f0f5;
    }
    .arrival-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
    .arrival-card:hover .arrival-img { transform: scale(1.06); }
    .arrival-img-placeholder {
      width: 100%; height: 100%;
      display: flex; align-items: center; justify-content: center;
      color: rgba(85,23,86,0.2);
    }
    .arrival-badges {
      position: absolute; top: 10px; left: 10px;
      display: flex; flex-direction: column; gap: 5px;
    }
    .new-badge {
      background: var(--royal-dark); color: var(--gold-light);
      font-size: 0.68rem; font-weight: 700; letter-spacing: 1px;
      padding: 3px 9px; border-radius: 2px; text-transform: uppercase;
    }
    .off-badge {
      background: #e63946; color: #fff;
      font-size: 0.68rem; font-weight: 700;
      padding: 3px 9px; border-radius: 2px; text-transform: uppercase;
    }
    .arrival-hover {
      position: absolute; inset: 0;
      background: rgba(58,14,59,0.35);
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: opacity 0.3s;
    }
    .arrival-hover span {
      background: var(--gold-light); color: var(--royal-dark);
      font-size: 0.78rem; font-weight: 700; letter-spacing: 1.5px;
      text-transform: uppercase; padding: 0.6rem 1.4rem; border-radius: 2px;
    }
    .arrival-card:hover .arrival-hover { opacity: 1; }
    .arrival-body { padding: 1rem 1.1rem 1.25rem; }
    .arrival-cat {
      font-size: 0.7rem; letter-spacing: 1.5px; text-transform: uppercase;
      color: var(--text-light); margin: 0 0 0.3rem;
    }
    .arrival-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.1rem; font-weight: 700;
      color: var(--royal-dark); margin: 0 0 0.6rem; line-height: 1.3;
    }
    .arrival-price { display: flex; align-items: center; gap: 0.5rem; }
    .price-main { font-size: 1.15rem; font-weight: 700; color: var(--royal-dark); }
    .price-strike { font-size: 0.85rem; color: var(--text-light); text-decoration: line-through; }
    .no-arrivals { text-align: center; padding: 3rem; color: var(--text-light); font-size: 0.95rem; }
    .arrivals-cta { text-align: center; }
    .sec-btn {
      display: inline-block;
      border: 2px solid var(--royal-dark); color: var(--royal-dark);
      font-weight: 700; font-size: 0.88rem; letter-spacing: 1.5px;
      text-transform: uppercase; padding: 0.85rem 2.25rem;
      border-radius: 3px; text-decoration: none;
      transition: all 0.3s;
    }
    .sec-btn:hover { background: var(--royal-dark); color: #efebe1; }

    /* ══ RESPONSIVE ══ */
    @media (max-width: 900px) {
      .ls-main { grid-template-columns: 200px 1fr 180px; }
      .about-inner { grid-template-columns: 1fr; gap: 3rem; }
      .about-img-col { max-width: 420px; margin: 0 auto; width: 100%; }
      .about-text-col { padding-right: 0; }
      .about-img-frame::before { display: none; }
      .about-badge { right: 0; }
    }

    /* Mobile leadspace — stack: image on top, text below */
    @media (max-width: 640px) {
      .leadspace {
        grid-template-columns: 1fr;
        grid-template-rows: 52vw auto;
        min-height: auto; max-height: none;
      }
      .ls-img-wrap { grid-row: 1; height: 52vw; }
      .ls-text {
        grid-row: 2;
        padding: 1.75rem 1.25rem 2rem;
        align-items: center; text-align: center;
      }
      .ls-rule { margin-left: auto; margin-right: auto; }
      .ls-desc { max-width: 100%; }
      .ls-offer { justify-content: center; }
      .ls-shop-btn { align-self: center; }
    }

    @media (max-width: 640px) {
      .cat-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
      .offers-grid { grid-template-columns: 1fr; }
      .arrivals-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
      .about-stats { padding: 1rem; }
      .astat { padding: 0 0.75rem; }
      .astat-n { font-size: 1.6rem; }
    }
    @media (max-width: 400px) {
      .arrivals-grid { grid-template-columns: 1fr; }
      .cat-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `]
})
export class LandingComponent implements OnInit {
  categories: Category[] = [];
  newArrivals: Product[] = [];
  heroBanner: Banner | null = null;
  notifVisible = true;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getCategories().subscribe({
      next: (d: any) => this.categories = Array.isArray(d) ? d : (d.results || []),
      error: (e) => console.error('Categories:', e)
    });
    this.productService.getNewArrivals().subscribe({
      next: (d: any) => this.newArrivals = Array.isArray(d) ? d : (d.results || []),
      error: (e) => console.error('New arrivals:', e)
    });
    this.productService.getBanners().subscribe({
      next: (d: any) => {
        const banners: Banner[] = Array.isArray(d) ? d : (d.results || []);
        this.heroBanner = banners.length > 0 ? banners[0] : null;
      },
      error: (e) => console.error('Banners:', e)
    });
  }
}
