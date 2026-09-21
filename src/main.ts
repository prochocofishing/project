import { Component, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, RouterOutlet } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TranslateService } from './app/services/translate.service';
import { filter } from 'rxjs/operators';
import { HomeComponent } from './components/home.component';
import { PrivacyComponent } from './components/privacy.component';
import { TermsComponent } from './components/terms.component';
import { CookiesComponent } from './components/cookies.component';
import { HeaderComponent } from './components/header.component';
import { FooterComponent } from './components/footer.component';
import { ConsentBannerComponent } from './components/consent-banner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    ConsentBannerComponent,
    RouterOutlet
  ],
  template: `
    <div class="app-container">
      <app-header />
      <main>
        <router-outlet></router-outlet>
      </main>
      <app-footer />
      <app-consent-banner />
    </div>
  `,
})
export class App {
  name = signal('PROCHOCO');
  constructor(private router: Router, private title: Title, private translate: TranslateService) {
    // set dynamic titles on navigation
    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(() => {
      try {
        const path = this.router.url || '/';
        // Use TranslateService to resolve localized titles when available
        const brand = 'PROCHOCO';
        let pageTitle = brand;
        if (path === '/' || path === '') {
          const productsTitle = this.translate.t('products.title') || this.translate.t('nav.home') || 'Home';
          pageTitle = `${brand} - ${productsTitle}`;
        } else if (path.startsWith('/privacy')) {
          const t = this.translate.t('privacy.title') || 'Privacy Policy';
          pageTitle = `${brand} - ${t}`;
        } else if (path.startsWith('/terms')) {
          const t = this.translate.t('terms.title') || 'Terms of Service';
          pageTitle = `${brand} - ${t}`;
        } else if (path.startsWith('/cookies')) {
          const t = this.translate.t('cookies.title') || 'Cookie Policy';
          pageTitle = `${brand} - ${t}`;
        }
        this.title.setTitle(pageTitle);
      } catch (e) {}
    });
  }
}

const routes = [
  { path: '', component: HomeComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'cookies', component: CookiesComponent },
];

bootstrapApplication(App, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes)
  ]
});