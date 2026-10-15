# PT Indochain — Corporate Website

Premium responsive corporate website for PT Indochain Global Makmur.

## Contact
- Address: Jl. Kebon Jeruk III No. 95A, Tamansari, Jakarta Barat 11160, Indonesia
- Phone: +62 21 3028 6868
- Email: info@indochain.co.id
- Instagram: @indochain.co.id
- WhatsApp: +62 812 9801 1998

## Brand
**Tagline:** Quality you can rely on.

**Vision:** To be the partner that industries and buyers worldwide trust for quality supply from Indonesia.

**Mission:** We build long-term partnerships by delivering consistent quality, fair prices, and honest service.

## Core Values
- Reliability — we deliver what we promise.
- Quality — consistent products and standards.
- Integrity — transparent, honest dealings.
- Partnership — we grow when our customers grow.

## Pages
- Home
- About
- Products
- Foundry Materials
- Agricultural Products
- Product Detail
- News
- Contact

This is a static HTML/CSS/JavaScript site suitable for deployment on Vercel.


### Division imagery update
- Foundry Materials: replaced with the supplied powder-mound image (`foundry-division.jpg`).
- Agricultural Products: uses a high-resolution Pexels corn-kernel photograph (5,472 × 3,648 px), free to use under the Pexels license. Source: https://www.pexels.com/photo/close-up-shot-of-a-corn-7877996/

### Update (Oct 2026)
- **New `site.css` and `site.js` replace the old `style.css` / `script.js`** (every page now links to the new files; the old ones can be deleted). They contain the full design: header, 4-slide hero slider, footer, catalog, e-book viewer and product pages.
- Home: 4-slide auto-sliding hero (container ship, foundry, mining, agriculture), catalog call-to-action card, port-cranes photo in the intro section, product photos on the Foundry / Agricultural cards (`division-foundry.jpg`, `division-agriculture.jpg` - replace either file with a higher-resolution photo of the same name).
- Footer rebuilt on every page: address opens Google Maps, phone/email/WhatsApp/Instagram are links, Privacy / Terms / Sitemap pages added.
- Catalog: book on a wooden shelf; e-book page-flip viewer (`flipbook.js`) with page grid, zoom in/out, full screen, share and PDF download.
- Each foundry product has its own page; photos are `pd-*.jpg`. Slag X and Superbond+ pages embed their YouTube videos.
- Update: new pages `automatic-molding-machine.html` and `oxygen-rotary-furnace.html`; Patching Material is one entry with grade cards (R90-R66S); tables fit the phone screen; e-book page list fixed.
- Update: Automatic Green Sand Control System and Vibrator pages added; Oxygen Rotary Furnace text completed.
- Update: new home/about/products/contact wording, redesigned contact cards, Vibrator info, Slag Remover page removed from the e-book and PDF (6 pages), NCTH logo (links to ncth.com.tw) in the footer.

### Language switch (English / Bahasa Indonesia / 繁體中文)
- Every page has an **EN | ID | 中文** switch in the header (desktop and phone). The choice is remembered in the visitor's browser. Links ending in `?lang=id` or `?lang=zh` open the site in Indonesian or Traditional Chinese.
- `i18n.js` runs the switch. `i18n-id.js` (Indonesian) and `i18n-zh.js` (Traditional Chinese) hold the text as pairs: `"English text": "translation"`.
- When you change English wording on a page, add the new sentence to both `i18n-id.js` and `i18n-zh.js`. Anything missing stays in English in that language.
- Kept in English on purpose: brand and product names (Superbond+, Slag X Conditioner, Oxygen Rotary Furnace, NCTH, etc.), addresses, and the e-book PDF and its page images.
- The Indonesian text is applied in the browser. Search engines index the English HTML. Indonesian search traffic would need separate `/id/` pages.
- `seo_setup.py` writes English titles and descriptions. If you change one there, update its entry in `i18n-id.js`.
