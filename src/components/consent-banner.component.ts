import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsentService } from '../app/services/consent.service';
import { AnalyticsService } from '../app/services/analytics.service';
import { TranslateService } from '../app/services/translate.service';

@Component({
  selector: 'app-consent-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="visible" class="consent-overlay" role="dialog" aria-modal="true" aria-labelledby="consent-title">
      <div class="consent-panel" role="document">
        <div class="consent-header">
          <h3 id="consent-title">{{ translate.t('consent.title') }}</h3>
        </div>
        <div class="consent-body">
          <p class="consent-desc">{{ translate.t('consent.description') }}</p>
        </div>
        <div class="consent-footer">
          <button class="btn btn-secondary" (click)="decline()">{{ translate.t('consent.decline') }}</button>
          <button class="btn btn-primary" (click)="accept()">{{ translate.t('consent.accept') }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .consent-overlay {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(2,6,23,0.6);
      z-index: 10000;
      padding: 1rem;
    }
    .consent-panel {
      width: 100%;
      max-width: 720px;
      background: linear-gradient(180deg, #0b1220, #0f172a);
      color: #e6eef8;
      border-radius: 12px;
      box-shadow: 0 12px 40px rgba(2,6,23,0.7);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .consent-header h3 { margin: 0; color: #f1f5f9; font-size: 1.25rem; }
    .consent-desc { color: #cbd5e1; margin: 0; line-height: 1.5; }
    .consent-note { margin: 0; color: #9fb4d6; font-size: 0.95rem; }
    .consent-note a { color: #60a5fa; text-decoration: underline; }
    .consent-footer { display:flex; justify-content: flex-end; gap: 0.75rem; }
    .btn { padding: 0.6rem 0.9rem; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; }
    .btn-primary { background: linear-gradient(45deg,#3b82f6,#06b6d4); color: white; }
    .btn-secondary { background: transparent; color: #cbd5e1; border: 1px solid rgba(255,255,255,0.06); }
    @media (max-width: 640px) {
      .consent-panel { padding: 1rem; }
      .consent-footer { justify-content: stretch; }
      .btn { width: 100%; }
    }
    `,
  ],
})
export class ConsentBannerComponent {
  constructor(private consent: ConsentService, private analytics: AnalyticsService, public translate: TranslateService) {}

  get visible() {
    return this.consent.consentState()() === 'unknown';
  }

  accept() {
    this.consent.setConsent(true);
    // analytics service reacts to consent and loads gtag
  }

  decline() {
    this.consent.setConsent(false);
    this.analytics.optOut();
  }

  openPolicy(event: Event) {
    // Open the cookie policy in a new tab so users can read it without
    // having to accept/decline the modal. Prevent default to ensure a new
    // tab is used even in SPA routing contexts.
    try {
      event.preventDefault();
      // Use absolute path to be safe
      const url = '/cookies';
      window.open(url, '_blank', 'noopener');
    } catch (e) {
      // Fallback: do nothing, browser default will navigate
    }
  }
}
