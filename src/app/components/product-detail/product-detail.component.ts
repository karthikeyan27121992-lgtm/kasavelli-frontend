import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product, CartItem } from '../../models/product.model';
import { Subscription } from 'rxjs';

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

          <div class="actions" *ngIf="isAuthenticated && product.in_stock">
            <!-- Amazon-style: plain "Add to Cart" → inline stepper once added -->
            <ng-container *ngIf="cartItem; else addBtnTpl">
              <div class="cart-stepper">
                <button class="step-btn" (click)="decrease()">−</button>
                <span class="step-qty">{{ cartItem.quantity }}</span>
                <button class="step-btn" (click)="increase()">+</button>
              </div>
              <a routerLink="/cart" class="go-to-bag">View Bag →</a>
            </ng-container>
            <ng-template #addBtnTpl>
              <button class="btn-add" (click)="addToCart()" [disabled]="adding">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                {{ adding ? 'Adding…' : 'Add to Cart' }}
              </button>
            </ng-template>
          </div>

          <div class="out-of-stock-msg" *ngIf="!product.in_stock">
            <span>⊗ Currently out of stock</span>
          </div>

          <p *ngIf="!isAuthenticated" class="alert alert-info">
            Please <a routerLink="/login">login</a> to add items to cart
          </p>
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
    .container {
      padding: 2rem 1.5rem 4rem;
      max-width: 1100px;
      margin: 0 auto;
    }

    .breadcrumb {
      font-size: 0.78rem;
      letter-spacing: 0.5px;
      color: var(--text-light);
      margin-bottom: 2rem;
    }
    .breadcrumb a { color: var(--royal); text-decoration: none; }
    .breadcrumb a:hover { color: var(--gold-dark); }
    .breadcrumb span { margin: 0 0.5rem; opacity: 0.4; }

    .product-detail {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      margin-bottom: 4rem;
    }

    /* Images */
    .product-images {
      position: sticky;
      top: 80px;
    }
    .main-image {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      display: block;
      margin-bottom: 0.85rem;
      background: var(--cream);
      transition: transform 0.4s ease;
    }
    .main-image:hover { transform: scale(1.02); }
    .thumbnail-images { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .thumbnail {
      width: 78px; height: 78px;
      object-fit: cover;
      cursor: pointer;
      border: 2px solid transparent;
      transition: border-color 0.2s;
      background: var(--cream);
    }
    .thumbnail:hover, .thumbnail.active { border-color: var(--gold); }

    /* Info */
    .product-info {}
    .product-info h1 {
      font-family: 'Cormorant Garamond', serif;
      font-size: 2rem;
      color: var(--royal);
      margin-bottom: 0.3rem;
      line-height: 1.2;
    }
    .category {
      font-size: 0.75rem;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--text-light);
      margin-bottom: 1.5rem;
    }

    .price-section {
      display: flex; align-items: center; gap: 1rem;
      margin: 0 0 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--cream-dark);
    }
    .price { font-size: 2rem; font-weight: 700; color: var(--royal); font-family: 'Jost', sans-serif; }
    .price-original { font-size: 1.1rem; color: var(--text-light); text-decoration: line-through; }

    .product-specs {
      background: var(--cream);
      padding: 1.25rem;
      border-left: 3px solid var(--gold);
      margin: 1.5rem 0;
    }
    .product-specs p {
      margin: 0.5rem 0;
      font-size: 0.92rem;
      color: var(--text-mid);
    }
    .product-specs strong { color: var(--royal); }

    .in-stock  { color: #2e7d32; font-weight: 600; }
    .out-of-stock { color: var(--error); font-weight: 600; }

    .description { margin: 1.5rem 0; }
    .description h3 {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.2rem;
      color: var(--royal);
      margin-bottom: 0.5rem;
      letter-spacing: 0.5px;
    }
    .description p { font-size: 0.95rem; line-height: 1.8; color: var(--text-mid); }

    .actions {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin: 2rem 0;
      flex-wrap: wrap;
    }

    /* Cart stepper */
    .cart-stepper {
      display: inline-flex;
      align-items: center;
      border: 2px solid var(--royal);
      border-radius: 4px;
      overflow: hidden;
      height: 48px;
    }
    .step-btn {
      width: 48px; height: 48px;
      background: var(--royal);
      color: var(--cream);
      border: none;
      font-size: 1.4rem;
      cursor: pointer;
      transition: opacity 0.2s;
      font-family: 'Jost', sans-serif;
      line-height: 1;
    }
    .step-btn:hover { opacity: 0.82; }
    .step-qty {
      min-width: 52px;
      text-align: center;
      font-family: 'Jost', sans-serif;
      font-weight: 700;
      font-size: 1.1rem;
      color: var(--royal);
    }

    /* "Add to Cart" primary button */
    .btn-add {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.85rem 2rem;
      background: var(--royal);
      color: var(--cream);
      border: 2px solid var(--royal);
      font-family: 'Jost', sans-serif;
      font-weight: 600;
      font-size: 0.9rem;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      cursor: pointer;
      border-radius: 3px;
      transition: all 0.25s;
    }
    .btn-add:hover:not(:disabled) { background: transparent; color: var(--royal); }
    .btn-add:disabled { opacity: 0.55; cursor: not-allowed; }

    /* "View Bag" link after adding */
    .go-to-bag {
      font-family: 'Jost', sans-serif;
      font-size: 0.88rem;
      font-weight: 600;
      color: var(--gold);
      text-decoration: none;
      letter-spacing: 0.5px;
      border-bottom: 1px solid var(--gold);
      padding-bottom: 1px;
      transition: opacity 0.2s;
    }
    .go-to-bag:hover { opacity: 0.75; }

    /* Out of stock message */
    .out-of-stock-msg {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      background: #fdecea;
      color: var(--error);
      font-size: 0.9rem;
      font-weight: 600;
      border-radius: 3px;
      margin: 1.5rem 0;
    }

    .alert { margin: 1rem 0; }

    /* Related */
    .related-products { padding-top: 2rem; border-top: 1px solid var(--cream-dark); }
    .related-products h2 {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.6rem;
      color: var(--royal);
      margin-bottom: 1.5rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1.5rem;
    }
    .card { cursor: pointer; border: 1px solid var(--cream-dark); }
    .card:hover { border-color: var(--gold); }
    .card-img {
      width: 100%; height: 220px;
      object-fit: cover; background: var(--cream);
      transition: transform 0.35s ease;
    }
    .card:hover .card-img { transform: scale(1.05); }
    .card-body { padding: 1rem; }
    .card-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1rem;
      color: var(--royal);
      margin-bottom: 0.3rem;
    }
    .price { font-size: 1.05rem; font-weight: 700; color: var(--royal); }

    @media (max-width: 768px) {
      .product-detail { grid-template-columns: 1fr; gap: 2rem; }
      .product-images { position: static; }
      .actions { flex-direction: column; align-items: flex-start; }
      .btn-add { width: 100%; justify-content: center; }
    }
  `]
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  relatedProducts: Product[] = [];
  selectedImage = '';
  adding = false;
  cartItem: CartItem | null = null;
  private cartSub!: Subscription;

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
    // Subscribe to live cart so stepper reacts immediately
    this.cartSub = this.cartService.cartItems$.subscribe(items => {
      if (this.product) {
        this.cartItem = items.find(i => i.product === this.product!.id) ?? null;
      }
    });

    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.loadProduct(id);
    });
  }

  ngOnDestroy(): void {
    this.cartSub?.unsubscribe();
  }

  loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.selectedImage = data.image;
        // Sync cartItem for the newly loaded product
        const items = this.cartService['cartItemsSubject'].value as CartItem[];
        this.cartItem = items.find(i => i.product === data.id) ?? null;
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
    this.cartService.addToCart(this.product.id, 1).subscribe({
      next: () => { this.adding = false; },
      error: (err) => {
        this.adding = false;
        console.error('Error adding to cart:', err);
      }
    });
  }

  increase(): void {
    if (!this.cartItem) return;
    this.cartService.updateCartItem(this.cartItem.id, this.cartItem.quantity + 1).subscribe({
      error: (err) => console.error('Error updating cart:', err)
    });
  }

  decrease(): void {
    if (!this.cartItem) return;
    if (this.cartItem.quantity <= 1) {
      this.cartService.removeFromCart(this.cartItem.id).subscribe({
        error: (err) => console.error('Error removing from cart:', err)
      });
    } else {
      this.cartService.updateCartItem(this.cartItem.id, this.cartItem.quantity - 1).subscribe({
        error: (err) => console.error('Error updating cart:', err)
      });
    }
  }
}

// Made with Bob
