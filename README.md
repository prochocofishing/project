PROCHOCO — Minimal site adjustments

What I changed
- Added a tiny i18n system (static modules) in `src/app/i18n` and a `TranslateService` at `src/app/services/translate.service.ts`.
- Simplified `About`, `Products` (now only 2 products) and `Contact` components.
- Contact form now only asks: name, store name, email, message. It includes a honeypot and a timestamp anti-spam check.
- Contact form submits to EmailJS via the public REST API. Add your EmailJS credentials in `src/environments/environment.ts` / `environment.prod.ts`.
- Header now shows language buttons (PT / EN) and references `assets/images/mascot.png` if present.

Setup: add mascot and EmailJS credentials
1. Put your mascot image in the project at `src/images/mascot.png` (or `src/assets/images/mascot.png` if you prefer). The header references `assets/images/mascot.png` after build — ensure `angular.json` copies `src/images` to `assets/images` (the repo already includes an images asset mapping).

2. Configure EmailJS
- Sign in to https://www.emailjs.com/ and create a service and template.
- Copy your `serviceId`, `templateId` and `userId`.
- Edit `src/environments/environment.ts` and `src/environments/environment.prod.ts` and set the values for `emailjs.serviceId`, `emailjs.templateId`, `emailjs.userId`.

Local dev
- Run `npm install` (if needed)
- Run `npm start` or `ng serve` to start the dev server.

Notes
- I used a minimal synchronous translation approach (static objects) for speed. If you want a full-featured i18n solution later, I recommend `@ngx-translate/core` or Angular's i18n features.
- The EmailJS call uses the public REST endpoint — be sure to keep keys safe and follow EmailJS guidance.

If you want, I can now:
- Move the `i18n` files into `src/assets/i18n` and load them dynamically, or
- Add a small language indicator to remember the selected language in `localStorage`, or
- Add a preview modal for the mascot and optimize it for mobile.
