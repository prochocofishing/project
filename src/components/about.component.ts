import { Component } from '@angular/core';
import { TranslateService } from '../app/services/translate.service';

@Component({
  selector: 'app-about', standalone: true,
  template: `
    <section id="about" class="about-section" aria-labelledby="about-title">
      <div class="container about-grid">
        <div class="about-art">
          <span class="art-label">PROCHOCO · {{ en ? 'CEPHALOPODS' : 'CEFALÓPODES' }}</span>
          <img src="assets/images/logomascot.webp" [alt]="en ? 'PROCHOCO fishing mascot' : 'Mascote de pesca PROCHOCO'" width="381" height="555" loading="lazy" decoding="async">
          <p>{{ en ? 'A Portuguese brand. A passion for the sea.' : 'Uma marca portuguesa. Uma paixão pelo mar.' }}</p>
        </div>
        <div class="about-content">
          <p class="eyebrow">{{ en ? 'THE BRAND' : 'A MARCA' }}</p>
          <h2 id="about-title">{{ translate.t('about.title') }}</h2>
          <p class="intro-text">{{ translate.t('about.paragraph') }}</p>
          <div class="values-grid">
            <div class="value-item">
              <span class="value-number" aria-hidden="true">01 /</span>
              <h3>{{ translate.t('about.value2.title') }}</h3>
              <p>{{ translate.t('about.value2.desc') }}</p>
            </div>
            <div class="value-item">
              <span class="value-number" aria-hidden="true">02 /</span>
              <h3>{{ translate.t('about.value3.title') }}</h3>
              <p>{{ translate.t('about.value3.desc') }}</p>
            </div>
          </div>
          <details class="brand-story">
            <summary>{{ en ? 'Discover our story' : 'Conheça a nossa história' }} <span aria-hidden="true">+</span></summary>
            <p>{{ translate.t('hero.subtitle') }}</p>
          </details>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .about-section { padding: clamp(4rem, 8vw, 7rem) 0; background: #0d2433; color: #f4f7f6; }
    .about-grid { display: grid; grid-template-columns: .9fr 1.1fr; gap: clamp(2rem, 6vw, 6rem); align-items: center; }
    .about-art { background: #071b28; border: 1px solid #294251; border-radius: 14px; padding: clamp(1.4rem, 3vw, 2.5rem); text-align: center; }
    .art-label { display: block; color: #a7bbc5; font-size: .66rem; font-weight: 650; letter-spacing: .18em; text-align: left; }
    .about-art img { display: block; width: 100%; height: auto; max-width: 240px; aspect-ratio: 381 / 555; object-fit: contain; margin: 1.5rem auto; }
    .about-art p { margin: 0; padding-top: 1rem; border-top: 1px solid #294251; color: #b3c6ce; font-size: .8rem; line-height: 1.6; }
    .eyebrow { color: #73e1cf; font-size: .72rem; letter-spacing: .16em; font-weight: 700; margin-bottom: 1rem; }
    h2 { color: #f4f7f6; font-size: clamp(2rem, 3.8vw, 3.25rem); line-height: 1.1; letter-spacing: -.045em; margin-bottom: 1.5rem; }
    .intro-text { font-size: 1.08rem; line-height: 1.85; color: #b3c6ce; margin: 0; }
    .values-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 2.2rem; padding-top: 2rem; border-top: 1px solid #294251; }
    .value-number { color: #73e1cf; font-size: .7rem; letter-spacing: .08em; }
    h3 { color: #f4f7f6; font-size: 1rem; margin: .7rem 0; }
    .value-item p { color: #b3c6ce; font-size: .86rem; line-height: 1.75; margin: 0; }
    .brand-story { margin-top: 2rem; border-top: 1px solid #294251; border-bottom: 1px solid #294251; }
    .brand-story summary { display: flex; align-items: center; justify-content: space-between; gap: 1rem; min-height: 58px; padding: .85rem 0; color: #73e1cf; font-size: .9rem; font-weight: 600; cursor: pointer; list-style: none; }
    .brand-story summary::-webkit-details-marker { display: none; }
    .brand-story summary span { font-size: 1.35rem; font-weight: 400; }
    .brand-story[open] summary span { transform: rotate(45deg); }
    .brand-story p { color: #b3c6ce; font-size: .9rem; line-height: 1.9; padding-bottom: 1rem; margin: 0; }
    @media (max-width: 800px) { .about-grid { grid-template-columns: 1fr; gap: 2.5rem; } .about-art { max-width: 440px; width: 100%; margin: 0 auto; } .about-content { order: -1; } .about-art img { max-width: 200px; } }
    @media (max-width: 380px) { .values-grid { grid-template-columns: 1fr; gap: 1.5rem; } }
  `]
})
export class AboutComponent {
  constructor(public translate: TranslateService) {}
  get en() { return this.translate.getLang() === 'en'; }
}
