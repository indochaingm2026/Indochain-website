/* PT Indochain — page-flip e-book
   Desktop/tablet: two-page spread (cover shown alone, like a real book).
   Phone: single page that turns like a book page.
   Controls: arrows, click left/right side of the book, swipe, keyboard,
   page grid, zoom, full screen. */
(function () {
  'use strict';
  var root = document.getElementById('icFlip');
  if (!root) return;

  var srcs = root.getAttribute('data-pages').split(',').map(function (s) { return s.trim(); });
  var N = srcs.length;
  var RATIO = 839.113 / 584.211;            // page height / width
  var DUR = 850;                            // ms, keep in sync with --dur

  var stage = root.querySelector('.ic-flip-stage');
  var book = root.querySelector('.ic-book');
  var prevBtn = root.querySelector('.ic-flip-prev');
  var nextBtn = root.querySelector('.ic-flip-next');
  var countEl = document.getElementById('icCount');
  var gridEl = document.getElementById('icGrid');
  var gridBtn = document.getElementById('icGridBtn');
  var zoomBtn = document.getElementById('icZoomBtn');
  var fullBtn = document.getElementById('icFullBtn');
  var backTpl = document.getElementById('icBackTpl');

  var mode = '';          // 'spread' | 'single'
  var leaves = [];
  var cur = 0;            // number of leaves already turned
  var maxCur = 0;
  var zoom = 1;
  var busy = false;
  var pw = 320;

  /* ---------- build ---------- */
  function face(i) {
    var f = document.createElement('div');
    f.className = 'ic-face';
    var im = new Image();
    im.src = srcs[i];
    im.alt = 'Foundry Product E-book page ' + (i + 1);
    im.draggable = false;
    f.appendChild(im);
    return f;
  }
  function backCover() {
    var f = document.createElement('div');
    f.className = 'ic-face ic-backcover';
    f.innerHTML = backTpl ? backTpl.innerHTML : '';
    return f;
  }
  function blank() {
    var f = document.createElement('div');
    f.className = 'ic-face blank';
    return f;
  }

  function build(m) {
    mode = m;
    book.innerHTML = '';
    leaves = [];
    var L = (m === 'spread') ? Math.ceil(N / 2) : N;
    for (var i = 0; i < L; i++) {
      var leaf = document.createElement('div');
      leaf.className = 'ic-leaf';
      var front, back;
      if (m === 'spread') {
        front = face(2 * i);
        back = (2 * i + 1 < N) ? face(2 * i + 1) : backCover();
      } else {
        front = face(i);
        back = blank();
      }
      front.classList.add('front');
      back.classList.add('back');
      leaf.appendChild(front);
      leaf.appendChild(back);
      book.appendChild(leaf);
      leaves.push(leaf);
    }
    // spread: the last leaf can be turned (reveals the back cover)
    // single: the last page stays put
    maxCur = (m === 'spread') ? L : N - 1;
  }

  /* ---------- state -> DOM ---------- */
  function setZ() {
    var L = leaves.length;
    for (var i = 0; i < L; i++) {
      leaves[i].style.zIndex = (i < cur) ? (i + 1) : (L - i);
    }
  }
  function shift() {
    var x = 0;
    if (mode === 'spread' && zoom === 1) {
      if (cur === 0) x = -pw / 2;                 // cover alone, centred
      else if (cur === maxCur) x = pw / 2;        // back cover alone, centred
    }
    book.style.transform = 'translateX(' + x + 'px)';
  }
  function label() {
    var t;
    if (mode === 'single') {
      t = (cur + 1) + ' / ' + N;
    } else if (cur === 0) {
      t = '1 / ' + N;
    } else if (cur === maxCur) {
      t = 'End';
    } else {
      var a = 2 * cur, b = 2 * cur + 1;
      t = (b > N) ? (a + ' / ' + N) : (a + '–' + b + ' / ' + N);
    }
    if (countEl) countEl.textContent = t;
    if (prevBtn) prevBtn.disabled = (cur === 0);
    if (nextBtn) nextBtn.disabled = (cur >= maxCur);
  }
  function apply() {
    for (var i = 0; i < leaves.length; i++) {
      leaves[i].classList.toggle('is-flipped', i < cur);
    }
    setZ();
    shift();
    label();
  }
  function applyInstant() {
    root.classList.add('no-anim');
    apply();
    void book.offsetWidth;            // force reflow
    root.classList.remove('no-anim');
  }

  /* ---------- layout ---------- */
  function layout() {
    var avail = stage.clientWidth - (root.classList.contains('is-full') ? 20 : 24);
    var vh = window.innerHeight;
    var m = avail < 720 ? 'single' : 'spread';
    var heightCap = root.classList.contains('is-full') ? (vh - 170) : (vh * 0.8);

    if (m !== mode) {
      // keep the reader on (about) the same page when the layout switches
      var page = 0;
      if (mode === 'spread') page = Math.min(2 * cur, N - 1);
      else if (mode === 'single') page = cur;
      build(m);
      cur = (m === 'spread') ? Math.min(Math.ceil(page / 2), maxCur) : Math.min(page, maxCur);
    }

    var base = (m === 'spread')
      ? Math.min(avail / 2, heightCap / RATIO, 560)
      : Math.min(avail, heightCap / RATIO, 520);
    pw = Math.max(base, 150) * zoom;
    var ph = pw * RATIO;

    root.style.setProperty('--pw', pw + 'px');
    root.style.setProperty('--ph', ph + 'px');
    root.style.setProperty('--bw', (m === 'spread' ? pw * 2 : pw) + 'px');
    root.style.setProperty('--lx', (m === 'spread' ? pw : 0) + 'px');
    applyInstant();
  }

  /* ---------- navigation ---------- */
  function go(d) {
    if (busy) return;
    var next = cur + d;
    if (next < 0 || next > maxCur) return;
    busy = true;
    var leaf = leaves[d > 0 ? cur : cur - 1];
    leaf.style.zIndex = 500;                       // turning page stays on top
    cur = next;
    for (var i = 0; i < leaves.length; i++) {
      if (leaves[i] !== leaf) leaves[i].classList.toggle('is-flipped', i < cur);
    }
    leaf.classList.toggle('is-flipped', d > 0);
    shift();
    label();
    setTimeout(setZ, DUR * 0.5);
    setTimeout(function () { busy = false; }, DUR - 80);
  }
  function goPage(p) {                             // p = 0-based page index
    cur = (mode === 'spread') ? Math.min(Math.ceil(p / 2), maxCur) : Math.min(p, maxCur);
    applyInstant();
  }

  if (prevBtn) prevBtn.addEventListener('click', function (e) { e.stopPropagation(); go(-1); });
  if (nextBtn) nextBtn.addEventListener('click', function (e) { e.stopPropagation(); go(1); });

  /* swipe + click-to-turn */
  var sx = 0, sy = 0, st = 0, down = false;
  stage.addEventListener('pointerdown', function (e) {
    if (e.target.closest('.ic-flip-nav,.ic-flip-grid')) return;
    down = true; sx = e.clientX; sy = e.clientY; st = Date.now();
  });
  stage.addEventListener('pointerup', function (e) {
    if (!down) return;
    down = false;
    if (zoom > 1) return;
    var dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      go(dx < 0 ? 1 : -1);
    } else if (Math.abs(dx) < 8 && Math.abs(dy) < 8 && Date.now() - st < 400) {
      var r = stage.getBoundingClientRect();
      go(e.clientX > r.left + r.width / 2 ? 1 : -1);
    }
  });
  stage.addEventListener('pointercancel', function () { down = false; });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') go(1);
    else if (e.key === 'ArrowLeft') go(-1);
    else if (e.key === 'Escape') {
      if (gridEl && !gridEl.hidden) toggleGrid(false);
      else if (root.classList.contains('is-full')) toggleFull(false);
    }
  });

  /* ---------- page grid ---------- */
  function buildGrid() {
    if (!gridEl) return;
    gridEl.innerHTML = '';
    srcs.forEach(function (s, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Go to page ' + (i + 1));
      b.innerHTML = '<img src="' + s + '" alt="" loading="lazy"><span>' + (i + 1) + '</span>';
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        goPage(i);
        toggleGrid(false);
      });
      gridEl.appendChild(b);
    });
  }
  function toggleGrid(show) {
    if (!gridEl) return;
    gridEl.hidden = (show === undefined) ? !gridEl.hidden : !show;
    if (gridBtn) gridBtn.classList.toggle('is-on', !gridEl.hidden);
  }
  if (gridBtn) gridBtn.addEventListener('click', function () { toggleGrid(); });

  /* ---------- zoom ---------- */
  if (zoomBtn) zoomBtn.addEventListener('click', function () {
    zoom = (zoom === 1) ? 1.8 : 1;
    root.classList.toggle('is-zoom', zoom > 1);
    zoomBtn.classList.toggle('is-on', zoom > 1);
    layout();
    stage.scrollLeft = 0;
  });

  /* ---------- full screen (CSS based, works on iPhone too) ---------- */
  function toggleFull(on) {
    var next = (on === undefined) ? !root.classList.contains('is-full') : on;
    root.classList.toggle('is-full', next);
    document.body.classList.toggle('ic-no-scroll', next);
    if (fullBtn) fullBtn.classList.toggle('is-on', next);
    setTimeout(layout, 30);
  }
  if (fullBtn) fullBtn.addEventListener('click', function () { toggleFull(); });

  /* ---------- go ---------- */
  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(layout, 120); });
  window.addEventListener('orientationchange', function () { setTimeout(layout, 250); });

  buildGrid();
  layout();
})();
