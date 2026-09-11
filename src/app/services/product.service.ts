import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  Product, Category, ProductReview, Banner,
  NotificationBar, LeadspaceBanner, StorySection, WhyChooseCard, HomepageConfig
} from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;
  private notifUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) { }

  // Categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories/`);
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/categories/${id}/`);
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/categories/${categoryId}/products/`);
  }

  // Products
  getProducts(params?: any): Observable<{ results: Product[], count: number }> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key]) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<{ results: Product[], count: number }>(`${this.apiUrl}/products/`, { params: httpParams });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}/`);
  }

  getProductBySlug(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/?slug=${slug}`);
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/featured/`);
  }

  getNewArrivals(): Observable<{ results: Product[], count: number }> {
    // Products ordered by newest first, limit 8
    return this.http.get<{ results: Product[], count: number }>(
      `${this.apiUrl}/products/?ordering=-created_at&page_size=8`
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    // Use the main list endpoint with DRF SearchFilter — covers name, title, description, purity, category
    return this.http.get<any>(`${this.apiUrl}/products/?search=${encodeURIComponent(query)}&page_size=8`).pipe(
      map((res: any) => Array.isArray(res) ? res : (res.results || []))
    );
  }

  getRelatedProducts(productId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/${productId}/related/`);
  }

  // Admin - Product Management
  createProduct(product: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products/`, product);
  }

  updateProduct(id: number, product: FormData): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/products/${id}/`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}/`);
  }

  // Admin - Category Management
  createCategory(category: FormData): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categories/`, category);
  }

  updateCategory(id: number, category: FormData): Observable<Category> {
    return this.http.patch<Category>(`${this.apiUrl}/categories/${id}/`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categories/${id}/`);
  }

  // Reviews
  getProductReviews(productId: number): Observable<ProductReview[]> {
    return this.http.get<ProductReview[]>(`${this.apiUrl}/reviews/?product=${productId}`);
  }

  addReview(review: Partial<ProductReview>): Observable<ProductReview> {
    return this.http.post<ProductReview>(`${this.apiUrl}/reviews/`, review);
  }

  // Banners
  getBanners(): Observable<Banner[]> {
    return this.http.get<Banner[]>(`${this.notifUrl}/banners/`);
  }

  // Homepage Dynamic Configuration
  getHomepageConfig(): Observable<HomepageConfig> {
    return this.http.get<HomepageConfig>(`${this.notifUrl}/homepage-config/`);
  }

  // Notification Bars (Admin & Client)
  getNotificationBars(): Observable<NotificationBar[]> {
    return this.http.get<NotificationBar[]>(`${this.notifUrl}/notification-bars/`);
  }

  createNotificationBar(data: Partial<NotificationBar>): Observable<NotificationBar> {
    return this.http.post<NotificationBar>(`${this.notifUrl}/notification-bars/`, data);
  }

  updateNotificationBar(id: number, data: Partial<NotificationBar>): Observable<NotificationBar> {
    return this.http.patch<NotificationBar>(`${this.notifUrl}/notification-bars/${id}/`, data);
  }

  deleteNotificationBar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.notifUrl}/notification-bars/${id}/`);
  }

  // Leadspace Banners (Admin & Client)
  getLeadspaceBanners(): Observable<LeadspaceBanner[]> {
    return this.http.get<LeadspaceBanner[]>(`${this.notifUrl}/leadspace-banners/`);
  }

  createLeadspaceBanner(data: FormData): Observable<LeadspaceBanner> {
    return this.http.post<LeadspaceBanner>(`${this.notifUrl}/leadspace-banners/`, data);
  }

  updateLeadspaceBanner(id: number, data: FormData): Observable<LeadspaceBanner> {
    return this.http.patch<LeadspaceBanner>(`${this.notifUrl}/leadspace-banners/${id}/`, data);
  }

  deleteLeadspaceBanner(id: number): Observable<void> {
    return this.http.delete<void>(`${this.notifUrl}/leadspace-banners/${id}/`);
  }

  // Story Section (Admin & Client)
  getStorySections(): Observable<StorySection[]> {
    return this.http.get<StorySection[]>(`${this.notifUrl}/story-sections/`);
  }

  createStorySection(data: FormData): Observable<StorySection> {
    return this.http.post<StorySection>(`${this.notifUrl}/story-sections/`, data);
  }

  updateStorySection(id: number, data: FormData): Observable<StorySection> {
    return this.http.patch<StorySection>(`${this.notifUrl}/story-sections/${id}/`, data);
  }

  deleteStorySection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.notifUrl}/story-sections/${id}/`);
  }

  // Why Choose Cards (Admin & Client)
  getWhyChooseCards(): Observable<WhyChooseCard[]> {
    return this.http.get<WhyChooseCard[]>(`${this.notifUrl}/why-choose-cards/`);
  }

  createWhyChooseCard(data: Partial<WhyChooseCard>): Observable<WhyChooseCard> {
    return this.http.post<WhyChooseCard>(`${this.notifUrl}/why-choose-cards/`, data);
  }

  updateWhyChooseCard(id: number, data: Partial<WhyChooseCard>): Observable<WhyChooseCard> {
    return this.http.patch<WhyChooseCard>(`${this.notifUrl}/why-choose-cards/${id}/`, data);
  }

  deleteWhyChooseCard(id: number): Observable<void> {
    return this.http.delete<void>(`${this.notifUrl}/why-choose-cards/${id}/`);
  }
}

// Made with Bob
