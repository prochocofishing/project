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
              <a href="https://www.facebook.com/profile.php?id=61577095214540" target="_blank"  class="social-link" aria-label="Facebook">📘</a>
              <!-- <a href="#" class="social-link" aria-label="Instagram">📷</a> -->
              <a href="https://www.youtube.com/@PROCHOCO-FISHING" target="_blank"  class="social-link" aria-label="YouTube">📺</a>
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
