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
    <div class="container">
      <h2 class="mt-4 mb-3">Admin Panel</h2>

      <!-- Tabs -->
      <div class="admin-tabs">
        <button 
          class="tab-btn" 
          [class.active]="activeTab === 'products'"
          (click)="switchTab('products')"
        >
          Products
        </button>
        <button 
          class="tab-btn" 
          [class.active]="activeTab === 'categories'"
          (click)="switchTab('categories')"
        >
          Categories
        </button>
      </div>

      <!-- Products Tab -->
      <div class="tab-content" *ngIf="activeTab === 'products'">
        <div class="header-row">
          <h3>Product Management</h3>
          <button class="btn btn-primary" (click)="openAddProductModal()">
            <span>+</span> Add Product
          </button>
        </div>
        
        <div class="filters mb-3">
          <select class="form-control" [(ngModel)]="selectedCategory" (change)="loadProducts()">
            <option value="">All Categories</option>
            <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.display_name }}</option>
          </select>
        </div>

        <div class="table-responsive" *ngIf="products.length > 0">
          <table class="table">
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
                <td><img [src]="product.image" [alt]="product.name" class="table-img"></td>
                <td>{{ product.name }}</td>
                <td>{{ product.category_name }}</td>
                <td>₹{{ product.price }}</td>
                <td>₹{{ product.discounted_price || '-' }}</td>
                <td>{{ product.in_stock ? 'Yes' : 'No' }}</td>
                <td>
                  <button class="btn btn-secondary btn-sm" (click)="editProduct(product)">Edit</button>
                  <button class="btn btn-danger btn-sm" (click)="deleteProduct(product.id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="no-records" *ngIf="products.length === 0">
          <p>No records available</p>
          <button class="btn btn-primary" (click)="openAddProductModal()">Add Your First Product</button>
        </div>
      </div>

      <!-- Categories Tab -->
      <div class="tab-content" *ngIf="activeTab === 'categories'">
        <div class="header-row">
          <h3>Category Management</h3>
          <button class="btn btn-primary" (click)="openAddCategoryModal()">
            <span>+</span> Add Category
          </button>
        </div>

        <div class="table-responsive" *ngIf="categories.length > 0">
          <table class="table">
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
                <td><img [src]="category.image" [alt]="category.name" class="table-img"></td>
                <td>{{ category.name }}</td>
                <td>{{ category.display_name }}</td>
                <td>{{ category.description || '-' }}</td>
                <td>{{ category.is_active ? 'Yes' : 'No' }}</td>
                <td>
                  <button class="btn btn-secondary btn-sm" (click)="editCategory(category)">Edit</button>
                  <button class="btn btn-danger btn-sm" (click)="deleteCategory(category.id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="no-records" *ngIf="categories.length === 0">
          <p>No categories available</p>
          <button class="btn btn-primary" (click)="openAddCategoryModal()">Add Your First Category</button>
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
                <input type="file" class="form-control" (change)="onFileSelect($event, 'product')" accept="image/*">
                <small class="text-muted">Optional - can be added later</small>
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
                <input type="file" class="form-control" (change)="onFileSelect($event, 'category')" accept="image/*">
                <small class="text-muted">Recommended: Square image for best display</small>
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
    .admin-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      border-bottom: 2px solid #e0e0e0;
    }

    .tab-btn {
      padding: 0.75rem 1.5rem;
      background: none;
      border: none;
      border-bottom: 3px solid transparent;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      color: #666;
      transition: all 0.3s ease;
    }

    .tab-btn:hover {
      color: #333;
      background: #f5f5f5;
    }

    .tab-btn.active {
      color: #007bff;
      border-bottom-color: #007bff;
    }

    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .tab-content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .table {
      width: 100%;
      border-collapse: collapse;
    }

    .table th,
    .table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    .table-img {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
    }

    .no-records {
      text-align: center;
      padding: 3rem;
      color: #666;
    }

    .no-records p {
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 8px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #eee;
    }

    .modal-header h3 {
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 2rem;
      cursor: pointer;
      color: #666;
      line-height: 1;
    }

    .close-btn:hover {
      color: #000;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
      margin-top: 1rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .btn-sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
      margin-right: 0.5rem;
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;
      border: none;
    }

    .btn-danger:hover {
      background-color: #c82333;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .modal-content {
        width: 95%;
        max-height: 95vh;
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
  selectedFile: File | null = null;

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

    Object.keys(this.productData).forEach(key => {
      const value = this.productData[key];
      if (value !== null && value !== '' && value !== undefined) {
        if (typeof value === 'boolean') {
          formData.append(key, value ? 'true' : 'false');
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
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
    this.selectedFile = null;
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

    Object.keys(this.categoryData).forEach(key => {
      const value = this.categoryData[key];
      if (value !== null && value !== '' && value !== undefined) {
        if (typeof value === 'boolean') {
          formData.append(key, value ? 'true' : 'false');
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
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
    this.selectedFile = null;
  }

  onFileSelect(event: any, type: 'product' | 'category'): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }
}

// Made with Bob
