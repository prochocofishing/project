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
    <div *ngIf="visible" class="consent-banner" role="dialog" aria-live="polite">
      <div class="consent-inner">
        <div class="consent-text">
          <strong>{{ translate.t('consent.title') }}</strong>
          <p>{{ translate.t('consent.description') }}</p>
        </div>
        <div class="consent-actions">
          <button class="btn btn-secondary" (click)="decline()">{{ translate.t('consent.decline') }}</button>
          <button class="btn btn-primary" (click)="accept()">{{ translate.t('consent.accept') }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .consent-banner {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 16px;
      display: flex;
      justify-content: center;
      z-index: 9999;
      padding: 0 1rem;
    }
    .consent-inner {
      max-width: 1100px;
      background: rgba(15, 23, 42, 0.96);
      color: #e6eef8;
      border-radius: 12px;
      padding: 1rem 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 8px 24px rgba(2,6,23,0.6);
    }
    .consent-text p { margin: 0.25rem 0 0 0; color: #cbd5e1; }
    .consent-actions { display: flex; gap: 0.5rem; }
    .btn { padding: 0.5rem 0.75rem; border-radius: 8px; border: none; cursor: pointer; }
    .btn-primary { background: linear-gradient(45deg,#3b82f6,#06b6d4); color: white; }
    .btn-secondary { background: transparent; color: #cbd5e1; border: 1px solid rgba(255,255,255,0.06); }
    @media (max-width: 640px) {
      .consent-inner { flex-direction: column; align-items: stretch; }
      .consent-actions { justify-content: flex-end; }
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
}
