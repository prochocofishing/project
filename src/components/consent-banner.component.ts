import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConsentService } from '../app/services/consent.service';
import { AnalyticsService } from '../app/services/analytics.service';
import { TranslateService } from '../app/services/translate.service';

@Component({
  selector: 'app-consent-banner', standalone: true, imports: [RouterLink],
  template: `
    @if (visible) {
      <aside class="consent-banner" aria-labelledby="consent-title">
        <div class="consent-text">
          <h2 id="consent-title">{{ translate.t('consent.title') }}</h2>
          <p>{{ translate.t('consent.description') }} <a [routerLink]="translate.pagePath('cookies')">{{ translate.t('consent.policy_link_text') }}</a></p>
        </div>
        <div class="consent-actions">
          <button id="consent-decline" type="button" (click)="decline()">{{ translate.t('consent.decline') }}</button>
          <button type="button" (click)="accept()">{{ translate.t('consent.accept') }}</button>
        </div>
      </aside>
    }
  `,
  styles: [`
    .consent-banner { position: fixed; bottom: 1rem; left: 50%; transform: translateX(-50%); width: min(1040px, calc(100% - 2rem)); z-index: 1100; display: flex; align-items: center; gap: 1.5rem; padding: 1.1rem 1.4rem; background: #fff; color: #112c3c; border: 1px solid #c6d6d4; border-radius: 10px; box-shadow: 0 8px 36px #07172326; }
    .consent-text { flex: 1; min-width: 0; }
    h2 { margin: 0 0 .25rem; color: #112c3c; font-size: .86rem; font-weight: 700; }
    p { margin: 0; color: #536874; font-size: .78rem; line-height: 1.65; }
    a { color: #156393; text-decoration: underline; text-underline-offset: 2px; }
    .consent-actions { display: flex; gap: .6rem; flex-shrink: 0; }
    button { min-width: 92px; min-height: 44px; padding: .6rem 1rem; border: 1px solid #112c3c; border-radius: 5px; background: #112c3c; color: #fff; font: inherit; font-size: .8rem; font-weight: 600; cursor: pointer; }
    button:hover { background: #19465b; }
    button:active { background: #071723; }
    @media (max-width: 640px) { .consent-banner { bottom: .6rem; width: calc(100% - 1.2rem); padding: 1rem; flex-direction: column; align-items: stretch; gap: .75rem; } .consent-actions button { flex: 1; } }
  `]
})
export class ConsentBannerComponent {
  constructor(private consent: ConsentService, private analytics: AnalyticsService, public translate: TranslateService) {}
  get visible() { return this.consent.consentState()() === 'unknown'; }
  accept() { this.consent.setConsent(true); }
  decline() { this.consent.setConsent(false); this.analytics.optOut(); }
}
