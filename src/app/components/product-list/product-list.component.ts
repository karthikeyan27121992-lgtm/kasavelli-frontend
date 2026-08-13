import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product, Category } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="products-page">
      <div class="container">
        <h2 class="page-title">Our Premium Collection</h2>

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
              
              <button
                class="btn-add-cart"
                (click)="addToCart(product, $event)"
                [disabled]="!product.in_stock"
              >
                <span *ngIf="product.in_stock">Add to Cart</span>
                <span *ngIf="!product.in_stock">Out of Stock</span>
              </button>
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
      background: #FAF8F9;
      min-height: 100vh;
      padding: 2rem 0;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .page-title {
      color: var(--primary-purple);
      font-family: 'Playfair Display', serif;
      font-size: 2.5rem;
      text-align: center;
      margin-bottom: 2rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    /* Filters Section */
    .filters-section {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      margin-bottom: 2rem;
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 1.5rem;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-group label {
      font-weight: 600;
      color: var(--primary-purple);
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .filter-select,
    .filter-input {
      padding: 0.75rem 1rem;
      border: 2px solid #E8E8E8;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s ease;
      font-family: 'Lato', sans-serif;
    }

    .filter-select:focus,
    .filter-input:focus {
      outline: none;
      border-color: var(--primary-purple);
      box-shadow: 0 0 0 3px rgba(139, 58, 98, 0.1);
    }

    /* Products Count */
    .products-count {
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .products-count p {
      color: var(--dark-gray);
      font-size: 1rem;
      font-weight: 500;
    }

    /* Products Grid - 4 per row */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
      margin-bottom: 3rem;
    }

    /* Product Card */
    .product-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
    }

    .product-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 8px 20px rgba(139, 58, 98, 0.15);
    }

    .product-image-wrapper {
      position: relative;
      width: 100%;
      height: 280px;
      overflow: hidden;
      cursor: pointer;
    }

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .product-card:hover .product-image {
      transform: scale(1.08);
    }

    .product-overlay {
      position: absolute;
      top: 0;
      right: 0;
      padding: 0.5rem;
    }

    .discount-tag {
      background: linear-gradient(135deg, #4A7C59 0%, #5A9C69 100%);
      color: white;
      padding: 0.4rem 0.8rem;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.85rem;
      box-shadow: 0 2px 8px rgba(74, 124, 89, 0.3);
    }

    /* Product Info */
    .product-info {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    .product-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--primary-purple);
      margin-bottom: 0.5rem;
      font-family: 'Playfair Display', serif;
      cursor: pointer;
      transition: color 0.3s ease;
      line-height: 1.3;
    }

    .product-title:hover {
      color: var(--primary-magenta);
    }

    .product-category {
      color: var(--dark-gray);
      font-size: 0.9rem;
      margin-bottom: 0.25rem;
      opacity: 0.8;
    }

    .product-purity {
      color: var(--dark-gray);
      font-size: 0.85rem;
      margin-bottom: 0.75rem;
      font-weight: 500;
    }

    /* Pricing */
    .product-pricing {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .price-current {
      font-size: 1.35rem;
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

    /* Stock Badge */
    .product-stock {
      margin-bottom: 1rem;
    }

    .stock-badge {
      display: inline-block;
      padding: 0.35rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .stock-badge.in-stock {
      background-color: #d4edda;
      color: #155724;
    }

    .stock-badge.out-of-stock {
      background-color: #f8d7da;
      color: #721c24;
    }

    /* Add to Cart Button */
    .btn-add-cart {
      width: 100%;
      padding: 0.85rem;
      background: linear-gradient(135deg, #8B3A62 0%, #A94B76 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-top: auto;
    }

    .btn-add-cart:hover:not(:disabled) {
      background: linear-gradient(135deg, #6B2A4A 0%, #8B3A62 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(139, 58, 98, 0.3);
    }

    .btn-add-cart:disabled {
      background: #cccccc;
      cursor: not-allowed;
      opacity: 0.6;
    }

    /* Loading Spinner */
    .loading-spinner {
      text-align: center;
      padding: 4rem 0;
    }

    .spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid var(--primary-purple);
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-spinner p {
      color: var(--dark-gray);
      font-size: 1rem;
    }

    /* No Products */
    .no-products {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .no-products p {
      color: var(--dark-gray);
      font-size: 1.1rem;
      margin-bottom: 1.5rem;
    }

    .btn-reset {
      padding: 0.75rem 2rem;
      background: linear-gradient(135deg, #8B3A62 0%, #A94B76 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-reset:hover {
      background: linear-gradient(135deg, #6B2A4A 0%, #8B3A62 100%);
      transform: translateY(-2px);
    }

    /* Responsive Design */
    @media (max-width: 1200px) {
      .products-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 900px) {
      .products-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
      }

      .filters-section {
        grid-template-columns: 1fr;
      }

      .page-title {
        font-size: 2rem;
      }
    }

    @media (max-width: 600px) {
      .products-grid {
        grid-template-columns: 1fr;
      }

      .container {
        padding: 0 1rem;
      }

      .page-title {
        font-size: 1.75rem;
      }

      .product-image-wrapper {
        height: 250px;
      }
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategory = '';
  searchQuery = '';
  loading = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    
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

    // Add to cart
    this.cartService.addToCart(product.id, 1).subscribe({
      next: () => {
        alert('Product added to cart successfully!');
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
        alert('Failed to add product to cart');
      }
    });
  }

  resetFilters(): void {
    this.selectedCategory = '';
    this.searchQuery = '';
    this.loadProducts();
  }
}

// Made with Bob
