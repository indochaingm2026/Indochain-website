#!/usr/bin/env python3
"""
SEO + GEO setup for the PT Indochain static site.

Run from the site folder:   python3 seo_setup.py
Safe to re-run: each page's SEO block is replaced, never duplicated.

What it does for every page listed in PAGES:
  - unique <title> and meta description (product keywords built in)
  - canonical URL, Open Graph and Twitter tags
  - JSON-LD structured data (Organization/WebSite on home, Product + BreadcrumbList on products)
It also writes sitemap.xml, robots.txt and llms.txt (plain-text summary for AI assistants).

To add a product: add an entry to PAGES and to PRODUCT_PAGES, then re-run.
"""
import json
import pathlib
import re
import datetime
import html

BASE = "https://indochain.co.id"          # <- change if the live domain differs
SITE = pathlib.Path(__file__).resolve().parent
TODAY = datetime.date.today().isoformat()
ORG = {
    "name": "PT Indochain Global Makmur",
    "alt": "PT Indochain",
    "phone": "+62-21-3028-6868",
    "email": "info@indochain.co.id",
    "street": "Jl. Kebon Jeruk III No. 95A, Tamansari",
    "city": "Jakarta Barat",
    "postal": "11160",
    "instagram": "https://www.instagram.com/indochain.co.id",
    "ncth": "https://www.ncth.com.tw",
}

# filename -> (title, description, og image, kind, parent page for breadcrumbs)
PAGES = {
    "index.html": (
        "PT Indochain | Foundry & Casting Materials Supplier in Indonesia",
        "Indonesia supplier of foundry and casting materials: exothermic powder, bentonite binder, "
        "patching material, sea coal and Superbond+. Sister company of NCTH, Taiwan.",
        "hero-foundry.jpg", "home", None),
    "about.html": (
        "About PT Indochain Global Makmur | Sister Company of NCTH, Taiwan",
        "PT Indochain Global Makmur is an Indonesia-based trading and distribution company and sister "
        "company of New Chien Te Hang Co., Ltd. (NCTH), Taiwan.",
        "about-company.jpg", "page", None),
    "products.html": (
        "Products | Foundry Materials & Agricultural Products | PT Indochain",
        "Foundry and casting materials, refractory products, industrial chemicals and Indonesian "
        "agricultural and food products from PT Indochain Global Makmur.",
        "division-foundry.jpg", "page", None),
    "foundry-materials.html": (
        "Foundry & Casting Materials Indonesia | PT Indochain",
        "Foundry and casting materials supplied in Indonesia: exothermic powder, patching material, "
        "bentonite binder, sea coal, Slag X Conditioner and Superbond+.",
        "foundry-division.jpg", "page", "products.html"),
    "agricultural-products.html": (
        "Agricultural & Food Products from Indonesia | PT Indochain",
        "Vanilla beans, cocoa, spices, konjac, lobster and processed konjac, corn and cassava rice "
        "from Indonesia, supplied by PT Indochain Global Makmur.",
        "division-agriculture.jpg", "page", "products.html"),
    "catalog.html": (
        "Catalog | Foundry & Agricultural Products | PT Indochain",
        "Browse the PT Indochain catalog for foundry materials and agricultural products.",
        "logo-transparent.png", "page", None),
    "catalog-foundry.html": (
        "Foundry Materials Catalog | PT Indochain",
        "Foundry materials catalog from PT Indochain: exothermic powder, bentonite, patching material and more.",
        "logo-transparent.png", "page", "catalog.html"),
    "catalog-agricultural.html": (
        "Agricultural Products Catalog | PT Indochain",
        "Agricultural and food products catalog from PT Indochain Global Makmur, Indonesia.",
        "logo-transparent.png", "page", "catalog.html"),
    "catalog-ebook.html": (
        "Foundry Product E-book | PT Indochain",
        "Flip through the PT Indochain foundry product e-book: product pages, specifications and PDF download.",
        "ebook-cover.jpg", "page", "catalog.html"),
    "news.html": (
        "News & Insights | PT Indochain",
        "News and insights from PT Indochain Global Makmur.",
        "logo-transparent.png", "page", None),
    "contact.html": (
        "Contact Us | PT Indochain Jakarta",
        "Contact PT Indochain Global Makmur in Jakarta by phone, email or WhatsApp.",
        "logo-transparent.png", "page", None),
    "privacy.html": (
        "Privacy Policy | PT Indochain Global Makmur",
        "Privacy policy of PT Indochain Global Makmur.",
        "logo-transparent.png", "page", None),
    "terms.html": (
        "Terms of Use | PT Indochain Global Makmur",
        "Terms of use of the PT Indochain Global Makmur website.",
        "logo-transparent.png", "page", None),
    "sitemap.html": (
        "Sitemap | PT Indochain Global Makmur",
        "Full list of pages on the PT Indochain Global Makmur website.",
        "logo-transparent.png", "page", None),
    # ----- product pages -----
    "exothermic-piping-compound.html": (
        "Exothermic Powder (Exothermic Piping Compound) | NCTH | PT Indochain",
        "Exothermic powder for foundries in Indonesia. Exothermic piping compound that prevents piping "
        "defects in castings after pouring. Supplied by PT Indochain.",
        "pd-exothermic-1.jpg", "product", "foundry-materials.html"),
    "bentobond.html": (
        "Bentobond Bentonite Binder for Green Sand | PT Indochain",
        "Bentobond PLUS+ bentonite binder for green sand molding, supplied in Indonesia by PT Indochain. "
        "Comparable to natural sodium bentonite in tests.",
        "pd-bentobond.jpg", "product", "foundry-materials.html"),
    "patching-material.html": (
        "Patching Material for Ladles, Runners & Furnaces | PT Indochain",
        "Patching material for repairing ladles, runners and furnaces. Alumina/silica grades R90 to R80 "
        "and silica grade R66S. Supplied in Indonesia by PT Indochain.",
        "pd-patching-1.jpg", "product", "foundry-materials.html"),
    "sea-coal.html": (
        "Sea Coal (Coal Dust) for Green Sand | PT Indochain",
        "Sea coal (coal dust) for green sand molding to improve casting surfaces and ease demolding. "
        "Foundry supplier in Indonesia: PT Indochain.",
        "pd-sea-coal.jpg", "product", "foundry-materials.html"),
    "slag-x-conditioner.html": (
        "Slag X Conditioner Melt Additive | PT Indochain",
        "SLAG X Conditioner, a melt additive that alters slag and purifies molten metal for better energy "
        "efficiency in electric induction melting. Supplied in Indonesia by PT Indochain.",
        "pd-slag-x-1.jpg", "product", "foundry-materials.html"),
    "superbond-plus.html": (
        "Superbond+ Green Sand Additive | PT Indochain",
        "Superbond+ green sand additive that strengthens sand, stabilizes the mold surface and lets more "
        "sand be recycled. Supplied in Indonesia by PT Indochain.",
        "pd-superbond.jpg", "product", "foundry-materials.html"),
    "automatic-green-sand-control-system.html": (
        "Automatic Green Sand Control System ETA 3000 | PT Indochain",
        "Automatic green sand control system (ETA 3000) for measuring and controlling compactability, "
        "green compression strength and moisture in foundry sand.",
        "gsc-1.jpg", "product", "products.html"),
    "automatic-molding-machine.html": (
        "Automatic Molding Machine by Belloi & Romagnoli | PT Indochain",
        "Automatic molding machine from Belloi & Romagnoli, Italy, offered through New Chien Te Hang (NCTH) "
        "for the casting industry.",
        "mm-1.jpg", "product", "products.html"),
    "oxygen-rotary-furnace.html": (
        "Oxygen Rotary Furnace for Foundry | SOGEMI | PT Indochain",
        "Oxygen rotary furnace for the foundry industry from SOGEMI ENGINEERING, Italy, offered through "
        "New Chien Te Hang (NCTH). Focus on energy efficiency.",
        "orf-1.jpg", "product", "products.html"),
    "vibrator.html": (
        "Vibrator for Small Furnaces | NCTH Invincible | PT Indochain",
        "NCTH Invincible furnace vibration machine for small furnaces, with adjustable air pressure for a "
        "more stable air volume. Offered by PT Indochain.",
        "vib-1.jpg", "product", "products.html"),
}

