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
    <div class="container">
      <!-- Banners Section -->
      <section class="banners" *ngIf="banners.length > 0">
        <div class="banner" *ngFor="let banner of banners">
          <img [src]="banner.image" [alt]="banner.title" class="banner-img">
          <div class="banner-content">
            <h2>{{ banner.title }}</h2>
            <p>{{ banner.description }}</p>
            <span class="discount-badge" *ngIf="banner.discount_offer">
              {{ banner.discount_offer }}
            </span>
          </div>
        </div>
      </section>

      <!-- Video Banner Section -->
      <section class="video-banner">
        <video autoplay muted loop playsinline class="video-bg">
          <source src="assets/images/WhatsApp Video 2026-05-17 at 2.58.52 PM.mp4" type="video/mp4">
          Your browser does not support the video tag.
        </video>
        <div class="video-overlay">
          <h1 class="video-title">KASAVELLI 925</h1>
          <p class="video-subtitle">Premium Silver Collection</p>
        </div>
      </section>

      <!-- Categories Section - Horizontal Scrollable -->
      <section class="categories mt-4">
        <h2 class="text-center mb-3">Shop by Category</h2>
        <div class="category-scroll-container">
          <div class="category-scroll">
            <div class="category-item" *ngFor="let category of categories" [routerLink]="['/products']" [queryParams]="{category: category.id}">
              <div class="category-image-wrapper">
                <img [src]="category.image || 'assets/placeholder.jpg'" [alt]="category.display_name" class="category-img">
              </div>
              <h3 class="category-name">{{ category.display_name }}</h3>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Products -->
      <section class="featured-products mt-4">
        <h2 class="text-center mb-3">Featured Products</h2>
        <div class="grid">
          <div class="card" *ngFor="let product of featuredProducts" [routerLink]="['/products', product.id]">
            <img [src]="product.image" [alt]="product.name" class="card-img">
            <div class="card-body">
              <h3 class="card-title">{{ product.title }}</h3>
              <div class="price-section">
                <span class="price-original" *ngIf="product.discounted_price">₹{{ product.price }}</span>
                <span class="price">₹{{ product.final_price }}</span>
                <span class="discount-badge" *ngIf="product.discount_percentage > 0">
                  {{ product.discount_percentage }}% OFF
                </span>
              </div>
              <p class="card-text">{{ product.purity }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .container {
      padding: 0;
      max-width: 100%;
    }

    h2 {
      color: var(--primary-purple);
      font-family: 'Playfair Display', serif;
      font-size: 1.75rem;
      margin-bottom: 1.5rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .banners {
      margin: 0;
    }
    
    .banner {
      position: relative;
      overflow: hidden;
      margin-bottom: 0;
    }
    
    .banner-img {
      width: 100%;
      height: 400px;
      object-fit: cover;
    }
    
    .banner-content {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(transparent, rgba(139, 58, 98, 0.9));
      color: white;
      padding: 2rem;
    }

    .banner-content h2 {
      color: white;
      margin-bottom: 0.5rem;
      font-size: 1.5rem;
    }

    .discount-badge {
      background: linear-gradient(135deg, #4A7C59 0%, #5A9C69 100%);
      color: white;
      padding: 0.4rem 0.9rem;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.9rem;
      display: inline-block;
      margin-top: 0.5rem;
    }

    /* Video Banner Section */
    .video-banner {
      position: relative;
      width: 100%;
      height: 500px;
      overflow: hidden;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .video-bg {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }

    .video-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(139, 58, 98, 0.7) 0%, rgba(169, 75, 118, 0.6) 50%, rgba(199, 123, 161, 0.5) 100%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 2rem;
    }

    .video-title {
      font-family: 'Playfair Display', serif;
      font-size: 4rem;
      font-weight: 700;
      color: white;
      text-transform: uppercase;
      letter-spacing: 8px;
      margin: 0;
      text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
      animation: fadeInUp 1s ease-out;
    }

    .video-subtitle {
      font-family: 'Lato', sans-serif;
      font-size: 1.5rem;
      font-weight: 300;
      color: white;
      letter-spacing: 3px;
      margin-top: 1rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      animation: fadeInUp 1.2s ease-out;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Horizontal Scrollable Categories */
    .categories {
      background: linear-gradient(135deg, #8B3A62 0%, #A94B76 50%, #C77BA1 100%);
      padding: 3rem 0;
      margin: 0;
    }

    .categories h2 {
      color: white;
      text-align: center;
      margin-bottom: 2rem;
      padding: 0 2rem;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
    }

    .category-scroll-container {
      position: relative;
      padding: 0 2rem;
    }

    .category-scroll {
      display: flex;
      gap: 2rem;
      overflow-x: auto;
      overflow-y: hidden;
      scroll-behavior: smooth;
      padding: 1rem 0 2rem;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 255, 255, 0.5) transparent;
    }

    .category-scroll::-webkit-scrollbar {
      height: 6px;
    }

    .category-scroll::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
    }

    .category-scroll::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.5);
      border-radius: 10px;
    }

    .category-scroll::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.7);
    }

    .category-item {
      flex: 0 0 auto;
      width: 150px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .category-item:hover {
      transform: translateY(-8px);
    }

    .category-image-wrapper {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      overflow: hidden;
      margin: 0 auto 0.75rem;
      background: white;
      border: 4px solid white;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .category-item:hover .category-image-wrapper {
      border-color: #4A7C59;
      box-shadow: 0 8px 20px rgba(74, 124, 89, 0.3);
    }

    .category-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .category-item:hover .category-img {
      transform: scale(1.1);
    }

    .category-name {
      font-size: 0.9rem;
      font-weight: 600;
      color: white;
      font-family: 'Lato', sans-serif;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Featured Products */
    .featured-products {
      background: #FFFFFF;
      padding: 3rem 2rem;
      margin: 0;
    }

    .featured-products h2 {
      text-align: center;
      margin-bottom: 2rem;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .card {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      cursor: pointer;
      border: 1px solid #f0f0f0;
    }

    .card:hover {
      transform: translateY(-6px);
      box-shadow: 0 8px 16px rgba(139, 58, 98, 0.15);
      border-color: var(--primary-purple);
    }

    .card-img {
      width: 100%;
      height: 280px;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .card:hover .card-img {
      transform: scale(1.05);
    }

    .card-body {
      padding: 1.25rem;
    }

    .card-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--primary-purple);
      margin-bottom: 0.75rem;
      font-family: 'Playfair Display', serif;
      line-height: 1.3;
    }

    .price-section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin: 0.75rem 0;
      flex-wrap: wrap;
    }

    .price {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--primary-magenta);
      font-family: 'Lato', sans-serif;
    }

    .price-original {
      font-size: 1rem;
      color: var(--dark-gray);
      text-decoration: line-through;
      opacity: 0.6;
    }

    .card-text {
      color: var(--dark-gray);
      font-size: 0.9rem;
      margin-top: 0.5rem;
    }

    @media (max-width: 768px) {
      .category-item {
        width: 120px;
      }

      .category-image-wrapper {
        width: 120px;
        height: 120px;
      }

      .category-name {
        font-size: 0.8rem;
      }

      .grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
      }

      .banner-img {
        height: 300px;
      }

      .video-banner {
        height: 350px;
      }

      .video-title {
        font-size: 2.5rem;
        letter-spacing: 4px;
      }

      .video-subtitle {
        font-size: 1rem;
        letter-spacing: 2px;
      }

      .categories, .featured-products {
        padding: 2rem 1rem;
      }

      h2 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class LandingComponent implements OnInit {
  categories: Category[] = [];
  featuredProducts: Product[] = [];
  banners: Banner[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadFeaturedProducts();
    this.loadBanners();
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

  loadFeaturedProducts(): void {
    this.productService.getFeaturedProducts().subscribe({
      next: (data: any) => {
        // Handle both array and paginated response
        this.featuredProducts = Array.isArray(data) ? data : (data.results || []);
        console.log('Featured products loaded:', this.featuredProducts.length);
      },
      error: (err) => console.error('Error loading featured products:', err)
    });
  }

  loadBanners(): void {
    this.productService.getBanners().subscribe({
      next: (data: any) => {
        // Handle both array and paginated response
        this.banners = Array.isArray(data) ? data : (data.results || []);
        console.log('Banners loaded:', this.banners.length);
      },
      error: (err) => console.error('Error loading banners:', err)
    });
  }
}

// Made with Bob
