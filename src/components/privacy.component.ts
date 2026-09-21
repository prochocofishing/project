import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '../app/services/translate.service';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="privacy-page">
      <div class="container">
        <h1>{{ translate.t('privacy.title') }}</h1>
        <p>{{ translate.t('privacy.intro') }}</p>
        <h2>{{ translate.t('privacy.dataCollectedTitle') }}</h2>
        <p>{{ translate.t('privacy.dataCollected') }}</p>
        <h2>{{ translate.t('privacy.contactTitle') }}</h2>
        <p>{{ translate.t('privacy.contact') }}</p>
      </div>
    </section>
  `,
  styles: [
    `
    .privacy-page { padding: 4rem 1rem; }
    .container { max-width: 900px; margin: 0 auto; }
    h1 { font-size: 2rem; margin-bottom: 1rem; }
    `,
  ],
})
export class PrivacyComponent {
  constructor(public translate: TranslateService) {}
}
