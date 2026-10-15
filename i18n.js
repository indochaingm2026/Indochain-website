/* PT Indochain Global Makmur — i18n.js
 * Language switch: English (default), Bahasa Indonesia, 繁體中文 (Traditional Chinese).
 * Dictionaries: i18n-id.js (window.IC_ID) and i18n-zh.js (window.IC_ZH),
 * each maps English text -> translation.
 * The choice is remembered in this browser (localStorage). A link such as
 * index.html?lang=id or index.html?lang=zh also switches the language.
 */
(function () {
  'use strict';

  var KEY = 'ic-lang';
  var LANGS = ['en', 'id', 'zh'];
  var DICTS = { id: window.IC_ID || {}, zh: window.IC_ZH || {} };
  var HTML_LANG = { en: 'en', id: 'id', zh: 'zh-Hant' };
  var MAP_LANG = { en: 'en', id: 'id', zh: 'zh-TW' };
  var LABELS = [
    { code: 'en', text: 'EN', title: 'English', aria: 'Choose language' },
    { code: 'id', text: 'ID', title: 'Bahasa Indonesia', aria: 'Pilih bahasa' },
    { code: 'zh', text: '中文', title: '繁體中文', aria: '選擇語言' }
  ];

  function readLang() {
    try {
      var q = new URLSearchParams(location.search).get('lang');
      if (LANGS.indexOf(q) !== -1) { localStorage.setItem(KEY, q); return q; }
    } catch (e) { /* private mode or blocked storage: fall through */ }
    try {
      var s = localStorage.getItem(KEY);
      return LANGS.indexOf(s) !== -1 ? s : 'en';
    } catch (e) { return 'en'; }
  }

  function saveLang(l) {
    try { localStorage.setItem(KEY, l); } catch (e) { /* ignore */ }
  }

  var LANG = readLang();
  var DICT = DICTS[LANG] || {};

  /* Helper for scripts that build text at runtime (used by site.js, flipbook.js, product.html). */
  window.icT = function (s) {
    return Object.prototype.hasOwnProperty.call(DICT, s) ? DICT[s] : s;
  };
  window.icLang = LANG;

  var CJK_START = /^[　-鿿＀-￯]/;
  var CJK_END = /[　-鿿＀-￯]$/;

  function norm(s) { return s.replace(/\s+/g, ' ').trim(); }
  function has(k) { return Object.prototype.hasOwnProperty.call(DICT, k); }

  /* ---------- text nodes ---------- */
  function translateTextNode(n) {
    var m = n.nodeValue.match(/^(\s*)([\s\S]*?)(\s*)$/);
    var key = norm(m[2]);
    if (!key || !has(key)) return;
    var out = DICT[key], lead = m[1], trail = m[3];
    if (/^[.,;:!?)]/.test(out)) lead = '';      // no space before punctuation
    if (/\($/.test(out)) trail = '';            // no space after an opening bracket
    if (LANG === 'zh') {                        // Chinese text is not spaced like English
      if (CJK_START.test(out)) lead = '';
      if (CJK_END.test(out)) trail = '';
    }
    n.nodeValue = lead + out + trail;
  }

  function walk(root) {
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode;
        if (!p || /^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/.test(p.nodeName)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var list = [];
    while (w.nextNode()) list.push(w.currentNode);
    list.forEach(translateTextNode);
  }

  /* ---------- attributes: alt, placeholder, aria-label, title ---------- */
  var ATTRS = ['alt', 'placeholder', 'aria-label', 'title'];
  function translateAttrs(el) {
    ATTRS.forEach(function (a) {
      if (!el.hasAttribute(a)) return;
      var k = norm(el.getAttribute(a));
      if (k && has(k)) el.setAttribute(a, DICT[k]);
    });
  }

  /* ---------- page title and search-engine description ---------- */
  function translateHead() {
    var t = norm(document.title);
    if (has(t)) document.title = DICT[t];
    document.querySelectorAll('meta[name="description"],meta[name="twitter:description"],meta[property="og:description"],meta[property="og:title"]')
      .forEach(function (m) {
        var k = norm(m.getAttribute('content') || '');
        if (k && has(k)) m.setAttribute('content', DICT[k]);
      });
  }

  /* ---------- Google Maps embed follows the language ---------- */
  function translateMaps() {
    document.querySelectorAll('iframe[src*="google.com/maps"]').forEach(function (f) {
      var s = f.getAttribute('src');
      if (s.indexOf('hl=') === -1) f.setAttribute('src', s + '&hl=' + MAP_LANG[LANG]);
    });
  }

  /* ---------- switch buttons ---------- */
  function buildSwitch() {
    var wrap = document.createElement('div');
    wrap.className = 'lang-switch';
    wrap.setAttribute('role', 'group');
    var cur = LABELS.filter(function (x) { return x.code === LANG; })[0];
    wrap.setAttribute('aria-label', cur.aria);
    LABELS.forEach(function (lab) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = lab.text;
      b.title = lab.title;
      b.setAttribute('lang', lab.code === 'zh' ? 'zh-Hant' : lab.code);
      b.setAttribute('aria-pressed', LANG === lab.code ? 'true' : 'false');
      b.addEventListener('click', function () {
        if (LANG === lab.code) return;
        saveLang(lab.code);
        try {
          var u = new URL(location.href);
          u.searchParams.delete('lang');
          history.replaceState(null, '', u.pathname + (u.search || '') + u.hash);
        } catch (e) { /* ignore */ }
        location.reload();
      });
      wrap.appendChild(b);
    });
    return wrap;
  }

  function mountSwitch() {
    var inner = document.querySelector('.header-inner');
    if (!inner) return;
    var cta = inner.querySelector('.header-cta');
    var end = document.createElement('div');
    end.className = 'header-end';
    inner.appendChild(end);
    if (cta) end.appendChild(cta);
    end.appendChild(buildSwitch());
  }

  /* ---------- start ---------- */
  function init() {
    mountSwitch();
    if (LANG === 'en') return;
    document.documentElement.setAttribute('lang', HTML_LANG[LANG]);
    walk(document.body);
    document.querySelectorAll('template').forEach(function (t) { walk(t.content); });
    document.querySelectorAll('[alt],[placeholder],[aria-label],[title]').forEach(translateAttrs);
    translateHead();
    translateMaps();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
