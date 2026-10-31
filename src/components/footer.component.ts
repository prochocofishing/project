import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService } from '../app/services/translate.service';
import { ConsentService } from '../app/services/consent.service';
import { AnalyticsService } from '../app/services/analytics.service';

@Component({
  selector: 'app-footer', standalone: true, imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a [routerLink]="translate.homePath()" fragment="home" class="brand-link" [attr.aria-label]="en ? 'PROCHOCO — Home' : 'PROCHOCO — Início'">
              <img src="assets/images/logo.webp" alt="PROCHOCO" width="220" height="64" loading="lazy" decoding="async">
            </a>
            <p>{{ en ? 'A Portuguese brand of cephalopod fishing jigs. A passion for the sea, attention to every detail.' : 'Uma marca portuguesa de palhaços para a pesca de cefalópodes. Paixão pelo mar, atenção a cada pormenor.' }}</p>
            <div class="social-links" [attr.aria-label]="en ? 'Social media' : 'Redes sociais'">
              <a href="https://www.facebook.com/profile.php?id=61577095214540" target="_blank" rel="noopener noreferrer">Facebook <span aria-hidden="true">↗</span></a>
              <a href="https://www.instagram.com/prochoco.fishing/" target="_blank" rel="noopener noreferrer">Instagram <span aria-hidden="true">↗</span></a>
              <a href="https://www.youtube.com/@PROCHOCO-FISHING" target="_blank" rel="noopener noreferrer">YouTube <span aria-hidden="true">↗</span></a>
              <a href="https://www.tiktok.com/@prochoco.fishing" target="_blank" rel="noopener noreferrer">TikTok <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <nav class="footer-section" [attr.aria-label]="en ? 'Explore PROCHOCO' : 'Explorar PROCHOCO'">
            <h2>{{ en ? 'Explore' : 'Explorar' }}</h2>
            <a [routerLink]="translate.homePath()" fragment="products">{{ translate.t('nav.products') }}</a>
            <a [routerLink]="translate.homePath()" fragment="about">{{ translate.t('about.title') }}</a>
            <a [routerLink]="translate.homePath()" fragment="retailers">{{ en ? 'Retailers' : 'Revendedores' }}</a>
            <a [routerLink]="translate.homePath()" fragment="contact">{{ en ? 'Wholesale enquiries' : 'Vendas por grosso' }}</a>
          </nav>
          <div class="footer-section footer-contact">
            <h2>{{ translate.t('footer.contact.title') }}</h2>
            <a class="email-link" href="mailto:prochocofishing@gmail.com">prochocofishing&#64;gmail.com</a>
            <p>{{ translate.t('footer.contact.address') }}</p>
            <a [routerLink]="translate.homePath()" fragment="contact" class="contact-cta">{{ en ? 'Talk to us' : 'Fale connosco' }} <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>{{ copyright }}</p>
          <nav class="legal-links" [attr.aria-label]="en ? 'Legal information and privacy' : 'Informação legal e privacidade'">
            <a [routerLink]="translate.pagePath('privacy')">{{ translate.t('footer.privacy') }}</a>
            <a [routerLink]="translate.pagePath('terms')">{{ translate.t('footer.terms') }}</a>
            <a [routerLink]="translate.pagePath('cookies')">{{ translate.t('footer.cookies') }}</a>
            <button type="button" (click)="openPreferences()">{{ en ? 'Cookie preferences' : 'Preferências de cookies' }}</button>
            <button type="button" (click)="optOut()">{{ translate.t('footer.optout') }}</button>
          </nav>
          <span class="consent-feedback" role="status" aria-live="polite">{{ consentFeedback }}</span>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host { display: block; }
    .footer { background: #071723; color: #a9bdc8; }
    .footer-grid { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, .8fr) minmax(0, 1.2fr); gap: clamp(1.7rem, 5vw, 5rem); padding: 4rem 0 3.5rem; }
    .brand-link { display: inline-flex; align-items: center; min-height: 64px; margin-bottom: 1.25rem; }
    .brand-link img { display: block; width: 200px; height: 64px; object-fit: contain; object-position: left center; }
    .footer-brand p { max-width: 24rem; font-size: .87rem; line-height: 1.85; margin-bottom: 1.1rem; }
    .social-links { display: flex; flex-wrap: wrap; gap: .1rem 1rem; }
    a { color: #b3c6ce; text-decoration: none; }
    a:hover { color: #73e1cf; text-decoration: underline; text-underline-offset: 4px; }
    .social-links a { display: inline-flex; align-items: center; gap: .3rem; min-height: 38px; font-size: .74rem; }
    .social-links span { color: #73e1cf; }
    h2 { color: #f4f7f6; font-size: .8rem; font-weight: 650; margin: .8rem 0 1.2rem; }
    .footer-section > a { display: flex; align-items: center; min-height: 39px; font-size: .85rem; line-height: 1.5; }
    .email-link { overflow-wrap: anywhere; word-break: break-word; }
    .footer-contact p { font-size: .85rem; margin: .4rem 0 1rem; }
    .footer-section .contact-cta { display: inline-flex; gap: 1.5rem; color: #73e1cf; border-bottom: 1px solid #365450; min-height: 42px; }
    .footer-bottom { padding: 1.6rem 0 2rem; border-top: 1px solid #263d4b; display: flex; justify-content: space-between; gap: .75rem 2rem; flex-wrap: wrap; }
    .footer-bottom p { margin: 0; font-size: .72rem; line-height: 2.4; }
    .legal-links { display: flex; align-items: center; flex-wrap: wrap; gap: .25rem 1.2rem; }
    .legal-links a, .legal-links button { display: inline-flex; align-items: center; min-height: 36px; font-size: .7rem; line-height: 1.6; }
    .legal-links button { padding: 0; border: 0; background: none; color: #b3c6ce; font-family: inherit; cursor: pointer; text-align: left; }
    .legal-links button:hover { color: #73e1cf; text-decoration: underline; text-underline-offset: 4px; }
    .consent-feedback { width: 100%; color: #73e1cf; font-size: .75rem; }
    .consent-feedback:empty { display: none; }
    @media (max-width: 800px) { .footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; padding-top: 3rem; } .footer-brand { grid-column: 1 / -1; } .footer-bottom { flex-direction: column; gap: .5rem; } }
    @media (max-width: 420px) { .footer-grid { grid-template-columns: 1fr; } .footer-brand { grid-column: auto; } }
  `]
})
export class FooterComponent {
  consentFeedback = '';
  constructor(public translate: TranslateService, private consent: ConsentService, private analytics: AnalyticsService) {}
  get en() { return this.translate.getLang() === 'en'; }
  get copyright() { return String(this.translate.t('footer.copyright') || '').replace('{year}', String(new Date().getFullYear())); }
  optOut() {
    this.consent.revokeConsent();
    this.analytics.optOut();
    this.consentFeedback = this.en ? 'Analytics is disabled.' : 'O Analytics está desativado.';
  }
  openPreferences() {
    this.analytics.optOut();
    this.consent.clearConsent();
    this.consentFeedback = '';
    requestAnimationFrame(() => document.getElementById('consent-decline')?.focus());
  }
}
