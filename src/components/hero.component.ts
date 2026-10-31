import { Component, DestroyRef, HostListener, effect, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService } from '../app/services/translate.service';

@Component({
  selector: 'app-hero', standalone: true, imports: [RouterLink],
  template: `
    <section id="home" class="hero" aria-labelledby="hero-title">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <p class="eyebrow"><span aria-hidden="true"></span> {{ translate.t('hero.eyebrow') }}</p>
            <h1 id="hero-title">{{ translate.t('hero.title_line1') }}<span>{{ translate.t('hero.title_highlight') }}</span></h1>
            <p class="hero-description">{{ translate.t('hero.description') }}</p>
            <div class="hero-buttons">
              <a class="btn btn-primary" [routerLink]="translate.homePath()" fragment="products">{{ translate.t('hero.button.view') }} <span aria-hidden="true">↗</span></a>
              <a class="btn btn-outline" [routerLink]="translate.homePath()" fragment="retailers">{{ translate.t('hero.button.retailers') }}</a>
            </div>
            <a class="video-button" [routerLink]="translate.homePath()" fragment="videos">
              <span class="play-icon" aria-hidden="true">▶</span> {{ translate.t('hero.video.open') }} <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div class="hero-display" role="region" [attr.aria-roledescription]="text('carrossel', 'carousel')"
            [attr.aria-label]="text('Fotografias PROCHOCO', 'PROCHOCO photographs')"
            (mouseenter)="hoverPaused.set(true)" (mouseleave)="hoverPaused.set(false)"
            (focusin)="focusPaused.set(true)" (focusout)="onSlideshowFocusOut($event)"
            (keydown)="onSlideshowKeydown($event)">
            <div class="display-top">
              <span>PROCHOCO</span>
              <span>{{ text('GALERIA', 'GALLERY') }}</span>
            </div>
            <div class="product-visual" [attr.aria-busy]="pendingSlide() !== null">
              @for (slide of slides; track slide.src; let index = $index) {
                <div class="photo-slide" [class.is-active]="activeSlide() === index" role="group"
                  [attr.aria-roledescription]="text('diapositivo', 'slide')"
                  [attr.aria-label]="(index + 1) + text(' de ', ' of ') + slides.length"
                  [attr.aria-hidden]="activeSlide() !== index">
                  <img class="slide-image" [src]="slide.src" [srcset]="slide.srcset" [sizes]="slide.sizes"
                    [alt]="text(slide.altPt, slide.altEn)" [width]="slide.width" [height]="slide.height"
                    [attr.loading]="index === 0 ? 'eager' : 'lazy'" [attr.fetchpriority]="index === 0 ? 'high' : 'low'"
                    decoding="async" (load)="onSlideLoaded(index)" (error)="onSlideError(index)" />
                </div>
              }
              @if (pendingSlide() !== null) { <span class="slide-loading" role="status">{{ text('A carregar fotografia…', 'Loading photograph…') }}</span> }
            </div>
            <div class="display-bottom">
              <div class="slide-caption" [attr.aria-live]="rotationEnabled() ? 'off' : 'polite'" aria-atomic="true">
                <span class="display-label">{{ translate.t('hero.collection') }}</span>
                <p>{{ text(slides[activeSlide()].titlePt, slides[activeSlide()].titleEn) }}</p>
              </div>
              <div class="slideshow-controls" [attr.aria-label]="text('Controlos das fotografias', 'Photograph controls')">
                <div class="slide-dots" role="group" [attr.aria-label]="text('Escolher fotografia', 'Choose photograph')">
                  @for (slide of slides; track slide.src; let index = $index) {
                    <button type="button" class="slide-dot" [attr.aria-pressed]="activeSlide() === index"
                      [attr.aria-label]="text('Mostrar fotografia ', 'Show photograph ') + (index + 1) + ': ' + text(slide.titlePt, slide.titleEn)"
                      (click)="selectSlide(index)"><span aria-hidden="true"></span></button>
                  }
                </div>
                <span class="slide-counter" aria-hidden="true">0{{ activeSlide() + 1 }} / 0{{ slides.length }}</span>
                <div class="slide-actions">
                  <button type="button" class="slide-control" [attr.aria-label]="text('Fotografia anterior', 'Previous photograph')" (click)="advanceSlide(-1)"><span aria-hidden="true">‹</span></button>
                  <button type="button" class="slide-control rotation-control"
                    [attr.aria-label]="rotationEnabled() ? text('Pausar slideshow', 'Pause slideshow') : text('Reproduzir slideshow', 'Play slideshow')"
                    (click)="toggleRotation()"><span aria-hidden="true">{{ rotationEnabled() ? 'Ⅱ' : '▶' }}</span></button>
                  <button type="button" class="slide-control" [attr.aria-label]="text('Fotografia seguinte', 'Next photograph')" (click)="advanceSlide(1)"><span aria-hidden="true">›</span></button>
                </div>
              </div>
              @if (photoUnavailable()) { <p class="slide-error" role="status">{{ text('Não foi possível carregar a fotografia. Tente novamente.', 'The photograph could not be loaded. Please try again.') }}</p> }
            </div>
          </div>
        </div>
        <div class="hero-features" [attr.aria-label]="translate.t('hero.features.label')">
          <div class="feature"><span class="feature-number" aria-hidden="true">01 /</span><div><h2>{{ translate.t('feature.professional.title') }}</h2><p>{{ translate.t('feature.professional.desc') }}</p></div></div>
          <div class="feature"><span class="feature-number" aria-hidden="true">02 /</span><div><h2>{{ translate.t('feature.proven.title') }}</h2><p>{{ translate.t('feature.proven.desc') }}</p></div></div>
          <div class="feature"><span class="feature-number" aria-hidden="true">03 /</span><div><h2>{{ translate.t('feature.wholesale.title') }}</h2><p>{{ translate.t('feature.wholesale.desc') }}</p></div></div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero { padding: clamp(2.75rem, 6vw, 5rem) 0 0; background: #071723; position: relative; }
    .hero-content { display: grid; grid-template-columns: 1.05fr 1fr; gap: clamp(2rem, 5vw, 5rem); align-items: center; padding-bottom: 4rem; }
    .eyebrow { color: #b2c5cb; margin-bottom: 1.5rem; display: flex; align-items: center; gap: .6rem; font-size: .68rem; }
    .eyebrow span { width: 6px; height: 6px; background: #73e1cf; border-radius: 50%; }
    h1 { font-size: clamp(2.9rem, 4.7vw, 4.5rem); font-weight: 650; letter-spacing: -.055em; line-height: 1.07; color: #f4f7f6; max-width: 650px; }
    h1 span { display: block; color: #73e1cf; }
    .hero-description { color: #b6c8d0; margin-top: 1.6rem; font-size: 1.02rem; max-width: 450px; line-height: 1.8; }
    .hero-buttons { display: flex; gap: .75rem; flex-wrap: wrap; margin-top: 2rem; }
    .video-button { display: inline-flex; gap: .65rem; align-items: center; margin-top: 1.4rem; min-height: 44px; background: none; color: #73e1cf; border: 0; font-size: .9rem; font-weight: 650; padding: .3rem 0; }
    .video-button:hover { color: #73e1cf; }
    .play-icon { display: grid; place-items: center; border: 1px solid #65808b; height: 25px; width: 25px; border-radius: 50%; font-size: .5rem; padding-left: 1px; }
    .hero-display { border: 1px solid #38525d; border-radius: 8px; background: #102b39; overflow: hidden; }
    .display-top { display: flex; justify-content: space-between; gap: .5rem; padding: 1.2rem 1.5rem; color: #b1c9d0; font-size: .6rem; font-weight: 600; letter-spacing: .13em; border-bottom: 1px solid #38525d; }
    .display-top > span:first-child { color: #73e1cf; }
    .product-visual { background: #0a1c28; position: relative; aspect-ratio: 4 / 3; overflow: hidden; }
    .photo-slide { position: absolute; inset: 0; opacity: 0; transition: opacity .45s ease; pointer-events: none; }
    .photo-slide.is-active { opacity: 1; }
    .product-visual .slide-image { display: block; width: 100%; height: 100%; object-fit: contain; }
    .slide-loading { position: absolute; left: 50%; bottom: 1rem; transform: translateX(-50%); padding: .4rem .75rem; border-radius: 4px; background: #071723e6; color: #edf5f6; font-size: .75rem; white-space: nowrap; }
    .display-bottom { padding: 1.2rem 1.5rem .75rem; }
    .display-label { color: #73e1cf; font-size: .6rem; letter-spacing: .15em; }
    .slide-caption { min-height: 4.25rem; }
    .slide-caption p { color: #f4f7f6; font-size: .95rem; font-weight: 600; line-height: 1.4; margin-top: .25rem; }
    .slideshow-controls { display: flex; align-items: center; gap: .5rem; padding-top: .4rem; border-top: 1px solid #38525d; }
    .slide-dots, .slide-actions { display: flex; align-items: center; }
    .slide-dot { display: grid; place-items: center; width: 32px; height: 44px; border: 0; background: transparent; }
    .slide-dot span { width: 7px; height: 7px; border-radius: 50%; background: #90aab5; transition: background-color .2s, transform .2s; }
    .slide-dot[aria-pressed=true] span { background: #73e1cf; transform: scale(1.3); }
    .slide-counter { margin-right: auto; color: #b1c9d0; font-size: .65rem; letter-spacing: .1em; white-space: nowrap; }
    .slide-actions { gap: .25rem; }
    .slide-control { display: grid; place-items: center; width: 44px; height: 44px; border: 1px solid transparent; border-radius: 4px; background: transparent; color: #edf5f6; font-size: 1.6rem; line-height: 1; }
    .slide-control:hover { background: #1b3b4a; border-color: #65808b; color: #73e1cf; }
    .rotation-control { font-size: .8rem; }
    .slide-error { padding-top: .5rem; color: #f4ce9d; font-size: .75rem; }
    .hero-features { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid #2c4451; }
    .feature { display: flex; gap: 1rem; padding: 1.75rem 1.5rem; }
    .feature:first-child { padding-left: 0; }
    .feature + .feature { border-left: 1px solid #2c4451; }
    .feature-number { font-size: .65rem; color: #73e1cf; padding-top: .2rem; white-space: nowrap; }
    .feature h2 { font-size: .9rem; font-weight: 600; letter-spacing: -.01em; color: #edf5f6; }
    .feature p { color: #a9bfc8; font-size: .74rem; margin-top: .4rem; }
    @media(max-width: 850px) {
      .hero-content { gap: 2.5rem; grid-template-columns: 1fr; padding-bottom: 2.5rem; }
      .hero-text { max-width: 620px; }
      h1 { font-size: clamp(2.7rem, 7vw, 4rem); }
      .hero-description { max-width: 530px; }
      .hero-display { width: 100%; max-width: 570px; justify-self: center; }
      .feature { padding: 1.3rem 1rem; gap: .6rem; }
    }
    @media(max-width: 560px) {
      .hero-features { grid-template-columns: 1fr; }
      .feature, .feature:first-child { padding: 1.15rem 0; }
      .feature + .feature { border-left: 0; border-top: 1px solid #2c4451; }
      .feature p { margin-top: .2rem; font-size: .8rem; }
      .feature h2 { font-size: .95rem; }
      .hero-buttons .btn { flex-grow: 1; padding-inline: 1rem; }
      .display-bottom, .display-top { padding: 1rem; }
    }
  `]
})
export class HeroComponent {
  private readonly motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  readonly activeSlide = signal(0);
  readonly rotationEnabled = signal(!this.motionPreference.matches);
  readonly hoverPaused = signal(false);
  readonly focusPaused = signal(false);
  readonly pageHidden = signal(document.hidden);
  readonly pendingSlide = signal<number | null>(null);
  readonly photoUnavailable = signal(false);
  private readonly loadedSlides = new Set<number>();
  private readonly failedSlides = new Set<number>();
  readonly slides = [
    {
      src: 'assets/images/hero/collection-predador.webp',
      srcset: 'assets/images/hero/collection-predador-retouched-640.webp 640w, assets/images/hero/collection-predador.webp 1200w',
      sizes: '(max-width: 600px) calc(100vw - 34px), (max-width: 850px) 570px, (max-width: 1248px) 44vw, 544px',
      width: 1200, height: 873,
      titlePt: 'Os padrões da série PREDADOR', titleEn: 'The PREDADOR series patterns',
      altPt: 'Seis palhaços de pesca PROCHOCO da série PREDADOR, com diferentes padrões e cores, sobre um fundo claro',
      altEn: 'Six PROCHOCO PREDADOR fishing jigs in different patterns and colours on a light background',
    },
    {
      src: 'assets/images/hero/pesca-chocos.webp',
      srcset: 'assets/images/hero/pesca-chocos-360.webp 360w, assets/images/hero/pesca-chocos-640.webp 640w, assets/images/hero/pesca-chocos.webp 703w',
      sizes: '(max-width: 600px) 40vw, (max-width: 850px) 215px, 205px',
      width: 703, height: 1400,
      titlePt: 'Palhaços PROCHOCO na pesca ao choco', titleEn: 'PROCHOCO jigs for cuttlefish fishing',
      altPt: 'Palhaços de pesca PROCHOCO de vários padrões junto de chocos capturados',
      altEn: 'PROCHOCO fishing jigs in several patterns alongside caught cuttlefish',
    },
  ];

