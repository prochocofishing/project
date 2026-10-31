import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import en from '../i18n/en';
import pt from '../i18n/pt-PT';

export type Lang = 'en' | 'pt-PT';

@Injectable({ providedIn: 'root' })
export class TranslateService {
  current = signal<Lang>(this.languageForUrl(window.location.pathname));
  private readonly translations: Record<Lang, Record<string, unknown>> = { en, 'pt-PT': pt };

  constructor(private readonly router: Router) {}

  languageForUrl(url: string): Lang {
    return /^\/en(?:\/|$|[?#])/.test(url) ? 'en' : 'pt-PT';
  }

  syncFromUrl(url: string) { this.current.set(this.languageForUrl(url)); }

  setLang(lang: Lang) {
    const current = this.router.parseUrl(this.router.url);
    const path = this.router.url.split(/[?#]/)[0].replace(/^\/en(?=\/|$)/, '').replace(/^\/+|\/+$/g, '');
    const next = lang === 'en' ? `/en/${path ? path + '/' : ''}` : `/${path ? path + '/' : ''}`;
    void this.router.navigateByUrl(this.router.createUrlTree([next], {
      queryParams: current.queryParams,
      fragment: current.fragment ?? undefined,
    }));
  }

  getLang() { return this.current(); }
  homePath() { return this.current() === 'en' ? '/en/' : '/'; }
  pagePath(page: string) { return `${this.homePath()}${page.replace(/^\/+|\/+$/g, '')}/`; }

  t(key: string): any {
    return this.translations[this.current()][key] ?? this.translations['pt-PT'][key] ?? key;
  }
}
