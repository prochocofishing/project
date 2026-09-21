import { Injectable, effect } from '@angular/core';
import { ConsentService } from './consent.service';
import { environment } from '../../environments/environment';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    [key: string]: any;
  }
}

const MEASUREMENT_ID = 'G-KXGF6PEHEV';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private scriptLoaded = false;

  constructor(private consent: ConsentService) {
    // If user already granted consent earlier, load immediately
    if (this.consent.isGranted()) {
      this.loadGtag();
    }
    // react to future changes using Angular signal effect (signals don't have subscribe)
    effect(() => {
      const s = this.consent.consentState()();
      if (s === 'granted' && !this.scriptLoaded) {
        this.loadGtag();
      }
      if (s === 'denied') {
        this.optOut();
      }
    });
  }

  private loadGtag() {
    if (this.scriptLoaded) return;
    // Prevent loading if opt-out flag is set
    if (window[`ga-disable-${MEASUREMENT_ID}`]) {
      return;
    }
    // Only load analytics in production builds
    if (!environment.production) return;

    // create script tag
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    s.onload = () => this.initializeGtag();
    document.head.appendChild(s);
    this.scriptLoaded = true;
  }

  private initializeGtag() {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { (window.dataLayer as any[]).push(arguments); } as any;
    (window.gtag as any)('js', new Date());
    // Disable automatic page_view; we call events manually if needed
    (window.gtag as any)('config', MEASUREMENT_ID, { send_page_view: false, anonymize_ip: true });
  }

  // send an event (page_view or custom)
  sendEvent(name: string, params: Record<string, any> = {}) {
    if (!window.gtag) return;
    window.gtag('event', name, { send_to: MEASUREMENT_ID, ...params });
  }

  // opt-out: set the disable flag and remove any stored consent
  optOut() {
    try {
      window[`ga-disable-${MEASUREMENT_ID}`] = true;
      // best-effort: remove gtag script tags
      const scripts = Array.from(document.querySelectorAll(`script[src*="googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}"]`));
      scripts.forEach(s => s.remove());
      // clear gtag references
      try { delete window.gtag; } catch(e) { window.gtag = undefined; }
      // remove known GA cookies
      this.clearGACookies();
    } catch (e) {}
  }

  private clearGACookies() {
    const cookieNames = [
      '_ga',
      '_gid',
      `_ga_${MEASUREMENT_ID.replace(/G-|-/g, '')}`,
      `_gac_${MEASUREMENT_ID.replace(/G-|-/g, '')}`
    ];
    cookieNames.forEach(name => this.deleteCookie(name));
  }

  private deleteCookie(name: string) {
    try {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${location.hostname}`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    } catch(e) {}
  }
}
