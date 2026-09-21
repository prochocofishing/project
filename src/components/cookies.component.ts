import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '../app/services/translate.service';

@Component({
  selector: 'app-cookies',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="cookies-page">
      <div class="container">
        <h1>{{ translate.t('cookies.title') }}</h1>
        <p class="last-updated">{{ translate.t('cookies.lastUpdated') }}</p>
        
        <h2>{{ translate.t('cookies.whatAreTitle') }}</h2>
        <p>{{ translate.t('cookies.whatAre') }}</p>
        
        <h2>{{ translate.t('cookies.whyUseTitle') }}</h2>
        <p>{{ translate.t('cookies.whyUse') }}</p>
        
        <h2>{{ translate.t('cookies.typesTitle') }}</h2>
        <p>{{ translate.t('cookies.types') }}</p>
        
        <h2>{{ translate.t('cookies.consentTitle') }}</h2>
        <p>{{ translate.t('cookies.consent') }}</p>
        
        <h2>{{ translate.t('cookies.contactTitle') }}</h2>
        <p>{{ translate.t('cookies.contact') }}</p>
      </div>
    </section>
  `,
  styles: [
    `
    .cookies-page { padding: 4rem 1rem; background: linear-gradient(135deg, #1e293b 0%, #334155 100%); min-height: 100vh; }
    .container { max-width: 900px; margin: 0 auto; color: #e2e8f0; }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; color: #f1f5f9; }
    .last-updated { font-size: 0.9rem; color: #94a3b8; margin-bottom: 2rem; }
    h2 { font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; color: #f1f5f9; }
    p { line-height: 1.6; margin-bottom: 1rem; color: #cbd5e1; }
    `,
  ],
})
export class CookiesComponent {
  constructor(public translate: TranslateService) {}
}
