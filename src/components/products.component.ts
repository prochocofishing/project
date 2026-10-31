import { Component, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '../app/services/translate.service';
import { Product, PRODUCTS } from '../app/data/products';

@Component({
  selector: 'app-products',
  standalone: true,
  template: `
    <section id="products" class="products-section" aria-labelledby="catalogue-title">
      <div class="container">
        <div class="section-header">
          <div>
            <p class="eyebrow">{{ text('O EQUIPAMENTO', 'THE EQUIPMENT') }}</p>
            <h2 id="catalogue-title">{{ text('O teu próximo palhaço.', 'Your next cephalopod jig.') }}</h2>
          </div>
          <p class="section-intro">{{ text('Explora a série PREDADOR e os modelos CIRCUS e PINTAS. Compara tamanhos, acabamentos e condições de utilização.', 'Explore the PREDADOR series and the CIRCUS and PINTAS models. Compare sizes, finishes and fishing conditions.') }}</p>
        </div>
        <div class="catalogue-toolbar">
          <div class="filter-group" role="group" [attr.aria-label]="text('Filtrar por modelo', 'Filter by model')">
            @for (series of seriesFilters; track series.value) {
              <button type="button" class="filter-btn" [class.active]="selectedSeries() === series.value"
                [attr.aria-pressed]="selectedSeries() === series.value" (click)="selectedSeries.set(series.value)">
                {{ series.value === 'all' ? text('Todos', 'All models') : series.label }}
              </button>
            }
          </div>
          <div class="size-filter">
            <label for="catalogue-size">{{ text('Tamanho', 'Size') }}</label>
            <select id="catalogue-size" [value]="selectedSize()" (change)="setSize($event)">
              <option value="all">{{ text('Todos os tamanhos', 'All sizes') }}</option>
              <option value="2.5">2.5 · 10 cm</option><option value="3.0">3.0 · 12 cm</option>
            </select>
          </div>
        </div>
        <p class="catalogue-count" role="status" aria-live="polite" aria-atomic="true">
          {{ filteredProducts().length }} {{ text('de', 'of') }} {{ products.length }} {{ text('produtos', 'products') }}
        </p>
        <div class="products-grid">
          @for (product of filteredProducts(); track product.id) {
            <article id="product-{{ product.id }}" class="product-card" [attr.aria-labelledby]="'product-title-' + product.id">
              <div class="product-image">
                <span class="size-badge">{{ product.sizeNumber }}</span>
                <img [src]="product.image" [alt]="product.name + ' · ' + product.sizeNumber + ' · ' + product.sizeLength"
                  [width]="imageDimensions[product.id][0]" [height]="imageDimensions[product.id][1]" loading="lazy" decoding="async" />
              </div>
              <div class="product-info">
                <p class="product-series">{{ seriesName(product) }}@if (product.series === 'predador') { · {{ product.sizeNumber }} }</p>
                <h3 id="product-title-{{ product.id }}">{{ product.shortName }}</h3>
                @if (product.finish) { <p class="product-finish">{{ text('Acabamento', 'Finish') }}: <strong>{{ product.finish }}</strong></p> }
                <dl class="product-specs">
                  <div><dt>{{ text('Comprimento', 'Length') }}</dt><dd>{{ product.sizeLength }}</dd></div>
                  <div><dt>{{ text('Peso', 'Weight') }}</dt><dd>{{ product.weight }}</dd></div>
                  <div><dt>{{ text('Afundamento', 'Sink rate') }}</dt><dd>{{ product.sinking }}</dd></div>
                </dl>
                <ul class="product-features" [attr.aria-label]="text('Características', 'Features')">
                  @for (featureKey of product.featureKeys; track featureKey) { <li>{{ translate.t(featureKey) }}</li> }
                </ul>
                <details class="product-description">
                  <summary>{{ text('Quando usar este modelo', 'When to use this model') }} <span aria-hidden="true">+</span></summary>
                  <div class="description-content">
                    @for (paragraph of descriptionLines(product); track $index) {
                      <p [class.description-question]="$first">{{ paragraph }}</p>
                    }
                  </div>
                </details>
              </div>
            </article>
          } @empty {
            <div class="empty-state">
              <h3>{{ text('Sem modelos nesta combinação.', 'No models match these filters.') }}</h3>
              <p>{{ text('Experimenta outro tamanho ou consulta o catálogo completo.', 'Try another size or browse the complete catalogue.') }}</p>
              <button type="button" class="reset-btn" (click)="resetFilters()">{{ text('Ver todos os produtos', 'View all products') }}</button>
            </div>
          }
        </div>
        <section id="retailers" class="retailers-strip" aria-labelledby="retailers-title">
          <div class="retailers-header">
            <div><p class="eyebrow">{{ text('PERTO DE TI', 'NEAR YOU') }}</p><h3 id="retailers-title">{{ text('Encontra a PROCHOCO.', 'Find PROCHOCO.') }}</h3></div>
            <p>{{ text('Consulta os nossos produtos nas lojas e revendedores.', 'Browse our products at these shops and retailers.') }}</p>
          </div>
          <div class="retailers-links">
            @for (retailer of retailers; track retailer.name) {
              <a [href]="retailer.url" target="_blank" rel="noopener noreferrer" class="retailer-link">
                {{ retailer.name }}<span aria-hidden="true">↗</span><span class="sr-only">{{ text(' (abre numa nova janela)', ' (opens in a new window)') }}</span>
              </a>
            }
          </div>
        </section>
        <div class="catalogue-cta">
          <div>
            <p class="eyebrow">{{ text('PARCERIAS & REVENDA', 'PARTNERSHIPS & RETAIL') }}</p>
            <h3>{{ text('Leva a PROCHOCO para a tua loja.', 'Bring PROCHOCO to your shop.') }}</h3>
            <p>{{ translate.t('products.cta.text') }}</p>
          </div>
          <a class="catalogue-contact" href="mailto:prochocofishing@gmail.com">{{ text('Falar sobre revenda', 'Enquire about wholesale') }} <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .products-section { background: #f4f7f6; color: #112c3c; padding: 6.5rem 0; }
    .container { margin-inline: auto; }
    .section-header { display: grid; grid-template-columns: 1.15fr 1fr; align-items: end; gap: 3rem; margin-bottom: 2.5rem; }
    .eyebrow { font-size: .72rem; font-weight: 750; letter-spacing: .16em; color: #156393; margin-bottom: .8rem; }
    h2 { font-size: clamp(2rem, 4vw, 3.15rem); line-height: 1.12; letter-spacing: -.045em; font-weight: 750; margin: 0; }
    .section-intro { max-width: 30rem; color: #536874; font-size: 1rem; line-height: 1.75; margin: 0; }
    .catalogue-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding-block: 1.2rem; border-top: 1px solid #d8e2e3; border-bottom: 1px solid #d8e2e3; }
    .filter-group { display: flex; flex-wrap: wrap; gap: .4rem; }
    .filter-btn { padding: .7rem 1.1rem; min-height: 44px; border: 1px solid transparent; border-radius: 6px; font: inherit; font-size: .85rem; font-weight: 650; color: #536874; background: transparent; cursor: pointer; transition: background .2s, color .2s; }
    .filter-btn:hover { color: #112c3c; background: #e5eceb; }
    .filter-btn.active { background: #112c3c; color: #fff; }
    .size-filter { display: flex; align-items: center; gap: .75rem; font-size: .8rem; color: #536874; }
    select { min-height: 44px; border: 1px solid #becdd0; border-radius: 6px; background: #fff; color: #112c3c; padding: .6rem .75rem; font: inherit; font-size: .85rem; }
    .catalogue-count { color: #536874; font-size: .8rem; margin: 1rem 0 1.25rem; }
    .products-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.35rem; align-items: start; }
    .product-card { background: #fff; border: 1px solid #dce5e5; border-radius: 12px; overflow: hidden; scroll-margin-top: 7rem; transition: border-color .2s, box-shadow .2s; }
    .product-card:hover, .product-card:focus-within { border-color: #a9c3ca; box-shadow: 0 8px 24px #112c3c09; }
    .product-image { position: relative; aspect-ratio: 1.5; background: #fff; border-bottom: 1px solid #edf1f1; overflow: hidden; }
    .product-image img { width: 100%; height: 100%; object-fit: contain; display: block; transition: transform .25s; }
    .product-card:hover img { transform: scale(1.025); }
    .size-badge { position: absolute; z-index: 1; top: .9rem; right: .9rem; color: #112c3c; background: #f4f7f6; border: 1px solid #dce5e5; border-radius: 4px; padding: .25rem .5rem; font-size: .75rem; font-weight: 750; }
    .product-info { padding: 1.3rem; }
    .product-series { font-size: .65rem; font-weight: 750; letter-spacing: .13em; color: #156393; margin: 0 0 .4rem; }
    .product-info h3 { font-size: 1.1rem; font-weight: 750; letter-spacing: -.02em; line-height: 1.35; margin: 0 0 1.25rem; }
    .product-finish { color: #536874; font-size: .75rem; line-height: 1.5; margin: -.65rem 0 1.25rem; }
    .product-finish strong { color: #365a61; font-weight: 650; }
    .product-specs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .5rem; margin: 0 0 1rem; padding-bottom: 1.1rem; border-bottom: 1px solid #e8eeee; }
    dt { font-size: .72rem; color: #536874; margin-bottom: .25rem; }
    dd { margin: 0; font-size: .85rem; font-weight: 700; color: #112c3c; }
    .product-features { display: flex; flex-wrap: wrap; gap: .4rem; list-style: none; padding: 0; margin: 0 0 1.15rem; min-height: 3.5rem; align-content: start; }
    .product-features li { padding: .25rem .5rem; border-radius: 4px; background: #eef5f4; color: #365a61; font-size: .7rem; font-weight: 600; line-height: 1.5; }
    .product-description { border-top: 1px solid #e8eeee; }
    summary { padding-top: 1rem; min-height: 44px; color: #156393; font-weight: 650; font-size: .78rem; cursor: pointer; list-style: none; display: flex; justify-content: space-between; gap: .75rem; align-items: center; }
    summary::-webkit-details-marker { display: none; }
    summary span { font-size: 1.25rem; font-weight: 400; transition: transform .2s; }
    details[open] summary span { transform: rotate(45deg); }
    .description-content { padding-top: 1rem; color: #536874; font-size: .8rem; line-height: 1.75; }
    .description-content p { margin-bottom: .75rem; }
    .description-content .description-question { font-weight: 650; color: #112c3c; }
    .empty-state { grid-column: 1 / -1; border: 1px dashed #becdd0; border-radius: 12px; text-align: center; padding: 3rem 1.5rem; }
    .empty-state h3 { font-size: 1.3rem; margin-bottom: .75rem; }
    .empty-state p { color: #536874; font-size: .95rem; }
    .reset-btn { background: #112c3c; color: white; padding: .8rem 1.2rem; min-height: 44px; border: none; border-radius: 6px; cursor: pointer; font: inherit; font-size: .9rem; }
    .retailers-strip { margin-top: 4.5rem; padding-top: 3rem; border-top: 1px solid #d8e2e3; }
    .retailers-header { display: flex; align-items: end; justify-content: space-between; gap: 2rem; margin-bottom: 1.5rem; }
    .retailers-header h3 { font-size: clamp(1.6rem, 3vw, 2rem); font-weight: 750; letter-spacing: -.035em; }
    .retailers-header > p { color: #536874; max-width: 20rem; font-size: .9rem; margin: 0; }
    .retailers-links { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .65rem; }
    .retailer-link { background: white; display: flex; justify-content: space-between; align-items: center; gap: .5rem; border: 1px solid #dce5e5; color: #112c3c; padding: .8rem 1rem; border-radius: 6px; min-height: 48px; font-size: .8rem; font-weight: 650; transition: border-color .2s, background .2s; }
    .retailer-link span[aria-hidden] { color: #156393; }
    .retailer-link:hover { background: #eaf3f1; border-color: #a9c3ca; }
    .catalogue-cta { display: flex; align-items: center; justify-content: space-between; gap: 2rem; margin-top: 3rem; padding: 2.3rem; background: #0d2433; border-radius: 12px; color: white; }
    .catalogue-cta .eyebrow { color: #73e1cf; }
    .catalogue-cta h3 { font-size: clamp(1.45rem, 2.5vw, 1.85rem); letter-spacing: -.025em; font-weight: 700; margin-bottom: .7rem; }
    .catalogue-cta p:last-child { color: #c5d3d9; max-width: 35rem; font-size: .9rem; margin: 0; }
    .catalogue-contact { display: inline-flex; justify-content: center; align-items: center; gap: 1rem; flex-shrink: 0; border-radius: 6px; padding: .95rem 1.2rem; background: #73e1cf; color: #071723; font-size: .85rem; font-weight: 750; min-height: 48px; transition: background .2s; }
    .catalogue-contact:hover { background: #a1f1e4; color: #071723; }
    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0; }
    @media (max-width: 1050px) { .products-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .retailers-links { grid-template-columns: repeat(3, minmax(0, 1fr)); } .catalogue-cta { align-items: start; flex-direction: column; } }
    @media (max-width: 700px) {
      .products-section { padding-block: 4rem; } .section-header { grid-template-columns: 1fr; gap: 1.25rem; margin-bottom: 2rem; }
      .catalogue-toolbar { align-items: start; flex-direction: column; } .filter-group { width: 100%; }
      .filter-btn { flex: 1; font-size: .76rem; padding-inline: .65rem; } .size-filter { width: 100%; justify-content: space-between; }
      .products-grid { gap: 1rem; } .retailers-header { align-items: start; flex-direction: column; gap: 1rem; }
      .retailers-links { grid-template-columns: repeat(2, minmax(0, 1fr)); } .catalogue-cta { padding: 1.5rem; }
    }
    @media (max-width: 480px) { .products-grid { grid-template-columns: 1fr; } .product-info { padding: 1.25rem; } .retailer-link { padding: .75rem; font-size: .75rem; } .catalogue-contact { width: 100%; } }
    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition: none !important; } }
  `],
})
export class ProductsComponent {
  readonly products = PRODUCTS;
  readonly seriesFilters = [
    { value: 'all', label: '' }, { value: 'predador', label: 'PREDADOR' },
    { value: 'circus', label: 'CIRCUS' }, { value: 'pintas', label: 'PINTAS' },
  ];
  readonly retailers = [
    { name: 'Balanzol', url: 'https://balanzol.com/pt/brand/234-prochoco' },
    { name: 'TomarAventura', url: 'https://www.tomaraventura.pt/pt/248_prochoco' },
    { name: 'Ideal Pesca', url: 'https://idealpesca.pt/loja/amostras-toneiras-palhacos/03-08-19-prochoco' },
    { name: 'Loja do Jaime', url: 'https://lojadojaime.pt/marca/prochoco/' },
    { name: 'TudoPesca', url: 'https://lojatudopesca.com/36631-prochoco-squid-30-cor-circus.html' },
    { name: 'Espingardaria Lúcio', url: 'https://espingardarialucio.com/loja/index.php?id_manufacturer=74&controller=manufacturer' },
    { name: 'Estrela do Mar', url: 'https://www.estreladomar.pt/' },
    { name: 'Nova Pesca', url: 'https://www.facebook.com/novapescas/?locale=pt_PT' },
    { name: 'Espingardaria Mirobriga', url: 'https://www.facebook.com/p/Espingardaria-Mirobriga-61556277698212/' },
    { name: 'Caça & Pesca', url: 'https://www.facebook.com/cacapesca09/?locale=pt_PT' },
    { name: 'Bem Pescar', url: 'https://www.facebook.com/BEMPESCAR/?locale=pt_PT' },
    { name: 'Anzol do Sado', url: 'https://anzoldosado.sumupstore.com/' },
    { name: 'Sado Pesca', url: 'https://www.facebook.com/p/Sado-Pesca-100063552639173/?locale=pt_PT' },
    { name: 'Fisga Peixe', url: 'https://www.facebook.com/p/Fisgapeixe-100059731135858/?locale=pt_PT' },
  ];
  readonly imageDimensions: Record<number, [number, number]> = {
    5: [1200, 800], 6: [1200, 800], 7: [1200, 800], 8: [1200, 800], 9: [1200, 800],
    10: [1200, 800], 1: [958, 677], 2: [1134, 796], 3: [1039, 732], 4: [1042, 729],
  };
  readonly selectedSeries = signal('all');
  readonly selectedSize = signal('all');
  readonly filteredProducts = computed(() => this.products.filter(product =>
    (this.selectedSeries() === 'all' || product.series === this.selectedSeries()) &&
    (this.selectedSize() === 'all' || product.sizeNumber === this.selectedSize())
  ));
  constructor(public translate: TranslateService, route: ActivatedRoute) {
    route.fragment.pipe(takeUntilDestroyed()).subscribe(fragment => {
      // A direct link to a product must remain reachable after using filters.
      if (fragment?.startsWith('product-')) this.resetFilters();
    });
  }
  text(pt: string, en: string): string { return this.translate.getLang() === 'en' ? en : pt; }
  setSize(event: Event): void { this.selectedSize.set((event.target as HTMLSelectElement).value); }
  resetFilters(): void { this.selectedSeries.set('all'); this.selectedSize.set('all'); }
  seriesName(product: Product): string { return product.series === 'predador' ? product.name.split(' - ')[0].replace('PROCHOCO ', '') : 'PROCHOCO SQUID JIGS'; }
  descriptionLines(product: Product): string[] {
    return (this.translate.getLang() === 'en' ? product.descriptionEn : product.description).split('\n').map(line => line.trim()).filter(Boolean);
  }
}
