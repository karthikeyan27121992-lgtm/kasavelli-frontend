import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { CartItem, Order } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/users`;
  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();

  /** Live snapshot of all cart items — kept in sync after every mutation */
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private http: HttpClient) {
    if (localStorage.getItem('accessToken')) {
      this.refreshCart();
    }
  }

  /** Reload both the item list and the header count badge */
  refreshCart(): void {
    this.http.get<CartItem[]>(`${this.apiUrl}/cart/`).subscribe({
      next: (items) => {
        this.cartItemsSubject.next(items);
        this.cartCountSubject.next(items.reduce((s, i) => s + i.quantity, 0));
      },
      error: () => {
        this.cartItemsSubject.next([]);
        this.cartCountSubject.next(0);
      }
    });
  }

  loadCartCount(): void {
    this.refreshCart();
  }

  getCartItems(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrl}/cart/`);
  }

  /** Returns the cart row for a given product id, or undefined */
  getCartItemForProduct(productId: number): CartItem | undefined {
    return this.cartItemsSubject.value.find(i => i.product === productId);
  }

  /**
   * Upsert: POST increments quantity if the item already exists (backend upsert).
   * Returns the updated/created CartItem.
   */
  addToCart(productId: number, quantity: number = 1): Observable<CartItem> {
    return this.http.post<CartItem>(`${this.apiUrl}/cart/`, { product: productId, quantity })
      .pipe(tap(() => this.refreshCart()));
  }

  updateCartItem(id: number, quantity: number): Observable<CartItem> {
    return this.http.patch<CartItem>(`${this.apiUrl}/cart/${id}/`, { quantity })
      .pipe(tap(() => this.refreshCart()));
  }

  removeFromCart(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cart/${id}/`)
      .pipe(tap(() => this.refreshCart()));
  }

  clearCart(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/cart/clear/`)
      .pipe(tap(() => {
        this.cartItemsSubject.next([]);
        this.cartCountSubject.next(0);
      }));
  }

  getCartTotal(): Observable<{ total: number, items_count: number }> {
    return this.http.get<{ total: number, items_count: number }>(`${this.apiUrl}/cart/total/`);
  }

  // Orders
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/`);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${id}/`);
  }

  cancelOrder(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/orders/${id}/cancel/`, {});
  }
}

// Made with Bob
