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
              <div class="product-description" [innerHTML]="getFormattedDescription(product.description)"></div>
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
            </div>
          </div>
          }
        </div>

        <div id="contact" class="cta-section">
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
      id: 1,
      name: "PROCHOCO CIRCUS",
      categoryKey: "product.category.squid",
      sizeNumber: "2.5",
      sizeLength: "10 cm",
      weight: "10g",
      sinking: "5.0 s/m",
      image: "assets/images/products/circus2.5.png",
      description:
        'Quando usar um palhaço "rainbow"? (folha arco-íris)\n\nDurante o dia, sobretudo quando o sol já está mais alto.\n\nÉ um padrão muito versátil, funcionando bem em vários tipos de água, desde mais clara até ligeiramente turva.',
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
        'Quando usar um palhaço "rainbow"? (folha arco-íris)\n\nDurante o dia, sobretudo quando o sol já está mais alto.\n\nÉ um padrão muito versátil, funcionando bem em vários tipos de água, desde mais clara até ligeiramente turva.',
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
        'Quando usar um palhaço "rainbow"? (folha arco-íris)\n\nDurante o dia, sobretudo quando o sol já está mais alto.\n\nÉ um padrão muito versátil, funcionando bem em vários tipos de água, desde mais clara até ligeiramente turva.',
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
        'Quando usar um palhaço "rainbow"? (folha arco-íris)\n\nDurante o dia, sobretudo quando o sol já está mais alto.\n\nÉ um padrão muito versátil, funcionando bem em vários tipos de água, desde mais clara até ligeiramente turva.',
      featureKeys: [
        "product.feature.bkk",
        "product.feature.glow",
        "product.feature.rainbow",
        "product.feature.laser",
      ],
    },
  ]);

  constructor(public translate: TranslateService, private sanitizer: DomSanitizer) {}

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
      (p) => p.categoryKey === this.selectedCategory()
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
    const lines = text.split("\n").filter(line => line.trim());
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
}
