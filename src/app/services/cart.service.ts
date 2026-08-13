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

  constructor(private http: HttpClient) {
    // Only load cart count if a token is already present (page refresh while logged in)
    if (localStorage.getItem('accessToken')) {
      this.loadCartCount();
    }
  }

  loadCartCount(): void {
    this.getCartTotal().subscribe({
      next: (data) => this.cartCountSubject.next(data.items_count),
      error: () => this.cartCountSubject.next(0)
    });
  }

  getCartItems(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrl}/cart/`);
  }

  addToCart(productId: number, quantity: number = 1): Observable<CartItem> {
    return this.http.post<CartItem>(`${this.apiUrl}/cart/`, { product: productId, quantity })
      .pipe(tap(() => this.loadCartCount()));
  }

  updateCartItem(id: number, quantity: number): Observable<CartItem> {
    return this.http.patch<CartItem>(`${this.apiUrl}/cart/${id}/`, { quantity })
      .pipe(tap(() => this.loadCartCount()));
  }

  removeFromCart(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cart/${id}/`)
      .pipe(tap(() => this.loadCartCount()));
  }

  clearCart(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/cart/clear/`)
      .pipe(tap(() => this.cartCountSubject.next(0)));
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