PRODUCT_PAGES = [f for f, v in PAGES.items() if v[3] == "product"]
SKIP = {"product.html"}  # generic template page, not in sitemap


def url_for(fname):
    return BASE + "/" if fname == "index.html" else f"{BASE}/{fname}"


def h1_of(text):
    m = re.search(r"<h1[^>]*>(.*?)</h1>", text, re.S)
    return html.unescape(re.sub(r"<[^>]+>", "", m.group(1))).strip() if m else None


def build_block(fname, title, desc, image, kind, parent, h1):
    url = url_for(fname)
    img = f"{BASE}/{image}"
    ld = []
    if kind == "home":
        ld.append({
            "@context": "https://schema.org", "@type": "Organization",
            "name": ORG["name"], "alternateName": ORG["alt"], "url": BASE + "/",
            "logo": f"{BASE}/logo-transparent.png", "telephone": ORG["phone"], "email": ORG["email"],
            "address": {"@type": "PostalAddress", "streetAddress": ORG["street"],
                        "addressLocality": ORG["city"], "postalCode": ORG["postal"], "addressCountry": "ID"},
            "sameAs": [ORG["instagram"], ORG["ncth"]],
            "parentOrganization": {"@type": "Organization", "name": "New Chien Te Hang Co., Ltd.",
                                   "url": ORG["ncth"], "address": {"@type": "PostalAddress", "addressCountry": "TW"}},
            "areaServed": ["ID", "Worldwide"],
            "knowsAbout": ["foundry materials", "casting materials", "exothermic compound", "bentonite binder",
                           "green sand additives", "refractory products", "vanilla", "cocoa", "spices"],
        })
        ld.append({"@context": "https://schema.org", "@type": "WebSite", "name": ORG["alt"], "url": BASE + "/"})
    if kind == "product":
        ld.append({
            "@context": "https://schema.org", "@type": "Product", "name": h1 or title,
            "description": desc, "image": img, "url": url, "category": "Foundry materials",
            "brand": {"@type": "Brand", "name": "NCTH (New Chien Te Hang)"},
            "countryOfOrigin": "TW",
            "audience": {"@type": "BusinessAudience", "industry": "Foundry and casting"},
        })
        crumbs = [("Home", BASE + "/")]
        if parent:
            crumbs.append(("Products", BASE + "/products.html") if parent == "products.html"
                          else ("Foundry Materials", url_for(parent)))
        crumbs.append((h1 or title, url))
        ld.append({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "name": n, "item": u} for i, (n, u) in enumerate(crumbs)]})
    og_type = "product" if kind == "product" else "website"
    tags = [
        f'<link rel="canonical" href="{url}">',
        '<meta name="robots" content="index,follow,max-image-preview:large">',
        f'<meta property="og:type" content="{og_type}">',
        f'<meta property="og:site_name" content="{ORG["alt"]}">',
        f'<meta property="og:title" content="{html.escape(title, quote=True)}">',
        f'<meta property="og:description" content="{html.escape(desc, quote=True)}">',
        f'<meta property="og:url" content="{url}">',
        f'<meta property="og:image" content="{img}">',
        '<meta name="twitter:card" content="summary_large_image">',
        '<meta name="geo.region" content="ID-JK">',
        '<meta name="geo.placename" content="Jakarta">',
    ]
    for obj in ld:
        tags.append('<script type="application/ld+json">' + json.dumps(obj, ensure_ascii=False) + '</script>')
    return "<!-- seo:start -->" + "".join(tags) + "<!-- seo:end -->"


