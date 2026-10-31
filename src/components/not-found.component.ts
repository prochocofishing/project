import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService } from '../app/services/translate.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="not-found container">
      <p class="eyebrow">404</p>
      <h1>{{ translate.getLang() === 'en' ? 'Page not found' : 'Página não encontrada' }}</h1>
      <p>{{ translate.getLang() === 'en' ? 'Explore the catalogue or contact PROCHOCO.' : 'Explore o catálogo ou entre em contacto com a PROCHOCO.' }}</p>
      <a class="btn btn-primary" [routerLink]="translate.homePath()" fragment="products">{{ translate.t('hero.button.view') }}</a>
    </section>
  `,
  styles: [`.not-found { padding-block: 8rem; min-height: 60vh; } h1 { margin-bottom: 1rem; }`],
})
export class NotFoundComponent {
  constructor(public readonly translate: TranslateService) {}
}
