import { DOCUMENT } from '@angular/common';
import { effect, Inject, Injectable, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { PRODUCTS } from '../data/products';
import { TranslateService } from './translate.service';

const ORIGIN = 'https://www.prochoco.com';
const IMAGE = `${ORIGIN}/assets/images/logo2.png`;
const DESCRIPTIONS: Record<string, { pt: string; en: string }> = {
  home: {
    pt: 'Toneiras PROCHOCO para a pesca de cefalópodes: chocos, lulas e polvos. Séries PREDADOR, CIRCUS e PINTAS, tamanhos 2.5 e 3.0. Contactos para revendedores.',
    en: 'PROCHOCO cephalopod fishing jigs for squid, cuttlefish and octopus. Explore PREDADOR, CIRCUS and PINTAS in sizes 2.5 and 3.0. Retailer and wholesale enquiries.',
  },
  privacy: {
    pt: 'Saiba que dados a PROCHOCO pode recolher durante a navegação ou através do formulário e como nos contactar sobre a sua privacidade.',
    en: 'Learn which data PROCHOCO may collect through browsing and the contact form, and how to contact us about your privacy.',
  },
  terms: {
    pt: 'Consulte os termos de utilização do website PROCHOCO, incluindo utilização permitida, propriedade intelectual e contactos da marca.',
    en: 'Read the PROCHOCO website terms, including permitted use, intellectual property and contact information.',
  },
  cookies: {
    pt: 'Conheça a utilização de cookies no website PROCHOCO, como funciona o consentimento e como desativar a recolha de dados analíticos.',
    en: 'Learn how cookies are used on the PROCHOCO website, how consent works and how to disable analytics.',
  },
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  private path = signal(window.location.pathname);

  constructor(
    private readonly router: Router,
    private readonly title: Title,
    private readonly meta: Meta,
    public readonly translate: TranslateService,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        this.translate.syncFromUrl(event.urlAfterRedirects);
        this.path.set(event.urlAfterRedirects.split(/[?#]/)[0]);
      });
    effect(() => this.update(this.path(), this.translate.getLang() === 'en'));
  }

  private update(path: string, english: boolean) {
    const page = path.replace(/^\/en(?=\/|$)/, '').replace(/^\/+|\/+$/g, '') || 'home';
    const known = Object.hasOwn(DESCRIPTIONS, page);
    const localPath = page === 'home' ? '/' : `/${page}/`;
    const canonical = `${ORIGIN}${english ? '/en' : ''}${localPath}`;
    const title = known
      ? page === 'home'
        ? english ? 'PROCHOCO | Cephalopod fishing jigs from Portugal' : 'PROCHOCO | Toneiras para a pesca de cefalópodes'
        : `${this.translate.t(`${page}.title`)} | PROCHOCO`
      : `${english ? 'Page not found' : 'Página não encontrada'} | PROCHOCO`;
    const description = known ? DESCRIPTIONS[page][english ? 'en' : 'pt'] : english
      ? 'This PROCHOCO page could not be found. Explore the product catalogue.'
      : 'Esta página PROCHOCO não foi encontrada. Explore o catálogo de produtos.';

    this.document.documentElement.lang = english ? 'en' : 'pt-PT';
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: known ? 'index, follow, max-image-preview:large' : 'noindex, follow' });
    for (const [property, content] of Object.entries({
      'og:title': title, 'og:description': description, 'og:url': canonical,
      'og:type': 'website', 'og:site_name': 'PROCHOCO', 'og:image': IMAGE,
      'og:image:alt': 'PROCHOCO', 'og:locale': english ? 'en_GB' : 'pt_PT',
    })) this.meta.updateTag({ property, content });
    for (const [name, content] of Object.entries({
      'twitter:card': 'summary_large_image', 'twitter:title': title,
      'twitter:description': description, 'twitter:image': IMAGE, 'twitter:image:alt': 'PROCHOCO',
    })) this.meta.updateTag({ name, content });

    this.document.querySelectorAll('link[rel="canonical"], link[hreflang]').forEach(link => link.remove());
    if (known) {
      this.link({ rel: 'canonical', href: canonical });
      this.link({ rel: 'alternate', hreflang: 'pt-PT', href: `${ORIGIN}${localPath}` });
      this.link({ rel: 'alternate', hreflang: 'en', href: `${ORIGIN}/en${localPath}` });
      this.link({ rel: 'alternate', hreflang: 'x-default', href: `${ORIGIN}${localPath}` });
    }

    let script = this.document.getElementById('site-structured-data') as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.id = 'site-structured-data';
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': known
      ? this.graph(page, title, description, canonical, english) : [] });
    this.document.documentElement.dataset['seoReady'] = 'true';
  }

  private link(attributes: Record<string, string>) {
    const link = this.document.createElement('link');
    Object.entries(attributes).forEach(([name, value]) => link.setAttribute(name, value));
    this.document.head.appendChild(link);
  }

  private graph(page: string, title: string, description: string, canonical: string, english: boolean): object[] {
    const graph: object[] = [
      {
        '@type': 'Organization', '@id': `${ORIGIN}/#organization`, name: 'PROCHOCO', url: `${ORIGIN}/`,
        logo: IMAGE, email: 'prochocofishing@gmail.com',
        sameAs: ['https://www.facebook.com/profile.php?id=61577095214540', 'https://www.instagram.com/prochoco.fishing/', 'https://www.youtube.com/@PROCHOCO-FISHING'],
      },
      {
        '@type': 'WebSite', '@id': `${ORIGIN}/#website`, name: 'PROCHOCO', url: `${ORIGIN}/`,
        inLanguage: ['pt-PT', 'en'], publisher: { '@id': `${ORIGIN}/#organization` },
      },
      {
        '@type': 'WebPage', '@id': `${canonical}#webpage`, url: canonical, name: title, description,
        inLanguage: english ? 'en' : 'pt-PT', isPartOf: { '@id': `${ORIGIN}/#website` },
        about: { '@id': `${ORIGIN}/#organization` },
      },
    ];
    if (page !== 'home') graph.push({
      '@type': 'BreadcrumbList', '@id': `${canonical}#breadcrumbs`, itemListElement: [
        { '@type': 'ListItem', position: 1, name: english ? 'Home' : 'Início', item: `${ORIGIN}${english ? '/en/' : '/'}` },
        { '@type': 'ListItem', position: 2, name: this.translate.t(`${page}.title`), item: canonical },
      ],
    });
    if (page === 'home') for (const product of PRODUCTS) graph.push({
      '@type': 'Product', '@id': `${canonical}#product-${product.id}`, url: `${canonical}#product-${product.id}`,
      name: `${product.name} ${product.sizeNumber}`, image: [new URL(product.image, `${ORIGIN}/`).href],
      description: (english ? product.descriptionEn : product.description).replace(/\n/g, ' '),
      sku: String(product.id), brand: { '@type': 'Brand', name: 'PROCHOCO' },
      category: this.translate.t(product.categoryKey), size: product.sizeNumber,
      additionalProperty: [
        { '@type': 'PropertyValue', name: english ? 'Length' : 'Comprimento', value: product.sizeLength },
        { '@type': 'PropertyValue', name: english ? 'Weight' : 'Peso', value: product.weight },
        { '@type': 'PropertyValue', name: english ? 'Sink rate' : 'Afundamento', value: product.sinking },
      ],
    });
    return graph;
  }
}
