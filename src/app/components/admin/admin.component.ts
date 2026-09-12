import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import {
  Product, Category, NotificationBar, LeadspaceBanner,
  StorySection, WhyChooseCard
} from '../../models/product.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-wrap">
      <div class="admin-header">
        <h2 class="admin-title">Admin Panel</h2>
      </div>

      <!-- Navigation Tabs -->
      <div class="admin-tabs">
        <button class="tab-btn" [class.active]="activeTab === 'products'" (click)="switchTab('products')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          Products
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'categories'" (click)="switchTab('categories')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          Categories
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'notifications'" (click)="switchTab('notifications')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          Notification Bar
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'leadspace'" (click)="switchTab('leadspace')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          Leadspace Banner
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'story'" (click)="switchTab('story')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          Our Story
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'why-choose'" (click)="switchTab('why-choose')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
          Why Choose Us
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'spin-wheel'" (click)="switchTab('spin-wheel')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07 19.07 4.93"/></svg>
          Spin Wheel Slices
        </button>
      </div>

      <!-- ══════════════ 1. PRODUCTS TAB ══════════════ -->
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

        <div class="empty-state" *ngIf="products.length === 0">
          <p>No products found</p>
          <button class="btn-add" (click)="openAddProductModal()">Add Product</button>
        </div>
      </div>

      <!-- ══════════════ 2. CATEGORIES TAB ══════════════ -->
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
      </div>

      <!-- ══════════════ 3. NOTIFICATION BAR TAB ══════════════ -->
      <div class="tab-content" *ngIf="activeTab === 'notifications'">
        <div class="section-bar">
          <div class="section-bar-left">
            <h3 class="section-title">Homepage Notification Bar</h3>
            <span class="section-count">{{ notificationBars.length }} message{{ notificationBars.length !== 1 ? 's' : '' }}</span>
          </div>
          <button class="btn-add" (click)="openAddNotificationModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Notification
          </button>
        </div>

        <div class="info-card">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          <span>The active notification bar text will scroll at the top of the homepage. You can enable/disable items or add multiple announcements.</span>
        </div>

        <div class="table-wrap" *ngIf="notificationBars.length > 0">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Notification Text</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let notif of notificationBars">
                <td data-label="Order"><span class="order-badge">{{ notif.display_order }}</span></td>
                <td data-label="Text"><span class="cell-primary">{{ notif.text }}</span></td>
                <td data-label="Active">
                  <span class="stock-badge" [class.in]="notif.is_active" [class.out]="!notif.is_active">
                    {{ notif.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td data-label="Actions" class="actions-cell">
                  <button class="btn-icon edit" (click)="editNotification(notif)" title="Edit">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit
                  </button>
                  <button class="btn-icon del" (click)="deleteNotification(notif.id)" title="Delete">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="empty-state" *ngIf="notificationBars.length === 0">
          <p>No notification text configured yet.</p>
          <button class="btn-add" (click)="openAddNotificationModal()">Create First Notification</button>
        </div>
      </div>

      <!-- ══════════════ 4. LEADSPACE BANNER TAB ══════════════ -->
      <div class="tab-content" *ngIf="activeTab === 'leadspace'">
        <div class="section-bar">
          <div class="section-bar-left">
            <h3 class="section-title">Leadspace Hero Banner</h3>
            <span class="section-count">Edit the top hero section texts, discount badge, button, and banner image</span>
          </div>
        </div>

        <div class="panel-form-card" *ngIf="leadspaceData">
          <form (ngSubmit)="saveLeadspace()">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Eyebrow Tag</label>
                <input type="text" class="form-control" [(ngModel)]="leadspaceData.eyebrow" name="ls_eyebrow" placeholder="e.g. New Collection · 2026" required>
              </div>
              <div class="form-group">
                <label class="form-label">Main Title (Multi-line supported)</label>
                <textarea class="form-control" [(ngModel)]="leadspaceData.title" name="ls_title" rows="2" placeholder="e.g. Vanki&#10;Rings" required></textarea>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Description Line 1</label>
                <input type="text" class="form-control" [(ngModel)]="leadspaceData.desc_line1" name="ls_desc1" required>
              </div>
              <div class="form-group">
                <label class="form-label">Description Line 2</label>
                <input type="text" class="form-control" [(ngModel)]="leadspaceData.desc_line2" name="ls_desc2">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Offer Percentage / Tag</label>
                <input type="text" class="form-control" [(ngModel)]="leadspaceData.offer_pct" name="ls_offer_pct" placeholder="e.g. 20% OFF">
              </div>
              <div class="form-group">
                <label class="form-label">Offer Description Label</label>
                <input type="text" class="form-control" [(ngModel)]="leadspaceData.offer_label" name="ls_offer_lbl" placeholder="e.g. on all Vanki Rings · Limited Time">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Button Text</label>
                <input type="text" class="form-control" [(ngModel)]="leadspaceData.button_text" name="ls_btn_text" required>
              </div>
              <div class="form-group">
                <label class="form-label">Button Link</label>
                <input type="text" class="form-control" [(ngModel)]="leadspaceData.button_link" name="ls_btn_link" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Trust Tag 1</label>
                <input type="text" class="form-control" [(ngModel)]="leadspaceData.trust_tag1" name="ls_trust1" placeholder="e.g. 925 Certified">
              </div>
              <div class="form-group">
                <label class="form-label">Trust Tag 2</label>
                <input type="text" class="form-control" [(ngModel)]="leadspaceData.trust_tag2" name="ls_trust2" placeholder="e.g. Free Shipping">
              </div>
              <div class="form-group">
                <label class="form-label">Trust Tag 3</label>
                <input type="text" class="form-control" [(ngModel)]="leadspaceData.trust_tag3" name="ls_trust3" placeholder="e.g. Easy Returns">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Banner Image</label>
              <div *ngIf="leadspaceData.image && !selectedLeadspaceFile" class="current-image-preview">
                <img [src]="leadspaceData.image" alt="Current hero banner" class="preview-img">
                <div class="preview-info">
                  <span class="preview-label">Current Banner Image</span>
                  <small class="preview-hint">Upload a new image below to replace it.</small>
                </div>
              </div>
              <div *ngIf="selectedLeadspaceFile" class="current-image-preview new-file">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <div class="preview-info">
                  <span class="preview-label">New image selected</span>
                  <small class="preview-hint">{{ selectedLeadspaceFile.name }}</small>
                </div>
                <button type="button" class="clear-file-btn" (click)="selectedLeadspaceFile = null">✕</button>
              </div>
              <input type="file" class="form-control" (change)="onFileSelect($event, 'leadspace')" accept="image/*">
            </div>

            <div class="form-group">
              <label class="form-label checkbox-label">
                <input type="checkbox" [(ngModel)]="leadspaceData.is_active" name="ls_is_active">
                <span>Active (Display this banner on homepage)</span>
              </label>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary" [disabled]="saving">
                {{ saving ? 'Saving Changes...' : 'Save Leadspace Banner' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- ══════════════ 5. OUR STORY TAB ══════════════ -->
      <div class="tab-content" *ngIf="activeTab === 'story'">
        <div class="section-bar">
          <div class="section-bar-left">
            <h3 class="section-title">Our Story / About Section</h3>
            <span class="section-count">Edit title, paragraphs, stat numbers, badges, and image</span>
          </div>
        </div>

        <div class="panel-form-card" *ngIf="storyData">
          <form (ngSubmit)="saveStory()">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Eyebrow</label>
                <input type="text" class="form-control" [(ngModel)]="storyData.eyebrow" name="st_eyebrow" required>
              </div>
              <div class="form-group">
                <label class="form-label">Section Title</label>
                <input type="text" class="form-control" [(ngModel)]="storyData.title" name="st_title" required>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Paragraph 1</label>
              <textarea class="form-control" [(ngModel)]="storyData.paragraph_1" name="st_p1" rows="3" required></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Paragraph 2</label>
              <textarea class="form-control" [(ngModel)]="storyData.paragraph_2" name="st_p2" rows="3"></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Badge Number (e.g. 925)</label>
                <input type="text" class="form-control" [(ngModel)]="storyData.badge_number" name="st_bnum">
              </div>
              <div class="form-group">
                <label class="form-label">Badge Label (e.g. Hallmarked Silver)</label>
                <input type="text" class="form-control" [(ngModel)]="storyData.badge_label" name="st_blbl">
              </div>
            </div>

            <div class="stats-row">
              <div class="stat-col">
                <label class="form-label">Stat 1 Value</label>
                <input type="text" class="form-control" [(ngModel)]="storyData.stat1_value" name="st_s1v" placeholder="100+">
                <label class="form-label stat-lbl-field">Stat 1 Label</label>
                <input type="text" class="form-control" [(ngModel)]="storyData.stat1_label" name="st_s1l" placeholder="Unique Designs">
              </div>
              <div class="stat-col">
                <label class="form-label">Stat 2 Value</label>
                <input type="text" class="form-control" [(ngModel)]="storyData.stat2_value" name="st_s2v" placeholder="500+">
                <label class="form-label stat-lbl-field">Stat 2 Label</label>
                <input type="text" class="form-control" [(ngModel)]="storyData.stat2_label" name="st_s2l" placeholder="Happy Customers">
              </div>
              <div class="stat-col">
                <label class="form-label">Stat 3 Value</label>
                <input type="text" class="form-control" [(ngModel)]="storyData.stat3_value" name="st_s3v" placeholder="925">
                <label class="form-label stat-lbl-field">Stat 3 Label</label>
                <input type="text" class="form-control" [(ngModel)]="storyData.stat3_label" name="st_s3l" placeholder="Silver Purity">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Button Text</label>
                <input type="text" class="form-control" [(ngModel)]="storyData.button_text" name="st_btn_t">
              </div>
              <div class="form-group">
                <label class="form-label">Button Link</label>
                <input type="text" class="form-control" [(ngModel)]="storyData.button_link" name="st_btn_l">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Story Image (Optional)</label>
              <div *ngIf="storyData.image && !selectedStoryFile" class="current-image-preview">
                <img [src]="storyData.image" alt="Current story image" class="preview-img">
                <div class="preview-info">
                  <span class="preview-label">Current Story Image</span>
                  <small class="preview-hint">Upload a replacement image below.</small>
                </div>
              </div>
              <div *ngIf="selectedStoryFile" class="current-image-preview new-file">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <div class="preview-info">
                  <span class="preview-label">New image selected</span>
                  <small class="preview-hint">{{ selectedStoryFile.name }}</small>
                </div>
                <button type="button" class="clear-file-btn" (click)="selectedStoryFile = null">✕</button>
              </div>
              <input type="file" class="form-control" (change)="onFileSelect($event, 'story')" accept="image/*">
            </div>

            <div class="form-group">
              <label class="form-label checkbox-label">
                <input type="checkbox" [(ngModel)]="storyData.is_active" name="st_is_active">
                <span>Active (Display Our Story on homepage)</span>
              </label>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary" [disabled]="saving">
                {{ saving ? 'Saving Changes...' : 'Save Story Section' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- ══════════════ 6. WHY CHOOSE US TAB ══════════════ -->
      <div class="tab-content" *ngIf="activeTab === 'why-choose'">
        <div class="section-bar">
          <div class="section-bar-left">
            <h3 class="section-title">Why Choose Kasavelli Cards</h3>
            <span class="section-count">{{ whyCards.length }} card{{ whyCards.length !== 1 ? 's' : '' }}</span>
          </div>
          <button class="btn-add" (click)="openAddWhyCardModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Card
          </button>
        </div>

        <div class="table-wrap" *ngIf="whyCards.length > 0">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Icon</th>
                <th>Title</th>
                <th>Description</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let card of whyCards">
                <td data-label="Order"><span class="order-badge">{{ card.display_order }}</span></td>
                <td data-label="Icon"><span class="cat-chip">{{ card.icon_type }}</span></td>
                <td data-label="Title"><span class="cell-primary">{{ card.title }}</span></td>
                <td data-label="Description"><span class="desc-text">{{ card.description }}</span></td>
                <td data-label="Active">
                  <span class="stock-badge" [class.in]="card.is_active" [class.out]="!card.is_active">
                    {{ card.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td data-label="Actions" class="actions-cell">
                  <button class="btn-icon edit" (click)="editWhyCard(card)" title="Edit">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit
                  </button>
                  <button class="btn-icon del" (click)="deleteWhyCard(card.id)" title="Delete">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="empty-state" *ngIf="whyCards.length === 0">
          <p>No cards configured yet.</p>
          <button class="btn-add" (click)="openAddWhyCardModal()">Add First Card</button>
        </div>
      </div>

      <!-- ══════════════ 7. SPIN WHEEL SLICES TAB ══════════════ -->
      <div class="tab-content" *ngIf="activeTab === 'spin-wheel'">
        <div class="section-bar">
          <div class="section-bar-left">
            <h3 class="section-title">Spin Wheel Slices</h3>
            <span class="section-count">{{ spinSlices.length }} slice{{ spinSlices.length !== 1 ? 's' : '' }}</span>
          </div>
          <button class="btn-add" (click)="openAddSpinSliceModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Slice
          </button>
        </div>

        <div class="table-wrap" *ngIf="spinSlices.length > 0">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Label</th>
                <th>Discount %</th>
                <th>Preview Color</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let slice of spinSlices">
                <td><span class="order-badge">#{{ slice.display_order }}</span></td>
                <td><strong>{{ slice.label }}</strong></td>
                <td>
                  <span class="pct-pill" [class.zero-pct]="slice.percentage === 0">
                    {{ slice.percentage > 0 ? slice.percentage + '% OFF' : 'No Discount (Better Luck)' }}
                  </span>
                </td>
                <td>
                  <div class="slice-preview-pill" [style.background-color]="slice.color" [style.color]="slice.text_color">
                    {{ slice.label }}
                  </div>
                </td>
                <td>
                  <span class="status-badge" [class.active]="slice.is_active" [class.inactive]="!slice.is_active">
                    {{ slice.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <div class="action-btns">
                    <button class="btn-action edit" (click)="editSpinSlice(slice)" title="Edit">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="btn-action delete" (click)="deleteSpinSlice(slice.id)" title="Delete">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="empty-state" *ngIf="spinSlices.length === 0">
          <p>No spin wheel slices configured yet. Add slices to customize the wheel discounts.</p>
          <button class="btn-add" (click)="openAddSpinSliceModal()">Add First Slice</button>
        </div>
      </div>

      <!-- ══════════════ MODALS ══════════════ -->

      <!-- 1. Product Modal -->
      <div class="modal-overlay" *ngIf="showProductModal" (click)="closeProductModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ editingProduct ? 'Edit Product' : 'Add New Product' }}</h3>
            <button class="close-btn" (click)="closeProductModal()">&times;</button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="saveProduct()">
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
                <textarea class="form-control" [(ngModel)]="productData.description" name="description" rows="3" required></textarea>
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
                  <input type="text" class="form-control" [(ngModel)]="productData.purity" name="purity">
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
              <div class="form-row">
                <label class="form-label checkbox-label">
                  <input type="checkbox" [(ngModel)]="productData.in_stock" name="in_stock">
                  <span>In Stock</span>
                </label>
                <label class="form-label checkbox-label">
                  <input type="checkbox" [(ngModel)]="productData.is_featured" name="is_featured">
                  <span>Featured</span>
                </label>
              </div>
              <div class="form-group">
                <label class="form-label">Product Image</label>
                <div *ngIf="productData.image && !selectedProductFile" class="current-image-preview">
                  <img [src]="productData.image" alt="Current image" class="preview-img">
                  <div class="preview-info">
                    <span class="preview-label">Current image</span>
                    <small class="preview-hint">Upload a replacement below, or keep existing.</small>
                  </div>
                </div>
                <input type="file" class="form-control" (change)="onFileSelect($event, 'product')" accept="image/*">
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

      <!-- 2. Category Modal -->
      <div class="modal-overlay" *ngIf="showCategoryModal" (click)="closeCategoryModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ editingCategory ? 'Edit Category' : 'Add New Category' }}</h3>
            <button class="close-btn" (click)="closeCategoryModal()">&times;</button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="saveCategory()">
              <div class="form-group">
                <label class="form-label">Category Name (Slug)</label>
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
              </div>
              <div class="form-group">
                <label class="form-label">Display Name</label>
                <input type="text" class="form-control" [(ngModel)]="categoryData.display_name" name="display_name" required>
              </div>
              <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-control" [(ngModel)]="categoryData.description" name="description" rows="3"></textarea>
              </div>
              <div class="form-group">
                <label class="form-label checkbox-label">
                  <input type="checkbox" [(ngModel)]="categoryData.is_active" name="is_active">
                  <span>Active</span>
                </label>
              </div>
              <div class="form-group">
                <label class="form-label">Category Image</label>
                <div *ngIf="categoryData.image && !selectedCategoryFile" class="current-image-preview">
                  <img [src]="categoryData.image" alt="Current image" class="preview-img">
                </div>
                <input type="file" class="form-control" (change)="onFileSelect($event, 'category')" accept="image/*">
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

      <!-- 3. Notification Bar Modal -->
      <div class="modal-overlay" *ngIf="showNotificationModal" (click)="closeNotificationModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ editingNotification ? 'Edit Notification' : 'Add Notification' }}</h3>
            <button class="close-btn" (click)="closeNotificationModal()">&times;</button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="saveNotification()">
              <div class="form-group">
                <label class="form-label">Announcement Text</label>
                <textarea class="form-control" [(ngModel)]="notificationData.text" name="notif_text" rows="3" placeholder="e.g. Free shipping on orders above ₹999 · 30-Day easy returns" required></textarea>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Display Order</label>
                  <input type="number" class="form-control" [(ngModel)]="notificationData.display_order" name="notif_order" required>
                </div>
                <div class="form-group checkbox-align">
                  <label class="form-label checkbox-label">
                    <input type="checkbox" [(ngModel)]="notificationData.is_active" name="notif_active">
                    <span>Active</span>
                  </label>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="closeNotificationModal()">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="saving">
                  {{ saving ? 'Saving...' : (editingNotification ? 'Update Notification' : 'Add Notification') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- 4. Why Choose Card Modal -->
      <div class="modal-overlay" *ngIf="showWhyCardModal" (click)="closeWhyCardModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ editingWhyCard ? 'Edit Card' : 'Add Card' }}</h3>
            <button class="close-btn" (click)="closeWhyCardModal()">&times;</button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="saveWhyCard()">
              <div class="form-group">
                <label class="form-label">Title</label>
                <input type="text" class="form-control" [(ngModel)]="whyCardData.title" name="wc_title" placeholder="e.g. 925 Certified Silver" required>
              </div>
              <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-control" [(ngModel)]="whyCardData.description" name="wc_desc" rows="3" required></textarea>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Icon Type</label>
                  <select class="form-control" [(ngModel)]="whyCardData.icon_type" name="wc_icon" required>
                    <option value="shield">Shield / Certified</option>
                    <option value="heart">Heart / Handpicked</option>
                    <option value="truck">Truck / Fast Delivery</option>
                    <option value="returns">Trending / 30-Day Returns</option>
                    <option value="gift">Gift / Packaging</option>
                    <option value="sparkles">Sparkles / Made in India</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Display Order</label>
                  <input type="number" class="form-control" [(ngModel)]="whyCardData.display_order" name="wc_order" required>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label checkbox-label">
                  <input type="checkbox" [(ngModel)]="whyCardData.is_active" name="wc_active">
                  <span>Active</span>
                </label>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="closeWhyCardModal()">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="saving">
                  {{ saving ? 'Saving...' : (editingWhyCard ? 'Update Card' : 'Add Card') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- 5. Spin Wheel Slice Modal -->
      <div class="modal-overlay" *ngIf="showSpinSliceModal" (click)="closeSpinSliceModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ editingSpinSlice ? 'Edit Spin Wheel Slice' : 'Add Spin Wheel Slice' }}</h3>
            <button class="close-btn" (click)="closeSpinSliceModal()">&times;</button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="saveSpinSlice()">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Slice Label</label>
                  <input type="text" class="form-control" [(ngModel)]="spinSliceData.label" name="sw_label" placeholder="e.g. 10% OFF or Better Luck!" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Discount Percentage (%)</label>
                  <input type="number" class="form-control" [(ngModel)]="spinSliceData.percentage" name="sw_pct" min="0" max="100" placeholder="0 for Better Luck" required>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Background Color</label>
                  <div class="color-picker-wrap">
                    <input type="color" [(ngModel)]="spinSliceData.color" name="sw_color_p">
                    <input type="text" class="form-control" [(ngModel)]="spinSliceData.color" name="sw_color" placeholder="#551756">
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">Text Color</label>
                  <div class="color-picker-wrap">
                    <input type="color" [(ngModel)]="spinSliceData.text_color" name="sw_tcolor_p">
                    <input type="text" class="form-control" [(ngModel)]="spinSliceData.text_color" name="sw_tcolor" placeholder="#e8c547">
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Slice Live Preview</label>
                <div class="slice-live-preview" [style.background-color]="spinSliceData.color" [style.color]="spinSliceData.text_color">
                  {{ spinSliceData.label || 'Preview' }}
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Display Order</label>
                  <input type="number" class="form-control" [(ngModel)]="spinSliceData.display_order" name="sw_order" required>
                </div>
                <div class="form-group checkbox-align">
                  <label class="form-label checkbox-label">
                    <input type="checkbox" [(ngModel)]="spinSliceData.is_active" name="sw_active">
                    <span>Active</span>
                  </label>
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="closeSpinSliceModal()">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="saving">
                  {{ saving ? 'Saving...' : (editingSpinSlice ? 'Update Slice' : 'Add Slice') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host {
      --royal: #551756;
      --royal-mid: #702072;
      --royal-dark: #3a0e3b;
      --gold: #c9a84c;
      --gold-light: #e8c547;
      --bg: #f8f6fa;
      --card-bg: #ffffff;
      --border: #e6dfec;
      --text: #1a1a2e;
      --muted: #6b6b7b;
      --green: #15803d;
      --green-bg: #dcfce7;
      --red: #b91c1c;
      --red-bg: #fee2e2;
    }

    .admin-wrap {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1.5rem 4rem;
    }

    .admin-header {
      margin-bottom: 1.5rem;
    }
    .admin-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--royal-dark);
      margin: 0;
    }

    /* Tabs */
    .admin-tabs {
      display: flex;
      gap: 0.5rem;
      border-bottom: 2px solid var(--border);
      margin-bottom: 2rem;
      overflow-x: auto;
      padding-bottom: 1px;
    }
    .tab-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--muted);
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .tab-btn:hover {
      color: var(--royal);
    }
    .tab-btn.active {
      color: var(--royal);
      border-bottom-color: var(--royal);
    }

    /* Section Bar */
    .section-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
    }
    .section-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--royal-dark);
      margin: 0 0 0.25rem;
    }
    .section-count {
      font-size: 0.85rem;
      color: var(--muted);
    }

    .info-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.85rem 1.15rem;
      background: #fdf8e6;
      border: 1px solid #f3e5ab;
      border-radius: 8px;
      color: #7a5e00;
      font-size: 0.88rem;
      margin-bottom: 1.25rem;
    }

    .filter-bar {
      margin-bottom: 1.25rem;
    }
    .filter-select {
      padding: 0.55rem 1rem;
      border: 1px solid var(--border);
      border-radius: 6px;
      background: #fff;
      font-size: 0.9rem;
      color: var(--text);
    }

    .btn-add {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.6rem 1.2rem;
      background: var(--royal);
      color: #efebe1;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-add:hover {
      background: var(--royal-mid);
    }

    /* Tables */
    .table-wrap {
      background: #fff;
      border-radius: 10px;
      border: 1px solid var(--border);
      overflow-x: auto;
    }
    .admin-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    .admin-table th {
      padding: 0.9rem 1rem;
      background: #faf8fc;
      border-bottom: 1px solid var(--border);
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--muted);
      font-weight: 700;
    }
    .admin-table td {
      padding: 0.9rem 1rem;
      border-bottom: 1px solid var(--border);
      font-size: 0.9rem;
      color: var(--text);
      vertical-align: middle;
    }
    .admin-table tr:last-child td {
      border-bottom: none;
    }

    .table-img {
      width: 44px;
      height: 44px;
      object-fit: cover;
      border-radius: 6px;
      border: 1px solid var(--border);
    }
    .no-img-placeholder {
      width: 44px;
      height: 44px;
      border-radius: 6px;
      background: #f5f0f5;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--muted);
    }

    .cell-primary {
      font-weight: 600;
      color: var(--royal-dark);
    }
    .cat-chip {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      background: #f3ecf5;
      color: var(--royal);
      border-radius: 4px;
      font-size: 0.78rem;
      font-weight: 600;
    }
    .order-badge {
      display: inline-block;
      padding: 0.2rem 0.55rem;
      background: #f0ecf8;
      color: var(--royal-dark);
      border-radius: 4px;
      font-weight: 700;
      font-size: 0.82rem;
    }
    .price-val { font-weight: 700; }
    .price-disc { color: var(--green); font-weight: 700; }
    .price-none { color: var(--muted); }
    .desc-text {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      max-width: 300px;
      color: var(--muted);
      font-size: 0.85rem;
    }

    .stock-badge {
      display: inline-block;
      padding: 0.25rem 0.65rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
    }
    .stock-badge.in {
      background: var(--green-bg);
      color: var(--green);
    }
    .stock-badge.out {
      background: var(--red-bg);
      color: var(--red);
    }

    .actions-cell {
      display: flex;
      gap: 0.5rem;
    }
    .btn-icon {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.45rem 0.75rem;
      border-radius: 5px;
      border: 1px solid var(--border);
      background: #fff;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-icon.edit:hover {
      background: #f5f0f5;
      color: var(--royal);
      border-color: var(--royal);
    }
    .btn-icon.del:hover {
      background: var(--red-bg);
      color: var(--red);
      border-color: #fca5a5;
    }

    /* Panel Form Card for single-record sections */
    .panel-form-card {
      background: #fff;
      border-radius: 12px;
      border: 1px solid var(--border);
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.03);
    }
    .form-group {
      margin-bottom: 1.25rem;
    }
    .form-group.checkbox-align {
      display: flex;
      align-items: flex-end;
      padding-bottom: 0.6rem;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
    }
    .form-label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--royal-dark);
      margin-bottom: 0.4rem;
    }
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      cursor: pointer;
      font-weight: 500;
      color: var(--text);
    }
    .checkbox-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: var(--royal);
      cursor: pointer;
    }
    .form-control {
      width: 100%;
      padding: 0.65rem 0.9rem;
      border: 1px solid var(--border);
      border-radius: 6px;
      font-size: 0.92rem;
      font-family: inherit;
      color: var(--text);
      background: #faf8fc;
      transition: border-color 0.2s, background 0.2s;
      box-sizing: border-box;
    }
    .form-control:focus {
      outline: none;
      border-color: var(--royal);
      background: #fff;
    }

    .stats-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 1rem;
      background: #faf8fc;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 1.25rem;
      margin-bottom: 1.25rem;
    }
    .stat-lbl-field {
      margin-top: 0.6rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 1.5rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--border);
    }

    .color-picker-wrap {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .color-picker-wrap input[type="color"] {
      width: 42px;
      height: 40px;
      padding: 2px;
      border: 1px solid var(--border);
      border-radius: 6px;
      cursor: pointer;
      background: #fff;
    }

    .slice-live-preview {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-family: 'Raleway', sans-serif;
      font-weight: 700;
      font-size: 1rem;
      letter-spacing: 1px;
      border: 1px solid var(--border);
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      text-align: center;
    }
    .slice-preview-pill {
      display: inline-block;
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-weight: 700;
      font-size: 0.8rem;
      letter-spacing: 0.5px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
    }
    .pct-pill {
      display: inline-block;
      padding: 0.25rem 0.6rem;
      background: #fdf6e2;
      color: #946800;
      font-weight: 700;
      font-size: 0.8rem;
      border-radius: 12px;
      border: 1px solid #e8c547;
    }
    .pct-pill.zero-pct {
      background: #f1f0f4;
      color: #716e7a;
      border-color: #d2cfda;
    }

    /* Modal styles */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1.5rem;
    }
    .modal-content {
      background: #fff;
      border-radius: 12px;
      max-width: 650px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border);
    }
    .modal-header h3 {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--royal-dark);
      margin: 0;
    }
    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      line-height: 1;
      color: var(--muted);
      cursor: pointer;
    }
    .modal-body {
      padding: 1.5rem;
    }
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--border);
      margin-top: 1.25rem;
    }

    .current-image-preview {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
      padding: 10px;
      background: #faf8fc;
      border-radius: 8px;
      border: 1px solid var(--border);
    }
    .current-image-preview.new-file {
      background: #f0faf3;
      border-color: #a8d5b5;
      color: var(--green);
    }
    .preview-img {
      width: 64px;
      height: 64px;
      object-fit: cover;
      border-radius: 6px;
      border: 1px solid var(--border);
    }
    .preview-info { flex: 1; min-width: 0; }
    .preview-label { display: block; font-size: 0.82rem; font-weight: 700; color: var(--text); }
    .preview-hint { display: block; font-size: 0.75rem; color: var(--muted); }
    .clear-file-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--muted);
      font-size: 1rem;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      padding: 0.6rem 1.3rem;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-primary { background: var(--royal); color: #efebe1; }
    .btn-primary:hover { background: var(--royal-mid); }
    .btn-secondary { background: #f0ecf8; color: var(--royal-dark); }
    .btn-secondary:hover { background: #e2d8ee; }

    .empty-state {
      text-align: center;
      padding: 3rem 1.5rem;
      background: #fff;
      border-radius: 10px;
      border: 1px solid var(--border);
    }
    .empty-state p {
      color: var(--muted);
      margin-bottom: 1.25rem;
    }

    @media (max-width: 768px) {
      .form-row, .stats-row {
        grid-template-columns: 1fr;
      }
      .panel-form-card {
        padding: 1.25rem;
      }
    }
  `]
})
export class AdminComponent implements OnInit {
  activeTab: 'products' | 'categories' | 'notifications' | 'leadspace' | 'story' | 'why-choose' | 'spin-wheel' = 'products';
  
  // Data lists
  products: Product[] = [];
  categories: Category[] = [];
  notificationBars: NotificationBar[] = [];
  whyCards: WhyChooseCard[] = [];
  spinSlices: any[] = [];
  
  // Single-record forms
  leadspaceData: LeadspaceBanner | null = null;
  storyData: StorySection | null = null;
  
  selectedCategory = '';
  saving = false;

  // Modals & form state
  showProductModal = false;
  editingProduct: Product | null = null;
  productData: any = {
    name: '', title: '', description: '', category: '',
    price: 0, discounted_price: null, weight: null, purity: '925 Silver',
    stock_quantity: 0, slug: '', in_stock: true, is_featured: false, is_active: true
  };
  selectedProductFile: File | null = null;

  showCategoryModal = false;
  editingCategory: Category | null = null;
  categoryData: any = { name: '', display_name: '', description: '', is_active: true };
  selectedCategoryFile: File | null = null;

  showNotificationModal = false;
  editingNotification: NotificationBar | null = null;
  notificationData: any = { text: '', display_order: 1, is_active: true };

  selectedLeadspaceFile: File | null = null;
  selectedStoryFile: File | null = null;

  showWhyCardModal = false;
  editingWhyCard: WhyChooseCard | null = null;
  whyCardData: any = {
    title: '', description: '', icon_type: 'shield', display_order: 1, is_active: true
  };

  showSpinSliceModal = false;
  editingSpinSlice: any = null;
  spinSliceData: any = {
    label: '', percentage: 0, color: '#551756', text_color: '#e8c547',
    display_order: 1, is_active: true
  };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  switchTab(tab: 'products' | 'categories' | 'notifications' | 'leadspace' | 'story' | 'why-choose' | 'spin-wheel'): void {
    this.activeTab = tab;
    if (tab === 'products') this.loadProducts();
    else if (tab === 'categories') this.loadCategories();
    else if (tab === 'notifications') this.loadNotifications();
    else if (tab === 'leadspace') this.loadLeadspace();
    else if (tab === 'story') this.loadStory();
    else if (tab === 'why-choose') this.loadWhyCards();
    else if (tab === 'spin-wheel') this.loadSpinSlices();
  }

  // ── 1. Products ──
  loadProducts(): void {
    const params = this.selectedCategory ? { category: this.selectedCategory } : {};
    this.productService.getProducts(params).subscribe({
      next: (data) => this.products = data.results,
      error: (err) => console.error('Error loading products:', err)
    });
  }

  openAddProductModal(): void {
    this.editingProduct = null;
    this.productData = {
      name: '', title: '', description: '', category: '',
      price: 0, discounted_price: null, weight: null, purity: '925 Silver',
      stock_quantity: 0, slug: '', in_stock: true, is_featured: false, is_active: true
    };
    this.selectedProductFile = null;
    this.showProductModal = true;
  }

  editProduct(product: Product): void {
    this.productService.getProductById(product.id).subscribe({
      next: (detail) => {
        this.editingProduct = detail;
        this.productData = { ...detail };
        this.selectedProductFile = null;
        this.showProductModal = true;
      },
      error: () => {
        this.editingProduct = product;
        this.productData = { ...product };
        this.selectedProductFile = null;
        this.showProductModal = true;
      }
    });
  }

  closeProductModal(): void {
    this.showProductModal = false;
    this.editingProduct = null;
  }

  saveProduct(): void {
    this.saving = true;
    const formData = new FormData();
    const imageFields = ['image', 'image_2', 'image_3'];

    Object.keys(this.productData).forEach(key => {
      if (imageFields.includes(key)) return;
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

    const req = this.editingProduct
      ? this.productService.updateProduct(this.editingProduct.id, formData)
      : this.productService.createProduct(formData);

    req.subscribe({
      next: () => {
        this.saving = false;
        alert(this.editingProduct ? 'Product updated successfully' : 'Product added successfully');
        this.closeProductModal();
        this.loadProducts();
      },
      error: (err) => {
        this.saving = false;
        console.error('Error saving product:', err);
        alert('Failed to save product');
      }
    });
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          alert('Product deleted successfully');
          this.loadProducts();
        },
        error: (err) => console.error('Error deleting product:', err)
      });
    }
  }

  // ── 2. Categories ──
  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data: Category[]) => this.categories = data,
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  openAddCategoryModal(): void {
    this.editingCategory = null;
    this.categoryData = { name: '', display_name: '', description: '', is_active: true };
    this.selectedCategoryFile = null;
    this.showCategoryModal = true;
  }

  editCategory(category: Category): void {
    this.editingCategory = category;
    this.categoryData = { ...category };
    this.selectedCategoryFile = null;
    this.showCategoryModal = true;
  }

  closeCategoryModal(): void {
    this.showCategoryModal = false;
    this.editingCategory = null;
  }

  saveCategory(): void {
    this.saving = true;
    const formData = new FormData();
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

    const req = this.editingCategory
      ? this.productService.updateCategory(this.editingCategory.id, formData)
      : this.productService.createCategory(formData);

    req.subscribe({
      next: () => {
        this.saving = false;
        alert(this.editingCategory ? 'Category updated successfully' : 'Category added successfully');
        this.closeCategoryModal();
        this.loadCategories();
      },
      error: (err) => {
        this.saving = false;
        console.error('Error saving category:', err);
        alert('Failed to save category');
      }
    });
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.productService.deleteCategory(id).subscribe({
        next: () => {
          alert('Category deleted successfully');
          this.loadCategories();
        },
        error: (err) => console.error('Error deleting category:', err)
      });
    }
  }

  // ── 3. Notification Bars ──
  loadNotifications(): void {
    this.productService.getNotificationBars().subscribe({
      next: (data) => this.notificationBars = data,
      error: (err) => console.error('Error loading notifications:', err)
    });
  }

  openAddNotificationModal(): void {
    this.editingNotification = null;
    this.notificationData = {
      text: '',
      display_order: this.notificationBars.length + 1,
      is_active: true
    };
    this.showNotificationModal = true;
  }

  editNotification(notif: NotificationBar): void {
    this.editingNotification = notif;
    this.notificationData = { ...notif };
    this.showNotificationModal = true;
  }

  closeNotificationModal(): void {
    this.showNotificationModal = false;
    this.editingNotification = null;
  }

  saveNotification(): void {
    this.saving = true;
    const req = this.editingNotification
      ? this.productService.updateNotificationBar(this.editingNotification.id, this.notificationData)
      : this.productService.createNotificationBar(this.notificationData);

    req.subscribe({
      next: () => {
        this.saving = false;
        alert(this.editingNotification ? 'Notification updated!' : 'Notification created!');
        this.closeNotificationModal();
        this.loadNotifications();
      },
      error: (err) => {
        this.saving = false;
        console.error('Error saving notification:', err);
        alert('Failed to save notification');
      }
    });
  }

  deleteNotification(id: number): void {
    if (confirm('Are you sure you want to delete this notification text?')) {
      this.productService.deleteNotificationBar(id).subscribe({
        next: () => {
          alert('Notification deleted successfully');
          this.loadNotifications();
        },
        error: (err) => console.error('Error deleting notification:', err)
      });
    }
  }

  // ── 4. Leadspace Banner ──
  loadLeadspace(): void {
    this.productService.getLeadspaceBanners().subscribe({
      next: (banners) => {
        if (banners && banners.length > 0) {
          this.leadspaceData = { ...banners[0] };
        } else {
          this.leadspaceData = {
            id: 0,
            eyebrow: 'New Collection · 2026',
            title: 'Vanki\nRings',
            desc_line1: 'Traditional South Indian finger rings, handcrafted in 925 sterling silver.',
            desc_line2: 'Worn with mehndi or bridal wear — a timeless symbol of grace.',
            offer_pct: '20% OFF',
            offer_label: 'on all Vanki Rings · Limited Time',
            button_text: 'Shop Now',
            button_link: '/products',
            trust_tag1: '925 Certified',
            trust_tag2: 'Free Shipping',
            trust_tag3: 'Easy Returns',
            is_active: true
          };
        }
      },
      error: (err) => console.error('Error loading leadspace:', err)
    });
  }

  saveLeadspace(): void {
    if (!this.leadspaceData) return;
    this.saving = true;
    const formData = new FormData();

    Object.keys(this.leadspaceData).forEach(key => {
      if (key === 'image' || key === 'id' || key === 'created_at' || key === 'updated_at') return;
      const value = (this.leadspaceData as any)[key];
      if (value !== null && value !== undefined) {
        if (typeof value === 'boolean') {
          formData.append(key, value ? 'true' : 'false');
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    if (this.selectedLeadspaceFile) {
      formData.append('image', this.selectedLeadspaceFile, this.selectedLeadspaceFile.name);
    }

    const req = this.leadspaceData.id
      ? this.productService.updateLeadspaceBanner(this.leadspaceData.id, formData)
      : this.productService.createLeadspaceBanner(formData);

    req.subscribe({
      next: (saved) => {
        this.saving = false;
        this.leadspaceData = saved;
        this.selectedLeadspaceFile = null;
        alert('Leadspace banner updated successfully!');
      },
      error: (err) => {
        this.saving = false;
        console.error('Error saving leadspace:', err);
        alert('Failed to save leadspace banner');
      }
    });
  }

  // ── 5. Story Section ──
  loadStory(): void {
    this.productService.getStorySections().subscribe({
      next: (stories) => {
        if (stories && stories.length > 0) {
          this.storyData = { ...stories[0] };
        } else {
          this.storyData = {
            id: 0,
            eyebrow: 'Our Story',
            title: 'Crafted with Passion,\nWorn with Pride',
            paragraph_1: 'Founded in 2024, Kasavelli was born from a love for traditional Indian jewellery-making.',
            paragraph_2: 'We blend centuries-old craftsmanship with modern design sensibilities.',
            badge_number: '925',
            badge_label: 'Hallmarked\nSilver',
            stat1_value: '100+',
            stat1_label: 'Unique Designs',
            stat2_value: '500+',
            stat2_label: 'Happy Customers',
            stat3_value: '925',
            stat3_label: 'Silver Purity',
            button_text: 'View Collection',
            button_link: '/products',
            is_active: true
          };
        }
      },
      error: (err) => console.error('Error loading story:', err)
    });
  }

  saveStory(): void {
    if (!this.storyData) return;
    this.saving = true;
    const formData = new FormData();

    Object.keys(this.storyData).forEach(key => {
      if (key === 'image' || key === 'id' || key === 'created_at' || key === 'updated_at') return;
      const value = (this.storyData as any)[key];
      if (value !== null && value !== undefined) {
        if (typeof value === 'boolean') {
          formData.append(key, value ? 'true' : 'false');
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    if (this.selectedStoryFile) {
      formData.append('image', this.selectedStoryFile, this.selectedStoryFile.name);
    }

    const req = this.storyData.id
      ? this.productService.updateStorySection(this.storyData.id, formData)
      : this.productService.createStorySection(formData);

    req.subscribe({
      next: (saved) => {
        this.saving = false;
        this.storyData = saved;
        this.selectedStoryFile = null;
        alert('Our Story section updated successfully!');
      },
      error: (err) => {
        this.saving = false;
        console.error('Error saving story:', err);
        alert('Failed to save story section');
      }
    });
  }

  // ── 6. Why Choose Cards ──
  loadWhyCards(): void {
    this.productService.getWhyChooseCards().subscribe({
      next: (cards) => this.whyCards = cards,
      error: (err) => console.error('Error loading why choose cards:', err)
    });
  }

  openAddWhyCardModal(): void {
    this.editingWhyCard = null;
    this.whyCardData = {
      title: '',
      description: '',
      icon_type: 'shield',
      display_order: this.whyCards.length + 1,
      is_active: true
    };
    this.showWhyCardModal = true;
  }

  editWhyCard(card: WhyChooseCard): void {
    this.editingWhyCard = card;
    this.whyCardData = { ...card };
    this.showWhyCardModal = true;
  }

  closeWhyCardModal(): void {
    this.showWhyCardModal = false;
    this.editingWhyCard = null;
  }

  saveWhyCard(): void {
    this.saving = true;
    const req = this.editingWhyCard
      ? this.productService.updateWhyChooseCard(this.editingWhyCard.id, this.whyCardData)
      : this.productService.createWhyChooseCard(this.whyCardData);

    req.subscribe({
      next: () => {
        this.saving = false;
        alert(this.editingWhyCard ? 'Card updated!' : 'Card added!');
        this.closeWhyCardModal();
        this.loadWhyCards();
      },
      error: (err) => {
        this.saving = false;
        console.error('Error saving card:', err);
        alert('Failed to save card');
      }
    });
  }

  deleteWhyCard(id: number): void {
    if (confirm('Are you sure you want to delete this card?')) {
      this.productService.deleteWhyChooseCard(id).subscribe({
        next: () => {
          alert('Card deleted successfully');
          this.loadWhyCards();
        },
        error: (err) => console.error('Error deleting card:', err)
      });
    }
  }

  // ── 7. Spin Wheel Slices ──
  loadSpinSlices(): void {
    this.productService.getSpinWheelSlices().subscribe({
      next: (slices) => this.spinSlices = slices,
      error: (err) => console.error('Error loading spin slices:', err)
    });
  }

  openAddSpinSliceModal(): void {
    this.editingSpinSlice = null;
    this.spinSliceData = {
      label: '',
      percentage: 0,
      color: '#551756',
      text_color: '#e8c547',
      display_order: this.spinSlices.length + 1,
      is_active: true
    };
    this.showSpinSliceModal = true;
  }

  editSpinSlice(slice: any): void {
    this.editingSpinSlice = slice;
    this.spinSliceData = { ...slice };
    this.showSpinSliceModal = true;
  }

  closeSpinSliceModal(): void {
    this.showSpinSliceModal = false;
    this.editingSpinSlice = null;
  }

  saveSpinSlice(): void {
    this.saving = true;
    const req = this.editingSpinSlice
      ? this.productService.updateSpinWheelSlice(this.editingSpinSlice.id, this.spinSliceData)
      : this.productService.createSpinWheelSlice(this.spinSliceData);

    req.subscribe({
      next: () => {
        this.saving = false;
        alert(this.editingSpinSlice ? 'Spin slice updated!' : 'Spin slice added!');
        this.closeSpinSliceModal();
        this.loadSpinSlices();
      },
      error: (err) => {
        this.saving = false;
        console.error('Error saving spin slice:', err);
        alert('Failed to save spin wheel slice');
      }
    });
  }

  deleteSpinSlice(id: number): void {
    if (confirm('Are you sure you want to delete this slice?')) {
      this.productService.deleteSpinWheelSlice(id).subscribe({
        next: () => {
          alert('Slice deleted successfully');
          this.loadSpinSlices();
        },
        error: (err) => console.error('Error deleting slice:', err)
      });
    }
  }

  onFileSelect(event: any, type: 'product' | 'category' | 'leadspace' | 'story'): void {
    if (event.target.files.length > 0) {
      if (type === 'product') this.selectedProductFile = event.target.files[0];
      else if (type === 'category') this.selectedCategoryFile = event.target.files[0];
      else if (type === 'leadspace') this.selectedLeadspaceFile = event.target.files[0];
      else if (type === 'story') this.selectedStoryFile = event.target.files[0];
    }
  }
}

// Made with Bob
