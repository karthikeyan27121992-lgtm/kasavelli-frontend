import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface SpinResult {
  percentage: number;   // 0 = Better Luck slot
  label: string;
  expiresAt: string | null;  // ISO string from DB, null for "Better Luck"
}

@Injectable({ providedIn: 'root' })
export class SpinWheelService {
  private apiUrl = `${environment.apiUrl}/users/users/save_spin/`;
  private slicesUrl = `${environment.apiUrl}/notifications/spin-wheel-slices/`;

  private resultSubject = new BehaviorSubject<SpinResult | null>(null);
  result$ = this.resultSubject.asObservable();

  get currentResult(): SpinResult | null {
    return this.resultSubject.value;
  }

  /**
   * Called after login — loads the user's spin state from their profile.
   * Returns true if the user still needs to spin (no valid discount in DB).
   */
  loadFromUser(user: any): boolean {
    const pct: number = user.spin_discount_pct ?? 0;
    const expiresAt: string | null = user.spin_discount_expires_at ?? null;

    // Check if an existing discount is still valid (not expired)
    if (pct > 0 && expiresAt) {
      const expiryMs = new Date(expiresAt).getTime();
      if (expiryMs > Date.now()) {
        // Still valid — load it, no need to spin again
        this.resultSubject.next({
          percentage: pct,
          label: `${pct}% OFF`,
          expiresAt,
        });
        return false;  // needsSpin = false
      }
    }

    // Either no spin yet, or Better Luck was recorded (pct=0, no expiry),
    // or the discount has expired → needs a fresh spin
    this.resultSubject.next(null);

    // If pct=0 and expiresAt=null it means they never spun OR spun "Better Luck"
    // but we still want them to spin on every fresh login after expiry.
    // "Better Luck" saves pct=0 with no expiry, so needsSpin is true next login.
    return true;  // needsSpin = true
  }

  /**
   * Persist spin result to DB after the wheel stops.
   * Also updates the local observable.
   */
  saveResult(percentage: number, label: string): Observable<any> {
    return this.http.post(this.apiUrl, { percentage }).pipe(
      tap((res: any) => {
        this.resultSubject.next({
          percentage,
          label,
          expiresAt: res.spin_discount_expires_at ?? null,
        });
      }),
      catchError(err => {
        console.error('Failed to save spin result', err);
        // Still update local state even if API fails
        this.resultSubject.next({ percentage, label, expiresAt: null });
        return of(null);
      })
    );
  }

  /** Fetch dynamic active slices from API with fallback */
  getActiveSlices(): Observable<any[]> {
    return this.http.get<any[]>(this.slicesUrl).pipe(
      catchError(err => {
        console.warn('Could not fetch dynamic spin wheel slices, using defaults:', err);
        return of([]);
      })
    );
  }

  /** Called on logout — clears local state only (DB keeps the record until expiry) */
  clear(): void {
    this.resultSubject.next(null);
  }

  constructor(private http: HttpClient) {}
}

// Made with Bob
