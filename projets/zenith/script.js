// Videos load only when they come near the screen, play while visible, pause when not.
// Phones and tablets get the lighter 1440px version.
(function () {
  var small = window.matchMedia('(max-width: 900px)').matches;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var videos = document.querySelectorAll('.lazy-video');

  function load(v) {
    if (v.dataset.loaded) return;
    v.src = small && v.dataset.srcSmall ? v.dataset.srcSmall : v.dataset.src;
    v.dataset.loaded = '1';
  }

  if (!('IntersectionObserver' in window)) {
    videos.forEach(function (v) { load(v); if (!reduce) v.play().catch(function () {}); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) {
        load(v);
        if (!reduce) v.play().catch(function () {});
      } else if (!v.paused) {
        v.pause();
      }
    });
  }, { rootMargin: '300px 0px' });

  videos.forEach(function (v) { io.observe(v); });
})();
