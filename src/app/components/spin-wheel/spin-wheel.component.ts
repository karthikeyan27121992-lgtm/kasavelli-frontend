import {
  Component, OnInit, AfterViewInit, OnDestroy,
  ElementRef, ViewChild, Output, EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinWheelService } from '../../services/spin-wheel.service';
import type { SpinResult } from '../../services/spin-wheel.service';
import { AuthService } from '../../services/auth.service';

interface Slice {
  label: string;
  percentage: number;
  color: string;
  textColor: string;
}

const SLICES: Slice[] = [
  { label: '5% OFF',          percentage: 5,  color: '#551756', textColor: '#e8c547' },
  { label: 'Better Luck!',    percentage: 0,  color: '#e8c547', textColor: '#3a0e3b' },
  { label: '15% OFF',         percentage: 15, color: '#7a2278', textColor: '#fff'    },
  { label: '5% OFF',          percentage: 5,  color: '#c9a84c', textColor: '#3a0e3b' },
  { label: '20% OFF',         percentage: 20, color: '#3a0e3b', textColor: '#e8c547' },
  { label: 'Better Luck!',    percentage: 0,  color: '#9c3d9c', textColor: '#fff'    },
  { label: '10% OFF',         percentage: 10, color: '#e8c547', textColor: '#3a0e3b' },
  { label: 'Better Luck!',    percentage: 0,  color: '#551756', textColor: '#e8c547' },
];

