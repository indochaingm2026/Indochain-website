/* Thumbnail switcher for the foundry product galleries */
(function () {
  document.querySelectorAll('.ic-gallery').forEach(function (g) {
    var main = g.querySelector('.ic-main img');
    g.querySelectorAll('.ic-thumbs button').forEach(function (b) {
      b.addEventListener('click', function () {
        main.src = b.getAttribute('data-src');
        g.querySelectorAll('.ic-thumbs button').forEach(function (x) { x.classList.remove('is-on'); });
        b.classList.add('is-on');
      });
    });
  });
})();
