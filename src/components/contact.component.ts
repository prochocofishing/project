import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { environment } from '../environments/environment';
import { TranslateService } from '../app/services/translate.service';

@Component({
  selector: 'app-contact', standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section id="contact" class="contact-section" aria-labelledby="contact-title">
      <div class="container contact-grid">
        <div class="contact-intro">
          <p class="eyebrow">{{ en ? 'PARTNERSHIPS & RETAILERS' : 'PARCERIAS & REVENDEDORES' }}</p>
          <h2 id="contact-title">{{ en ? 'Bring PROCHOCO to your store.' : 'Leve a PROCHOCO até à sua loja.' }}</h2>
          <p class="contact-lead">{{ translate.t('products.cta.text') }}.</p>
          <a class="contact-email" href="mailto:prochocofishing@gmail.com">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/></svg>
            <span>prochocofishing&#64;gmail.com</span>
          </a>
          <p class="contact-location">{{ translate.t('footer.contact.address') }}</p>
          <div class="contact-note">
            <span class="note-line" aria-hidden="true"></span>
            <p>{{ en ? 'Looking for a jig for your next fishing trip?' : 'Procura um palhaço para a sua próxima saída de pesca?' }}
              <a [routerLink]="translate.homePath()" fragment="retailers">{{ en ? 'Find our retailers' : 'Conheça os nossos revendedores' }} <span aria-hidden="true">↗</span></a>
            </p>
          </div>
        </div>
        <div class="contact-form-container">
          <form class="contact-form" #formElement (ngSubmit)="submitForm(contactForm)" #contactForm="ngForm" [attr.aria-busy]="isSubmitting()" novalidate>
            <h3>{{ en ? 'Talk to us' : 'Fale connosco' }}</h3>
            <p class="form-intro">{{ emailConfigured ? (en ? 'Send your wholesale enquiry using the form below.' : 'Envie o seu pedido de informação através do formulário.') : (en ? 'Fill in your enquiry to open it in your email app.' : 'Preencha o pedido para o abrir na sua aplicação de email.') }}</p>
            <p class="required-note">{{ en ? '* Required fields' : '* Campos obrigatórios' }}</p>
            <div class="form-row">
              <div class="form-group">
                <label for="contact-name">{{ translate.t('contact.name') }} *</label>
                <input type="text" id="contact-name" name="name" [(ngModel)]="formData().name" #nameInput="ngModel" required [pattern]="nonBlank" maxlength="120" autocomplete="name" class="form-input" [attr.aria-invalid]="nameInput.invalid && (nameInput.touched || contactForm.submitted)" aria-describedby="name-error">
                <span id="name-error" class="field-error">@if (nameInput.invalid && (nameInput.touched || contactForm.submitted)) { {{ en ? 'Enter your name.' : 'Indique o seu nome.' }} }</span>
              </div>
              <div class="form-group">
                <label for="contact-store">{{ translate.t('contact.store') }} *</label>
                <input type="text" id="contact-store" name="storeName" [(ngModel)]="formData().storeName" #storeInput="ngModel" required [pattern]="nonBlank" maxlength="160" autocomplete="organization" class="form-input" [attr.aria-invalid]="storeInput.invalid && (storeInput.touched || contactForm.submitted)" aria-describedby="store-error">
                <span id="store-error" class="field-error">@if (storeInput.invalid && (storeInput.touched || contactForm.submitted)) { {{ en ? 'Enter your store name.' : 'Indique o nome da loja.' }} }</span>
              </div>
            </div>
            <div class="form-group">
              <label for="contact-email">{{ translate.t('contact.email') }} *</label>
              <input type="email" id="contact-email" name="email" [(ngModel)]="formData().email" #emailInput="ngModel" required email maxlength="254" autocomplete="email" inputmode="email" class="form-input" [attr.aria-invalid]="emailInput.invalid && (emailInput.touched || contactForm.submitted)" aria-describedby="email-error">
              <span id="email-error" class="field-error">@if (emailInput.invalid && (emailInput.touched || contactForm.submitted)) { {{ en ? 'Enter a valid email address.' : 'Indique um endereço de email válido.' }} }</span>
            </div>
            <div class="form-group">
              <label for="contact-message">{{ translate.t('contact.message') }} <span class="optional">{{ en ? '(optional)' : '(opcional)' }}</span></label>
              <textarea id="contact-message" name="message" [(ngModel)]="formData().message" rows="4" maxlength="5000" class="form-input" [placeholder]="en ? 'Tell us what you are looking for…' : 'Conte-nos o que procura…'"></textarea>
            </div>
            <div class="honeypot" aria-hidden="true"><label for="contact-website">Website</label><input id="contact-website" type="text" name="hp" [(ngModel)]="formData().hp" tabindex="-1" autocomplete="off"></div>
            <p class="privacy-note">{{ en ? 'Your details are used to reply to your enquiry.' : 'Os seus dados são utilizados para responder ao pedido.' }} <a [routerLink]="translate.pagePath('privacy')">{{ translate.t('footer.privacy') }}</a>.</p>
            <button type="submit" class="submit-btn" [disabled]="isSubmitting()">{{ isSubmitting() ? translate.t('contact.sending') : (emailConfigured ? translate.t('contact.send') : (en ? 'Prepare email' : 'Preparar email')) }} <span aria-hidden="true">↗</span></button>
            <div class="submit-message" [class.success]="submitSuccess()" [class.has-message]="submitMessage()" role="status" aria-live="polite" aria-atomic="true">{{ submitMessage() }}</div>
          </form>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .contact-section { padding: clamp(4rem, 8vw, 7rem) 0; background: #eef3f2; color: #112c3c; }
    .contact-grid { display: grid; grid-template-columns: 1fr 1.1fr; align-items: start; gap: clamp(2rem, 6vw, 6rem); }
    .contact-intro { padding-top: 1rem; }
    .eyebrow { color: #156393; font-size: .73rem; font-weight: 750; letter-spacing: .15em; margin-bottom: 1.4rem; }
    h2 { max-width: 10ch; font-size: clamp(2.25rem, 4vw, 3.8rem); letter-spacing: -.05em; line-height: 1.08; margin-bottom: 1.5rem; }
    .contact-lead { max-width: 32rem; color: #536874; font-size: 1.08rem; line-height: 1.75; }
    .contact-email { display: inline-flex; align-items: center; gap: .8rem; min-height: 48px; margin-top: 1rem; color: #112c3c; font-size: clamp(.95rem, 1.5vw, 1.12rem); font-weight: 650; text-decoration: underline; text-underline-offset: 4px; overflow-wrap: anywhere; }
    .contact-email svg { width: 22px; height: 22px; flex: 0 0 auto; }
    .contact-email:hover { color: #156393; }
    .contact-location { color: #536874; margin: .7rem 0 0 2.2rem; font-size: .9rem; }
    .contact-note { display: flex; align-items: start; gap: 1rem; margin-top: 3rem; max-width: 26rem; }
    .note-line { height: 2px; width: 32px; flex: 0 0 32px; background: #156393; margin-top: .7rem; }
    .contact-note p { font-size: .9rem; color: #536874; margin: 0; }
    .contact-note a { display: inline-block; color: #156393; font-weight: 650; text-decoration: underline; text-underline-offset: 3px; padding: .3rem 0; }
    .contact-form-container { min-width: 0; background: #fff; border: 1px solid #d8e3e1; border-radius: 16px; padding: clamp(1.3rem, 3vw, 2.5rem); box-shadow: 0 14px 42px #112c3c05; }
    h3 { font-size: 1.5rem; letter-spacing: -.03em; margin-bottom: .5rem; color: #112c3c; }
    .form-intro { color: #536874; font-size: .9rem; margin-bottom: .5rem; }
    .required-note { font-size: .76rem; color: #536874; margin-bottom: 1.6rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { margin-bottom: .8rem; min-width: 0; }
    .form-group label { display: block; margin-bottom: .4rem; color: #112c3c; font-size: .85rem; font-weight: 650; }
    .optional { color: #536874; font-size: .78rem; font-weight: 400; }
    .form-input { width: 100%; min-height: 48px; padding: .8rem .9rem; border: 1px solid #becdce; border-radius: 6px; background: #fff; color: #112c3c; font: inherit; font-size: 1rem; transition: border-color .18s; }
    .form-input:hover { border-color: #80999c; }
    .form-input:focus { outline: 2px solid #156393; outline-offset: 2px; box-shadow: none; border-color: #156393; }
    .form-input[aria-invalid="true"] { border-color: #ae302b; }
    .form-input::placeholder { color: #657b84; }
    textarea.form-input { resize: vertical; min-height: 116px; }
    .field-error { display: block; min-height: 1.3rem; padding-top: .2rem; color: #ae302b; font-size: .75rem; }
    .honeypot { display: none; }
    .privacy-note { font-size: .76rem; line-height: 1.6; color: #536874; margin-bottom: 1.1rem; }
    .privacy-note a { color: #156393; text-decoration: underline; }
    .submit-btn { display: flex; justify-content: space-between; align-items: center; width: 100%; min-height: 50px; padding: .85rem 1.1rem; border: 1px solid #112c3c; border-radius: 6px; background: #112c3c; color: #fff; font: inherit; font-size: .9rem; font-weight: 650; cursor: pointer; transition: background .18s; }
    .submit-btn:hover:not(:disabled) { background: #19465b; }
    .submit-btn:active:not(:disabled) { background: #071723; }
    .submit-btn:disabled { opacity: .65; cursor: wait; }
    .submit-message { font-size: .85rem; line-height: 1.6; color: #a32925; }
    .submit-message.has-message { border-top: 1px solid #d8e3e1; margin-top: 1rem; padding-top: 1rem; }
    .submit-message.success { color: #146b52; }
    @media (max-width: 800px) { .contact-grid { grid-template-columns: 1fr; gap: 2.2rem; } h2 { max-width: 16ch; } .contact-note { margin-top: 1.4rem; } }
    @media (max-width: 420px) { .form-row { grid-template-columns: 1fr; gap: 0; } }
  `]
})
export class ContactComponent {
  readonly nonBlank = /\S/;
  @ViewChild('formElement') private formElement?: ElementRef<HTMLFormElement>;
  isSubmitting = signal(false);
  submitMessage = signal('');
  submitSuccess = signal(false);
  formData = signal({ name: '', storeName: '', email: '', message: '', hp: '', ts: Date.now() });
  constructor(public translate: TranslateService) {}
  get en() { return this.translate.getLang() === 'en'; }
  get emailConfigured() {
    return Object.values(environment.emailjs).every(value => typeof value === 'string' && value.trim() && !/^(your|placeholder)/i.test(value));
  }
  async submitForm(form: NgForm) {
    if (this.isSubmitting() || this.formData().hp) return;
    this.submitSuccess.set(false);
    if (form.invalid || !this.formData().name.trim() || !this.formData().storeName.trim()) {
      form.control.markAllAsTouched();
      this.submitMessage.set(this.en ? 'Check the required fields before continuing.' : 'Verifique os campos obrigatórios antes de continuar.');
      this.formElement?.nativeElement.querySelector<HTMLElement>('.ng-invalid')?.focus();
      return;
    }
    if (Date.now() - this.formData().ts < 1500) {
      this.submitMessage.set(this.en ? 'Please wait a moment before trying again.' : 'Aguarde um momento antes de tentar novamente.');
      return;
    }
    this.submitMessage.set('');
    if (!this.emailConfigured) { this.sendViaMailto(); return; }
    this.isSubmitting.set(true);
    const { serviceId, templateId, userId } = environment.emailjs;
    const { name, storeName, email, message } = this.formData();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service_id: serviceId, template_id: templateId, user_id: userId, template_params: { name: name.trim(), storeName: storeName.trim(), email: email.trim(), message: message.trim() } }),
        signal: controller.signal
      });
      if (!response.ok) throw new Error('send-failed');
      this.submitSuccess.set(true);
      this.submitMessage.set(this.translate.t('contact.thanks'));
      this.formData.set({ name: '', storeName: '', email: '', message: '', hp: '', ts: Date.now() });
      form.resetForm(this.formData());
    } catch {
      this.submitMessage.set(this.en ? 'The message could not be sent. Please try again or email prochocofishing@gmail.com directly.' : 'Não foi possível enviar a mensagem. Tente novamente ou escreva diretamente para prochocofishing@gmail.com.');
    } finally { clearTimeout(timeout); this.isSubmitting.set(false); }
  }
  private sendViaMailto() {
    const { name, storeName, email, message } = this.formData();
    const subject = encodeURIComponent(`Contacto PROCHOCO - ${storeName.trim() || name.trim()}`);
    const body = encodeURIComponent(`Nome: ${name.trim()}\nLoja: ${storeName.trim()}\nEmail: ${email.trim()}\n\nMensagem:\n${message.trim()}`);
    this.submitSuccess.set(true);
    this.submitMessage.set(this.en ? 'Your enquiry is ready. Send it from your email app. If no app opens, email prochocofishing@gmail.com directly; your details remain here.' : 'O pedido está preparado. Conclua o envio na sua aplicação de email. Se a aplicação não abrir, escreva para prochocofishing@gmail.com; os dados permanecem neste formulário.');
    window.location.href = `mailto:prochocofishing@gmail.com?subject=${subject}&body=${body}`;
  }
}
