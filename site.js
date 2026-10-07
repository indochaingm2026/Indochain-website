/* PT Indochain Global Makmur — site.js (replaces script.js) */
(function () {
  'use strict';

  /* ---------- header: mobile menu + shadow on scroll ---------- */
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.menu-toggle');
  if (header && toggle) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    header.querySelectorAll('.mobile-panel a').forEach(function (a) {
      a.addEventListener('click', function () { header.classList.remove('menu-open'); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') header.classList.remove('menu-open');
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1000) header.classList.remove('menu-open');
    });
  }
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- hero slider (4 slides, auto + dots + swipe) ---------- */
  var hero = document.querySelector('.hero-slider');
  if (hero) {
    var slides = hero.querySelectorAll('.hero-slide');
    var dots = hero.querySelectorAll('.hero-dot');
    var bar = hero.querySelector('.hero-progress span');
    var DELAY = 6500, idx = 0, timer = null;
    hero.style.setProperty('--slide-ms', DELAY + 'ms');

    function runBar() {
      if (!bar) return;
      bar.classList.remove('run');
      void bar.offsetWidth;
      bar.classList.add('run');
    }
    function show(i) {
      idx = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) { s.classList.toggle('is-active', n === idx); });
      dots.forEach(function (d, n) {
        d.classList.toggle('is-active', n === idx);
        d.setAttribute('aria-selected', n === idx ? 'true' : 'false');
      });
      runBar();
    }
    function start() { stop(); timer = setInterval(function () { show(idx + 1); }, DELAY); runBar(); }
    function stop() { if (timer) clearInterval(timer); timer = null; if (bar) bar.classList.remove('run'); }

    dots.forEach(function (d, n) {
      d.addEventListener('click', function () { show(n); start(); });
    });

    var sx = 0, sy = 0, tracking = false;
    hero.addEventListener('touchstart', function (e) {
      sx = e.touches[0].clientX; sy = e.touches[0].clientY; tracking = true;
    }, { passive: true });
    hero.addEventListener('touchend', function (e) {
      if (!tracking) return;
      tracking = false;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) { show(idx + (dx < 0 ? 1 : -1)); start(); }
    }, { passive: true });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });

    show(0);
    start();
  }

  /* ---------- catalog search + filter ---------- */
  var search = document.getElementById('catalogSearch');
  var cards = document.querySelectorAll('.catalog-card');
  var filterBtns = document.querySelectorAll('.catalog-filter-btn');
  if (cards.length) {
    var group = 'all';
    var apply = function () {
      var q = search ? search.value.trim().toLowerCase() : '';
      cards.forEach(function (c) {
        var okGroup = group === 'all' || c.getAttribute('data-group') === group;
        var okText = !q || c.textContent.toLowerCase().indexOf(q) > -1;
        c.hidden = !(okGroup && okText);
      });
    };
    if (search) search.addEventListener('input', apply);
    filterBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        group = b.getAttribute('data-filter');
        filterBtns.forEach(function (x) { x.classList.toggle('active', x === b); });
        apply();
      });
    });
  }

  /* ---------- contact form: opens the visitor's email app with the message ---------- */
  document.querySelectorAll('form[data-demo]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = Array.prototype.map.call(f.querySelectorAll('input,select,textarea'), function (el) {
        return (el.placeholder || 'Product interest') + ': ' + el.value;
      }).join('\n');
      var subject = 'Inquiry from indochain.co.id';
      location.href = 'mailto:info@indochain.co.id?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(v);
      var m = f.querySelector('.form-message');
      if (m) m.textContent = 'Opening your email app to send the inquiry…';
    });
  });
})();
