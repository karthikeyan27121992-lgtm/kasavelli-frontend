import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { PaymentService, RazorpayOrder } from '../../services/payment.service';
import { CartItem } from '../../models/product.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2 class="mt-4 mb-3">Shopping Cart</h2>

      <div *ngIf="cartItems.length === 0" class="text-center mt-4">
        <p>Your cart is empty</p>
        <a href="/products" class="btn btn-primary">Continue Shopping</a>
      </div>

      <div *ngIf="cartItems.length > 0">
        <div class="cart-items">
          <div class="cart-item" *ngFor="let item of cartItems">
            <img [src]="item.product_image" [alt]="item.product_name" class="item-image">
            <div class="item-details">
              <h3>{{ item.product_name }}</h3>
              <p class="price">₹{{ item.discounted_price || item.product_price }}</p>
            </div>
            <div class="item-quantity">
              <input 
                type="number" 
                [(ngModel)]="item.quantity" 
                (change)="updateQuantity(item)"
                min="1"
                class="form-control"
              >
            </div>
            <div class="item-total">
              <p>₹{{ (item.discounted_price || item.product_price) * item.quantity }}</p>
            </div>
            <button class="btn btn-secondary" (click)="removeItem(item.id)">Remove</button>
          </div>
        </div>

        <div class="cart-summary">
          <h3>Order Summary</h3>
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>₹{{ cartTotal }}</span>
          </div>
          <div class="summary-row total">
            <span>Total:</span>
            <span>₹{{ cartTotal }}</span>
          </div>

          <div class="checkout-form">
            <h4>Shipping Details</h4>
            <div class="form-group">
              <label class="form-label">Shipping Address</label>
              <textarea 
                class="form-control" 
                [(ngModel)]="shippingAddress"
                rows="3"
                required
              ></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Phone Number</label>
              <input 
                type="tel" 
                class="form-control" 
                [(ngModel)]="phoneNumber"
                required
              >
            </div>
          </div>

          <button 
            class="btn btn-primary" 
            (click)="proceedToCheckout()"
            [disabled]="processing || !shippingAddress || !phoneNumber"
            style="width: 100%;"
          >
            {{ processing ? 'Processing...' : 'Proceed to Payment' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-items {
      margin-bottom: 2rem;
    }

    .cart-item {
      display: grid;
      grid-template-columns: 100px 2fr 150px 150px 100px;
      gap: 1rem;
      align-items: center;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      margin-bottom: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .item-image {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 4px;
    }

    .item-details h3 {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }

    .item-quantity input {
      width: 80px;
    }

    .item-total {
      text-align: right;
      font-weight: bold;
    }

    .cart-summary {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      max-width: 500px;
      margin-left: auto;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #eee;
    }

    .summary-row.total {
      font-size: 1.5rem;
      font-weight: bold;
      border-bottom: none;
      margin-top: 1rem;
    }

    .checkout-form {
      margin: 2rem 0;
    }

    @media (max-width: 768px) {
      .cart-item {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .item-image {
        margin: 0 auto;
      }
    }
  `]
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartTotal = 0;
  shippingAddress = '';
  phoneNumber = '';
  processing = false;

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCartItems().subscribe({
      next: (data) => {
        this.cartItems = data;
        this.calculateTotal();
      },
      error: (err) => console.error('Error loading cart:', err)
    });
  }

  calculateTotal(): void {
    this.cartTotal = this.cartItems.reduce((sum, item) => {
      const price = item.discounted_price || item.product_price;
      return sum + (price * item.quantity);
    }, 0);
  }

  updateQuantity(item: CartItem): void {
    this.cartService.updateCartItem(item.id, item.quantity).subscribe({
      next: () => this.calculateTotal(),
      error: (err) => console.error('Error updating quantity:', err)
    });
  }

  removeItem(id: number): void {
    if (confirm('Remove this item from cart?')) {
      this.cartService.removeFromCart(id).subscribe({
        next: () => this.loadCart(),
        error: (err) => console.error('Error removing item:', err)
      });
    }
  }

  proceedToCheckout(): void {
    this.processing = true;

    const orderData = {
      shipping_address: this.shippingAddress,
      phone_number: this.phoneNumber
    };

    this.paymentService.createOrder(orderData).subscribe({
      next: (razorpayOrder: RazorpayOrder) => {
        this.initiatePayment(razorpayOrder);
      },
      error: (err) => {
        this.processing = false;
        console.error('Error creating order:', err);
        alert('Failed to create order. Please try again.');
      }
    });
  }

  initiatePayment(orderData: RazorpayOrder): void {
    this.paymentService.initiatePayment(
      orderData,
      (response) => {
        // Payment success
        this.paymentService.verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        }).subscribe({
          next: (result) => {
            this.processing = false;
            alert('Payment successful! Order ID: ' + result.order_id);
            this.router.navigate(['/']);
          },
          error: (err) => {
            this.processing = false;
            console.error('Payment verification failed:', err);
            alert('Payment verification failed');
          }
        });
      },
      (error) => {
        // Payment failed
        this.processing = false;
        this.paymentService.paymentFailed(orderData.order_id).subscribe();
        alert('Payment failed or cancelled');
      }
    );
  }
}

// Made with Bob
