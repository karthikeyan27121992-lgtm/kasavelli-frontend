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
      <div class="container">
        <h2 class="page-title">Our Collection</h2>
        <p class="page-title-sub">Handcrafted 925 Sterling Silver</p>

        <!-- Filters Section -->
        <div class="filters-section">
          <div class="filter-group">
            <label>Category</label>
            <select class="filter-select" [(ngModel)]="selectedCategory" (change)="onFilterChange()">
              <option value="">All Categories</option>
              <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.display_name }}</option>
            </select>
          </div>

          <div class="filter-group search-group">
            <label>Search</label>
            <input
              type="text"
              class="filter-input"
              placeholder="Search products..."
              [(ngModel)]="searchQuery"
              (input)="onSearch()"
            >
          </div>
        </div>

        <!-- Products Count -->
        <div class="products-count" *ngIf="!loading">
          <p>Showing {{ products.length }} product{{ products.length !== 1 ? 's' : '' }}</p>
        </div>

        <!-- Products Grid - 4 per row -->
        <div class="products-grid" *ngIf="!loading">
          <div class="product-card" *ngFor="let product of products">
            <div class="product-image-wrapper" [routerLink]="['/products', product.id]">
              <img [src]="product.image" [alt]="product.title" class="product-image">
              <div class="product-overlay" *ngIf="product.discount_percentage > 0">
                <span class="discount-tag">{{ product.discount_percentage }}% OFF</span>
              </div>
            </div>
            
            <div class="product-info">
              <h3 class="product-title" [routerLink]="['/products', product.id]">{{ product.title }}</h3>
              <p class="product-category">{{ product.category_name }}</p>
              <p class="product-purity">{{ product.purity }}</p>
              
              <div class="product-pricing">
                <span class="price-original" *ngIf="product.discounted_price">₹{{ product.price }}</span>
                <span class="price-current">₹{{ product.final_price }}</span>
              </div>
              
              <div class="product-stock">
                <span class="stock-badge" [class.in-stock]="product.in_stock" [class.out-of-stock]="!product.in_stock">
                  {{ product.in_stock ? '✓ In Stock' : '✗ Out of Stock' }}
                </span>
              </div>
              
              <!-- Add-to-cart: plain button or inline stepper (Amazon style) -->
              <ng-container *ngIf="product.in_stock; else outOfStock">
                <ng-container *ngIf="getCartItem(product.id) as item; else addBtn">
                  <!-- Already in cart → show stepper -->
                  <div class="cart-stepper" (click)="$event.stopPropagation()">
                    <button class="step-btn" (click)="decrease(item, $event)">−</button>
                    <span class="step-qty">{{ item.quantity }}</span>
                    <button class="step-btn" (click)="increase(item, $event)">+</button>
                  </div>
                </ng-container>
                <ng-template #addBtn>
                  <button class="btn-add-cart" (click)="addToCart(product, $event)">
                    Add to Cart
                  </button>
                </ng-template>
              </ng-container>
              <ng-template #outOfStock>
                <button class="btn-add-cart" disabled>Out of Stock</button>
              </ng-template>
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
    .products-page {
      background: var(--cream);
      min-height: 100vh;
      padding: 3rem 0;
    }

    .container { max-width: 1400px; margin: 0 auto; padding: 0 2rem; }

    .page-title {
      font-family: 'Cormorant Garamond', serif;
      color: var(--royal);
      font-size: 2.4rem;
      text-align: center;
      margin-bottom: 0.5rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 3px;
    }
    .page-title-sub {
      text-align: center;
      color: var(--text-light);
      font-size: 0.88rem;
      letter-spacing: 1px;
      margin-bottom: 2.5rem;
    }

    /* Filters */
    .filters-section {
      background: var(--white);
      padding: 1.25rem 1.5rem;
      border: 1px solid var(--cream-dark);
      margin-bottom: 2rem;
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 1.5rem;
      align-items: end;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .filter-group label {
      font-weight: 600;
      color: var(--royal);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .filter-select, .filter-input {
      padding: 0.7rem 1rem;
      border: 1px solid var(--cream-dark);
      border-radius: 2px;
      font-size: 0.95rem;
      font-family: 'Jost', sans-serif;
      background: var(--cream);
      color: var(--text-dark);
      transition: border-color 0.3s;
    }
    .filter-select:focus, .filter-input:focus {
      outline: none;
      border-color: var(--gold);
      box-shadow: 0 0 0 3px rgba(202,178,115,0.15);
    }

    /* Count */
    .products-count { margin-bottom: 1.5rem; }
    .products-count p {
      color: var(--text-light);
      font-size: 0.88rem;
      letter-spacing: 0.5px;
    }

    /* Grid */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.75rem;
      margin-bottom: 3rem;
    }

    /* Card */
    .product-card {
      background: var(--white);
      border: 1px solid var(--cream-dark);
      overflow: hidden;
      transition: all 0.35s ease;
      display: flex;
      flex-direction: column;
    }
    .product-card:hover {
      border-color: var(--gold);
      box-shadow: 0 12px 32px rgba(85,23,86,0.12);
      transform: translateY(-6px);
    }

    .product-image-wrapper {
      position: relative;
      width: 100%;
      height: 280px;
      overflow: hidden;
      cursor: pointer;
      background: var(--cream);
    }
    .product-image {
      width: 100%; height: 100%;
      object-fit: cover;
      transition: transform 0.45s ease;
    }
    .product-card:hover .product-image { transform: scale(1.07); }

    .product-overlay {
      position: absolute;
      top: 10px; left: 10px;
    }
    .discount-tag {
      background: var(--royal);
      color: var(--gold-light);
      padding: 0.3rem 0.65rem;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    /* Info */
    .product-info {
      padding: 1.1rem 1.25rem 1.4rem;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
    .product-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.15rem;
      color: var(--royal);
      margin-bottom: 0.3rem;
      cursor: pointer;
      line-height: 1.3;
      transition: color 0.2s;
    }
    .product-title:hover { color: var(--gold-dark); }
    .product-category {
      font-size: 0.72rem;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--text-light);
      margin-bottom: 0.2rem;
    }
    .product-purity {
      font-size: 0.82rem;
      color: var(--text-light);
      margin-bottom: 0.65rem;
    }

    /* Price */
    .product-pricing {
      display: flex; align-items: center; gap: 0.65rem;
      margin-bottom: 0.7rem;
    }
    .price-current {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--royal);
      font-family: 'Jost', sans-serif;
    }
    .price-original {
      font-size: 0.88rem;
      color: var(--text-light);
      text-decoration: line-through;
    }

    /* Stock */
    .product-stock { margin-bottom: 0.85rem; }
    .stock-badge {
      display: inline-block;
      padding: 0.25rem 0.65rem;
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .stock-badge.in-stock  { background: #e8f5e9; color: #2e7d32; }
    .stock-badge.out-of-stock { background: #fdecea; color: var(--error); }

    /* CTA */
    .btn-add-cart {
      width: 100%;
      padding: 0.8rem;
      background: var(--royal);
      color: var(--cream);
      border: 2px solid var(--royal);
      font-family: 'Jost', sans-serif;
      font-weight: 600;
      font-size: 0.82rem;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-top: auto;
    }
    .btn-add-cart:hover:not(:disabled) {
      background: transparent;
      color: var(--royal);
    }
    .btn-add-cart:disabled {
      background: var(--cream-dark);
      border-color: var(--cream-dark);
      color: var(--text-light);
      cursor: not-allowed;
    }

    /* Cart stepper (inline qty control, shown when product is in cart) */
    .cart-stepper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      border: 2px solid var(--royal);
      border-radius: 3px;
      overflow: hidden;
      margin-top: auto;
    }
    .step-btn {
      flex: 0 0 40px;
      height: 40px;
      background: var(--royal);
      color: var(--cream);
      border: none;
      font-size: 1.3rem;
      line-height: 1;
      cursor: pointer;
      transition: opacity 0.2s;
      font-family: 'Jost', sans-serif;
    }
    .step-btn:hover { opacity: 0.82; }
    .step-qty {
      flex: 1;
      text-align: center;
      font-family: 'Jost', sans-serif;
      font-weight: 700;
      font-size: 1rem;
      color: var(--royal);
    }

    /* Spinner */
    .loading-spinner { text-align: center; padding: 4rem 0; }
    .spinner {
      border: 3px solid var(--cream-dark);
      border-top: 3px solid var(--royal);
      border-radius: 50%;
      width: 44px; height: 44px;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 1rem;
    }
    @keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
    .loading-spinner p { color: var(--text-light); font-size: 0.9rem; }

    /* No Products */
    .no-products {
      text-align: center;
      padding: 4rem 2rem;
      background: var(--white);
      border: 1px solid var(--cream-dark);
    }
    .no-products p { color: var(--text-mid); font-size: 1.05rem; margin-bottom: 1.5rem; }
    .btn-reset {
      padding: 0.75rem 2rem;
      background: var(--royal);
      color: var(--cream);
      border: 2px solid var(--royal);
      font-family: 'Jost', sans-serif;
      font-weight: 600;
      font-size: 0.82rem;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.3s;
    }
    .btn-reset:hover { background: transparent; color: var(--royal); }

    /* Responsive */
    @media (max-width: 1200px) { .products-grid { grid-template-columns: repeat(3, 1fr); } }
    @media (max-width: 900px) {
      .products-grid { grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
      .filters-section { grid-template-columns: 1fr; }
      .page-title { font-size: 2rem; }
    }
    @media (max-width: 600px) {
      .products-grid { grid-template-columns: repeat(2, 1fr); gap: 0.85rem; }
      .container { padding: 0 1rem; }
      .page-title { font-size: 1.75rem; }
      .product-image-wrapper { height: 220px; }
    }
    @media (max-width: 400px) {
      .products-grid { grid-template-columns: 1fr; }
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
