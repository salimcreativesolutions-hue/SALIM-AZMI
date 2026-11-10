// Next-project picture: a round button follows the pointer while it is over the picture.
(function () {
  var box = document.querySelector('.case-next');
  var btn = box && box.querySelector('.cn-btn');
  // Zoom-out on arrival, like the top picture
  if (box && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    box.classList.add('zoom-ready');
    new IntersectionObserver(function (es, io) {
      if (es[0].isIntersecting) { box.classList.add('is-in'); io.disconnect(); }
    }, { threshold: 0.35 }).observe(box);
  }
  if (!box || !btn || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  var tx = 0, ty = 0, x = 0, y = 0, on = false, raf = 0, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function loop() {
    x += (tx - x) * (reduce ? 1 : 0.2);
    y += (ty - y) * (reduce ? 1 : 0.2);
    btn.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
    raf = on ? requestAnimationFrame(loop) : 0;
  }
  function place(e) {
    var r = box.getBoundingClientRect();
    tx = e.clientX - r.left; ty = e.clientY - r.top;
  }
  box.addEventListener('pointerenter', function (e) {
    place(e); x = tx; y = ty; on = true;
    box.classList.add('is-on'); document.documentElement.classList.add('cn-hover');
    if (!raf) raf = requestAnimationFrame(loop);
  });
  box.addEventListener('pointermove', place);
  box.addEventListener('pointerleave', function () {
    on = false; box.classList.remove('is-on'); document.documentElement.classList.remove('cn-hover');
  });
})();
