import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="logo">
              <img src="https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=60&h=40&fit=crop" alt="PROCHOCO Logo" class="logo-img">
              <span class="brand-name">PROCHOCO</span>
            </div>
            <p class="brand-description">
              Premium squid jigs designed for professional fishermen and trusted by fishing stores worldwide.
            </p>
            <div class="social-links">
              <a href="#" class="social-link" aria-label="Facebook">📘</a>
              <a href="#" class="social-link" aria-label="Instagram">📷</a>
              <a href="#" class="social-link" aria-label="YouTube">📺</a>
              <a href="#" class="social-link" aria-label="LinkedIn">💼</a>
            </div>
          </div>

          <div class="footer-section">
            <h4>Products</h4>
            <ul class="footer-links">
              <li><a href="#products">Deep Sea Jigs</a></li>
              <li><a href="#products">Coastal Jigs</a></li>
              <li><a href="#products">Night Fishing</a></li>
              <li><a href="#products">Beginner Series</a></li>
              <li><a href="#products">Tournament Grade</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4>Company</h4>
            <ul class="footer-links">
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#">Wholesale</a></li>
              <li><a href="#">Quality Promise</a></li>
              <li><a href="#">Shipping Info</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4>Support</h4>
            <ul class="footer-links">
              <li><a href="#">Product Guide</a></li>
              <li><a href="#">Fishing Tips</a></li>
              <li><a href="#">Care Instructions</a></li>
              <li><a href="#">Warranty</a></li>
              <li><a href="#">Returns</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4>Contact Info</h4>
            <div class="contact-info">
              <div class="contact-item">
                <span class="contact-icon">📧</span>
                <span>wholesale&#64;prochoco.com</span>
              </div>
              <div class="contact-item">
                <span class="contact-icon">📱</span>
                <span>+1 (555) 123-4567</span>
              </div>
              <div class="contact-item">
                <span class="contact-icon">📍</span>
                <span>Fishing Harbor, FL 33101</span>
              </div>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <div class="footer-bottom-content">
            <p>&copy; 2025 PROCHOCO. All rights reserved.</p>
            <div class="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #0f172a;
      border-top: 1px solid rgba(59, 130, 246, 0.2);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
      gap: 3rem;
      padding: 4rem 0 3rem 0;
    }

    .footer-brand {
      max-width: 300px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .logo-img {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      object-fit: cover;
    }

    .brand-name {
      font-size: 1.25rem;
      font-weight: bold;
      color: #3b82f6;
    }

    .brand-description {
      color: #94a3b8;
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .social-links {
      display: flex;
      gap: 1rem;
    }

    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      text-decoration: none;
      font-size: 1.25rem;
      transition: all 0.3s ease;
    }

    .social-link:hover {
      background: #3b82f6;
      transform: translateY(-2px);
    }

    .footer-section h4 {
      color: #f1f5f9;
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }

    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-links li {
      margin-bottom: 0.75rem;
    }

    .footer-links a {
      color: #94a3b8;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .footer-links a:hover {
      color: #3b82f6;
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #94a3b8;
      font-size: 0.875rem;
    }

    .contact-icon {
      font-size: 1rem;
    }

    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding: 2rem 0;
    }

    .footer-bottom-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .footer-bottom-content p {
      color: #94a3b8;
      margin: 0;
    }

    .footer-bottom-links {
      display: flex;
      gap: 2rem;
    }

    .footer-bottom-links a {
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.875rem;
      transition: color 0.3s ease;
    }

    .footer-bottom-links a:hover {
      color: #3b82f6;
    }

    @media (max-width: 768px) {
      .footer-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
        padding: 3rem 0 2rem 0;
      }

      .footer-brand {
        max-width: none;
      }

      .footer-bottom-content {
        flex-direction: column;
        text-align: center;
      }

      .footer-bottom-links {
        justify-content: center;
      }
    }

    @media (max-width: 1024px) and (min-width: 769px) {
      .footer-grid {
        grid-template-columns: 2fr 1fr 1fr;
        gap: 2rem;
      }

      .footer-section:last-child {
        grid-column: 1 / -1;
        margin-top: 1rem;
      }
    }
  `]
})
export class FooterComponent {
}