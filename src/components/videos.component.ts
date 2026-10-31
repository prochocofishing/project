import { Component, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '../app/services/translate.service';

@Component({
  selector: 'app-videos',
  standalone: true,
  template: `
    <section id="videos" class="videos-section" aria-labelledby="videos-title">
      <div class="container">
        <div class="section-header">
          <div><p class="eyebrow">{{ translate.t('videos.eyebrow') }}</p><h2 id="videos-title">{{ translate.t('videos.title') }}</h2></div>
          <p class="section-intro">{{ translate.t('videos.intro') }}</p>
        </div>
        <div class="videos-grid">
          @for (video of videos; track video.id) {
            <article class="video-card" [attr.aria-labelledby]="'video-title-' + video.id">
              <div class="video-media">
                @if (activeVideo() === video.id) {
                  <iframe [id]="'player-' + video.id" [src]="video.embed" [title]="translate.t(video.titleKey)"
                    width="960" height="540" allow="autoplay; encrypted-media; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                } @else {
                  <button [id]="'play-' + video.id" class="video-preview" type="button" (click)="play(video.id)"
                    [attr.aria-label]="translate.t('videos.play') + ': ' + translate.t(video.titleKey)">
                    <img [src]="'assets/images/videos/' + video.id + '.webp'" alt="" width="960" height="540" loading="lazy" decoding="async" />
                    <span class="preview-shade" aria-hidden="true"></span>
                    <span class="play-circle" aria-hidden="true">▶</span>
                    <span class="play-label">{{ translate.t('videos.play') }}</span>
                  </button>
                }
              </div>
              <div class="video-info">
                <div class="video-meta">
                  <span class="video-series">{{ video.series }}</span>
                  @if (activeVideo() === video.id) {
                    <button class="close-video" type="button" (click)="close(video.id)">{{ translate.t('videos.close') }} <span aria-hidden="true">×</span></button>
                  }
                </div>
                <h3 [id]="'video-title-' + video.id">{{ translate.t(video.titleKey) }}</h3>
                <p>{{ translate.t(video.descriptionKey) }}</p>
                <a class="youtube-link" [href]="'https://www.youtube.com/watch?v=' + video.id" target="_blank" rel="noopener noreferrer">
                  {{ translate.t('videos.youtube') }} <span aria-hidden="true">↗</span><span class="sr-only"> {{ translate.t('videos.newWindow') }}</span>
                </a>
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .videos-section { background: #0d2433; padding: 4.5rem 0 5rem; border-top: 1px solid #2c4451; }
    .section-header { display: grid; grid-template-columns: 1fr 1fr; align-items: end; gap: 3rem; margin-bottom: 2rem; }
    .eyebrow { color: #73e1cf; margin-bottom: .8rem; }
    h2 { color: #f4f7f6; font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; line-height: 1.12; }
    .section-intro { color: #b6c8d0; max-width: 30rem; line-height: 1.75; }
    .videos-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.5rem; }
    .video-card { min-width: 0; border: 1px solid #38525d; border-radius: 10px; overflow: hidden; background: #071723; }
    .video-media { aspect-ratio: 16/9; background: #071723; }
    .video-preview { display: block; position: relative; width: 100%; height: 100%; padding: 0; border: 0; color: #fff; background: #071723; overflow: hidden; }
    .video-preview:focus-visible { outline-offset: -5px; }
    .video-preview img { width: 100%; height: 100%; object-fit: cover; transition: transform .25s; }
    .video-preview:hover img { transform: scale(1.035); }
    .preview-shade { position: absolute; inset: 0; background: linear-gradient(transparent 40%, #071723d9); }
    .play-circle { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 64px; height: 64px; display: grid; place-items: center; padding-left: 4px; border-radius: 50%; background: #73e1cf; color: #071723; font-size: 1.35rem; box-shadow: 0 4px 24px #0004; transition: background .2s; }
    .video-preview:hover .play-circle { background: #a1f0e3; }
    .play-label { position: absolute; bottom: 1.1rem; left: 1.3rem; font-size: .9rem; font-weight: 700; }
    iframe { display: block; width: 100%; height: 100%; border: 0; }
    .video-info { padding: 1.35rem 1.5rem 1.5rem; }
    .video-meta { display: flex; justify-content: space-between; align-items: center; gap: 1rem; min-height: 32px; margin-bottom: .5rem; }
    .video-series { font-size: .65rem; font-weight: 700; color: #73e1cf; letter-spacing: .13em; }
    h3 { color: #f4f7f6; font-size: 1.2rem; line-height: 1.35; letter-spacing: -.02em; }
    .video-info p { color: #b6c8d0; font-size: .86rem; line-height: 1.65; margin-top: .7rem; }
    .youtube-link { display: inline-flex; align-items: center; gap: .6rem; min-height: 44px; font-size: .8rem; font-weight: 600; margin-top: .6rem; }
    .close-video { display: inline-flex; align-items: center; gap: .6rem; min-height: 44px; padding: 0 .5rem; border: 1px solid #53707d; border-radius: 4px; background: transparent; color: #edf5f6; font-size: .75rem; }
    .close-video:hover { border-color: #73e1cf; }
    .close-video span { font-size: 1.2rem; }
    @media(max-width: 700px) { .videos-section { padding-block: 3.5rem; } .section-header { grid-template-columns: 1fr; gap: 1rem; } .videos-grid { grid-template-columns: 1fr; } .video-info { padding: 1.1rem 1.25rem; } }
    @media(prefers-reduced-motion: reduce) { .video-preview img, .play-circle { transition: none; } }
  `],
})
export class VideosComponent {
  readonly translate = inject(TranslateService);
  private readonly sanitizer = inject(DomSanitizer);
  readonly activeVideo = signal<string | null>(null);
  // Only these two fixed, supplied video IDs can become trusted resource URLs.
  readonly videos = [
    { id: '7KCfHJeMsKU', series: 'PREDADOR · 2.5', titleKey: 'videos.predador.title', descriptionKey: 'videos.predador.description',
      embed: this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube-nocookie.com/embed/7KCfHJeMsKU?autoplay=1&rel=0') },
    { id: 'TCt42EKedug', series: 'CIRCUS', titleKey: 'videos.circus.title', descriptionKey: 'videos.circus.description',
      embed: this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube-nocookie.com/embed/TCt42EKedug?autoplay=1&rel=0') },
  ];

  play(id: string) {
    this.activeVideo.set(id);
    window.requestAnimationFrame(() => document.getElementById('player-' + id)?.focus());
  }

  close(id: string) {
    this.activeVideo.set(null);
    window.requestAnimationFrame(() => document.getElementById('play-' + id)?.focus());
  }
}
