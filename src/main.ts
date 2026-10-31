import { Component, provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet, Routes, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { HeaderComponent } from './components/header.component';
import { FooterComponent } from './components/footer.component';
import { ConsentBannerComponent } from './components/consent-banner.component';
import { SeoService } from './app/services/seo.service';

declare global { interface Window { __PROCHOCO_READY__?: boolean; } }

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, ConsentBannerComponent, RouterOutlet],
  template: `
    <a class="skip-link" href="#main-content" (click)="skipToContent($event)">{{ seo.translate.getLang() === 'en' ? 'Skip to content' : 'Saltar para o conteúdo' }}</a>
    <div class="app-container">
      <app-header />
      <main id="main-content" tabindex="-1"><router-outlet /></main>
      <app-footer />
      <app-consent-banner />
    </div>
  `,
})
export class App {
  constructor(public readonly seo: SeoService) {}

  skipToContent(event: Event) {
    event.preventDefault();
    document.getElementById('main-content')?.focus();
  }
}

const contentRoutes: Routes = [
  { path: '', pathMatch: 'full', loadComponent: () => import('./components/home.component').then(m => m.HomeComponent) },
  { path: 'privacy', loadComponent: () => import('./components/privacy.component').then(m => m.PrivacyComponent) },
  { path: 'terms', loadComponent: () => import('./components/terms.component').then(m => m.TermsComponent) },
  { path: 'cookies', loadComponent: () => import('./components/cookies.component').then(m => m.CookiesComponent) },
];
const routes: Routes = [
  { path: 'en', children: contentRoutes },
  ...contentRoutes,
  { path: '**', loadComponent: () => import('./components/not-found.component').then(m => m.NotFoundComponent) },
];

bootstrapApplication(App, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withEnabledBlockingInitialNavigation(), withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })),
  ],
}).then(() => { window.__PROCHOCO_READY__ = true; })
  .catch(error => console.error('PROCHOCO could not start.', error));
