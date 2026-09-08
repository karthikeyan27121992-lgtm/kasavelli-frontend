import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Message {
  role: 'user' | 'bot';
  text: string;
  time: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Floating bubble -->
    <div class="chat-bubble" (click)="toggle()" [class.open]="isOpen" aria-label="Chat with us">
      <svg *ngIf="!isOpen" class="bubble-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <svg *ngIf="isOpen" class="bubble-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
      <span class="bubble-badge" *ngIf="!isOpen && unread > 0">{{ unread }}</span>
    </div>

    <!-- Chat panel -->
    <div class="chat-panel" [class.visible]="isOpen">

      <!-- Header -->
      <div class="chat-header">
        <div class="chat-header-info">
          <div class="avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div>
            <p class="chat-name">Kasavelli Assistant</p>
            <p class="chat-status">
              <span class="status-dot"></span>
              {{ loading ? 'Typing...' : 'Online' }}
            </p>
          </div>
        </div>
        <button class="header-close" (click)="toggle()" aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="16" height="16">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Messages -->
      <div class="chat-messages" #msgContainer>
        <div
          *ngFor="let msg of messages"
          class="msg-row"
          [class.user-row]="msg.role === 'user'"
          [class.bot-row]="msg.role === 'bot'"
        >
          <div class="msg-avatar" *ngIf="msg.role === 'bot'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="14" height="14">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div class="msg-bubble" [class.user-bubble]="msg.role === 'user'" [class.bot-bubble]="msg.role === 'bot'">
            <p class="msg-text" [innerHTML]="formatText(msg.text)"></p>
            <span class="msg-time">{{ msg.time }}</span>
          </div>
        </div>

        <!-- Typing indicator -->
        <div class="msg-row bot-row" *ngIf="loading">
          <div class="msg-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="14" height="14">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div class="msg-bubble bot-bubble typing-bubble">
            <span class="dot"></span><span class="dot"></span><span class="dot"></span>
          </div>
        </div>
      </div>

      <!-- Quick replies -->
      <div class="quick-replies" *ngIf="messages.length <= 1 && !loading">
        <button class="qr-btn" *ngFor="let q of quickReplies" (click)="sendQuick(q)">{{ q }}</button>
      </div>

      <!-- Input -->
      <div class="chat-input-row">
        <input
          #inputRef
          class="chat-input"
          type="text"
          placeholder="Ask me anything..."
          [(ngModel)]="inputText"
          (keydown.enter)="send()"
          [disabled]="loading"
          maxlength="500"
        >
        <button class="send-btn" (click)="send()" [disabled]="!inputText.trim() || loading" aria-label="Send">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>

    </div>
  `,
  styles: [`
    /* ── Floating Bubble ─────────────────── */
    :host {
      position: fixed;
      bottom: 1.75rem;
      right: 1.75rem;
      z-index: 9999;
    }

    .chat-bubble {
      width: 56px; height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #551756, #7a2278);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(85,23,86,0.45);
      transition: transform 0.25s ease, box-shadow 0.25s ease;
      position: relative;
    }
    .chat-bubble:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 28px rgba(85,23,86,0.55);
    }
    .chat-bubble.open { background: linear-gradient(135deg, #3a0e3b, #551756); }
    .bubble-icon { width: 24px; height: 24px; color: #e8c547; }
    .bubble-badge {
      position: absolute; top: -4px; right: -4px;
      background: #e8c547; color: #3a0e3b;
      border-radius: 50%; width: 20px; height: 20px;
      font-size: 11px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      border: 2px solid #fff;
    }

    /* ── Chat Panel ──────────────────────── */
    .chat-panel {
      position: absolute;
      bottom: 70px; right: 0;
      width: 340px;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.18);
      display: flex; flex-direction: column;
      overflow: hidden;
      opacity: 0; transform: scale(0.92) translateY(12px);
      pointer-events: none;
      transition: opacity 0.25s ease, transform 0.25s ease;
      transform-origin: bottom right;
      max-height: 520px;
    }
    .chat-panel.visible {
      opacity: 1; transform: scale(1) translateY(0);
      pointer-events: all;
    }

    /* Header */
    .chat-header {
      background: linear-gradient(135deg, #3a0e3b, #551756);
      padding: 14px 16px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .chat-header-info { display: flex; align-items: center; gap: 10px; }
    .avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: rgba(232,197,71,0.2);
      border: 1.5px solid rgba(232,197,71,0.5);
      display: flex; align-items: center; justify-content: center;
      color: #e8c547; flex-shrink: 0;
    }
    .chat-name {
      font-size: 13px; font-weight: 700;
      color: #efebe1; letter-spacing: 0.3px;
    }
    .chat-status {
      font-size: 11px; color: rgba(232,197,71,0.8);
      display: flex; align-items: center; gap: 5px; margin-top: 1px;
    }
    .status-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: #4ade80;
      display: inline-block;
    }
    .header-close {
      background: rgba(255,255,255,0.1); border: none; border-radius: 50%;
      width: 28px; height: 28px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      color: rgba(239,235,225,0.7); transition: background 0.2s;
    }
    .header-close:hover { background: rgba(255,255,255,0.2); color: #fff; }

    /* Messages */
    .chat-messages {
      flex: 1; overflow-y: auto;
      padding: 14px 12px;
      display: flex; flex-direction: column; gap: 10px;
      min-height: 260px; max-height: 320px;
      background: #faf9f7;
    }
    .chat-messages::-webkit-scrollbar { width: 4px; }
    .chat-messages::-webkit-scrollbar-track { background: transparent; }
    .chat-messages::-webkit-scrollbar-thumb { background: #e0d5d5; border-radius: 2px; }

    .msg-row { display: flex; align-items: flex-end; gap: 6px; }
    .user-row { flex-direction: row-reverse; }

    .msg-avatar {
      width: 26px; height: 26px; border-radius: 50%;
      background: linear-gradient(135deg, #551756, #7a2278);
      display: flex; align-items: center; justify-content: center;
      color: #e8c547; flex-shrink: 0;
    }

    .msg-bubble {
      max-width: 220px; padding: 8px 11px;
      border-radius: 14px; position: relative;
    }
    .bot-bubble {
      background: #fff; border: 1px solid #ede8f0;
      border-bottom-left-radius: 4px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }
    .user-bubble {
      background: linear-gradient(135deg, #551756, #7a2278);
      border-bottom-right-radius: 4px;
    }
    .msg-text {
      font-size: 13px; line-height: 1.55; margin: 0;
      white-space: pre-wrap; word-break: break-word;
    }
    .bot-bubble .msg-text  { color: #1f2328; }
    .user-bubble .msg-text { color: #efebe1; }

    .msg-time {
      font-size: 10px; display: block; margin-top: 3px;
      opacity: 0.55;
    }
    .bot-bubble .msg-time  { color: #57606a; }
    .user-bubble .msg-time { color: rgba(239,235,225,0.7); }

    /* Typing dots */
    .typing-bubble { padding: 10px 14px; display: flex; gap: 4px; align-items: center; }
    .dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: #b0a0b5;
      animation: bounce 1.2s infinite ease-in-out;
    }
    .dot:nth-child(2) { animation-delay: 0.2s; }
    .dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes bounce {
      0%, 80%, 100% { transform: translateY(0); }
      40%           { transform: translateY(-6px); }
    }

    /* Quick replies */
    .quick-replies {
      padding: 8px 12px;
      display: flex; flex-wrap: wrap; gap: 6px;
      background: #faf9f7;
      border-top: 1px solid #f0eaee;
    }
    .qr-btn {
      background: #fff; border: 1px solid #d5c5d8;
      border-radius: 20px; padding: 5px 12px;
      font-size: 11.5px; color: #551756; cursor: pointer;
      transition: all 0.2s; white-space: nowrap;
    }
    .qr-btn:hover { background: #551756; color: #fff; border-color: #551756; }

    /* Input row */
    .chat-input-row {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 12px;
      border-top: 1px solid #f0eaee;
      background: #fff;
    }
    .chat-input {
      flex: 1; border: 1px solid #e5e0e8; border-radius: 20px;
      padding: 8px 14px; font-size: 13px; color: #1f2328;
      background: #faf9f7; outline: none;
      transition: border-color 0.2s;
      font-family: inherit;
    }
    .chat-input:focus { border-color: #7a2278; background: #fff; }
    .chat-input::placeholder { color: #b0a0b5; }
    .chat-input:disabled { opacity: 0.6; }

    .send-btn {
      width: 36px; height: 36px; border-radius: 50%;
      background: linear-gradient(135deg, #551756, #7a2278);
      border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      color: #e8c547; flex-shrink: 0;
      transition: opacity 0.2s, transform 0.2s;
    }
    .send-btn:hover:not(:disabled) { opacity: 0.88; transform: scale(1.08); }
    .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    /* Mobile */
    @media (max-width: 420px) {
      :host { bottom: 1rem; right: 1rem; }
      .chat-panel { width: calc(100vw - 2rem); right: 0; }
    }
  `]
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('msgContainer') private msgContainer!: ElementRef;
  @ViewChild('inputRef') private inputRef!: ElementRef;

  isOpen = false;
  loading = false;
  inputText = '';
  unread = 1;
  messages: Message[] = [];

  quickReplies = [
    'What jewellery do you sell?',
    'Shipping & delivery info',
    'Return policy',
    'How to care for silver?',
    'Suggest a gift under ₹2000',
  ];

  private history: { role: string; text: string }[] = [];
  private readonly apiUrl = `${environment.apiUrl}/chat/`;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Welcome message
    this.messages.push({
      role: 'bot',
      text: 'Hi! I\'m your Kasavelli Assistant 💎\n\nI can help you with our silver jewellery collections, shipping, returns, and more. What would you like to know?',
      time: this.now(),
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.unread = 0;
      setTimeout(() => this.inputRef?.nativeElement?.focus(), 300);
    }
  }

  sendQuick(text: string): void {
    this.inputText = text;
    this.send();
  }

  send(): void {
    const text = this.inputText.trim();
    if (!text || this.loading) return;

    this.inputText = '';
    this.messages.push({ role: 'user', text, time: this.now() });
    this.history.push({ role: 'user', text });
    this.loading = true;

    this.http.post<{ reply: string; error?: string }>(this.apiUrl, {
      message: text,
      history: this.history.slice(-10),
    }).subscribe({
      next: (res) => {
        this.loading = false;
        const reply = res.reply || 'Sorry, I could not get a response. Please try again.';
        this.messages.push({ role: 'bot', text: reply, time: this.now() });
        this.history.push({ role: 'bot', text: reply });
        if (!this.isOpen) this.unread++;
      },
      error: () => {
        this.loading = false;
        this.messages.push({
          role: 'bot',
          text: 'Sorry, something went wrong. Please try again in a moment.',
          time: this.now(),
        });
      },
    });
  }

  formatText(text: string): string {
    // Bold **text**, newlines to <br>
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  private now(): string {
    return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }

  private scrollToBottom(): void {
    try {
      const el = this.msgContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    } catch {}
  }
}
