import { Component, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, RouterOutlet } from '@angular/router';
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