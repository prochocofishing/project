import { Injectable, signal } from '@angular/core';
import en from '../i18n/en';
import pt from '../i18n/pt-PT';

type Lang = 'en' | 'pt-PT';

@Injectable({ providedIn: 'root' })
export class TranslateService {
  current = signal<Lang>('pt-PT');
  private cache: Record<Lang, Record<string, any>> = {
    'en': en,
    'pt-PT': pt
  };

  setLang(lang: Lang) {
    this.current.set(lang);
  }

  getLang() {
    return this.current();
  }

  t(key: string): any {
    return this.cache[this.current()]?.[key];
  }
}
