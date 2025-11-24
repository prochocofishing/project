import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateService } from "../app/services/translate.service";

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="logo">
              <img src="assets/images/logo.png" alt="home" class="mascot" />
            </div>
            <p class="brand-description">
              {{ translate.t("footer.brand.description") }}
            </p>
            <div class="social-links">
              <a href="https://www.facebook.com/profile.php?id=61577095214540" target="_blank" rel="noopener noreferrer" class="social-link facebook" aria-label="Facebook">
                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="false">
                  <title>Facebook</title>
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.85 7.94 9.8v-6.93H7.9V12h2.04V9.8c0-2.02 1.2-3.14 3.03-3.14.88 0 1.8.16 1.8.16v1.98h-1.01c-.99 0-1.3.62-1.3 1.25V12h2.22l-.36 2.87h-1.86v6.93C18.56 20.85 22 16.84 22 12z" />
                </svg>
              </a>
              <!-- <a href="#" class="social-link" aria-label="Instagram">📷</a> -->
              <a href="https://www.youtube.com/@PROCHOCO-FISHING" target="_blank" rel="noopener noreferrer" class="social-link youtube" aria-label="YouTube">
                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="false">
                  <title>YouTube</title>
                  <path d="M23.5 6.2c-.3-1.1-1.2-2-2.3-2.2C18.4 3.5 12 3.5 12 3.5s-6.4 0-9.2.5C1.7 4.2.8 5.1.5 6.2.1 7.9 0 10 0 10s0 2.1.5 3.8c.3 1.1 1.2 2 2.3 2.2 2.8.5 9.2.5 9.2.5s6.4 0 9.2-.5c1.1-.2 2-.9 2.3-2.2.5-1.7.5-3.8.5-3.8s0-2.1-.5-3.8zM9.8 13.5V6.5l6.2 3.5-6.2 3.5z" />
                </svg>
              </a>
            </div>
          </div>

          <div class="footer-section">
            <h4>{{ translate.t("footer.contact.title") }}</h4>
            <div class="contact-info">
              <div class="contact-item">
                <span class="contact-icon">📧</span>
                <span>{{ translate.t("footer.contact.email") }}</span>
              </div>
              <div class="contact-item">
                <span class="contact-icon">📍</span>
                <span>{{ translate.t("footer.contact.address") }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <div class="footer-bottom-content">
            <p>{{ copyright }}</p>
            <div class="footer-bottom-links">
              <a href="#">{{ translate.t("footer.privacy") }}</a>
              <a href="#">{{ translate.t("footer.terms") }}</a>
              <a href="#">{{ translate.t("footer.cookies") }}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      .mascot {
        height: 64px;
        margin-left: 12px;
        object-fit: contain;
        filter: drop-shadow(0 0 6px rgba(0, 0, 0, 0.4));
        border-radius: 6px;
      }
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
        background: rgba(255, 255, 255, 0.04);
        border-radius: 8px;
        text-decoration: none;
        color: #94a3b8;
        transition: all 0.2s ease;
      }

      .social-link svg {
        width: 20px;
        height: 20px;
        display: block;
        fill: currentColor;
      }

      /* Brand-specific defaults */
      .social-link.facebook {
        color: #1877F2; /* Facebook blue */
        background: rgba(24, 119, 242, 0.08);
      }

      .social-link.youtube {
        color: #FF0000; /* YouTube red */
        background: rgba(255, 0, 0, 0.06);
      }

      /* Hover: brand background with white icon */
      .social-link.facebook:hover {
        background: #1877F2;
        color: #fff;
        transform: translateY(-2px);
      }

      .social-link.youtube:hover {
        background: #FF0000;
        color: #fff;
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
    `,
  ],
})
export class FooterComponent {
  constructor(public translate: TranslateService) {}

  get copyright() {
    const tpl = this.translate.t('footer.copyright');
    const year = String(new Date().getFullYear());
    if (typeof tpl === 'string') {
      return tpl.replace('{year}', year);
    }
    return tpl;
  }
}
