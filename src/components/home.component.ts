import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from './hero.component';
import { ProductsComponent } from './products.component';
import { AboutComponent } from './about.component';
import { ContactComponent } from './contact.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeroComponent, ProductsComponent, AboutComponent, ContactComponent],
  template: `
    <app-hero />
    <app-products />
    <app-about />
    <app-contact />
  `,
})
export class HomeComponent {}
