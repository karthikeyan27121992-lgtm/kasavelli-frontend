import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container" *ngIf="product">
      <div class="product-detail">
        <div class="product-images">
          <img [src]="selectedImage" [alt]="product.name" class="main-image">
          <div class="thumbnail-images">
            <img [src]="product.image" (click)="selectImage(product.image)" class="thumbnail">
            <img *ngIf="product.image_2" [src]="product.image_2" (click)="selectImage(product.image_2)" class="thumbnail">
            <img *ngIf="product.image_3" [src]="product.image_3" (click)="selectImage(product.image_3)" class="thumbnail">
          </div>
        </div>

        <div class="product-info">
          <h1>{{ product.title }}</h1>
          <p class="category">{{ product.category_name }}</p>
          
          <div class="price-section">
            <span class="price-original" *ngIf="product.discounted_price">₹{{ product.price }}</span>
            <span class="price">₹{{ product.final_price }}</span>
            <span class="discount-badge" *ngIf="product.discount_percentage > 0">
              {{ product.discount_percentage }}% OFF
            </span>
          </div>

          <div class="product-specs">
            <p><strong>Purity:</strong> {{ product.purity }}</p>
            <p *ngIf="product.weight"><strong>Weight:</strong> {{ product.weight }}g</p>
            <p><strong>Stock:</strong> 
              <span [class.in-stock]="product.in_stock" [class.out-of-stock]="!product.in_stock">
                {{ product.in_stock ? 'In Stock' : 'Out of Stock' }}
              </span>
            </p>
          </div>

          <div class="description">
            <h3>Description</h3>
            <p>{{ product.description }}</p>
          </div>

          <div class="actions" *ngIf="isAuthenticated">
            <div class="quantity-selector">
              <label>Quantity:</label>
              <input type="number" [(ngModel)]="quantity" min="1" [max]="product.stock_quantity" class="form-control">
            </div>
            
            <button 
              class="btn btn-primary" 
              (click)="addToCart()" 
              [disabled]="!product.in_stock || adding"
            >
              {{ adding ? 'Adding...' : 'Add to Cart' }}
            </button>
          </div>

          <p *ngIf="!isAuthenticated" class="alert alert-info">
            Please <a routerLink="/login">login</a> to add items to cart
          </p>

          <div class="alert alert-success" *ngIf="successMessage">
            {{ successMessage }}
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <section class="related-products mt-4" *ngIf="relatedProducts.length > 0">
        <h2>Related Products</h2>
        <div class="grid">
          <div class="card" *ngFor="let related of relatedProducts" [routerLink]="['/products', related.id]">
            <img [src]="related.image" [alt]="related.name" class="card-img">
            <div class="card-body">
              <h3 class="card-title">{{ related.title }}</h3>
              <span class="price">₹{{ related.final_price }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div class="spinner" *ngIf="!product"></div>
  `,
  styles: [`
    .product-detail {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      margin: 2rem 0;
    }

    .product-images {
      position: sticky;
      top: 100px;
    }

    .main-image {
      width: 100%;
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .thumbnail-images {
      display: flex;
      gap: 1rem;
    }

    .thumbnail {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 4px;
      cursor: pointer;
      border: 2px solid transparent;
    }

    .thumbnail:hover {
      border-color: #c0c0c0;
    }

    .product-info h1 {
      margin-bottom: 0.5rem;
    }

    .category {
      color: #666;
      margin-bottom: 1rem;
    }

    .price-section {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin: 1.5rem 0;
    }

    .product-specs {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 4px;
      margin: 1.5rem 0;
    }

    .product-specs p {
      margin: 0.5rem 0;
    }

    .in-stock {
      color: #28a745;
    }

    .out-of-stock {
      color: #dc3545;
    }

    .description {
      margin: 2rem 0;
    }

    .actions {
      display: flex;
      gap: 1rem;
      align-items: flex-end;
      margin: 2rem 0;
    }

    .quantity-selector {
      flex: 0 0 150px;
    }

    .quantity-selector input {
      width: 100%;
    }

    @media (max-width: 768px) {
      .product-detail {
        grid-template-columns: 1fr;
      }

      .actions {
        flex-direction: column;
        align-items: stretch;
      }

      .quantity-selector {
        flex: 1;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  relatedProducts: Product[] = [];
  selectedImage = '';
  quantity = 1;
  adding = false;
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    public authService: AuthService
  ) {}

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.loadProduct(id);
    });
  }

  loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.selectedImage = data.image;
        this.loadRelatedProducts(id);
      },
      error: (err) => console.error('Error loading product:', err)
    });
  }

  loadRelatedProducts(productId: number): void {
    this.productService.getRelatedProducts(productId).subscribe({
      next: (data) => this.relatedProducts = data,
      error: (err) => console.error('Error loading related products:', err)
    });
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  addToCart(): void {
    if (!this.product) return;

    this.adding = true;
    this.successMessage = '';

    this.cartService.addToCart(this.product.id, this.quantity).subscribe({
      next: () => {
        this.adding = false;
        this.successMessage = 'Product added to cart successfully!';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.adding = false;
        console.error('Error adding to cart:', err);
        alert('Failed to add product to cart');
      }
    });
  }
}

// Made with Bob
