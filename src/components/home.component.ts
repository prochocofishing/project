import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from './hero.component';
import { ProductsComponent } from './products.component';
import { AboutComponent } from './about.component';
import { ContactComponent } from './contact.component';
import { VideosComponent } from './videos.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeroComponent, VideosComponent, ProductsComponent, AboutComponent, ContactComponent],
  template: `
    <app-hero />
    <app-videos />
    <app-products />
    <app-about />
    <app-contact />
  `,
})
export class HomeComponent {}
