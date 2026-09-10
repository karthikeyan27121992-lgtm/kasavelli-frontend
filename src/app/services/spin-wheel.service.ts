import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface SpinResult {
  percentage: number;   // 0 means no discount (Better Luck slot)
  label: string;        // e.g. "10% OFF"
  spunAt: number;       // timestamp
}

const STORAGE_KEY = 'kasavelli_spin';

@Injectable({ providedIn: 'root' })
export class SpinWheelService {
  private resultSubject = new BehaviorSubject<SpinResult | null>(this.loadStored());
  result$ = this.resultSubject.asObservable();

  /** True if the user has NOT yet spun this session */
  get needsSpin(): boolean {
    return this.loadStored() === null;
  }

  get currentResult(): SpinResult | null {
    return this.resultSubject.value;
  }

  /** Call after a spin completes */
  saveResult(result: SpinResult): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    this.resultSubject.next(result);
  }

  /** Call on logout — clears so next login gets a fresh spin */
  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.resultSubject.next(null);
  }

  private loadStored(): SpinResult | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}

// Made with Bob
