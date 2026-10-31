import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '../app/services/translate.service';

@Component({
  selector: 'app-header', standalone: true, imports: [RouterLink],
  template: `
    <header class="header">
      <nav class="nav-container container" [attr.aria-label]="translate.getLang() === 'en' ? 'Main navigation' : 'Navegação principal'">
        <a class="logo" [routerLink]="translate.homePath()" fragment="home" [attr.aria-label]="translate.getLang() === 'en' ? 'PROCHOCO — Home' : 'PROCHOCO — Início'" (click)="closeMenu()">
          <img src="assets/images/logo.webp" alt="PROCHOCO" width="220" height="70" fetchpriority="high" />
          <span class="brand-tagline">{{ translate.t('header.tagline') }}</span>
        </a>
        <div class="nav-menu" id="main-navigation" [class.active]="isMenuOpen()">
          @for (item of navItems; track item.id) {
            <a class="nav-link" [routerLink]="translate.homePath()" [fragment]="item.id" (click)="closeMenu()">{{ translate.t(item.key) }}</a>
          }
          <a class="nav-contact" [routerLink]="translate.homePath()" fragment="contact" (click)="closeMenu()">{{ translate.t('nav.contact') }} <span aria-hidden="true">↗</span></a>
        </div>
        <div class="nav-actions">
          <div class="lang-switch" role="group" [attr.aria-label]="translate.getLang() === 'en' ? 'Language' : 'Idioma'">
            <button type="button" class="lang-btn" lang="pt-PT" aria-label="PT — Português" [attr.aria-pressed]="translate.getLang() === 'pt-PT'" (click)="setLang('pt-PT')">PT</button><span aria-hidden="true">/</span>
            <button type="button" class="lang-btn" lang="en" aria-label="EN — English" [attr.aria-pressed]="translate.getLang() === 'en'" (click)="setLang('en')">EN</button>
          </div>
          <button type="button" class="menu-toggle" (click)="toggleMenu()" [attr.aria-expanded]="isMenuOpen()" aria-controls="main-navigation" [attr.aria-label]="translate.getLang() === 'en' ? (isMenuOpen() ? 'Close menu' : 'Open menu') : (isMenuOpen() ? 'Fechar menu' : 'Abrir menu')">
            <span [class.open]="isMenuOpen()"></span><span [class.open]="isMenuOpen()"></span><span [class.open]="isMenuOpen()"></span>
          </button>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    :host { display: block; position: sticky; top: 0; z-index: 1000; }
    .header { background: #071723; border-bottom: 1px solid #233b48; }
    .nav-container { display: flex; align-items: center; gap: 2rem; min-height: 96px; }
    .logo { display: flex; flex-direction: column; align-items: flex-start; margin-right: auto; padding-block: 10px; }
    .logo:hover { text-decoration: none; }
    .logo img { width: 180px; height: auto; }
    .brand-tagline { color: #b0c4cc; font-size: .55rem; font-weight: 600; letter-spacing: .16em; margin: 4px 0 0 3px; }
    .nav-menu { display: flex; align-items: center; gap: 1.75rem; }
    .nav-link { font-size: .85rem; font-weight: 500; color: #c6d4d9; padding-block: 12px; }
    .nav-link:hover { color: #73e1cf; text-decoration: none; }
    .nav-contact { padding: .6rem 1rem; border: 1px solid #53707d; border-radius: 4px; color: #edf5f6; font-size: .85rem; font-weight: 600; }
    .nav-contact span { margin-left: .7rem; color: #73e1cf; }
    .nav-contact:hover { border-color: #73e1cf; text-decoration: none; }
    .nav-actions, .lang-switch { display: flex; align-items: center; }
    .lang-switch { gap: .15rem; font-size: .7rem; color: #849da7; }
    .lang-btn { min-height: 44px; min-width: 36px; background: transparent; border: 0; color: #adbec6; font-size: .72rem; font-weight: 600; }
    .lang-btn[aria-pressed=true] { color: #73e1cf; text-decoration: underline; text-underline-offset: 6px; }
    .menu-toggle { display: none; width: 44px; height: 44px; background: transparent; border: 1px solid #49626f; border-radius: 4px; padding: 10px; }
    .menu-toggle span { display: block; height: 2px; background: #edf5f6; margin: 4px 0; transition: transform .18s, opacity .18s; }
    .menu-toggle span.open:nth-child(1) { transform: translateY(6px) rotate(45deg); }
    .menu-toggle span.open:nth-child(2) { opacity: 0; }
    .menu-toggle span.open:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }
    @media(max-width: 850px) {
      .nav-container { min-height: 78px; gap: 1rem; }
      .logo img { width: 145px; }
      .brand-tagline { display: none; }
      .nav-actions { gap: .7rem; }
      .menu-toggle { display: block; }
      .nav-menu { display: none; position: absolute; top: 100%; left: 0; right: 0; padding: 1.25rem 1.5rem 1.75rem; background: #0d2433; border-bottom: 1px solid #49626f; box-shadow: 0 16px 25px #0003; }
      .nav-menu.active { display: flex; flex-direction: column; align-items: stretch; gap: .2rem; }
      .nav-link { padding: .8rem 0; font-size: 1rem; }
      .nav-contact { margin-top: .6rem; text-align: center; }
    }
  `]
})
export class HeaderComponent {
  readonly isMenuOpen = signal(false);
  readonly navItems = [{id: 'home', key: 'nav.home'}, {id: 'products', key: 'nav.products'}, {id: 'about', key: 'nav.about'}];
  constructor(public translate: TranslateService, router: Router) {
    router.events.pipe(takeUntilDestroyed()).subscribe(event => { if (event instanceof NavigationEnd) this.closeMenu(); });
  }
  toggleMenu() { this.isMenuOpen.update(value => !value); }
  closeMenu() { this.isMenuOpen.set(false); }
  @HostListener('document:keydown.escape') onEscape() {
    if (this.isMenuOpen()) { this.closeMenu(); document.querySelector<HTMLButtonElement>('.menu-toggle')?.focus(); }
  }
  setLang(lang: 'en' | 'pt-PT') { this.closeMenu(); this.translate.setLang(lang); }
}
