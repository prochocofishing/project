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
    <div *ngIf="visible" class="consent-banner" role="region" aria-label="{{ translate.t('consent.title') }}">
      <div class="consent-text">
        <p class="consent-desc">
          {{ translate.t('consent.description') }}
          <a href="/cookies" (click)="openPolicy($event)">{{ translate.t('consent.policy_link_text') }}</a>
        </p>
      </div>
      <div class="consent-actions">
        <button class="btn btn-secondary" (click)="decline()">{{ translate.t('consent.decline') }}</button>
        <button class="btn btn-primary" (click)="accept()">{{ translate.t('consent.accept') }}</button>
      </div>
    </div>
  `,
  styles: [
    `
    .consent-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 10000;
      background: linear-gradient(180deg, #0b1220, #0f172a);
      color: #e6eef8;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 -8px 30px rgba(2, 6, 23, 0.5);
      padding: 1rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    .consent-text { flex: 1 1 auto; }
    .consent-desc { color: #cbd5e1; margin: 0; line-height: 1.5; max-width: 900px; font-size: 0.95rem; }
    .consent-desc a { color: #60a5fa; text-decoration: underline; white-space: nowrap; }
    .consent-actions {
      display: flex;
      gap: 0.75rem;
      flex-shrink: 0;
    }
    .btn { padding: 0.6rem 1.1rem; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; font-size: 0.95rem; }
    .btn-primary { background: linear-gradient(45deg,#3b82f6,#06b6d4); color: white; }
    .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(59,130,246,0.4); }
    .btn-secondary { background: transparent; color: #cbd5e1; border: 1px solid rgba(255,255,255,0.15); }
    .btn-secondary:hover { background: rgba(255,255,255,0.05); }
    @media (max-width: 768px) {
      .consent-banner { flex-direction: column; align-items: stretch; padding: 1rem; }
      .consent-actions { flex-direction: column; }
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
