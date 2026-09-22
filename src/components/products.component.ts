import { Component, signal, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DomSanitizer } from "@angular/platform-browser";
import { TranslateService } from "../app/services/translate.service";

interface Product {
  id: number;
  name: string;
  categoryKey: string;
  sizeNumber: string;
  sizeLength: string;
  weight: string;
  sinking: string;
  image: string;
  description: string;
  featureKeys: string[];
}

@Component({
  selector: "app-products",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="products" class="products-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">{{ translate.t("products.title") }}</h2>
          <p class="section-subtitle">{{ translate.t("products.subtitle") }}</p>
        </div>

        <div class="filter-tabs">
          @for (category of categories(); track category) {
            <button
              class="filter-btn"
              [class.active]="selectedCategory() === category"
              (click)="setCategory(category)"
            >
              {{ getTranslatedCategory(category) }}
            </button>
          }
        </div>

        <div class="products-grid">
          @for (product of filteredProducts(); track product.id) {
            <div
              id="product-{{ product.id }}"
              class="product-card"
              (mouseenter)="setHoveredProduct(product.id)"
              (mouseleave)="setHoveredProduct(null)"
            >
              <div class="product-image">
                <img [src]="product.image" [alt]="product.name" />
              </div>
              <div class="product-info">
                <div class="product-header">
                  <h3 class="product-name">{{ product.name }}</h3>
                </div>
                <div
                  class="product-description"
                  [innerHTML]="getFormattedDescription(product.description)"
                ></div>
                <div class="product-specs">
                  <div class="spec">
                    <span class="spec-label">{{
                      translate.t("product.spec.size")
                    }}</span>
                    <div class="spec-value">
                      <div>{{ product.sizeNumber }}</div>
                      <div>{{ product.sizeLength }}</div>
                    </div>
                  </div>
                  <div class="spec">
                    <span class="spec-label">{{
                      translate.t("product.spec.weight")
                    }}</span>
                    <span class="spec-value">{{ product.weight }}</span>
                  </div>
                  <div class="spec">
                    <span class="spec-label">{{
                      translate.t("product.spec.sinking")
                    }}</span>
                    <span class="spec-value">{{ product.sinking }}</span>
                  </div>
                </div>
                <div class="product-features">
                  @for (featureKey of product.featureKeys; track featureKey) {
                    <div class="feature-tag">
                      {{ translate.t(featureKey) }}
                    </div>
                  }
                </div>
                <script
                  type="application/ld+json"
                  [innerHTML]="getProductJsonLd(product)"
                ></script>
              </div>
            </div>
          }
        </div>

        <div class="retailers-strip">
          <div class="retailers-inner">
            <span class="retailers-label">{{ translate.t("products.retailers.label") }}</span>
            <div class="retailers-links">
              <a href="https://balanzol.com/pt/brand/234-prochoco" target="_blank" rel="noopener noreferrer" class="retailer-link">Balanzol</a>
              <a href="https://www.tomaraventura.pt/pt/248_prochoco" target="_blank" rel="noopener noreferrer" class="retailer-link">TomarAventura</a>
              <a href="https://idealpesca.pt/loja/amostras-toneiras-palhacos/03-08-19-prochoco" target="_blank" rel="noopener noreferrer" class="retailer-link">Ideal Pesca</a>
              <a href="https://lojadojaime.pt/marca/prochoco/" target="_blank" rel="noopener noreferrer" class="retailer-link">Loja do Jaime</a>
              <a href="https://lojatudopesca.com/36631-prochoco-squid-30-cor-circus.html" target="_blank" rel="noopener noreferrer" class="retailer-link">TudoPesca</a>
              <a href="https://espingardarialucio.com/loja/index.php?id_manufacturer=74&controller=manufacturer" target="_blank" rel="noopener noreferrer" class="retailer-link">Espingardaria Lúcio</a>
              <a href="https://www.estreladomar.pt/" target="_blank" rel="noopener noreferrer" class="retailer-link">Estrela do Mar</a>
              <a href="https://www.facebook.com/novapescas/?locale=pt_PT" target="_blank" rel="noopener noreferrer" class="retailer-link">Nova Pesca</a>
              <a href="https://www.facebook.com/p/Espingardaria-Mirobriga-61556277698212/" target="_blank" rel="noopener noreferrer" class="retailer-link">Espingardaria Mirobriga</a>
              <a href="https://www.facebook.com/cacapesca09/?locale=pt_PT" target="_blank" rel="noopener noreferrer" class="retailer-link">Caça & Pesca</a>
              <a href="https://www.facebook.com/BEMPESCAR/?locale=pt_PT" target="_blank" rel="noopener noreferrer" class="retailer-link">Bem Pescar</a>
              <a href="https://anzoldosado.sumupstore.com/" target="_blank" rel="noopener noreferrer" class="retailer-link">Anzol do Sado</a>
              <a href="https://www.facebook.com/p/Sado-Pesca-100063552639173/?locale=pt_PT" target="_blank" rel="noopener noreferrer" class="retailer-link">Sado Pesca</a>
              <a href="https://www.facebook.com/p/Fisgapeixe-100059731135858/?locale=pt_PT" target="_blank" rel="noopener noreferrer" class="retailer-link">Fisga Peixe</a>
            </div>
          </div>
        </div>

        <div class="cta-section">
          <h3>{{ translate.t("products.cta.title") }}</h3>
          <p>{{ translate.t("products.cta.text") }}</p>
          <div class="contact-item">
            <span class="contact-icon">📧</span>
            <span>{{ translate.t("footer.contact.email") }}</span>
          </div>
          <!-- <button class="btn btn-primary" (click)="scrollToContact()">
            {{ translate.t("products.cta.button") }}
          </button> -->
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .products-section {
        padding: 6rem 2rem;
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
      }

      .section-header {
        text-align: center;
        margin-bottom: 4rem;
      }

      .section-title {
        font-size: 3rem;
        font-weight: bold;
        color: #f1f5f9;
        margin-bottom: 1rem;
      }

      .section-subtitle {
        font-size: 1.25rem;
        color: #cbd5e1;
        max-width: 600px;
        margin: 0 auto;
        line-height: 1.6;
      }

      .filter-tabs {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 3rem;
        flex-wrap: wrap;
      }

      .filter-btn {
        padding: 0.75rem 1.5rem;
        border: 2px solid rgba(59, 130, 246, 0.3);
        background: transparent;
        color: #cbd5e1;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
      }

      .filter-btn:hover,
      .filter-btn.active {
        background: #3b82f6;
        color: white;
        border-color: #3b82f6;
        transform: translateY(-2px);
      }

      .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
        margin-bottom: 4rem;
      }

      .product-card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        overflow: hidden;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
      }

      .product-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      }

      .product-image {
        position: relative;
        height: 250px;
        overflow: hidden;
      }

      .madein-tag {
        position: absolute;
        top: 0.875rem;
        left: 0.875rem;
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.35rem 0.8rem;
        background: rgba(15, 23, 42, 0.8);
        border: 1px solid rgba(59, 130, 246, 0.35);
        border-radius: 40px;
        color: #f1f5f9;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        backdrop-filter: blur(8px);
        z-index: 2;
      }

      .madein-icon {
        width: 13px;
        height: 13px;
        color: #3b82f6;
        flex-shrink: 0;
      }

      .product-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      .product-card:hover .product-image img {
        transform: scale(1.1);
      }

      .product-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(59, 130, 246, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .product-overlay.visible {
        opacity: 1;
      }

      .overlay-btn {
        background: white;
        color: #3b82f6;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.3s ease;
      }

      .overlay-btn:hover {
        transform: scale(1.05);
      }

      .product-info {
        padding: 1.5rem;
      }

      .product-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
      }

      .product-name {
        font-size: 1.25rem;
        font-weight: bold;
        color: #f1f5f9;
        margin: 0;
      }

      .product-price {
        font-size: 1.5rem;
        font-weight: bold;
        color: #3b82f6;
      }

      .product-description {
        color: #cbd5e1;
        line-height: 1.6;
        margin-bottom: 1rem;
        font-size: 0.9rem;
      }

      .desc-question {
        color: #60a5fa;
        font-weight: 600;
        margin-bottom: 0.5rem;
        font-size: 0.95rem;
      }

      .desc-line {
        color: #cbd5e1;
        margin-bottom: 0.35rem;
        padding-left: 0.5rem;
      }

      .product-specs {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .spec {
        display: flex;
        flex-direction: column;
        font-size: 0.875rem;
        gap: 0.25rem;
      }

      .spec-label {
        padding-right: 5px;
        color: #94a3b8;
      }

      .spec-value {
        color: #cbd5e1;
        font-weight: 600;
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
        line-height: 1.2;
      }

      .product-colors {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .colors-label {
        font-size: 0.875rem;
        color: #94a3b8;
      }

      .color-dots {
        display: flex;
        gap: 0.25rem;
      }

      .color-dot {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.3);
        cursor: pointer;
        transition: transform 0.2s ease;
      }

      .color-dot:hover {
        transform: scale(1.2);
      }

      .product-features {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .feature-tag {
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        color: #ffffff;
        padding: 0.5rem 0.875rem;
        border-radius: 8px;
        font-size: 0.75rem;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .retailers-strip {
        display: flex;
        justify-content: center;
        margin-bottom: 4rem;
      }

      .retailers-inner {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        flex-wrap: wrap;
        justify-content: center;
        padding: 1.25rem 2rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 14px;
      }

      .retailers-label {
        color: #94a3b8;
        font-size: 0.9rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .retailers-links {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
      }

      .retailer-link {
        display: inline-block;
        padding: 0.5rem 1rem;
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 30px;
        background: rgba(59, 130, 246, 0.1);
        color: #bfdbfe;
        font-size: 0.85rem;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.25s ease;
      }

      .retailer-link:hover {
        background: #3b82f6;
        color: #ffffff;
        transform: translateY(-2px);
        box-shadow: 0 6px 18px rgba(59, 130, 246, 0.35);
      }

      .cta-section {
        text-align: center;
        background: rgba(59, 130, 246, 0.1);
        padding: 3rem 2rem;
        border-radius: 16px;
        border: 1px solid rgba(59, 130, 246, 0.2);
      }

      .cta-section h3 {
        font-size: 2rem;
        color: #f1f5f9;
        margin-bottom: 1rem;
      }

      .cta-section p {
        color: #cbd5e1;
        font-size: 1.125rem;
        margin-bottom: 2rem;
      }

      .btn {
        padding: 1rem 2rem;
        border-radius: 8px;
        font-weight: 600;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 1rem;
      }

      .btn-primary {
        background: linear-gradient(45deg, #3b82f6, #06b6d4);
        color: white;
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
      }

      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
      }

      @media (max-width: 768px) {
        .products-section {
          padding: 4rem 1rem;
        }

        .section-title {
          font-size: 2rem;
        }

        .products-grid {
          grid-template-columns: 1fr;
        }

        .product-specs {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ProductsComponent {
  hoveredProduct = signal<number | null>(null);
  selectedCategory = signal("all");
  products = signal<Product[]>([
    {
      id: 5,
      name: "PROCHOCO PREDADOR 01 - CAVALA JAPONESA",
      categoryKey: "product.category.squid",
      sizeNumber: "2.5",
      sizeLength: "10 cm",
      weight: "10g",
      sinking: "5.0 s/m",
      image: "assets/images/products/cavala2.5.png",
      description:
        'Quando usar o "cavala japonesa"?  \nDurante o dia, sobretudo com sol alto e água clara: o corpo dourado reflete a luz, imitando um cardume de sardinha ou cavala junto à superfície.\n\nÉ um padrão muito eficaz em águas límpidas, onde o dourado sólido se destaca por contraste com o brilho intenso do sol.\n\nA pinta junto às agulhas, semelhante a um olho, funciona como um ponto de atração visual. Ao explorar o comportamento natural do choco, que tende a atacar a presa pela zona da cabeça, ajuda a direcionar o ataque para a área das agulhas.',
      featureKeys: [
        "product.feature.bkk",
        "product.feature.glow",
        "product.feature.goldBody",
        "product.feature.laser",
      ],
    },
    {
      id: 6,
      name: "PROCHOCO PREDADOR 02 - ZEBRA",
      categoryKey: "product.category.squid",
      sizeNumber: "2.5",
      sizeLength: "10 cm",
      weight: "10g",
      sinking: "5.0 s/m",
      image: "assets/images/products/zebra2.5.png",
      description:
        'Quando usar a "zebra"?  \nO corpo glow acumula luz e brilha no escuro, mantendo o isco visível quando a luz é pouca.\n\nAs riscas a preto e branco criam um contraste máximo, ideal para água turva, dias nublados, ao amanhecer, ao entardecer e durante a noite.\n\nA pinta junto às agulhas, semelhante a um olho, funciona como um ponto de atração visual. Ao explorar o comportamento natural do choco, que tende a atacar a presa pela zona da cabeça, ajuda a direcionar o ataque para a área das agulhas.',
      featureKeys: [
        "product.feature.bkk",
        "product.feature.glow",
        "product.feature.glowBody",
        "product.feature.laser",
      ],
    },
    {
      id: 7,
      name: "PROCHOCO PREDADOR 03 - UVA BRAVA",
      categoryKey: "product.category.squid",
      sizeNumber: "2.5",
      sizeLength: "10 cm",
      weight: "10g",
      sinking: "5.0 s/m",
      image: "assets/images/products/uvabrava2.5.png",
      description:
        'Quando usar a "uva brava"?  \nO vermelho é dos tons mais eficazes ao amanhecer e ao entardecer, quando a água ganha um tom avermelhado.\n\nO roxo (uva) é das últimas cores a desaparecer com a profundidade, funcionando bem quando a luz é fraca ou a água está mais carregada.\n\nA pinta junto às agulhas, semelhante a um olho, funciona como um ponto de atração visual. Ao explorar o comportamento natural do choco, que tende a atacar a presa pela zona da cabeça, ajuda a direcionar o ataque para a área das agulhas.',
      featureKeys: [
        "product.feature.bkk",
        "product.feature.glow",
        "product.feature.redBody",
        "product.feature.laser",
      ],
    },
    {
      id: 8,
      name: "PROCHOCO PREDADOR 04 - O MATADOR",
      categoryKey: "product.category.squid",
      sizeNumber: "2.5",
      sizeLength: "10 cm",
      weight: "10g",
      sinking: "5.0 s/m",
      image: "assets/images/products/matador2.5.png",
      description:
        'Quando usar "o matador"?  \nO roxo tape reflete a luz e é das últimas cores a desaparecer com a profundidade, mantendo o isco visível em pouca luz e água mais escura.\n\nO dorso verde claro com riscas roxas garante contraste, excelente à noite e durante o crepúsculo.\n\nA pinta junto às agulhas, semelhante a um olho, funciona como um ponto de atração visual. Ao explorar o comportamento natural do choco, que tende a atacar a presa pela zona da cabeça, ajuda a direcionar o ataque para a área das agulhas.',
      featureKeys: [
        "product.feature.bkk",
        "product.feature.glow",
        "product.feature.purpleBody",
        "product.feature.laser",
      ],
    },
    {
      id: 9,
      name: "PROCHOCO PREDADOR 05 - LULA EM CHAMAS",
      categoryKey: "product.category.squid",
      sizeNumber: "2.5",
      sizeLength: "10 cm",
      weight: "10g",
      sinking: "5.0 s/m",
      image: "assets/images/products/lulachamas2.5.png",
      description:
        'Quando usar a "lula em chamas"?  \nO corpo rainbow é muito versátil, funcionando durante todo o dia em vários tipos de água.\n\nO fade em tons de roxo e rosa que imita chamas é especialmente eficaz ao amanhecer e ao entardecer, quando a luz muda rapidamente.\n\nA pinta junto às agulhas, semelhante a um olho, funciona como um ponto de atração visual. Ao explorar o comportamento natural do choco, que tende a atacar a presa pela zona da cabeça, ajuda a direcionar o ataque para a área das agulhas.',
      featureKeys: [
        "product.feature.bkk",
        "product.feature.rainbow",
        "product.feature.laser",
      ],
    },
    {
      id: 10,
      name: "PROCHOCO PREDADOR 06 - COBRA",
      categoryKey: "product.category.squid",
      sizeNumber: "2.5",
      sizeLength: "10 cm",
      weight: "10g",
      sinking: "5.0 s/m",
      image: "assets/images/products/cobra2.5.png",
      description:
        'Quando usar a "cobra"?  \nO dourado sólido destaca-se por silhueta no sol alto e na luz intensa, funcionando muito bem em dias de sol e água clara.\n\nA folha dourada reflete a luz como um cardume de pequenos peixes, aumentando a atração à distância.\n\nA pinta junto às agulhas, semelhante a um olho, funciona como um ponto de atração visual. Ao explorar o comportamento natural do choco, que tende a atacar a presa pela zona da cabeça, ajuda a direcionar o ataque para a área das agulhas.',
      featureKeys: [
        "product.feature.bkk",
        "product.feature.glow",
        "product.feature.goldBody",
        "product.feature.laser",
      ],
    },
    {
      id: 1,
      name: "PROCHOCO CIRCUS",
      categoryKey: "product.category.squid",
      sizeNumber: "2.5",
      sizeLength: "10 cm",
      weight: "10g",
      sinking: "5.0 s/m",
      image: "assets/images/products/circus2.5.png",
      description:
        'Quando usar um palhaço "rainbow"? \nDurante o dia, sobretudo quando o sol já está mais alto.\n\nÉ um padrão muito versátil, funcionando bem em vários tipos de água, desde mais clara até ligeiramente turva.',
      featureKeys: [
        "product.feature.bkk",
        "product.feature.glow",
        "product.feature.rainbow",
        "product.feature.laser",
      ],
    },
    {
      id: 2,
      name: "PROCHOCO PINTAS",
      categoryKey: "product.category.squid",
      sizeNumber: "2.5",
      sizeLength: "10 cm",
      weight: "10g",
      sinking: "5.0 s/m",
      image: "assets/images/products/pintas2.5.png",
      description:
        'Quando usar um palhaço "rainbow"?  \nDurante o dia, sobretudo quando o sol já está mais alto.\n\nÉ um padrão muito versátil, funcionando bem em vários tipos de água, desde mais clara até ligeiramente turva.',
      featureKeys: [
        "product.feature.bkk",
        "product.feature.glow",
        "product.feature.rainbow",
        "product.feature.laser",
      ],
    },
    {
      id: 3,
      name: "PROCHOCO CIRCUS",
      categoryKey: "product.category.squid",
      sizeNumber: "3.0",
      sizeLength: "12 cm",
      weight: "16g",
      sinking: "3.5 s/m",
      image: "assets/images/products/circus3.0.png",
      description:
        'Quando usar um palhaço "rainbow"?  \nDurante o dia, sobretudo quando o sol já está mais alto.\n\nÉ um padrão muito versátil, funcionando bem em vários tipos de água, desde mais clara até ligeiramente turva.',
      featureKeys: [
        "product.feature.bkk",
        "product.feature.glow",
        "product.feature.rainbow",
        "product.feature.laser",
      ],
    },
    {
      id: 4,
      name: "PROCHOCO PINTAS",
      categoryKey: "product.category.squid",
      sizeNumber: "3.0",
      sizeLength: "12 cm",
      weight: "16g",
      sinking: "3.5 s/m",
      image: "assets/images/products/pintas3.0.png",
      description:
        'Quando usar um palhaço "rainbow"?  \nDurante o dia, sobretudo quando o sol já está mais alto.\n\nÉ um padrão muito versátil, funcionando bem em vários tipos de água, desde mais clara até ligeiramente turva.',
      featureKeys: [
        "product.feature.bkk",
        "product.feature.glow",
        "product.feature.rainbow",
        "product.feature.laser",
      ],
    },
  ]);

  constructor(
    public translate: TranslateService,
    private sanitizer: DomSanitizer,
  ) {}

  categories = computed(() => {
    const uniqueCategories = [
      ...new Set(this.products().map((p) => p.categoryKey)),
    ];
    return ["all", ...uniqueCategories];
  });

  filteredProducts = computed(() => {
    if (this.selectedCategory() === "all") {
      return this.products();
    }
    return this.products().filter(
      (p) => p.categoryKey === this.selectedCategory(),
    );
  });

  setCategory(category: string) {
    this.selectedCategory.set(category);
  }

  setHoveredProduct(id: number | null) {
    this.hoveredProduct.set(id);
  }

  scrollToContact() {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }

  getTranslatedCategory(category: string): string {
    if (category === "all") {
      return this.translate.getLang() === "en" ? "All" : "Todos";
    }
    return this.translate.t(category);
  }

  getFormattedDescription(text: string) {
    const lines = text.split("\n").filter((line) => line.trim());
    const html = lines
      .map((line, index) => {
        if (index === 0) {
          return `<div class="desc-question"><strong>${line}</strong></div>`;
        }
        return `<div class="desc-line">• ${line}</div>`;
      })
      .join("");
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  getProductJsonLd(product: Product) {
    try {
      const imageUrl =
        typeof window !== "undefined" && window.location
          ? new URL(product.image, window.location.origin).href
          : product.image;
      const pageUrl =
        typeof window !== "undefined" && window.location
          ? `${window.location.origin}${window.location.pathname}#product-${product.id}`
          : `https://www.prochoco.com/#product-${product.id}`;

      const json: any = {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: product.name,
        image: [imageUrl],
        description: product.description.replace(/\n/g, " "),
        sku: String(product.id),
        brand: {
          "@type": "Brand",
          name: "PROCHOCO",
        },
        url: pageUrl,
        category: this.translate?.t(product.categoryKey) || product.categoryKey,
      };
      return this.sanitizer.bypassSecurityTrustHtml(JSON.stringify(json));
    } catch (e) {
      return this.sanitizer.bypassSecurityTrustHtml("{}");
    }
  }
}
