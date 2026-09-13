import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Order } from '../../models/product.model';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="orders-page">

      <!-- Header -->
      <div class="page-header">
        <div class="page-header-inner">
          <a routerLink="/" class="back-btn" aria-label="Back">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </a>
          <div>
            <h1>My Orders</h1>
            <p class="order-count" *ngIf="!loading && orders.length > 0">
              {{ orders.length }} order{{ orders.length !== 1 ? 's' : '' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div class="loading-state" *ngIf="loading">
        <div class="spinner"></div>
        <p>Loading your orders…</p>
      </div>

      <!-- Error -->
      <div class="error-state" *ngIf="!loading && error">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c0392b" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p>{{ error }}</p>
        <button class="btn-retry" (click)="loadOrders()">Try Again</button>
      </div>

      <!-- Empty -->
      <div class="empty-state" *ngIf="!loading && !error && orders.length === 0">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="1.2">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <h2>No orders yet</h2>
        <p>Once you place an order it will appear here.</p>
        <a routerLink="/products" class="btn-shop">Start Shopping</a>
      </div>

      <!-- Orders List -->
      <div class="orders-list" *ngIf="!loading && !error && orders.length > 0">
        <div class="order-card" *ngFor="let order of orders">

          <!-- Card Header -->
          <div class="card-header">
            <div class="order-id-block">
              <span class="label">Order ID</span>
              <span class="order-id">{{ order.order_id }}</span>
            </div>
            <div class="header-right">
              <span class="order-date">{{ order.created_at | date:'d MMM yyyy' }}</span>
              <span class="status-badge" [ngClass]="statusClass(order.status)">
                {{ order.status | titlecase }}
              </span>
            </div>
          </div>

          <!-- Items -->
          <div class="items-list">
            <div class="item-row" *ngFor="let item of order.items">
              <div class="item-img-wrap">
                <img
                  [src]="item.product_image || 'assets/images/placeholder.jpg'"
                  [alt]="item.product_name"
                  class="item-img"
                  (error)="onImgError($event)"
                >
              </div>
              <div class="item-info">
                <span class="item-name">{{ item.product_name }}</span>
                <span class="item-meta">Qty: {{ item.quantity }} &nbsp;·&nbsp; ₹{{ item.price | number:'1.0-0' }} each</span>
              </div>
              <span class="item-subtotal">₹{{ item.price * item.quantity | number:'1.0-0' }}</span>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="card-footer">
            <div class="footer-left">
              <span class="pay-status" [ngClass]="paymentClass(order.payment_status)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                Payment: {{ order.payment_status | titlecase }}
              </span>
              <span class="ship-to">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                {{ order.shipping_address }}
              </span>
            </div>
            <div class="footer-right">
              <span class="total-label">Total</span>
              <span class="total-amount">₹{{ order.total_amount | number:'1.0-0' }}</span>
            </div>
          </div>

          <!-- Cancel button — only for pending/processing -->
          <div class="card-actions" *ngIf="order.status === 'pending' || order.status === 'processing'">
            <button
              class="btn-cancel"
              (click)="cancelOrder(order)"
              [disabled]="cancelling === order.id"
            >
              <span *ngIf="cancelling !== order.id">Cancel Order</span>
              <span *ngIf="cancelling === order.id">Cancelling…</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  `,
  styles: [`
    :host {
      --royal: #881e62;
      --royal-dark: #4a0a38;
      --gold: #cab273;
      --cream: #efebe1;
      --cream-dark: #ddd6c6;
      --text: #2a1a2e;
      --text-muted: #6b6b7b;
    }

    .orders-page {
      min-height: 100vh;
      background: #f7f3ef;
      padding-bottom: 4rem;
    }

    /* ── Header ── */
    .page-header {
      background: #fff;
      border-bottom: 1px solid var(--cream-dark);
      padding: 1.25rem 0;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .page-header-inner {
      max-width: 760px;
      margin: 0 auto;
      padding: 0 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .back-btn {
      width: 36px; height: 36px;
      border-radius: 50%;
      background: var(--cream);
      display: flex; align-items: center; justify-content: center;
      text-decoration: none;
      color: var(--royal);
      flex-shrink: 0;
      transition: background 0.2s;
    }
    .back-btn:hover { background: var(--cream-dark); }
    h1 {
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--royal-dark);
      margin: 0;
      font-family: 'Raleway', sans-serif;
    }
    .order-count {
      font-size: 0.82rem;
      color: var(--text-muted);
      margin: 2px 0 0;
    }

    /* ── States ── */
    .loading-state, .error-state, .empty-state {
      max-width: 400px;
      margin: 5rem auto;
      text-align: center;
      padding: 2rem;
    }
    .spinner {
      width: 40px; height: 40px;
      border: 3px solid var(--cream-dark);
      border-top-color: var(--royal);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 1rem;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .loading-state p, .error-state p, .empty-state p {
      color: var(--text-muted);
      margin: 0.5rem 0;
    }
    .empty-state h2 {
      font-size: 1.2rem;
      color: var(--royal-dark);
      margin: 0.75rem 0 0.4rem;
    }
    .btn-retry {
      margin-top: 1rem;
      padding: 0.6rem 1.5rem;
      background: var(--royal);
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-shop {
      display: inline-block;
      margin-top: 1.25rem;
      padding: 0.75rem 2rem;
      background: var(--royal);
      color: #fff !important;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 700;
      font-size: 0.88rem;
      letter-spacing: 1px;
      transition: background 0.2s;
    }
    .btn-shop:hover { background: var(--royal-dark); }

    /* ── Order Cards ── */
    .orders-list {
      max-width: 760px;
      margin: 2rem auto;
      padding: 0 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .order-card {
      background: #fff;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(58,14,59,0.07);
      border: 1px solid var(--cream-dark);
    }

    /* Card Header */
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 1rem 1.25rem;
      background: #faf7f2;
      border-bottom: 1px solid var(--cream-dark);
      gap: 1rem;
      flex-wrap: wrap;
    }
    .label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--text-muted);
      display: block;
      margin-bottom: 2px;
    }
    .order-id {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text);
      word-break: break-all;
    }
    .header-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 6px;
      flex-shrink: 0;
    }
    .order-date {
      font-size: 0.78rem;
      color: var(--text-muted);
    }

    /* Status badge */
    .status-badge {
      padding: 3px 10px;
      border-radius: 999px;
      font-size: 0.74rem;
      font-weight: 700;
      letter-spacing: 0.4px;
    }
    .status-pending    { background: #fef9c3; color: #854d0e; }
    .status-processing { background: #dbeafe; color: #1e40af; }
    .status-shipped    { background: #e0f2fe; color: #0369a1; }
    .status-delivered  { background: #dcfce7; color: #166534; }
    .status-cancelled  { background: #fee2e2; color: #991b1b; }

    /* Items */
    .items-list {
      padding: 0.5rem 1.25rem;
    }
    .item-row {
      display: flex;
      align-items: center;
      gap: 0.9rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f5f0eb;
    }
    .item-row:last-child { border-bottom: none; }
    .item-img-wrap {
      width: 52px; height: 52px;
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;
      background: var(--cream);
    }
    .item-img {
      width: 100%; height: 100%;
      object-fit: cover;
    }
    .item-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 3px;
      min-width: 0;
    }
    .item-name {
      font-size: 0.92rem;
      font-weight: 600;
      color: var(--text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .item-meta {
      font-size: 0.78rem;
      color: var(--text-muted);
    }
    .item-subtotal {
      font-size: 0.92rem;
      font-weight: 700;
      color: var(--royal-dark);
      flex-shrink: 0;
    }

    /* Card Footer */
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding: 0.9rem 1.25rem;
      background: #faf7f2;
      border-top: 1px solid var(--cream-dark);
      gap: 1rem;
      flex-wrap: wrap;
    }
    .footer-left {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .pay-status {
      font-size: 0.78rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .pay-completed { color: #166534; }
    .pay-pending   { color: #854d0e; }
    .pay-failed    { color: #991b1b; }
    .ship-to {
      font-size: 0.75rem;
      color: var(--text-muted);
      display: flex;
      align-items: flex-start;
      gap: 4px;
      max-width: 260px;
      line-height: 1.4;
    }
    .ship-to svg { flex-shrink: 0; margin-top: 1px; }
    .footer-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    .total-label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--text-muted);
    }
    .total-amount {
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--royal);
    }

    /* Cancel button */
    .card-actions {
      padding: 0.75rem 1.25rem;
      border-top: 1px solid var(--cream-dark);
      display: flex;
      justify-content: flex-end;
    }
    .btn-cancel {
      padding: 0.5rem 1.2rem;
      border: 1.5px solid #ef4444;
      background: transparent;
      color: #ef4444;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;
    }
    .btn-cancel:hover:not(:disabled) {
      background: #fee2e2;
    }
    .btn-cancel:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 480px) {
      .card-header { flex-direction: column; }
      .header-right { align-items: flex-start; flex-direction: row; gap: 8px; }
      .card-footer { flex-direction: column; }
      .footer-right { align-items: flex-start; flex-direction: row; align-items: center; gap: 8px; }
      .total-label { font-size: 0.82rem; }
    }
  `]
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  error: string | null = null;
  cancelling: number | null = null;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;
    this.cartService.getOrders().subscribe({
      next: (orders) => {
        // Most recent first
        this.orders = orders.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load your orders. Please try again.';
        this.loading = false;
      }
    });
  }

  cancelOrder(order: Order): void {
    if (!confirm(`Cancel order ${order.order_id}?`)) return;
    this.cancelling = order.id;
    this.cartService.cancelOrder(order.id).subscribe({
      next: () => {
        order.status = 'cancelled';
        this.cancelling = null;
      },
      error: () => {
        alert('Could not cancel order. Please try again.');
        this.cancelling = null;
      }
    });
  }

  statusClass(status: string): string {
    return `status-${status}`;
  }

  paymentClass(status: string): string {
    if (status === 'completed') return 'pay-completed';
    if (status === 'failed') return 'pay-failed';
    return 'pay-pending';
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/images/placeholder.jpg';
  }
}

// Made with Bob
