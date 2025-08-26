import { Component, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { provideZonelessChangeDetection } from '@angular/core';
import { HeaderComponent } from './components/header.component';
import { HeroComponent } from './components/hero.component';
import { ProductsComponent } from './components/products.component';
import { AboutComponent } from './components/about.component';
import { ContactComponent } from './components/contact.component';
import { FooterComponent } from './components/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    HeroComponent,
    ProductsComponent,
    AboutComponent,
    ContactComponent,
    FooterComponent
  ],
  template: `
    <div class="app-container">
      <app-header />
      <main>
        <app-hero />
        <app-products />
        <app-about />
        <app-contact />
      </main>
      <app-footer />
    </div>
  `,
})
export class App {
  name = signal('PROCHOCO');
}

bootstrapApplication(App, {
  providers: [
  provideZonelessChangeDetection()
  ]
});