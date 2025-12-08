SEO checklist and actions taken

Files added/updated:
- `src/index.html` — meta description, canonical, hreflang alternates, Organization JSON-LD, Open Graph & Twitter meta already added.
- `src/assets/sitemap.xml` — static sitemap listing main pages.
- `src/assets/robots.txt` — references sitemap and allows crawling.
- `src/components/products.component.ts` — per-product JSON-LD inserted into product cards.
- `src/components/consent-banner.component.ts` — consent flow (keeps analytics blocked until accept).

How to submit sitemap to Google Search Console
1. Log in to Google Search Console and add/verify your property (`https://www.prochoco.com/`).
2. In the left menu, choose "Sitemaps".
3. Enter the path to your sitemap (e.g. `assets/sitemap.xml` or `/sitemap.xml` depending on where you host it).
4. Click "Submit" and check back for index coverage.

Notes & recommendations
- For best crawling, host `sitemap.xml` at the root (https://www.prochoco.com/sitemap.xml). If your deployment serves `src/assets/sitemap.xml` at `/assets/sitemap.xml`, submit that URL instead.
- Consider using server-side rendering (Angular Universal) if you need richer indexing for SPA content.
- Use Google Search Console to monitor coverage and remove errors.

Detailed next steps and commands

- Submit sitemap to Google Search Console:
	1. Go to https://search.google.com/search-console
	2. Select your property and open "Sitemaps"
	3. Submit `https://www.prochoco.com/sitemap.xml` (or `/assets/sitemap.xml` if hosted there)

- Validate structured data (Rich Results Test):
	- Use https://search.google.com/test/rich-results
	- Paste a public URL (e.g., `https://www.prochoco.com/`) or a HTML snapshot containing your JSON-LD and run the test.

- Run Lighthouse locally (Chrome) or from command line:
	- In Chrome: DevTools -> Lighthouse -> Generate report (Mobile + Desktop)
	- CLI (if you have Node + Lighthouse installed):
		```powershell
		npm install -g lighthouse
		lighthouse https://localhost:4200 --output html --output-path ./lighthouse-report.html
		```

- Prerender / SSR (overview & quick commands)
	- Option A (Angular Universal):
		```powershell
		ng add @nguniversal/express-engine
		npm run build:ssr
		npm run serve:ssr
		```
		This creates server-side rendering with an Express server. Deployment requires a Node server (VPS, Heroku, or similar).

	- Option B (static prerender for standalone routes):
		```powershell
		ng run project:prerender
		```
		(Exact command depends on Angular project config & builders; may require adding a prerender target.)

- Expose product feed to LLMs and crawlers:
	- I added `/assets/products.json` which includes full product descriptions in PT/EN. Make sure this file is publicly accessible after deployment.
	- You can link to it from `robots.txt` as a comment, or include it in your sitemap (not standard but can be useful to humans/consumers).

- Final checklist before submit
	- Verify `/sitemap.xml` is reachable at site root.
	- Validate one or two product pages (or the homepage with product JSON-LD) in the Rich Results Test.
	- Run Lighthouse and fix major issues (LCP, CLS, accessibility).
	- Submit the sitemap in Search Console and monitor Index Coverage.
 
Prerendering with Playwright (static snapshots)
- This repo now includes a small prerender utility using Playwright to capture HTML snapshots of important routes.

Steps to generate static snapshots:
1. Install dependencies:
```powershell
npm install
npm run prerender:install-browsers
```
2. Serve your app locally (dev server or built `dist`):
```powershell
npm run start
# or, after build:
npx http-server ./dist/prochoco -p 8080
```
3. Run the prerender script (change `BASE_URL` if serving on a different port):
```powershell
BASE_URL=http://localhost:4200 npm run prerender
# or if using the static build server:
BASE_URL=http://localhost:8080 npm run prerender
```
4. Generated HTML snapshots will be in `./prerendered/`.

Notes:
- The snapshots are useful for SEO testing and for uploading static HTML to a CDN or server for crawlers.
- If you prefer Angular Universal (SSR) instead, follow the Angular Universal guide; prerender snapshots are a lighter alternative that doesn't require a Node server in production.

Next steps I can do for you
- Add server-side rendered product pages or pre-render the product list for better indexing.
- Generate a full sitemap including product entries (requires per-product URLs).
- Add schema for product offers/pricing if you add price fields.