  constructor(public translate: TranslateService, destroyRef: DestroyRef) {
    effect(onCleanup => {
      if (!this.rotationEnabled() || this.hoverPaused() || this.focusPaused() || this.pageHidden()) return;
      const timer = window.setInterval(() => this.advanceSlide(1, false), 6000);
      onCleanup(() => window.clearInterval(timer));
    });
    const onMotionChange = (event: MediaQueryListEvent) => { if (event.matches) this.rotationEnabled.set(false); };
    this.motionPreference.addEventListener('change', onMotionChange);
    destroyRef.onDestroy(() => this.motionPreference.removeEventListener('change', onMotionChange));
  }

  text(pt: string, en: string) { return this.translate.getLang() === 'en' ? en : pt; }

  selectSlide(index: number, manual = true) {
    if (manual) this.rotationEnabled.set(false);
    if (this.failedSlides.has(index)) { this.photoUnavailable.set(true); return; }
    this.photoUnavailable.set(false);
    if (this.loadedSlides.has(index)) { this.pendingSlide.set(null); this.activeSlide.set(index); }
    else this.pendingSlide.set(index);
  }

  advanceSlide(direction: number, manual = true) {
    this.selectSlide((this.activeSlide() + direction + this.slides.length) % this.slides.length, manual);
  }

  toggleRotation() {
    const enabled = !this.rotationEnabled();
    this.rotationEnabled.set(enabled);
    if (enabled) this.focusPaused.set(false);
  }

  onSlideLoaded(index: number) {
    this.loadedSlides.add(index);
    if (this.pendingSlide() === index) { this.pendingSlide.set(null); this.activeSlide.set(index); }
  }

  onSlideError(index: number) {
    this.failedSlides.add(index);
    if (this.pendingSlide() === index) { this.pendingSlide.set(null); this.photoUnavailable.set(true); this.rotationEnabled.set(false); }
  }

  onSlideshowFocusOut(event: FocusEvent) {
    if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)) this.focusPaused.set(false);
  }

  onSlideshowKeydown(event: KeyboardEvent) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      this.advanceSlide(event.key === 'ArrowLeft' ? -1 : 1);
    }
  }

  @HostListener('document:visibilitychange') onVisibilityChange() { this.pageHidden.set(document.hidden); }
}
