import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Order } from '../../models/product.model';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="confirmation-wrapper">
      <div class="confirmation-card" *ngIf="order; else loading">
        <div class="success-icon">✓</div>
        <h1>Order Confirmed!</h1>
        <p class="sub">Thank you for your purchase. Your order has been placed successfully.</p>

        <div class="order-meta">
          <div class="meta-row">
            <span class="label">Order ID</span>
            <span class="value">{{ order.order_id }}</span>
          </div>
          <div class="meta-row">
            <span class="label">Payment Status</span>
            <span class="value badge success">{{ order.payment_status }}</span>
          </div>
          <div class="meta-row">
            <span class="label">Order Status</span>
            <span class="value badge processing">{{ order.status }}</span>
          </div>
          <div class="meta-row">
            <span class="label">Shipping To</span>
            <span class="value">{{ order.shipping_address }}</span>
          </div>
          <div class="meta-row">
            <span class="label">Phone</span>
            <span class="value">{{ order.phone_number }}</span>
          </div>
        </div>

        <div class="order-items">
          <h3>Items Ordered</h3>
          <div class="item-row" *ngFor="let item of order.items">
            <img [src]="item.product_image" [alt]="item.product_name" class="item-thumb">
            <div class="item-info">
              <span class="item-name">{{ item.product_name }}</span>
              <span class="item-qty">Qty: {{ item.quantity }}</span>
            </div>
            <span class="item-price">₹{{ item.price * item.quantity }}</span>
          </div>
        </div>

        <div class="order-total">
          <span>Total Paid</span>
          <span class="total-amount">₹{{ order.total_amount }}</span>
        </div>

        <div class="actions">
          <a routerLink="/products" class="btn btn-primary">Continue Shopping</a>
        </div>
      </div>

      <ng-template #loading>
        <div class="loading-state" *ngIf="!error">
          <p>Loading order details…</p>
        </div>
        <div class="error-state" *ngIf="error">
          <p>{{ error }}</p>
          <a routerLink="/" class="btn btn-primary">Go Home</a>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .confirmation-wrapper {
      min-height: 80vh;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 3rem 1rem;
      background: #f7f8fa;
    }
    .confirmation-card {
      background: white;
      border-radius: 12px;
      padding: 2.5rem;
      max-width: 600px;
      width: 100%;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
      text-align: center;
    }
    .success-icon {
      width: 64px; height: 64px;
      background: #22c55e;
      color: white;
      border-radius: 50%;
      font-size: 2rem;
      line-height: 64px;
      margin: 0 auto 1.5rem;
    }
    h1 { font-size: 1.8rem; margin-bottom: 0.5rem; }
    .sub { color: #57606a; margin-bottom: 2rem; }
    .order-meta { text-align: left; margin-bottom: 2rem; }
    .meta-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 0.6rem 0;
      border-bottom: 1px solid #f0f0f0;
      gap: 1rem;
    }
    .label { color: #57606a; font-size: 0.9rem; flex-shrink: 0; }
    .value { font-weight: 500; text-align: right; }
    .badge {
      padding: 2px 10px;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: capitalize;
    }
    .badge.success { background: #dcfce7; color: #166534; }
    .badge.processing { background: #dbeafe; color: #1e40af; }
    .order-items { text-align: left; margin-bottom: 1.5rem; }
    .order-items h3 { font-size: 1rem; margin-bottom: 1rem; color: #57606a; text-transform: uppercase; letter-spacing: 0.05em; }
    .item-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .item-thumb { width: 48px; height: 48px; object-fit: cover; border-radius: 6px; flex-shrink: 0; }
    .item-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
    .item-name { font-weight: 500; font-size: 0.95rem; }
    .item-qty { color: #57606a; font-size: 0.85rem; }
    .item-price { font-weight: 600; }
    .order-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      font-size: 1.1rem;
      font-weight: 600;
      border-top: 2px solid #e5e7eb;
      margin-bottom: 2rem;
    }
    .total-amount { font-size: 1.4rem; color: #1f2328; }
    .actions { display: flex; justify-content: center; }
    .btn { display: inline-block; padding: 0.75rem 2rem; border-radius: 8px; text-decoration: none; font-weight: 600; cursor: pointer; border: none; }
    .btn-primary { background: #1f2328; color: white; }
    .loading-state, .error-state { text-align: center; padding: 4rem; }
  `]
})
export class OrderConfirmationComponent implements OnInit {
  order: Order | null = null;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.queryParamMap.get('id');
    if (!orderId) {
      this.error = 'No order ID found.';
      return;
    }

    // Find the order by its numeric DB id from the orders list
    this.cartService.getOrders().subscribe({
      next: (orders) => {
        const found = orders.find(o => o.order_id === orderId);
        if (found) {
          this.order = found;
        } else {
          this.error = 'Order not found.';
        }
      },
      error: () => {
        this.error = 'Could not load order details.';
      }
    });
  }
}
