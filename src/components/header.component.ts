import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '../app/services/translate.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <nav class="nav-container">
        <div class="logo" (click)="scrollTo('home')">
          <img src="assets/images/logo.png" alt="home" class="mascot" />
        </div>

        <div class="nav-menu" [class.active]="isMenuOpen()">
          <a href="#home" class="nav-link" (click)="scrollTo('home')">{{ translate.t('nav.home') }}</a>
          <a href="#products" class="nav-link" (click)="scrollTo('products')">{{ translate.t('nav.products') }}</a>
          <a href="#about" class="nav-link" (click)="scrollTo('about')">{{ translate.t('nav.about') }}</a>
          <a href="#contact" class="nav-link" (click)="scrollTo('contact')">{{ translate.t('nav.contact') }}</a>
        </div>

        <div class="lang-switch" role="group" aria-label="Language switch">
          <button class="lang-btn" [class.active]="translate.getLang() === 'pt-PT'" (click)="setLang('pt-PT')">PT</button>
          <button class="lang-btn" [class.active]="translate.getLang() === 'en'" (click)="setLang('en')">EN</button>
        </div>

        <button class="menu-toggle" (click)="toggleMenu()" [attr.aria-expanded]="isMenuOpen()">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
    </header>
  `,
  styles: [`
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(10px);
      z-index: 1000;
      border-bottom: 1px solid rgba(59, 130, 246, 0.2);
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 2rem;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0;
      cursor: pointer;
      height: 80px;
    }

    .logo-img {
      height: 100%;
      width: auto;
      max-width: 300px;
      object-fit: contain;
      filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.3));
      transition: transform 0.3s ease;
    }

    .mascot {
      height: 64px;
      margin-left: 12px;
      object-fit: contain;
      filter: drop-shadow(0 0 6px rgba(0,0,0,0.4));
      border-radius: 6px;
    }

    .logo:hover .logo-img {
      transform: scale(1.05);
    }

    .brand-name {
      font-size: 1.75rem;
      font-weight: 900;
      color: #ffffff;
      letter-spacing: 0.05em;
      font-family: 'Arial Black', sans-serif;
      text-transform: uppercase;
      background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
    }

    .brand-underline {
      width: 100px;
      height: 3px;
      background: linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%);
      border-radius: 2px;
      animation: underlineWave 3s ease-in-out infinite;
    }

    @keyframes underlineWave {
      0%, 100% {
        width: 100px;
      }
      50% {
        width: 120px;
      }
    }

    .nav-menu {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .nav-link {
      color: #e2e8f0;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      position: relative;
    }

    .nav-link:hover {
      color: #3b82f6;
      background: rgba(59, 130, 246, 0.1);
      transform: translateY(-1px);
    }

    .lang-switch {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      margin-left: 1rem;
    }

    .lang-btn {
      padding: 0.35rem 0.6rem;
      border-radius: 6px;
      border: 1px solid rgba(226,232,240,0.08);
      background: transparent;
      color: #e2e8f0;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .lang-btn.active {
      background: #e2e8f0;
      color: #0f172a;
      transform: translateY(-1px);
    }

    .menu-toggle {
      display: none;
      flex-direction: column;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
    }

    .menu-toggle span {
      width: 25px;
      height: 2px;
      background: #e2e8f0;
      transition: all 0.3s ease;
      margin: 2px 0;
    }

    @media (max-width: 768px) {
      .nav-menu {
        position: fixed;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(15, 23, 42, 0.98);
        flex-direction: column;
        padding: 2rem;
        transform: translateY(-100vh);
        transition: transform 0.3s ease;
        border-top: 1px solid rgba(59, 130, 246, 0.2);
      }

      .nav-menu.active {
        transform: translateY(0);
      }

      .menu-toggle {
        display: flex;
      }

      .menu-toggle span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
      }

      .menu-toggle span:nth-child(2) {
        opacity: 0;
      }

      .menu-toggle span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
      }
    }
  `]
})
export class HeaderComponent {
  isMenuOpen = signal(false);
  constructor(public translate: TranslateService) {}

  toggleMenu() {
    this.isMenuOpen.update(value => !value);
  }

  scrollTo(elementId: string) {
    this.isMenuOpen.set(false);
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  setLang(lang: 'en' | 'pt-PT') {
    this.translate.setLang(lang);
  }
}