/* Scroll reveal: quiet and editorial. Skipped for reduced motion or without IntersectionObserver. */
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var textSel = '.ed-intro h2, .ed-intro-mid > *, .ed-stats li, .ed-acc > li, .pj-cap, .ed-links > li, .ed-h, .ed-rule, .ed-tabs, .ed-rev.on, .pw-grid > *';
  var imgSel = '.pj-img';
  var items = [];
  function add(el, cls) { if (el.classList.contains('rv') || el.classList.contains('rv-img')) return; el.classList.add(cls); items.push(el); }
  /* Images are clipped, so observe their (unclipped) parent and reveal the child. */
  document.querySelectorAll(imgSel).forEach(function (el) { el.classList.add('rv-img'); var host = el.parentElement; host._rv = el; items.push(host); });
  document.querySelectorAll(textSel).forEach(function (el) { if (!el.closest('.rv-img')) add(el, 'rv'); });
  var io = new IntersectionObserver(function (entries) {
    var batch = entries.filter(function (e) { return e.isIntersecting; });
    batch.forEach(function (e, i) {
      var t = e.target._rv || e.target;
      t.style.setProperty('--d', Math.min(i, 4) * 90 + 'ms');
      t.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  items.forEach(function (el) { io.observe(el); });
  /* Safety net: never leave anything hidden */
  setTimeout(function () { document.querySelectorAll('.rv:not(.in),.rv-img:not(.in)').forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top < innerHeight) el.classList.add('in'); }); }, 2500);
})();
