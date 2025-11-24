import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { TranslateService } from '../app/services/translate.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- <section id="contact" class="contact-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">{{ translate.t('contact.title') }}</h2>
          <p class="section-subtitle">{{ translate.t('contact.subtitle') }}</p>
        </div>

        <div class="contact-grid">
          <div class="contact-form-container">
            <form class="contact-form" (ngSubmit)="submitForm()" #contactForm="ngForm">
              <h3>{{ translate.t('contact.title') }}</h3>

              <div class="form-group">
                <label for="name">{{ translate.t('contact.name') }}</label>
                <input type="text" id="name" name="name" [(ngModel)]="formData().name" required class="form-input">
              </div>

              <div class="form-group">
                <label for="storeName">{{ translate.t('contact.store') }}</label>
                <input type="text" id="storeName" name="storeName" [(ngModel)]="formData().storeName" required class="form-input">
              </div>

              <div class="form-group">
                <label for="email">{{ translate.t('contact.email') }}</label>
                <input type="email" id="email" name="email" [(ngModel)]="formData().email" required class="form-input">
              </div>

              <div class="form-group">
                <label for="message">{{ translate.t('contact.message') }}</label>
                <textarea id="message" name="message" [(ngModel)]="formData().message" rows="5" class="form-input"></textarea>
              </div>

     
              <input type="text" name="hp" [(ngModel)]="formData().hp" style="display:none" autocomplete="off">

              <input type="hidden" name="ts" [value]="formData().ts">

              <button type="submit" class="submit-btn" [disabled]="isSubmitting()">
                {{ isSubmitting() ? translate.t('contact.sending') : translate.t('contact.send') }}
              </button>

              <div *ngIf="submitMessage()" class="submit-message" [class.success]="submitSuccess()">
                {{ submitMessage() }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section> -->
  `,
  styles: [`
    .contact-section {
      padding: 6rem 2rem;
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .section-header {
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
      line-height: 1.6;
    }

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 4rem;
    }

    .contact-info h3 {
      color: #f1f5f9;
      font-size: 1.5rem;
      margin-bottom: 2rem;
    }

    .contact-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .contact-icon {
      font-size: 1.5rem;
      margin-top: 0.25rem;
    }

    .contact-details h4 {
      color: #f1f5f9;
      font-size: 1.125rem;
      margin-bottom: 0.5rem;
    }

    .contact-details p {
      color: #cbd5e1;
      margin-bottom: 0.25rem;
      font-size: 0.9rem;
    }

    .business-info {
      background: rgba(59, 130, 246, 0.1);
      padding: 2rem;
      border-radius: 12px;
      border: 1px solid rgba(59, 130, 246, 0.2);
    }

    .business-info h4 {
      color: #f1f5f9;
      font-size: 1.125rem;
      margin-bottom: 1rem;
      text-align: center;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .info-label {
      color: #94a3b8;
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
    }

    .info-value {
      color: #3b82f6;
      font-weight: 600;
    }

    .contact-form-container {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 2rem;
      backdrop-filter: blur(10px);
    }

    .contact-form h3 {
      color: #f1f5f9;
      font-size: 1.5rem;
      margin-bottom: 2rem;
      text-align: center;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      color: #cbd5e1;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    .form-input {
      width: 100%;
      padding: 0.75rem 1rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      color: #f1f5f9;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .form-input:focus {
      outline: none;
      border-color: #3b82f6;
      background: rgba(255, 255, 255, 0.15);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-input::placeholder {
      color: #94a3b8;
    }

    select.form-input {
      cursor: pointer;
    }

    textarea.form-input {
      resize: vertical;
      min-height: 100px;
    }

    .checkbox-group {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .checkbox-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #cbd5e1;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 6px;
      transition: background 0.3s ease;
    }

    .checkbox-item:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .checkbox-item input[type="checkbox"] {
      margin: 0;
      accent-color: #3b82f6;
    }

    .submit-btn {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(45deg, #3b82f6, #06b6d4);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
    }

    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .submit-message {
      text-align: center;
      padding: 1rem;
      margin-top: 1rem;
      border-radius: 8px;
      font-weight: 500;
    }

    .submit-message.success {
      background: rgba(34, 197, 94, 0.1);
      color: #22c55e;
      border: 1px solid rgba(34, 197, 94, 0.2);
    }

    .submit-message:not(.success) {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    @media (max-width: 768px) {
      .contact-section {
        padding: 4rem 1rem;
      }

      .section-title {
        font-size: 2rem;
      }

      .contact-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .checkbox-group {
        grid-template-columns: 1fr;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ContactComponent {
  isSubmitting = signal(false);
  submitMessage = signal('');
  submitSuccess = signal(false);

  formData = signal({
    name: '',
    storeName: '',
    email: '',
    message: '',
    hp: '',
    ts: Date.now()
  });

  constructor(public translate: TranslateService) {}

  async submitForm() {
    // Basic anti-spam checks
    if (this.formData().hp) {
      // honeypot filled -> likely spam, silently ignore
      return;
    }

    const age = Date.now() - (this.formData().ts || 0);
    if (age < 1500) {
      this.submitMessage.set(this.translate.t('contact.error'));
      return;
    }

    this.isSubmitting.set(true);
    this.submitMessage.set('');

    const payload = {
      service_id: environment.emailjs.serviceId,
      template_id: environment.emailjs.templateId,
      user_id: environment.emailjs.userId,
      template_params: {
        name: this.formData().name,
        storeName: this.formData().storeName,
        email: this.formData().email,
        message: this.formData().message
      }
    };

    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('send-failed');
      this.submitSuccess.set(true);
      this.submitMessage.set(this.translate.t('contact.thanks'));
      this.formData.set({ name: '', storeName: '', email: '', message: '', hp: '', ts: Date.now() });
    } catch (e) {
      console.error(e);
      this.submitSuccess.set(false);
      this.submitMessage.set(this.translate.t('contact.error'));
    } finally {
      this.isSubmitting.set(false);
      setTimeout(() => this.submitMessage.set(''), 5000);
    }
  }
}