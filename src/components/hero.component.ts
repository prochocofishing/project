import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="home" class="hero">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            Premium Squid Jigs for
            <span class="highlight">Professional Fishermen</span>
          </h1>
          <p class="hero-subtitle">
            PROCHOCO delivers high-quality squid jigs designed for maximum catch rates. 
            Perfect for fishing stores looking to offer their customers the best in squid fishing equipment.
          </p>
          <div class="hero-buttons">
            <button class="btn btn-primary" (click)="scrollToProducts()">
              View Catalog
            </button>
            <button class="btn btn-outline" (click)="scrollToContact()">
              Wholesale Inquiry
            </button>
          </div>
        </div>
        <div class="hero-image">
          <img src="https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop" alt="Premium Squid Jigs" class="main-image">
          <div class="floating-card">
            <div class="stat">
              <div class="stat-number">5+</div>
              <div class="stat-label">Years Experience</div>
            </div>
            <div class="stat">
              <div class="stat-number">50+</div>
              <div class="stat-label">Jig Models</div>
            </div>
          </div>
        </div>
      </div>
      <div class="hero-features">
        <div class="feature">
          <div class="feature-icon">🎣</div>
          <h3>Professional Quality</h3>
          <p>Crafted for serious anglers</p>
        </div>
        <div class="feature">
          <div class="feature-icon">⚡</div>
          <h3>Proven Results</h3>
          <p>High catch rate guarantee</p>
        </div>
        <div class="feature">
          <div class="feature-icon">🏆</div>
          <h3>Wholesale Pricing</h3>
          <p>Competitive rates for retailers</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 8rem 2rem 4rem;
      position: relative;
      overflow: hidden;
    }

    .hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="wave" patternUnits="userSpaceOnUse" width="100" height="100"><path d="M0,50 Q25,30 50,50 T100,50 V100 H0 Z" fill="rgba(59,130,246,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23wave)"/></svg>') repeat;
      opacity: 0.1;
    }

    .hero-content {
      max-width: 1200px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
      position: relative;
      z-index: 1;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: bold;
      line-height: 1.1;
      color: #f1f5f9;
      margin-bottom: 1.5rem;
    }

    .highlight {
      color: #3b82f6;
      background: linear-gradient(45deg, #3b82f6, #06b6d4);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      color: #cbd5e1;
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .hero-buttons {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
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

    .btn-outline {
      background: transparent;
      color: #3b82f6;
      border: 2px solid #3b82f6;
    }

    .btn-outline:hover {
      background: #3b82f6;
      color: white;
      transform: translateY(-2px);
    }

    .hero-image {
      position: relative;
    }

    .main-image {
      width: 100%;
      height: 400px;
      object-fit: cover;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }

    .floating-card {
      position: absolute;
      bottom: -20px;
      right: -20px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      gap: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .stat {
      text-align: center;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      color: #3b82f6;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #cbd5e1;
    }

    .hero-features {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      max-width: 1200px;
      margin-top: 4rem;
      position: relative;
      z-index: 1;
    }

    .feature {
      text-align: center;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: transform 0.3s ease;
    }

    .feature:hover {
      transform: translateY(-5px);
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .feature h3 {
      color: #f1f5f9;
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }

    .feature p {
      color: #cbd5e1;
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .hero {
        padding: 6rem 1rem 2rem;
      }

      .hero-content {
        grid-template-columns: 1fr;
        gap: 2rem;
        text-align: center;
      }

      .hero-title {
        font-size: 2.5rem;
      }

      .hero-buttons {
        justify-content: center;
      }

      .hero-features {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .floating-card {
        position: relative;
        bottom: 0;
        right: 0;
        margin-top: 1rem;
      }
    }
  `]
})
export class HeroComponent {
  scrollToProducts() {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToContact() {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }
}