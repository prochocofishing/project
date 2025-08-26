import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Product {
  id: number;
  name: string;
  category: string;
  size: string;
  weight: string;
  colors: string[];
  price: number;
  image: string;
  description: string;
  features: string[];
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="products" class="products-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Our Product Catalog</h2>
          <p class="section-subtitle">
            Premium squid jigs designed for maximum performance and catch rates
          </p>
        </div>

        <div class="filter-tabs">
          @for (category of categories(); track category) {
            <button 
              class="filter-btn"
              [class.active]="selectedCategory() === category"
              (click)="setCategory(category)">
              {{ category }}
            </button>
          }
        </div>

        <div class="products-grid">
          @for (product of filteredProducts(); track product.id) {
            <div 
              class="product-card"
              (mouseenter)="setHoveredProduct(product.id)"
              (mouseleave)="setHoveredProduct(null)">
              <div class="product-image">
                <img [src]="product.image" [alt]="product.name">
                <div class="product-overlay" [class.visible]="hoveredProduct() === product.id">
                  <button class="overlay-btn">View Details</button>
                </div>
              </div>
              <div class="product-info">
                <div class="product-header">
                  <h3 class="product-name">{{ product.name }}</h3>
                  <span class="product-price">123</span>
                </div>
                <p class="product-description">{{ product.description }}</p>
                <div class="product-specs">
                  <div class="spec">
                    <span class="spec-label">Size:</span>
                    <span class="spec-value">{{ product.size }}</span>
                  </div>
                  <div class="spec">
                    <span class="spec-label">Weight:</span>
                    <span class="spec-value">{{ product.weight }}</span>
                  </div>
                </div>
                <div class="product-colors">
                  <span class="colors-label">Available Colors:</span>
                  <div class="color-dots">
                    @for (color of product.colors; track color) {
                      <span class="color-dot" 
                            [style.background-color]="color"
                            [title]="color">
                      </span>
                    }
                  </div>
                </div>
                <div class="product-features">
                  @for (feature of product.features; track feature) {
                    <div class="feature-tag">
                      {{ feature }}
                    </div>
                  }
                </div>
              </div>
            </div>
          }
        </div>

        <div class="cta-section">
          <h3>Ready to Stock Our Products?</h3>
          <p>Contact us for wholesale pricing and minimum order quantities</p>
          <button class="btn btn-primary" (click)="scrollToContact()">
            Get Wholesale Pricing
          </button>
        </div>
      </div>
    </section>
  `,
  styles: [`
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
      line-height: 1.5;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }

    .product-specs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .spec {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
    }

    .spec-label {
      color: #94a3b8;
    }

    .spec-value {
      color: #f1f5f9;
      font-weight: 500;
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
      background: rgba(59, 130, 246, 0.2);
      color: #3b82f6;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
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
  `]
})
export class ProductsComponent {
  hoveredProduct = signal<number | null>(null);
  selectedCategory = signal('All');

  products = signal<Product[]>([
    {
      id: 1,
      name: 'ProChoco Deep Sea Elite',
      category: 'Deep Sea',
      size: '3.5"',
      weight: '25g',
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
      price: 12.99,
      image: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      description: 'Premium deep-sea squid jig designed for maximum attraction in deep waters.',
      features: ['UV Reactive', 'Glow in Dark', 'Sharp Hooks', 'Weighted']
    },
    {
      id: 2,
      name: 'ProChoco Coastal Master',
      category: 'Coastal',
      size: '3.0"',
      weight: '20g',
      colors: ['#FF9F43', '#10AC84', '#5F27CD', '#FF3838'],
      price: 9.99,
      image: 'https://images.pexels.com/photos/1643113/pexels-photo-1643113.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      description: 'Perfect for coastal squid fishing with excellent visibility and movement.',
      features: ['Bright Colors', 'Flexible Body', 'Corrosion Resistant']
    },
    {
      id: 3,
      name: 'ProChoco Night Hunter',
      category: 'Night Fishing',
      size: '4.0"',
      weight: '30g',
      colors: ['#00D2FF', '#FF006E', '#8338EC', '#FFBE0B'],
      price: 15.99,
      image: 'https://images.pexels.com/photos/1643113/pexels-photo-1643113.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop&_=2',
      description: 'Specially designed for night fishing with enhanced luminescence.',
      features: ['Extended Glow', 'UV Enhanced', 'Premium Hooks', 'High Contrast']
    },
    {
      id: 4,
      name: 'ProChoco Shallow Pro',
      category: 'Shallow Water',
      size: '2.5"',
      weight: '15g',
      colors: ['#26DE81', '#FC5C65', '#45AAF2', '#A55EEA'],
      price: 7.99,
      image: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop&_=2',
      description: 'Lightweight jig perfect for shallow water squid fishing.',
      features: ['Lightweight', 'Natural Action', 'Quick Sink', 'Durable']
    },
    {
      id: 5,
      name: 'ProChoco Tournament Series',
      category: 'Deep Sea',
      size: '3.8"',
      weight: '28g',
      colors: ['#FD79A8', '#00B894', '#0984E3', '#E17055'],
      price: 18.99,
      image: 'https://images.pexels.com/photos/1643113/pexels-photo-1643113.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop&_=3',
      description: 'Professional grade jig used by tournament anglers worldwide.',
      features: ['Tournament Grade', 'Premium Materials', 'Balanced Weight', 'Pro Hooks']
    },
    {
      id: 6,
      name: 'ProChoco Beginner Special',
      category: 'Beginner',
      size: '3.2"',
      weight: '22g',
      colors: ['#FF7675', '#74B9FF', '#00B894', '#FDCB6E'],
      price: 5.99,
      image: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop&_=3',
      description: 'Perfect entry-level jig for new squid fishing enthusiasts.',
      features: ['Easy to Use', 'Affordable', 'Reliable', 'Good Action']
    }
  ]);

  categories = computed(() => {
    const uniqueCategories = [...new Set(this.products().map(p => p.category))];
    return ['All', ...uniqueCategories];
  });

  filteredProducts = computed(() => {
    if (this.selectedCategory() === 'All') {
      return this.products();
    }
    return this.products().filter(p => p.category === this.selectedCategory());
  });

  setCategory(category: string) {
    this.selectedCategory.set(category);
  }

  setHoveredProduct(id: number | null) {
    this.hoveredProduct.set(id);
  }

  scrollToContact() {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }
}