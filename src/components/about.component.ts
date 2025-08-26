import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="about" class="about-section">
      <div class="container">
        <div class="about-grid">
          <div class="about-content">
            <h2 class="section-title">About PROCHOCO</h2>
            <p class="intro-text">
              Founded by passionate anglers, PROCHOCO has been crafting premium squid jigs 
              for over 5 years. Our commitment to quality and performance has made us a 
              trusted partner for fishing stores worldwide.
            </p>
            
            <div class="story-content">
              <h3>Our Story</h3>
              <p>
                What started as a small passion project among fishing enthusiasts has grown 
                into a leading brand in the squid fishing industry. We understand that every 
                cast matters, which is why we put meticulous attention to detail into every 
                jig we create.
              </p>
              
              <h3>Our Mission</h3>
              <p>
                To provide fishing stores with the highest quality squid jigs that deliver 
                consistent results for their customers. We believe in building lasting 
                partnerships through reliable products and exceptional service.
              </p>
            </div>

            <div class="values-grid">
              <div class="value-item">
                <div class="value-icon">🏆</div>
                <h4>Quality First</h4>
                <p>Every jig undergoes rigorous testing</p>
              </div>
              <div class="value-item">
                <div class="value-icon">🤝</div>
                <h4>Partnership</h4>
                <p>We support our retail partners' success</p>
              </div>
              <div class="value-item">
                <div class="value-icon">🎣</div>
                <h4>Innovation</h4>
                <p>Constantly improving our designs</p>
              </div>
            </div>
          </div>

          <div class="about-stats">
            <div class="stats-card">
              <h3>Why Choose PROCHOCO?</h3>
              
              <div class="stat-item">
                <div class="stat-number">50+</div>
                <div class="stat-label">Unique Jig Models</div>
                <div class="stat-desc">Diverse range for all fishing conditions</div>
              </div>

              <div class="stat-item">
                <div class="stat-number">200+</div>
                <div class="stat-label">Retail Partners</div>
                <div class="stat-desc">Fishing stores worldwide trust our products</div>
              </div>

              <div class="stat-item">
                <div class="stat-number">98%</div>
                <div class="stat-label">Satisfaction Rate</div>
                <div class="stat-desc">Based on retailer feedback surveys</div>
              </div>

              <div class="certifications">
                <h4>Quality Certifications</h4>
                <div class="cert-badges">
                  <div class="badge">ISO 9001</div>
                  <div class="badge">RoHS Compliant</div>
                  <div class="badge">CE Marked</div>
                </div>
              </div>
            </div>

            <div class="team-image">
              <img src="https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=500&h=400&fit=crop" alt="PROCHOCO Team">
              <div class="image-overlay">
                <p>Our dedicated team of fishing experts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about-section {
      padding: 6rem 2rem;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .about-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: start;
    }

    .section-title {
      font-size: 3rem;
      font-weight: bold;
      color: #f1f5f9;
      margin-bottom: 2rem;
      background: linear-gradient(45deg, #3b82f6, #06b6d4);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .intro-text {
      font-size: 1.25rem;
      color: #cbd5e1;
      line-height: 1.7;
      margin-bottom: 2rem;
    }

    .story-content h3 {
      color: #f1f5f9;
      font-size: 1.5rem;
      margin: 2rem 0 1rem 0;
    }

    .story-content p {
      color: #cbd5e1;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .values-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-top: 3rem;
    }

    .value-item {
      text-align: center;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: transform 0.3s ease;
    }

    .value-item:hover {
      transform: translateY(-5px);
    }

    .value-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .value-item h4 {
      color: #f1f5f9;
      font-size: 1.125rem;
      margin-bottom: 0.5rem;
    }

    .value-item p {
      color: #94a3b8;
      font-size: 0.875rem;
    }

    .about-stats {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .stats-card {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 2rem;
      backdrop-filter: blur(10px);
    }

    .stats-card h3 {
      color: #f1f5f9;
      font-size: 1.5rem;
      margin-bottom: 2rem;
      text-align: center;
    }

    .stat-item {
      margin-bottom: 2rem;
      text-align: center;
    }

    .stat-number {
      font-size: 3rem;
      font-weight: bold;
      color: #3b82f6;
      line-height: 1;
    }

    .stat-label {
      color: #f1f5f9;
      font-weight: 600;
      font-size: 1.125rem;
      margin: 0.5rem 0;
    }

    .stat-desc {
      color: #94a3b8;
      font-size: 0.875rem;
    }

    .certifications {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .certifications h4 {
      color: #f1f5f9;
      text-align: center;
      margin-bottom: 1rem;
    }

    .cert-badges {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .badge {
      background: rgba(59, 130, 246, 0.2);
      color: #3b82f6;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .team-image {
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      height: 300px;
    }

    .team-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .team-image:hover img {
      transform: scale(1.05);
    }

    .image-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
      color: white;
      padding: 2rem 1.5rem 1.5rem;
      text-align: center;
    }

    .image-overlay p {
      margin: 0;
      font-size: 1rem;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .about-section {
        padding: 4rem 1rem;
      }

      .about-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .section-title {
        font-size: 2rem;
      }

      .values-grid {
        grid-template-columns: 1fr;
      }

      .team-image {
        height: 250px;
      }
    }
  `]
})
export class AboutComponent {
}