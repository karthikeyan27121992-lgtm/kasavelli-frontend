import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import {
  Product, Category, Banner, NotificationBar,
  LeadspaceBanner, StorySection, WhyChooseCard, HomepageConfig
} from '../../models/product.model';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `

    <!-- ══ NOTIFICATION BAR (SMOOTH FADE & SLIDE) ═══════════════════════ -->
    <div class="notif-bar" *ngIf="notifVisible && notificationList.length > 0">
      <button class="notif-nav-arrow notif-prev" (click)="prevNotif()" aria-label="Previous announcement" *ngIf="notificationList.length > 1">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <div class="notif-stage">
        <div class="notif-item" [class.visible]="notifVisibleState">
          <span class="notif-tag" *ngIf="currentNotif.tag">{{ currentNotif.tag }}</span>
          <span class="notif-text">{{ currentNotif.text }}</span>
        </div>
      </div>

      <button class="notif-nav-arrow notif-next" (click)="nextNotif()" aria-label="Next announcement" *ngIf="notificationList.length > 1">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      <button class="notif-close" (click)="notifVisible=false" aria-label="Close announcement">✕</button>
    </div>

    <div class="landing">

      <!-- ══ 1. LEADSPACE BANNER (Exact Layout: Split with Angular Ribbon & Image Side) ════ -->
      <section class="ls-wrapper" *ngIf="leadspace?.is_active !== false">
        <div class="ls-banner-card">
          <!-- Left: Angular Content Area with Brand Graphics -->
          <div class="ls-content-pane">
            <div class="ls-brand-badge">
              <span class="ls-brand-sparkle">✦</span>
              <span class="ls-brand-text">KASAVELLI SILVER</span>
            </div>

            <div class="ls-header-group">
              <p class="ls-eyebrow">{{ leadspace?.eyebrow || 'New Collection · 2026' }}</p>
              <h1 class="ls-title" [innerHTML]="formattedTitle"></h1>
            </div>

            <p class="ls-desc">{{ leadspace?.desc_line1 || 'Traditional South Indian finger rings, handcrafted in 925 sterling silver.' }}</p>
            <p class="ls-desc ls-desc-sub" *ngIf="leadspace?.desc_line2">{{ leadspace?.desc_line2 }}</p>

            <div class="ls-action-row">
              <div class="ls-offer-pill" *ngIf="leadspace?.offer_pct || leadspace?.offer_label">
                <span class="ls-offer-val" *ngIf="leadspace?.offer_pct">{{ leadspace?.offer_pct }}</span>
                <span class="ls-offer-txt" *ngIf="leadspace?.offer_label">{{ leadspace?.offer_label }}</span>
              </div>
              <a [routerLink]="leadspace?.button_link || '/products'" class="ls-cta-btn">
                <span>{{ leadspace?.button_text || 'Shop Now' }}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>

            <!-- Footer Social / Trust Indicators -->
            <div class="ls-footer-tags">
              <span class="ls-tag"><span class="ls-dot">●</span> 925 Certified</span>
              <span class="ls-tag"><span class="ls-dot">●</span> Free Shipping</span>
              <span class="ls-tag"><span class="ls-dot">●</span> Easy Returns</span>
            </div>
          </div>

          <!-- Angular Cutout Separator & Slanted Accent Ribbons -->
          <div class="ls-slant-divider"></div>
          <div class="ls-gold-accent-strip"></div>

          <!-- Right: Image Showcase Area -->
          <div class="ls-image-pane">
            <img [src]="leadspace?.image || 'assets/images/vanki-ring.webp'" 
                 [alt]="leadspace?.title || 'Kasavelli Jewellery'" 
                 class="ls-hero-img">
            <div class="ls-image-overlay"></div>
          </div>
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
      <section class="about-section" *ngIf="story?.is_active !== false">
        <div class="container about-inner">
          <div class="about-img-col">
            <div class="about-img-frame">
              <img *ngIf="story?.image" [src]="story?.image" alt="Our Story" class="about-custom-img">
              <div *ngIf="!story?.image" class="about-img-bg"></div>
              <div class="about-badge" *ngIf="story?.badge_number">
                <span class="about-badge-num">{{ story?.badge_number || '925' }}</span>
                <span class="about-badge-lbl" [innerHTML]="formattedBadgeLabel"></span>
              </div>
            </div>
          </div>
          <div class="about-text-col">
            <p class="about-eyebrow">{{ story?.eyebrow || 'Our Story' }}</p>
            <h2 class="about-title" [innerHTML]="formattedStoryTitle"></h2>
            <p class="about-desc">{{ story?.paragraph_1 || 'Founded in 2024, Kasavelli was born from a love for traditional Indian jewellery-making. Every piece is handcrafted by skilled artisans using 925 hallmarked sterling silver — hypoallergenic, durable, and timeless.' }}</p>
            <p class="about-desc" *ngIf="story?.paragraph_2">{{ story?.paragraph_2 }}</p>
            <div class="about-stats">
              <div class="astat">
                <span class="astat-n">{{ story?.stat1_value || '100+' }}</span>
                <span class="astat-l">{{ story?.stat1_label || 'Unique Designs' }}</span>
              </div>
              <div class="astat-div"></div>
              <div class="astat">
                <span class="astat-n">{{ story?.stat2_value || '500+' }}</span>
                <span class="astat-l">{{ story?.stat2_label || 'Happy Customers' }}</span>
              </div>
              <div class="astat-div"></div>
              <div class="astat">
                <span class="astat-n">{{ story?.stat3_value || '925' }}</span>
                <span class="astat-l">{{ story?.stat3_label || 'Silver Purity' }}</span>
              </div>
            </div>
            <a [routerLink]="story?.button_link || '/products'" class="about-btn">
              {{ story?.button_text || 'View Collection' }}
            </a>
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
            <div class="offer-card" *ngFor="let card of whyCards">
              <div class="offer-icon">
                <!-- Shield / Certified -->
                <svg *ngIf="card.icon_type === 'shield'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="28" height="28">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <!-- Heart / Handpicked -->
                <svg *ngIf="card.icon_type === 'heart'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="28" height="28">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <!-- Truck / Fast Delivery -->
                <svg *ngIf="card.icon_type === 'truck'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="28" height="28">
                  <rect x="1" y="3" width="15" height="13" rx="1"/>
                  <path d="M16 8h4l3 5v3h-7V8zM5.5 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm13 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
                </svg>
                <!-- Trending / Returns -->
                <svg *ngIf="card.icon_type === 'returns'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="28" height="28">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  <polyline points="17 6 23 6 23 12"/>
                </svg>
                <!-- Gift / Packaging -->
                <svg *ngIf="card.icon_type === 'gift'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="28" height="28">
                  <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
                <!-- Sparkles / Made in India -->
                <svg *ngIf="card.icon_type === 'sparkles'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="28" height="28">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <h3>{{ card.title }}</h3>
              <p>{{ card.description }}</p>
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
    /* ══ CSS VARIABLES ══ */
    :host {
      --royal: #551756;
      --royal-mid: #3e0e3f;
      --royal-dark: #2a072c;
      --gold: #c9a84c;
      --gold-light: #f5cf62;
      --gold-dark: #a17822;
      --cream: #f9f5ef;
      --white: #ffffff;
      --text: #1a1a2e;
      --text-light: #6b6b7b;
    }

    /* ══ NOTIFICATION BAR (SMOOTH FADE & SLIDE) ══ */
    .notif-bar {
      background: #551756;
      color: #ffffff;
      min-height: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      padding: 0 52px;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      z-index: 100;
      border-bottom: 1.5px solid rgba(232, 197, 71, 0.35);
    }

    .notif-stage {
      flex: 1;
      max-width: 860px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      overflow: hidden;
      position: relative;
    }

    .notif-item {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-size: 0.83rem;
      line-height: 1.3;
      letter-spacing: 0.3px;
      white-space: nowrap;
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.4s ease-out, transform 0.4s ease-out;
    }

    .notif-item.visible {
      opacity: 1;
      transform: translateY(0);
    }

    .notif-tag {
      font-weight: 700;
      color: #e8c547;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      font-size: 0.76rem;
      flex-shrink: 0;
      display: inline-block;
    }

    .notif-text {
      font-weight: 500;
      color: #ffffff;
      display: inline-block;
    }

    .notif-nav-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(232, 197, 71, 0.25);
      color: #e8c547;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-radius: 50%;
      transition: all 0.2s ease;
      padding: 0;
      z-index: 2;
    }

    .notif-nav-arrow:hover {
      color: #ffffff;
      background: rgba(232, 197, 71, 0.35);
      border-color: #e8c547;
      transform: translateY(-50%) scale(1.1);
    }

    .notif-prev {
      left: 14px;
    }

    .notif-next {
      right: 44px;
    }

    .notif-close {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: rgba(255, 255, 255, 0.75);
      font-size: 0.75rem;
      cursor: pointer;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s;
      z-index: 2;
    }

    .notif-close:hover {
      color: #ffffff;
      background: rgba(232, 197, 71, 0.3);
      border-color: #e8c547;
    }

    @media (max-width: 680px) {
      .notif-bar {
        height: 38px;
        min-height: 38px;
        padding: 0 38px 0 36px;
      }
      .notif-spin-card {
        font-size: 0.75rem;
        gap: 6px;
      }
      .notif-tag {
        font-size: 0.65rem;
        padding: 2px 6px;
      }
      .notif-nav-arrow {
        width: 24px;
        height: 24px;
      }
      .notif-prev {
        left: 6px;
      }
      .notif-next {
        right: 34px;
      }
      .notif-close {
        right: 6px;
        width: 22px;
        height: 22px;
      }
    }

    /* ══ SHARED ══ */
    .landing { background: #fff; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
    .sec-head { text-align: center; margin-bottom: 3rem; }
    .sec-head h2 {
      font-family: 'Raleway', sans-serif;
      font-size: clamp(1.8rem, 3.5vw, 2.4rem);
      color: var(--royal-dark); font-weight: 700; letter-spacing: 0.5px;
    }
    .sec-line {
      width: 48px; height: 3px;
      background: linear-gradient(90deg, var(--gold), var(--gold-light));
      margin: 0.75rem auto 0.75rem; border-radius: 2px;
    }
    .sec-sub { color: var(--text-light); font-size: 0.95rem; }

    /* ══ 1. EXACT LEADSPACE LAYOUT (From Reference Banner Template) ══ */
    .ls-wrapper {
      width: 100%;
      background: #180319;
      padding: 0;
      margin: 0;
      display: flex;
      justify-content: center;
      box-sizing: border-box;
      overflow: hidden;
    }

    .ls-banner-card {
      position: relative;
      width: 100%;
      max-width: 100%;
      min-height: 520px;
      background: #250628;
      border-radius: 0;
      overflow: hidden;
      display: flex;
      box-shadow: 0 15px 45px rgba(0, 0, 0, 0.45);
      border-top: 1px solid rgba(201, 168, 76, 0.25);
      border-bottom: 1px solid rgba(201, 168, 76, 0.25);
      border-left: none;
      border-right: none;
    }

    /* Left Content Pane (Angular Cut with dark maroon-purple gradient) */
    .ls-content-pane {
      position: relative;
      flex: 1.25;
      z-index: 3;
      padding: 3.5rem 4.5rem 3.5rem 4rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background: linear-gradient(135deg, #300832 0%, #200422 65%, #18031a 100%);
      clip-path: polygon(0 0, 100% 0, 84% 100%, 0 100%);
      box-shadow: 12px 0 30px rgba(0, 0, 0, 0.35);
    }

    /* Decorative Brand Logo/Sparkle Top */
    .ls-brand-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(245, 207, 98, 0.12);
      border: 1px solid rgba(245, 207, 98, 0.35);
      padding: 0.35rem 0.9rem;
      border-radius: 20px;
      width: fit-content;
      margin-bottom: 1.5rem;
    }
    .ls-brand-sparkle {
      color: var(--gold-light);
      font-size: 0.85rem;
    }
    .ls-brand-text {
      color: var(--gold-light);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    /* Header Group */
    .ls-header-group {
      margin-bottom: 1.25rem;
    }
    .ls-eyebrow {
      font-size: 0.78rem;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: var(--gold-light);
      font-weight: 700;
      margin: 0 0 0.5rem;
    }
    .ls-title {
      font-family: 'Raleway', sans-serif;
      font-size: clamp(2.4rem, 4vw, 3.6rem);
      font-weight: 800;
      line-height: 1.1;
      color: #ffffff;
      margin: 0;
      letter-spacing: -0.5px;
      text-shadow: 0 3px 12px rgba(0, 0, 0, 0.4);
    }

    /* Description Texts */
    .ls-desc {
      color: rgba(249, 245, 239, 0.9);
      font-size: 1rem;
      line-height: 1.6;
      margin: 0 0 0.4rem;
      max-width: 520px;
      font-weight: 300;
    }
    .ls-desc-sub {
      color: rgba(249, 245, 239, 0.75);
      font-size: 0.92rem;
      margin-bottom: 1.5rem;
    }

    /* Action Row: Offer & Button */
    .ls-action-row {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-top: 0.5rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .ls-offer-pill {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      background: rgba(255, 255, 255, 0.08);
      border: 1px dashed var(--gold);
      padding: 0.5rem 1.1rem;
      border-radius: 8px;
    }
    .ls-offer-val {
      font-family: 'Raleway', sans-serif;
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--gold-light);
    }
    .ls-offer-txt {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.85);
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
      max-width: 140px;
      line-height: 1.3;
    }

    .ls-cta-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      background: linear-gradient(135deg, #f5cf62 0%, #c9a84c 100%);
      color: #1a031d;
      font-weight: 800;
      font-size: 0.88rem;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      padding: 0.95rem 2.25rem;
      border-radius: 8px;
      text-decoration: none;
      box-shadow: 0 8px 24px rgba(245, 207, 98, 0.35);
      transition: all 0.3s ease;
    }
    .ls-cta-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 30px rgba(245, 207, 98, 0.5);
      background: linear-gradient(135deg, #fae08c 0%, #dbba5d 100%);
    }

    /* Footer Trust Tags */
    .ls-footer-tags {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding-top: 1.25rem;
      border-top: 1px solid rgba(255, 255, 255, 0.12);
      max-width: 480px;
    }
    .ls-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.76rem;
      color: rgba(245, 207, 98, 0.9);
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .ls-dot {
      font-size: 0.5rem;
      color: var(--gold);
    }

    /* Slanted Accent Ribbons */
    .ls-slant-divider {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 54%;
      width: 45px;
      background: linear-gradient(to bottom, #501154, #320836);
      transform: skewX(-14deg);
      z-index: 2;
      opacity: 0.85;
    }
    .ls-gold-accent-strip {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 56.5%;
      width: 6px;
      background: linear-gradient(to bottom, var(--gold-light), var(--gold-dark));
      transform: skewX(-14deg);
      z-index: 2;
      box-shadow: 0 0 15px rgba(245, 207, 98, 0.5);
    }

    /* Right Image Showcase Pane */
    .ls-image-pane {
      position: relative;
      flex: 1;
      min-height: 100%;
      z-index: 1;
      overflow: hidden;
      margin-left: -5%;
    }
    .ls-hero-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 30%;
      transition: transform 0.6s ease;
    }
    .ls-banner-card:hover .ls-hero-img {
      transform: scale(1.03);
    }
    .ls-image-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to right, rgba(37, 6, 40, 0.5) 0%, transparent 60%);
      pointer-events: none;
    }

    /* ══ 2. CATEGORIES ══ */
    .cat-section { padding: 5rem 0; background: #fff; }
    .cat-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.5rem;
    }
    .cat-card {
      background: #faf8f5; border-radius: 12px; overflow: hidden;
      cursor: pointer; transition: all 0.35s ease;
      position: relative;
      border: 1.5px solid rgba(232, 197, 71, 0.45);
      box-shadow: 0 4px 18px rgba(201, 168, 76, 0.12);
    }
    .cat-card::before {
      content: '✦';
      position: absolute;
      top: 6px;
      right: 8px;
      color: #f5cf62;
      font-size: 0.7rem;
      opacity: 0.75;
      text-shadow: 0 0 6px rgba(245, 207, 98, 0.8);
      z-index: 4;
      pointer-events: none;
    }
    .cat-card:hover {
      transform: translateY(-5px);
      border-color: #f5cf62;
      box-shadow: 0 10px 28px rgba(85,23,86,0.14), 0 0 16px rgba(245, 207, 98, 0.4);
    }
    .cat-img-wrap {
      position: relative; height: 180px; overflow: hidden;
      background: #ede6ee;
    }
    .cat-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
    .cat-card:hover .cat-img { transform: scale(1.08); }
    .cat-img-placeholder {
      width: 100%; height: 100%;
      display: flex; align-items: center; justify-content: center;
      color: rgba(85,23,86,0.3);
    }
    .cat-overlay {
      position: absolute; inset: 0;
      background: rgba(85,23,86,0.5);
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: opacity 0.3s;
    }
    .cat-card:hover .cat-overlay { opacity: 1; }
    .cat-overlay span {
      color: #efebe1; font-weight: 700; font-size: 0.82rem;
      letter-spacing: 1px; text-transform: uppercase;
    }
    .cat-info { padding: 1rem; text-align: center; }
    .cat-name {
      font-weight: 700; font-size: 0.95rem;
      color: var(--royal-dark); margin: 0 0 0.2rem;
    }
    .cat-count { font-size: 0.78rem; color: var(--text-light); margin: 0; }

    /* ══ 3. ABOUT US ══ */
    .about-section { padding: 5rem 0; background: var(--cream); }
    .about-inner {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem; align-items: center;
    }
    .about-img-frame {
      position: relative; height: 420px; border-radius: 16px;
      overflow: visible;
    }
    .about-img-frame::before {
      content: ''; position: absolute; inset: -10px;
      border: 2px solid var(--gold); border-radius: 20px;
      opacity: 0.4; z-index: 0;
    }
    .about-img-bg {
      width: 100%; height: 100%; border-radius: 14px;
      background: linear-gradient(135deg, var(--royal-dark) 0%, var(--royal) 60%, #8a2a8c 100%);
      position: relative; z-index: 1; overflow: hidden;
    }
    .about-custom-img {
      width: 100%; height: 100%; border-radius: 14px;
      object-fit: cover; position: relative; z-index: 1;
    }
    .about-badge {
      position: absolute; bottom: 20px; right: -20px;
      background: #fff; border-radius: 10px;
      padding: 0.75rem 1.25rem;
      box-shadow: 0 8px 28px rgba(0,0,0,0.12);
      display: flex; align-items: center; gap: 0.75rem; z-index: 2;
      border: 1px solid rgba(201,148,26,0.2);
    }
    .about-badge-num {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--royal-dark);
      line-height: 1;
      letter-spacing: -0.5px;
    }
    .about-badge-lbl { font-size: 0.72rem; color: var(--text-light); line-height: 1.4; }

    .about-text-col { padding-right: 1rem; }
    .about-eyebrow {
      font-size: 0.72rem; letter-spacing: 3px; text-transform: uppercase;
      color: var(--gold); font-weight: 600; margin-bottom: 1rem;
    }
    .about-title {
      font-family: 'Raleway', sans-serif;
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
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--royal-dark);
      line-height: 1.1;
      letter-spacing: -0.5px;
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
      position: relative;
      border: 1.5px solid rgba(232, 197, 71, 0.45);
      box-shadow: 0 4px 18px rgba(201, 168, 76, 0.12);
      transition: all 0.35s ease;
    }
    .offer-card::before {
      content: '✦';
      position: absolute;
      top: 8px;
      right: 12px;
      color: #f5cf62;
      font-size: 0.72rem;
      opacity: 0.75;
      text-shadow: 0 0 6px rgba(245, 207, 98, 0.8);
      pointer-events: none;
    }
    .offer-card:hover {
      transform: translateY(-4px);
      border-color: #f5cf62;
      box-shadow: 0 10px 30px rgba(85,23,86,0.12), 0 0 18px rgba(245, 207, 98, 0.35);
    }
    .offer-icon {
      width: 52px; height: 52px; border-radius: 12px;
      background: linear-gradient(135deg, rgba(85,23,86,0.08), rgba(85,23,86,0.04));
      display: flex; align-items: center; justify-content: center;
      color: var(--royal-dark); margin-bottom: 1.25rem;
    }
    .offer-card h3 {
      font-family: 'Raleway', sans-serif;
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
      border: 1.5px solid rgba(232, 197, 71, 0.45);
      box-shadow: 0 4px 18px rgba(201, 168, 76, 0.12);
      cursor: pointer;
      position: relative;
      transition: all 0.35s ease;
      text-decoration: none; color: inherit; display: block;
    }
    .arrival-card::after {
      content: '✦';
      position: absolute;
      top: 8px;
      right: 10px;
      color: #f5cf62;
      font-size: 0.72rem;
      opacity: 0.85;
      text-shadow: 0 0 8px rgba(245, 207, 98, 0.9);
      z-index: 3;
      pointer-events: none;
    }
    .arrival-card:hover {
      transform: translateY(-5px);
      border-color: #f5cf62;
      box-shadow: 0 12px 32px rgba(85,23,86,0.14), 0 0 20px rgba(245, 207, 98, 0.45);
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
      font-family: 'Raleway', sans-serif;
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
    @media (max-width: 960px) {
      .ls-wrapper {
        padding: 1rem 0.75rem;
      }
      .ls-banner-card {
        flex-direction: row;
        min-height: 420px;
      }
      .ls-content-pane {
        flex: 1.35;
        padding: 2.2rem 2.2rem 2rem 2rem;
        clip-path: polygon(0 0, 100% 0, 82% 100%, 0 100%);
      }
      .ls-slant-divider {
        left: 51%;
        width: 32px;
        display: block;
      }
      .ls-gold-accent-strip {
        left: 53.5%;
        width: 5px;
        display: block;
      }
      .ls-image-pane {
        flex: 1;
        margin-left: -6%;
        height: auto;
      }
      .ls-title {
        font-size: clamp(1.8rem, 3.5vw, 2.5rem);
      }
      .ls-desc {
        font-size: 0.88rem;
      }
      .ls-desc-sub {
        font-size: 0.82rem;
      }
      .about-inner { grid-template-columns: 1fr; gap: 3rem; }
      .about-img-col { max-width: 420px; margin: 0 auto; width: 100%; }
      .about-text-col { padding-right: 0; }
      .about-img-frame::before { display: none; }
      .about-badge { right: 0; }
    }

    @media (max-width: 680px) {
      .ls-wrapper {
        padding: 0;
      }
      .ls-banner-card {
        flex-direction: row;
        min-height: 360px;
        border-radius: 0;
      }
      .ls-content-pane {
        flex: 1.05;
        padding: 1.3rem 1.2rem 1.1rem 0.9rem;
        clip-path: polygon(0 0, 100% 0, 84% 100%, 0 100%);
      }
      .ls-brand-badge {
        padding: 0.18rem 0.5rem;
        margin-bottom: 0.6rem;
      }
      .ls-brand-text {
        font-size: 0.58rem;
        letter-spacing: 1px;
      }
      .ls-brand-sparkle {
        font-size: 0.65rem;
      }
      .ls-header-group {
        margin-bottom: 0.5rem;
      }
      .ls-eyebrow {
        font-size: 0.62rem;
        letter-spacing: 1.5px;
        margin-bottom: 0.2rem;
      }
      .ls-title {
        font-size: clamp(1.2rem, 4.5vw, 1.65rem);
        line-height: 1.1;
      }
      .ls-desc {
        font-size: 0.75rem;
        line-height: 1.4;
        margin-bottom: 0.2rem;
      }
      .ls-desc-sub {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        font-size: 0.7rem;
        line-height: 1.35;
        margin-bottom: 0.7rem;
      }
      .ls-action-row {
        gap: 0.5rem;
        margin-top: 0.2rem;
        margin-bottom: 0.8rem;
      }
      .ls-offer-pill {
        padding: 0.3rem 0.55rem;
        gap: 0.3rem;
      }
      .ls-offer-val {
        font-size: 0.95rem;
      }
      .ls-offer-txt {
        font-size: 0.58rem;
        max-width: 90px;
        letter-spacing: 0.4px;
      }
      .ls-cta-btn {
        padding: 0.5rem 1rem;
        font-size: 0.7rem;
        letter-spacing: 0.8px;
        gap: 0.3rem;
      }
      .ls-cta-btn svg {
        width: 13px;
        height: 13px;
      }
      .ls-footer-tags {
        gap: 0.5rem;
        padding-top: 0.5rem;
      }
      .ls-tag {
        font-size: 0.58rem;
        gap: 0.2rem;
      }
      .ls-dot {
        font-size: 0.35rem;
      }
      .ls-slant-divider {
        left: 45%;
        width: 20px;
        display: block;
      }
      .ls-gold-accent-strip {
        left: 47.5%;
        width: 3px;
        display: block;
      }
      .ls-image-pane {
        flex: 1.25;
        margin-left: -7%;
        height: auto;
      }
      .offers-grid { grid-template-columns: 1fr; }
      .arrivals-grid { grid-template-columns: 1fr; }
      .cat-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 440px) {
      .ls-banner-card {
        min-height: 330px;
      }
      .ls-content-pane {
        flex: 1.05;
        padding: 1rem 0.8rem 0.8rem 0.7rem;
        clip-path: polygon(0 0, 100% 0, 82% 100%, 0 100%);
      }
      .ls-title {
        font-size: 1.15rem;
      }
      .ls-desc {
        font-size: 0.68rem;
        line-height: 1.3;
      }
      .ls-desc-sub {
        display: none;
      }
      .ls-action-row {
        margin-bottom: 0.5rem;
      }
      .ls-offer-pill {
        display: none;
      }
      .ls-cta-btn {
        padding: 0.45rem 0.8rem;
        font-size: 0.65rem;
      }
      .ls-slant-divider {
        left: 42%;
        width: 16px;
      }
      .ls-gold-accent-strip {
        left: 44.5%;
        width: 3px;
      }
      .ls-image-pane {
        flex: 1.35;
        margin-left: -8%;
      }
    }
  `]
})
export class LandingComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  newArrivals: Product[] = [];
  heroBanner: Banner | null = null;
  notifVisible = true;

  // Dynamic Homepage Sections
  notificationBars: NotificationBar[] = [];
  leadspace: LeadspaceBanner | null = null;
  story: StorySection | null = null;
  whyCards: WhyChooseCard[] = [];

  // Notification smooth rotation state
  activeNotifIndex = 0;
  notifVisibleState = true;
  private notifTimer: any = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.startNotifRotation();
    // Load dynamic homepage config
    this.productService.getHomepageConfig().subscribe({
      next: (config: HomepageConfig) => {
        if (config) {
          this.notificationBars = config.notifications || [];
          this.leadspace = config.leadspace;
          this.story = config.story;
          this.whyCards = (config.why_choose_cards && config.why_choose_cards.length > 0)
            ? config.why_choose_cards
            : this.getDefaultWhyCards();
        }
      },
      error: (e) => {
        console.error('Homepage config:', e);
        this.whyCards = this.getDefaultWhyCards();
      }
    });

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

  ngOnDestroy(): void {
    if (this.notifTimer) {
      clearInterval(this.notifTimer);
    }
  }

  private startNotifRotation(): void {
    if (this.notifTimer) clearInterval(this.notifTimer);
    this.notifTimer = setInterval(() => {
      this.nextNotif();
    }, 4500);
  }

  nextNotif(): void {
    const list = this.notificationList;
    if (list.length <= 1) return;
    this.notifVisibleState = false;
    setTimeout(() => {
      this.activeNotifIndex = (this.activeNotifIndex + 1) % list.length;
      this.notifVisibleState = true;
    }, 350);
  }

  prevNotif(): void {
    const list = this.notificationList;
    if (list.length <= 1) return;
    this.notifVisibleState = false;
    setTimeout(() => {
      this.activeNotifIndex = (this.activeNotifIndex - 1 + list.length) % list.length;
      this.notifVisibleState = true;
    }, 350);
  }

  /**
   * Parse notification items into structured objects.
   * If an item contains '·' (e.g. joined list from admin), it splits them into individual notifications.
   */
  get notificationList(): Array<{ tag: string; text: string }> {
    const rawTexts: string[] = [];
    if (this.notificationBars && this.notificationBars.length > 0) {
      this.notificationBars.forEach(n => {
        if (n.text) {
          const parts = n.text.split(/\s*·\s*/);
          parts.forEach(p => {
            const trimmed = p.trim();
            if (trimmed) rawTexts.push(trimmed);
          });
        }
      });
    }

    if (rawTexts.length === 0) {
      rawTexts.push(
        'FLAT 15% OFF | Use Code: SHINE15 on your first order',
        'FREE SHIPPING | On all prepaid orders above ₹999 across India',
        '925 SILVER | Certified authentic hallmark with certificate',
        'EASY RETURNS | 30-Day hassle-free return & doorstep exchange'
      );
    }

    return rawTexts.map(raw => {
      if (raw.includes('|')) {
        const [tag, ...rest] = raw.split('|');
        return { tag: tag.trim(), text: rest.join('|').trim() };
      }
      if (raw.includes('—')) {
        const [tag, ...rest] = raw.split('—');
        return { tag: tag.trim(), text: rest.join('—').trim() };
      }
      return { tag: '', text: raw };
    });
  }

  get currentNotif(): { tag: string; text: string } {
    const list = this.notificationList;
    return list[this.activeNotifIndex % list.length] || { tag: '', text: '' };
  }

  get formattedTitle(): string {
    const title = this.leadspace?.title || 'Vanki\nRings';
    return title.replace(/\n/g, '<br>');
  }

  get formattedStoryTitle(): string {
    const title = this.story?.title || 'Crafted with Passion,\nWorn with Pride';
    return title.replace(/\n/g, '<br>');
  }

  get formattedBadgeLabel(): string {
    const label = this.story?.badge_label || 'Hallmarked\nSilver';
    return label.replace(/\n/g, '<br>');
  }

  private getDefaultWhyCards(): WhyChooseCard[] {
    return [
      { id: 1, title: '925 Certified Silver', description: 'Every piece is hallmarked 925 sterling silver — certified pure, hypoallergenic, and safe for all skin types.', icon_type: 'shield', display_order: 1, is_active: true },
      { id: 2, title: 'Handpicked Designs', description: 'Each design is curated by our artisans — blending traditional Indian motifs with contemporary aesthetics.', icon_type: 'heart', display_order: 2, is_active: true },
      { id: 3, title: 'Fast & Safe Delivery', description: 'Free shipping above ₹999. Secure packaging ensures your jewellery arrives safely across India in 5–7 days.', icon_type: 'truck', display_order: 3, is_active: true },
      { id: 4, title: '30-Day Returns', description: 'Not happy? Return within 30 days — no questions asked. Your satisfaction is our highest priority.', icon_type: 'returns', display_order: 4, is_active: true },
      { id: 5, title: 'Perfect for Gifting', description: 'Every order comes gift-ready with elegant packaging — ideal for birthdays, anniversaries, and festivities.', icon_type: 'gift', display_order: 5, is_active: true },
      { id: 6, title: 'Made in India', description: 'Proudly handcrafted by Indian artisans — supporting traditional craft while delivering world-class quality.', icon_type: 'sparkles', display_order: 6, is_active: true },
    ];
  }
}

// Made with Bob
