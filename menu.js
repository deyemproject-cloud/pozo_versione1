(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function stagger(panel) {
    if (reduce) return;
    var items = panel.querySelectorAll('.menu-item');
    items.forEach(function (it, i) {
      it.style.animation = 'none';
      void it.offsetWidth;           // reflow to restart the animation
      it.style.animation = '';
      it.style.setProperty('--d', (Math.min(i, 18) * 0.03) + 's');
    });
  }

  window.switchTab = function (id) {
    document.querySelectorAll('.tab-content').forEach(function (p) {
      var on = p.id === id;
      p.classList.toggle('active', on);
      if (on) stagger(p);
    });
    document.querySelectorAll('.tab-btn').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-tab') === id);
    });
    // keep the tab bar pinned near the top after switching
    var bar = document.getElementById('tabbar');
    if (bar) {
      var y = bar.getBoundingClientRect().top + window.scrollY - 80;
      if (window.scrollY > y) window.scrollTo({ top: y, behavior: 'smooth' });
    }
    // scroll the active button into view within the bar
    var btn = document.querySelector('.tab-btn[data-tab="' + id + '"]');
    if (btn && btn.scrollIntoView) btn.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  };

  document.addEventListener('DOMContentLoaded', function () {
    var active = document.querySelector('.tab-content.active');
    if (active) stagger(active);
  });
})();