def process(fname, title, desc, image, kind, parent):
    path = SITE / fname
    if not path.exists():
        print(f"  skip (missing): {fname}")
        return
    s = path.read_text(encoding="utf-8")
    h1 = h1_of(s)
    s = re.sub(r"<!-- seo:start -->.*?<!-- seo:end -->", "", s, flags=re.S)
    s = re.sub(r"<title>.*?</title>", f"<title>{html.escape(title)}</title>", s, count=1, flags=re.S)
    desc_tag = f'<meta name="description" content="{html.escape(desc, quote=True)}">'
    if re.search(r'<meta name="description"[^>]*>', s):
        s = re.sub(r'<meta name="description"[^>]*>', desc_tag, s, count=1)
    else:
        s = s.replace("</title>", "</title>" + desc_tag, 1)
    block = build_block(fname, title, desc, image, kind, parent, h1)
    s = s.replace("</head>", block + "</head>", 1)
    path.write_text(s, encoding="utf-8")
    print(f"  ok: {fname}")


def write_sitemap():
    urls = [url_for(f) for f in PAGES if f not in SKIP and (SITE / f).exists()]
    body = "\n".join(f"  <url><loc>{u}</loc><lastmod>{TODAY}</lastmod></url>" for u in urls)
    (SITE / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        f'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{body}\n</urlset>\n', encoding="utf-8")


def write_robots():
    (SITE / "robots.txt").write_text(
        "User-agent: *\nAllow: /\n\n"
        "# AI search and answer engines are welcome too (GEO)\n"
        "User-agent: GPTBot\nAllow: /\n\n"
        "User-agent: ClaudeBot\nAllow: /\n\n"
        "User-agent: PerplexityBot\nAllow: /\n\n"
        "User-agent: Google-Extended\nAllow: /\n\n"
        f"Sitemap: {BASE}/sitemap.xml\n", encoding="utf-8")


def write_llms():
    lines = [
        f"# {ORG['name']} (PT Indochain)",
        "",
        "> Indonesia-based trading and distribution company and sister company of New Chien Te Hang Co., Ltd. (NCTH), Taiwan. "
        "Supplies foundry and casting materials, refractory products, industrial chemicals, and Indonesian agricultural and food products.",
        "",
        "## Foundry & casting products",
    ]
    for f in PRODUCT_PAGES:
        t, d, *_ = PAGES[f]
        lines.append(f"- [{t.split(' | ')[0]}]({url_for(f)}): {d}")
    lines += [
        "",
        "## Agricultural & food products",
        f"- [Agricultural Products]({url_for('agricultural-products.html')}): vanilla beans, cocoa, spices, konjac, lobster, and processed konjac, corn and cassava rice from Indonesia.",
        "",
        "## Company & contact",
        f"- [About]({url_for('about.html')}): company profile and partnership with NCTH.",
        f"- [Contact]({url_for('contact.html')}): Jakarta office, phone {ORG['phone']}, email {ORG['email']}.",
        f"- Address: {ORG['street']}, {ORG['city']} {ORG['postal']}, Indonesia.",
    ]
    (SITE / "llms.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    print("Updating page SEO blocks:")
    for fname, (title, desc, image, kind, parent) in PAGES.items():
        process(fname, title, desc, image, kind, parent)
    write_sitemap()
    write_robots()
    write_llms()
    print("Wrote sitemap.xml, robots.txt, llms.txt")
