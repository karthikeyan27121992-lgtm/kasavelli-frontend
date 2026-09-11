import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product, Category } from '../../models/product.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-wrap">
      <div class="admin-header">
        <h2 class="admin-title">Admin Panel</h2>
      </div>

      <!-- Tabs -->
      <div class="admin-tabs">
        <button class="tab-btn" [class.active]="activeTab === 'products'" (click)="switchTab('products')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          Products
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'categories'" (click)="switchTab('categories')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          Categories
        </button>
      </div>

      <!-- ── Products Tab ── -->
      <div class="tab-content" *ngIf="activeTab === 'products'">
        <div class="section-bar">
          <div class="section-bar-left">
            <h3 class="section-title">Products</h3>
            <span class="section-count">{{ products.length }} item{{ products.length !== 1 ? 's' : '' }}</span>
          </div>
          <button class="btn-add" (click)="openAddProductModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Product
          </button>
        </div>

        <div class="filter-bar">
          <select class="filter-select" [(ngModel)]="selectedCategory" (change)="loadProducts()">
            <option value="">All Categories</option>
            <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.display_name }}</option>
          </select>
        </div>

        <!-- Desktop table -->
        <div class="table-wrap" *ngIf="products.length > 0">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Discounted</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let product of products">
                <td data-label="Image">
                  <img *ngIf="product.image; else noImg" [src]="product.image" [alt]="product.name" class="table-img">
                  <ng-template #noImg><div class="no-img-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" width="22" height="22"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div></ng-template>
                </td>
                <td data-label="Name"><span class="cell-primary">{{ product.name }}</span></td>
                <td data-label="Category"><span class="cat-chip">{{ product.category_name }}</span></td>
                <td data-label="Price"><span class="price-val">₹{{ product.price }}</span></td>
                <td data-label="Discounted">
                  <span class="price-disc" *ngIf="product.discounted_price">₹{{ product.discounted_price }}</span>
                  <span class="price-none" *ngIf="!product.discounted_price">—</span>
                </td>
                <td data-label="Stock">
                  <span class="stock-badge" [class.in]="product.in_stock" [class.out]="!product.in_stock">
                    {{ product.in_stock ? 'In Stock' : 'Out of Stock' }}
                  </span>
                </td>
                <td data-label="Actions" class="actions-cell">
                  <button class="btn-icon edit" (click)="editProduct(product)" title="Edit">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit
                  </button>
                  <button class="btn-icon del" (click)="deleteProduct(product.id)" title="Delete">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile cards (≤640px) -->
        <div class="card-list" *ngIf="products.length > 0">
          <div class="item-card" *ngFor="let product of products">
            <div class="card-img-col">
              <img *ngIf="product.image; else noImgCard" [src]="product.image" [alt]="product.name" class="card-img">
              <ng-template #noImgCard>
                <div class="card-img-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" width="28" height="28"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
              </ng-template>
            </div>
            <div class="card-body">
              <p class="card-name">{{ product.name }}</p>
              <p class="card-meta">{{ product.category_name }}</p>
              <div class="card-price-row">
                <span class="card-price">₹{{ product.discounted_price || product.price }}</span>
                <span class="card-orig" *ngIf="product.discounted_price">₹{{ product.price }}</span>
                <span class="stock-badge" [class.in]="product.in_stock" [class.out]="!product.in_stock">
                  {{ product.in_stock ? 'In Stock' : 'Out' }}
                </span>
              </div>
            </div>
            <div class="card-actions">
              <button class="btn-icon edit" (click)="editProduct(product)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="btn-icon del" (click)="deleteProduct(product.id)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
              </button>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="products.length === 0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" width="48" height="48"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          <p>No products yet</p>
          <button class="btn-add" (click)="openAddProductModal()">Add Your First Product</button>
        </div>
      </div>

      <!-- ── Categories Tab ── -->
      <div class="tab-content" *ngIf="activeTab === 'categories'">
        <div class="section-bar">
          <div class="section-bar-left">
            <h3 class="section-title">Categories</h3>
            <span class="section-count">{{ categories.length }} item{{ categories.length !== 1 ? 's' : '' }}</span>
          </div>
          <button class="btn-add" (click)="openAddCategoryModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Category
          </button>
        </div>

        <!-- Desktop table -->
        <div class="table-wrap" *ngIf="categories.length > 0">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Display Name</th>
                <th>Description</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let category of categories">
                <td data-label="Image">
                  <img *ngIf="category.image; else noCatImg" [src]="category.image" [alt]="category.name" class="table-img">
                  <ng-template #noCatImg><div class="no-img-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" width="22" height="22"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div></ng-template>
                </td>
                <td data-label="Name"><span class="cell-primary">{{ category.name }}</span></td>
                <td data-label="Display Name">{{ category.display_name }}</td>
                <td data-label="Description"><span class="desc-text">{{ category.description || '—' }}</span></td>
                <td data-label="Active">
                  <span class="stock-badge" [class.in]="category.is_active" [class.out]="!category.is_active">
                    {{ category.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td data-label="Actions" class="actions-cell">
                  <button class="btn-icon edit" (click)="editCategory(category)" title="Edit">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit
                  </button>
                  <button class="btn-icon del" (click)="deleteCategory(category.id)" title="Delete">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile cards (≤640px) -->
        <div class="card-list" *ngIf="categories.length > 0">
          <div class="item-card" *ngFor="let category of categories">
            <div class="card-img-col">
              <img *ngIf="category.image; else noCatImgCard" [src]="category.image" [alt]="category.name" class="card-img">
              <ng-template #noCatImgCard>
                <div class="card-img-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" width="28" height="28"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                </div>
              </ng-template>
            </div>
            <div class="card-body">
              <p class="card-name">{{ category.display_name }}</p>
              <p class="card-meta">{{ category.name }}</p>
              <div class="card-price-row">
                <span class="stock-badge" [class.in]="category.is_active" [class.out]="!category.is_active">
                  {{ category.is_active ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>
            <div class="card-actions">
              <button class="btn-icon edit" (click)="editCategory(category)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="btn-icon del" (click)="deleteCategory(category.id)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
              </button>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="categories.length === 0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" width="48" height="48"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          <p>No categories yet</p>
          <button class="btn-add" (click)="openAddCategoryModal()">Add Your First Category</button>
        </div>
      </div>

      <!-- Add/Edit Product Modal -->
      <div class="modal-overlay" *ngIf="showProductModal" (click)="closeProductModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ editingProduct ? 'Edit Product' : 'Add New Product' }}</h3>
            <button class="close-btn" (click)="closeProductModal()">&times;</button>
          </div>

          <div class="modal-body">
            <form (ngSubmit)="saveProduct()" #productForm="ngForm">
              <div class="form-group">
                <label class="form-label">Product Name</label>
                <input type="text" class="form-control" [(ngModel)]="productData.name" name="name" required>
              </div>

              <div class="form-group">
                <label class="form-label">Title</label>
                <input type="text" class="form-control" [(ngModel)]="productData.title" name="title" required>
              </div>

              <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-control" [(ngModel)]="productData.description" name="description" rows="4" required></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Category</label>
                <select class="form-control" [(ngModel)]="productData.category" name="category" required>
                  <option value="">Select Category</option>
                  <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.display_name }}</option>
                </select>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Price</label>
                  <input type="number" class="form-control" [(ngModel)]="productData.price" name="price" required>
                </div>

                <div class="form-group">
                  <label class="form-label">Discounted Price</label>
                  <input type="number" class="form-control" [(ngModel)]="productData.discounted_price" name="discounted_price">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Weight (grams)</label>
                  <input type="number" class="form-control" [(ngModel)]="productData.weight" name="weight">
                </div>

                <div class="form-group">
                  <label class="form-label">Purity</label>
                  <input type="text" class="form-control" [(ngModel)]="productData.purity" name="purity" value="925 Silver">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Stock Quantity</label>
                  <input type="number" class="form-control" [(ngModel)]="productData.stock_quantity" name="stock_quantity" required>
                </div>

                <div class="form-group">
                  <label class="form-label">Slug</label>
                  <input type="text" class="form-control" [(ngModel)]="productData.slug" name="slug" required>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <input type="checkbox" [(ngModel)]="productData.in_stock" name="in_stock">
                  In Stock
                </label>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <input type="checkbox" [(ngModel)]="productData.is_featured" name="is_featured">
                  Featured Product
                </label>
              </div>

              <div class="form-group">
                <label class="form-label">Product Image</label>
                <!-- Current saved image (shown when editing) -->
                <div *ngIf="productData.image && !selectedProductFile" class="current-image-preview">
                  <img [src]="productData.image" alt="Current image" class="preview-img">
                  <div class="preview-info">
                    <span class="preview-label">Current image</span>
                    <small class="preview-hint">Upload a new file below to replace it, or leave empty to keep this image.</small>
                  </div>
                </div>
                <!-- New file preview (shown after selecting a file) -->
                <div *ngIf="selectedProductFile" class="current-image-preview new-file">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <div class="preview-info">
                    <span class="preview-label">New image selected</span>
                    <small class="preview-hint">{{ selectedProductFile.name }}</small>
                  </div>
                  <button type="button" class="clear-file-btn" (click)="selectedProductFile = null" title="Remove selection">✕</button>
                </div>
                <input type="file" class="form-control" (change)="onFileSelect($event, 'product')" accept="image/*">
                <small class="text-muted" *ngIf="!editingProduct">Upload a product image</small>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="closeProductModal()">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="saving">
                  {{ saving ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Add/Edit Category Modal -->
      <div class="modal-overlay" *ngIf="showCategoryModal" (click)="closeCategoryModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ editingCategory ? 'Edit Category' : 'Add New Category' }}</h3>
            <button class="close-btn" (click)="closeCategoryModal()">&times;</button>
          </div>

          <div class="modal-body">
            <form (ngSubmit)="saveCategory()" #categoryForm="ngForm">
              <div class="form-group">
                <label class="form-label">Category Name</label>
                <select class="form-control" [(ngModel)]="categoryData.name" name="name" required [disabled]="!!editingCategory">
                  <option value="">Select Category</option>
                  <option value="chain-with-pendant">Chain with Pendant</option>
                  <option value="earrings">Ear Rings</option>
                  <option value="pendant">Pendant</option>
                  <option value="gold-polish">Gold Polish Looks</option>
                  <option value="rings">Rings</option>
                  <option value="anklets">Anklets</option>
                  <option value="bracelets">Bracelets</option>
                </select>
                <small class="text-muted" *ngIf="!editingCategory">Select from predefined categories</small>
                <small class="text-muted" *ngIf="editingCategory">Category name cannot be changed</small>
              </div>

              <div class="form-group">
                <label class="form-label">Display Name</label>
                <input type="text" class="form-control" [(ngModel)]="categoryData.display_name" name="display_name" required>
                <small class="text-muted">User-friendly name (e.g., Chain with Pendant)</small>
              </div>

              <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-control" [(ngModel)]="categoryData.description" name="description" rows="3"></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <input type="checkbox" [(ngModel)]="categoryData.is_active" name="is_active">
                  Active
                </label>
              </div>

              <div class="form-group">
                <label class="form-label">Category Image</label>
                <!-- Current saved image -->
                <div *ngIf="categoryData.image && !selectedCategoryFile" class="current-image-preview">
                  <img [src]="categoryData.image" alt="Current image" class="preview-img">
                  <div class="preview-info">
                    <span class="preview-label">Current image</span>
                    <small class="preview-hint">Upload a new file below to replace it, or leave empty to keep this image.</small>
                  </div>
                </div>
                <!-- New file preview -->
                <div *ngIf="selectedCategoryFile" class="current-image-preview new-file">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <div class="preview-info">
                    <span class="preview-label">New image selected</span>
                    <small class="preview-hint">{{ selectedCategoryFile.name }}</small>
                  </div>
                  <button type="button" class="clear-file-btn" (click)="selectedCategoryFile = null" title="Remove selection">✕</button>
                </div>
                <input type="file" class="form-control" (change)="onFileSelect($event, 'category')" accept="image/*">
                <small class="text-muted" *ngIf="!editingCategory">Recommended: Square image for best display</small>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="closeCategoryModal()">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="saving">
                  {{ saving ? 'Saving...' : (editingCategory ? 'Update Category' : 'Add Category') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ── CSS vars ── */
    :host {
      --royal:      #3a0e3b;
      --royal-mid:  #551756;
      --gold:       #c9a84c;
      --gold-light: #e8c547;
      --cream:      #f9f5ef;
      --border:     #ede8f0;
      --text:       #2a1a2e;
      --muted:      #7a6a7e;
      --green:      #2e7d4f;
      --green-bg:   #e8f5ee;
      --red:        #c0392b;
      --red-bg:     #fdecea;
    }

    /* ── Page wrapper ── */
    .admin-wrap {
      max-width: 1100px;
      margin: 0 auto;
      padding: 1.5rem 1rem 4rem;
    }
    .admin-header { margin-bottom: 1.25rem; }
    .admin-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(1.5rem, 4vw, 2rem);
      font-weight: 700;
      color: var(--royal);
      margin: 0;
    }

    /* ── Tabs ── */
    .admin-tabs {
      display: flex;
      gap: 0;
      margin-bottom: 1.5rem;
      border-bottom: 2px solid var(--border);
    }
    .tab-btn {
      display: flex; align-items: center; gap: 0.45rem;
      padding: 0.75rem 1.4rem;
      background: none; border: none;
      border-bottom: 3px solid transparent;
      margin-bottom: -2px;
      cursor: pointer;
      font-size: 0.9rem; font-weight: 600;
      color: var(--muted);
      transition: color 0.2s, border-color 0.2s;
    }
    .tab-btn:hover { color: var(--royal); }
    .tab-btn.active { color: var(--royal); border-bottom-color: var(--gold); }

    /* ── Tab content card ── */
    .tab-content {
      background: #fff;
      border-radius: 12px;
      border: 1px solid var(--border);
      box-shadow: 0 2px 12px rgba(58,14,59,0.06);
      overflow: hidden;
    }

    /* ── Section bar ── */
    .section-bar {
      display: flex; align-items: center;
      justify-content: space-between;
      padding: 1.1rem 1.4rem;
      border-bottom: 1px solid var(--border);
      background: #fdfbff;
    }
    .section-bar-left { display: flex; align-items: baseline; gap: 0.6rem; }
    .section-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.15rem; font-weight: 700;
      color: var(--royal); margin: 0;
    }
    .section-count {
      font-size: 0.75rem; color: var(--muted);
      background: #f0ecf5; border-radius: 20px;
      padding: 2px 10px;
    }

    /* ── Add button ── */
    .btn-add {
      display: inline-flex; align-items: center; gap: 0.4rem;
      background: var(--royal); color: #f0e8d0;
      border: none; border-radius: 6px;
      padding: 0.55rem 1.1rem;
      font-size: 0.82rem; font-weight: 700;
      letter-spacing: 0.5px; cursor: pointer;
      transition: background 0.2s;
      white-space: nowrap;
    }
    .btn-add:hover { background: var(--royal-mid); }

    /* ── Filter bar ── */
    .filter-bar {
      padding: 0.85rem 1.4rem;
      border-bottom: 1px solid var(--border);
      background: #faf8fc;
    }
    .filter-select {
      width: 100%; max-width: 280px;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--border);
      border-radius: 6px;
      font-size: 0.88rem; color: var(--text);
      background: #fff; outline: none;
    }
    .filter-select:focus { border-color: var(--royal-mid); }

    /* ── Desktop table (hidden on mobile) ── */
    .table-wrap { overflow-x: auto; }
    .admin-table {
      width: 100%; border-collapse: collapse;
      font-size: 0.88rem;
    }
    .admin-table thead tr { background: #faf7fb; }
    .admin-table th {
      padding: 0.85rem 1rem;
      text-align: left;
      font-size: 0.72rem; font-weight: 700;
      letter-spacing: 0.8px; text-transform: uppercase;
      color: var(--muted); border-bottom: 2px solid var(--border);
      white-space: nowrap;
    }
    .admin-table td {
      padding: 0.85rem 1rem;
      border-bottom: 1px solid var(--border);
      vertical-align: middle; color: var(--text);
    }
    .admin-table tbody tr:hover { background: #fdf9ff; }
    .admin-table tbody tr:last-child td { border-bottom: none; }

    .table-img {
      width: 52px; height: 52px;
      object-fit: cover; border-radius: 6px;
      border: 1px solid var(--border);
    }
    .no-img-placeholder {
      width: 52px; height: 52px;
      background: #f5f0f5;
      border: 1px dashed #c8bccb;
      border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      color: #b0a0b5;
    }
    .cell-primary { font-weight: 600; color: var(--royal); }
    .cat-chip {
      background: #f0ecf8; color: var(--royal-mid);
      padding: 3px 10px; border-radius: 20px;
      font-size: 0.78rem; font-weight: 600;
    }
    .price-val { font-weight: 700; color: var(--royal); }
    .price-disc { font-weight: 700; color: var(--green); }
    .price-none { color: #bbb; }
    .desc-text {
      max-width: 180px;
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
      overflow: hidden; color: var(--muted); font-size: 0.83rem;
    }

    /* ── Stock / Active badge ── */
    .stock-badge {
      display: inline-block;
      padding: 3px 10px; border-radius: 20px;
      font-size: 0.75rem; font-weight: 700; letter-spacing: 0.3px;
    }
    .stock-badge.in  { background: var(--green-bg); color: var(--green); }
    .stock-badge.out { background: var(--red-bg);   color: var(--red); }

    /* ── Action buttons ── */
    .actions-cell { white-space: nowrap; }
    .btn-icon {
      display: inline-flex; align-items: center; gap: 0.3rem;
      padding: 0.35rem 0.7rem;
      border: none; border-radius: 5px;
      font-size: 0.78rem; font-weight: 600;
      cursor: pointer; transition: background 0.18s;
      margin-right: 0.4rem;
    }
    .btn-icon.edit { background: #f0ecf8; color: var(--royal-mid); }
    .btn-icon.edit:hover { background: #e0d5f0; }
    .btn-icon.del  { background: var(--red-bg); color: var(--red); }
    .btn-icon.del:hover  { background: #f5c6c2; }

    /* ── Mobile card list (hidden on desktop) ── */
    .card-list { display: none; }

    /* ── Empty state ── */
    .empty-state {
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 3.5rem 1rem; gap: 0.85rem;
      color: var(--muted);
    }
    .empty-state p { font-size: 1rem; margin: 0; }

    /* ── Modal ── */
    .modal-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }
    .modal-content {
      background: #fff;
      border-radius: 12px;
      width: 100%; max-width: 580px;
      max-height: 92vh; overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    }
    .modal-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border);
      position: sticky; top: 0;
      background: #fff; z-index: 1;
    }
    .modal-header h3 {
      margin: 0;
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.2rem; font-weight: 700;
      color: var(--royal);
    }
    .close-btn {
      background: none; border: none;
      font-size: 1.6rem; cursor: pointer;
      color: var(--muted); line-height: 1;
      padding: 0.2rem 0.4rem; border-radius: 4px;
      transition: background 0.15s, color 0.15s;
    }
    .close-btn:hover { background: #f5f0f5; color: var(--royal); }
    .modal-body { padding: 1.5rem; }
    .modal-footer {
      display: flex; justify-content: flex-end; gap: 0.75rem;
      padding-top: 1rem; border-top: 1px solid var(--border);
      margin-top: 1rem;
    }

    /* ── Form helpers ── */
    .form-row {
      display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
    }
    .current-image-preview {
      display: flex; align-items: center; gap: 12px;
      margin-bottom: 8px; padding: 10px;
      background: #faf8fc; border-radius: 8px;
      border: 1px solid var(--border);
    }
    .current-image-preview.new-file {
      background: #f0faf3; border-color: #a8d5b5;
      color: var(--green);
    }
    .preview-img {
      width: 64px; height: 64px;
      object-fit: cover; border-radius: 6px;
      border: 1px solid var(--border); flex-shrink: 0;
    }
    .preview-info { flex: 1; min-width: 0; }
    .preview-label { display: block; font-size: 0.82rem; font-weight: 700; color: var(--text); margin-bottom: 2px; }
    .preview-hint  { display: block; font-size: 0.75rem; color: var(--muted); line-height: 1.4; }
    .clear-file-btn {
      background: none; border: none; cursor: pointer;
      color: var(--muted); font-size: 1rem; padding: 0.25rem;
      border-radius: 4px; transition: color 0.15s, background 0.15s;
      flex-shrink: 0;
    }
    .clear-file-btn:hover { color: var(--red); background: var(--red-bg); }

    /* ── Keep existing btn classes working ── */
    .btn { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.55rem 1.1rem; border-radius: 6px; font-size: 0.88rem; font-weight: 600; border: none; cursor: pointer; transition: background 0.2s; }
    .btn-primary { background: var(--royal); color: #f0e8d0; }
    .btn-primary:hover { background: var(--royal-mid); }
    .btn-secondary { background: #f0ecf8; color: var(--royal-mid); }
    .btn-secondary:hover { background: #e0d5f0; }
    .btn-danger { background: var(--red-bg); color: var(--red); }
    .btn-danger:hover { background: #f5c6c2; }

    /* ── MOBILE (≤640px) ── */
    @media (max-width: 640px) {
      .admin-wrap { padding: 1rem 0.75rem 3rem; }

      /* Hide desktop table, show cards */
      .table-wrap { display: none; }
      .card-list  { display: flex; flex-direction: column; gap: 0; }

      /* Each card row */
      .item-card {
        display: flex; align-items: center; gap: 0.85rem;
        padding: 0.9rem 1rem;
        border-bottom: 1px solid var(--border);
        transition: background 0.15s;
      }
      .item-card:last-child { border-bottom: none; }
      .item-card:hover { background: #fdf9ff; }

      /* Image column */
      .card-img-col { flex-shrink: 0; }
      .card-img {
        width: 56px; height: 56px;
        object-fit: cover; border-radius: 8px;
        border: 1px solid var(--border);
      }
      .card-img-placeholder {
        width: 56px; height: 56px;
        background: #f5f0f5; border: 1px dashed #c8bccb;
        border-radius: 8px;
        display: flex; align-items: center; justify-content: center;
        color: #b0a0b5;
      }

      /* Body */
      .card-body { flex: 1; min-width: 0; }
      .card-name {
        font-weight: 700; font-size: 0.9rem;
        color: var(--royal); margin: 0 0 0.15rem;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .card-meta {
        font-size: 0.75rem; color: var(--muted);
        margin: 0 0 0.35rem;
      }
      .card-price-row {
        display: flex; align-items: center; gap: 0.45rem; flex-wrap: wrap;
      }
      .card-price { font-weight: 700; font-size: 0.88rem; color: var(--royal); }
      .card-orig  { font-size: 0.78rem; color: var(--muted); text-decoration: line-through; }

      /* Actions column */
      .card-actions {
        flex-shrink: 0;
        display: flex; flex-direction: column; gap: 0.4rem;
      }
      .card-actions .btn-icon {
        padding: 0.4rem; margin: 0;
        width: 32px; height: 32px;
        justify-content: center;
        border-radius: 6px;
      }

      /* Section bar on mobile */
      .section-bar { padding: 0.9rem 1rem; }
      .section-title { font-size: 1rem; }
      .btn-add { padding: 0.5rem 0.85rem; font-size: 0.78rem; }

      /* Filter bar */
      .filter-bar { padding: 0.75rem 1rem; }
      .filter-select { max-width: 100%; }

      /* Form row collapses */
      .form-row { grid-template-columns: 1fr; }

      /* Modal full-screen feel */
      .modal-overlay { padding: 0; align-items: flex-end; }
      .modal-content {
        border-radius: 16px 16px 0 0;
        max-height: 94vh; width: 100%; max-width: 100%;
      }
    }
  `]
})
export class AdminComponent implements OnInit {
  activeTab: 'products' | 'categories' = 'products';
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategory = '';
  
  // Product modal
  editingProduct: Product | null = null;
  showProductModal = false;
  productData: any = {
    name: '',
    title: '',
    description: '',
    category: '',
    price: 0,
    discounted_price: null,
    weight: null,
    purity: '925 Silver',
    stock_quantity: 0,
    slug: '',
    in_stock: true,
    is_featured: false,
    is_active: true
  };

  // Category modal
  editingCategory: Category | null = null;
  showCategoryModal = false;
  categoryData: any = {
    name: '',
    display_name: '',
    description: '',
    is_active: true
  };

  saving = false;
  selectedProductFile: File | null = null;
  selectedCategoryFile: File | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  switchTab(tab: 'products' | 'categories'): void {
    this.activeTab = tab;
    if (tab === 'categories') {
      this.loadCategories();
    } else {
      this.loadProducts();
    }
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data: Category[]) => {
        this.categories = data;
      },
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  loadProducts(): void {
    const params = this.selectedCategory ? { category: this.selectedCategory } : {};
    this.productService.getProducts(params).subscribe({
      next: (data) => this.products = data.results,
      error: (err) => console.error('Error loading products:', err)
    });
  }

  // Product Modal Methods
  openAddProductModal(): void {
    this.showProductModal = true;
    this.editingProduct = null;
    this.resetProductForm();
  }

  editProduct(product: Product): void {
    this.editingProduct = product;
    this.productData = { ...product };
    this.showProductModal = true;
  }

  closeProductModal(): void {
    this.showProductModal = false;
    this.resetProductForm();
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          alert('Product deleted successfully');
          this.loadProducts();
        },
        error: (err) => {
          console.error('Error deleting product:', err);
          alert('Failed to delete product');
        }
      });
    }
  }

  saveProduct(): void {
    this.saving = true;
    const formData = new FormData();

    // Image fields must only be appended when a new file is selected —
    // sending the existing Cloudinary URL string would overwrite the stored image path.
    const imageFields = ['image', 'image_2', 'image_3'];

    Object.keys(this.productData).forEach(key => {
      if (imageFields.includes(key)) return;   // handled separately below
      const value = this.productData[key];
      if (value === null || value === undefined) return;
      if (typeof value === 'boolean') {
        formData.append(key, value ? 'true' : 'false');
      } else {
        formData.append(key, value.toString());
      }
    });

    if (this.selectedProductFile) {
      formData.append('image', this.selectedProductFile, this.selectedProductFile.name);
    }

    const request = this.editingProduct
      ? this.productService.updateProduct(this.editingProduct.id, formData)
      : this.productService.createProduct(formData);

    request.subscribe({
      next: (response) => {
        this.saving = false;
        alert(this.editingProduct ? 'Product updated successfully' : 'Product added successfully');
        this.closeProductModal();
        this.loadProducts();
      },
      error: (err) => {
        this.saving = false;
        console.error('Error saving product:', err);
        let errorMsg = 'Failed to save product';
        if (err.error) {
          if (typeof err.error === 'string') {
            errorMsg += ': ' + err.error;
          } else if (err.error.detail) {
            errorMsg += ': ' + err.error.detail;
          } else {
            const errors = Object.keys(err.error).map(key =>
              `${key}: ${Array.isArray(err.error[key]) ? err.error[key].join(', ') : err.error[key]}`
            ).join('\n');
            errorMsg += ':\n' + errors;
          }
        }
        alert(errorMsg);
      }
    });
  }

  resetProductForm(): void {
    this.editingProduct = null;
    this.productData = {
      name: '',
      title: '',
      description: '',
      category: '',
      price: 0,
      discounted_price: null,
      weight: null,
      purity: '925 Silver',
      stock_quantity: 0,
      slug: '',
      in_stock: true,
      is_featured: false,
      is_active: true
    };
    this.selectedProductFile = null;
  }

  // Category Modal Methods
  openAddCategoryModal(): void {
    this.showCategoryModal = true;
    this.editingCategory = null;
    this.resetCategoryForm();
  }

  editCategory(category: Category): void {
    this.editingCategory = category;
    this.categoryData = { ...category };
    this.showCategoryModal = true;
  }

  closeCategoryModal(): void {
    this.showCategoryModal = false;
    this.resetCategoryForm();
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category? This will affect all products in this category.')) {
      this.productService.deleteCategory(id).subscribe({
        next: () => {
          alert('Category deleted successfully');
          this.loadCategories();
        },
        error: (err) => {
          console.error('Error deleting category:', err);
          alert('Failed to delete category');
        }
      });
    }
  }

  saveCategory(): void {
    this.saving = true;
    const formData = new FormData();

    // Exclude 'image' — only append when a new file is chosen
    Object.keys(this.categoryData).forEach(key => {
      if (key === 'image') return;
      const value = this.categoryData[key];
      if (value === null || value === undefined) return;
      if (typeof value === 'boolean') {
        formData.append(key, value ? 'true' : 'false');
      } else {
        formData.append(key, value.toString());
      }
    });

    if (this.selectedCategoryFile) {
      formData.append('image', this.selectedCategoryFile, this.selectedCategoryFile.name);
    }

    const request = this.editingCategory
      ? this.productService.updateCategory(this.editingCategory.id, formData)
      : this.productService.createCategory(formData);

    request.subscribe({
      next: (response) => {
        this.saving = false;
        alert(this.editingCategory ? 'Category updated successfully' : 'Category added successfully');
        this.closeCategoryModal();
        this.loadCategories();
      },
      error: (err) => {
        this.saving = false;
        console.error('Error saving category:', err);
        let errorMsg = 'Failed to save category';
        if (err.error) {
          if (typeof err.error === 'string') {
            errorMsg += ': ' + err.error;
          } else if (err.error.detail) {
            errorMsg += ': ' + err.error.detail;
          } else {
            const errors = Object.keys(err.error).map(key =>
              `${key}: ${Array.isArray(err.error[key]) ? err.error[key].join(', ') : err.error[key]}`
            ).join('\n');
            errorMsg += ':\n' + errors;
          }
        }
        alert(errorMsg);
      }
    });
  }

  resetCategoryForm(): void {
    this.editingCategory = null;
    this.categoryData = {
      name: '',
      display_name: '',
      description: '',
      is_active: true
    };
    this.selectedCategoryFile = null;
  }

  onFileSelect(event: any, type: 'product' | 'category'): void {
    if (event.target.files.length > 0) {
      if (type === 'product') {
        this.selectedProductFile = event.target.files[0];
      } else {
        this.selectedCategoryFile = event.target.files[0];
      }
    }
  }
}

// Made with Bob