@Component({
  selector: 'app-spin-wheel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sw-backdrop" (click)="onBackdropClick($event)">
      <div class="sw-modal" (click)="$event.stopPropagation()">

        <!-- Close -->
        <button class="sw-x" (click)="dismiss()" aria-label="Close">✕</button>

        <!-- Header -->
        <div class="sw-head">
          <p class="sw-eyebrow">Welcome to Kasavelli ✦</p>
          <h2 class="sw-title">Spin & Win a Discount!</h2>
          <p class="sw-sub">Spin the wheel to unlock your personal discount for today's shopping.</p>
        </div>

        <!-- Wheel -->
        <div class="sw-wheel-area" *ngIf="!result">
          <div class="sw-pointer">▼</div>
          <canvas #wheelCanvas width="300" height="300" class="sw-canvas"></canvas>
          <button class="sw-spin-btn" (click)="spin()" [disabled]="spinning">
            {{ spinning ? 'Spinning…' : 'SPIN' }}
          </button>
        </div>

        <!-- Result -->
        <div class="sw-result" *ngIf="result">
          <div class="sw-result-icon" [class.lucky]="result.percentage > 0">
            {{ result.percentage > 0 ? '🎉' : '😊' }}
          </div>
          <h3 class="sw-result-title" *ngIf="result.percentage > 0">
            You won <span>{{ result.label }}</span>!
          </h3>
          <h3 class="sw-result-title sw-no-luck" *ngIf="result.percentage === 0">
            Better Luck Next Time!
          </h3>
          <p class="sw-result-sub" *ngIf="result.percentage > 0">
            Your <strong>{{ result.percentage }}% discount</strong> has been applied to your cart automatically.
          </p>
          <p class="sw-result-sub" *ngIf="result.percentage === 0">
            No worries — our products are already the best value around!
          </p>
          <button class="sw-done-btn" (click)="dismiss()">Start Shopping</button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .sw-backdrop {
      position: fixed; inset: 0; z-index: 2000;
      background: rgba(10,2,10,0.72);
      display: flex; align-items: center; justify-content: center;
      padding: 1rem;
      animation: fadeIn 0.25s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .sw-modal {
      background: #fff;
      border-radius: 18px;
      padding: 2rem 2rem 2.5rem;
      width: 100%; max-width: 380px;
      position: relative;
      box-shadow: 0 24px 80px rgba(0,0,0,0.35);
      animation: slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1);
      text-align: center;
    }
    @keyframes slideUp {
      from { transform: translateY(40px) scale(0.95); opacity: 0; }
      to   { transform: translateY(0)    scale(1);    opacity: 1; }
    }

    .sw-x {
      position: absolute; top: 1rem; right: 1rem;
      background: #f5f0f5; border: none; border-radius: 50%;
      width: 30px; height: 30px; cursor: pointer;
      font-size: 0.75rem; color: #551756;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.2s;
    }
    .sw-x:hover { background: #e8d8e8; }

    .sw-eyebrow {
      font-size: 0.7rem; letter-spacing: 2.5px; text-transform: uppercase;
      color: #c9a84c; font-weight: 700; margin: 0 0 0.4rem;
    }
    .sw-title {
      font-family: 'Raleway', sans-serif;
      font-size: 1.7rem; font-weight: 700;
      color: #3a0e3b; margin: 0 0 0.5rem;
    }
    .sw-sub {
      font-size: 0.82rem; color: #888; line-height: 1.6;
      margin: 0 0 1.5rem;
    }

    /* Wheel */
    .sw-wheel-area {
      position: relative; display: inline-block;
      margin-bottom: 1.25rem;
    }
    .sw-pointer {
      position: absolute; top: -12px; left: 50%;
      transform: translateX(-50%);
      font-size: 1.4rem; color: #c9a84c;
      filter: drop-shadow(0 2px 3px rgba(0,0,0,0.3));
      z-index: 2; line-height: 1;
    }
    .sw-canvas {
      display: block; border-radius: 50%;
      box-shadow: 0 8px 32px rgba(85,23,86,0.25);
    }
    .sw-spin-btn {
      display: block; margin: 1rem auto 0;
      background: #551756; color: #e8c547;
      border: none; border-radius: 50px;
      padding: 0.7rem 2.5rem;
      font-size: 0.82rem; font-weight: 800; letter-spacing: 2px;
      cursor: pointer; transition: background 0.25s, transform 0.1s;
    }
    .sw-spin-btn:hover:not(:disabled) { background: #3a0e3b; transform: scale(1.03); }
    .sw-spin-btn:disabled { opacity: 0.6; cursor: not-allowed; }

    /* Result */
    .sw-result { padding: 0.5rem 0; }
    .sw-result-icon { font-size: 3rem; margin-bottom: 0.75rem; }
    .sw-result-title {
      font-family: 'Raleway', sans-serif;
      font-size: 1.6rem; font-weight: 700;
      color: #3a0e3b; margin: 0 0 0.6rem;
    }
    .sw-result-title span { color: #551756; }
    .sw-result-title.sw-no-luck { color: #888; font-size: 1.3rem; }
    .sw-result-sub {
      font-size: 0.87rem; color: #666; line-height: 1.65;
      margin: 0 0 1.5rem;
    }
    .sw-result-sub strong { color: #551756; }
    .sw-done-btn {
      background: #551756; color: #e8c547;
      border: none; border-radius: 50px;
      padding: 0.75rem 2.5rem;
      font-size: 0.82rem; font-weight: 800; letter-spacing: 2px;
      cursor: pointer; transition: background 0.25s;
    }
    .sw-done-btn:hover { background: #3a0e3b; }
  `]
})
export class SpinWheelComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('wheelCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Output() closed = new EventEmitter<void>();

  slices = SLICES;
  spinning = false;
  result: SpinResult | null = null;

  private currentAngle = 0;    // radians, current draw position
  private animFrameId = 0;

  constructor(
    private spinService: SpinWheelService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.drawWheel(0);
  }

  ngOnDestroy(): void {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
  }

  spin(): void {
    if (this.spinning) return;
    this.spinning = true;

    const sliceCount = this.slices.length;
    const sliceAngle = (2 * Math.PI) / sliceCount;

    // Pick a random winning slice index
    const winIndex = Math.floor(Math.random() * sliceCount);

    // Total rotation: 5 full spins + offset to land on winIndex
    // The pointer is at the top (−π/2). We want winIndex's midpoint at the top.
    const winMidAngle = winIndex * sliceAngle + sliceAngle / 2;
    const targetAngle = 5 * 2 * Math.PI + (2 * Math.PI - winMidAngle) - this.currentAngle;

    const startAngle = this.currentAngle;
    const duration = 4500;   // ms
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      this.currentAngle = startAngle + targetAngle * eased;
      this.drawWheel(this.currentAngle);

      if (progress < 1) {
        this.animFrameId = requestAnimationFrame(animate);
      } else {
        this.spinning = false;
        const won = this.slices[winIndex];
        // Persist to DB, then refresh user profile so localStorage is in sync
        this.spinService.saveResult(won.percentage, won.label).subscribe(() => {
          this.authService.refreshCurrentUser();
        });
        this.result = { percentage: won.percentage, label: won.label, expiresAt: null };
      }
    };

    this.animFrameId = requestAnimationFrame(animate);
  }

  dismiss(): void {
    // If user closes without spinning, record pct=0 so wheel doesn't show again this login
    if (!this.result) {
      this.spinService.saveResult(0, 'No spin').subscribe(() => {
        this.authService.refreshCurrentUser();
      });
    }
    this.closed.emit();
  }

  onBackdropClick(e: MouseEvent): void {
    // only dismiss if backdrop itself was clicked
    if ((e.target as HTMLElement).classList.contains('sw-backdrop')) {
      this.dismiss();
    }
  }

  private drawWheel(rotation: number): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = cx - 4;
    const sliceAngle = (2 * Math.PI) / this.slices.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.slices.forEach((slice, i) => {
      const startA = rotation + i * sliceAngle - Math.PI / 2;
      const endA = startA + sliceAngle;

      // Slice fill
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startA, endA);
      ctx.closePath();
      ctx.fillStyle = slice.color;
      ctx.fill();

      // Slice border
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label text
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startA + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = slice.textColor;
      ctx.font = `bold ${slice.percentage > 0 ? 11 : 9}px "Raleway", sans-serif`;
      ctx.fillText(slice.label, r - 8, 4);
      ctx.restore();
    });

    // Centre circle
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#551756';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Centre logo letter
    ctx.fillStyle = '#551756';
    ctx.font = 'bold 13px "Raleway", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('K', cx, cy);
  }
}

// Made with Bob
