import { Injectable, signal } from '@angular/core';

export type ConsentState = 'granted' | 'denied' | 'unknown';

const STORAGE_KEY = 'prochoco_analytics_consent';

@Injectable({ providedIn: 'root' })
export class ConsentService {
  private state = signal<ConsentState>('unknown');

  constructor() {
    this.initFromStorage();
  }

  private initFromStorage() {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === 'granted' || v === 'denied') {
        this.state.set(v);
      } else {
        this.state.set('unknown');
      }
    } catch (e) {
      this.state.set('unknown');
    }
  }

  consentState() {
    return this.state;
  }

  isGranted() {
    return this.state() === 'granted';
  }

  setConsent(granted: boolean) {
    const value: ConsentState = granted ? 'granted' : 'denied';
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
      // ignore
    }
    this.state.set(value);
  }

  revokeConsent() {
    try {
      localStorage.setItem(STORAGE_KEY, 'denied');
    } catch (e) {}
    this.state.set('denied');
  }

  clearConsent() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    this.state.set('unknown');
  }
}
