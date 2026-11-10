// Next-project picture: a round button follows the pointer while it is over the picture.
(function () {
  var box = document.querySelector('.case-next');
  var btn = box && box.querySelector('.cn-btn');
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

// At the very bottom the next-project picture goes full-bleed. Scrolling up: first gesture zooms it out, the second moves the page.
(function () {
  var box = document.querySelector('.case-next');
  if (!box) return;
  var html = document.documentElement, locked = false, startY = 0;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function atBottom() { return innerHeight + scrollY >= html.scrollHeight - 3; }
  function full() { box.classList.add('is-full'); }
  function out() {
    if (!box.classList.contains('is-full')) return false;
    box.classList.remove('is-full');
    if (!reduce) { locked = true; setTimeout(function () { locked = false; }, 1200); }
    return true;
  }
  addEventListener('scroll', function () { if (atBottom() && !box.classList.contains('is-full') && !locked) full(); }, { passive: true });
  addEventListener('wheel', function (e) {
    if (locked) { e.preventDefault(); return; }
    if (e.deltaY < 0 && out()) e.preventDefault();
    else if (e.deltaY > 0 && atBottom()) full();
  }, { passive: false });
  addEventListener('touchstart', function (e) { startY = e.touches[0].clientY; }, { passive: true });
  addEventListener('touchmove', function (e) {
    if (locked) { e.preventDefault(); return; }
    var dy = e.touches[0].clientY - startY;
    if (dy > 12 && out()) e.preventDefault();
  }, { passive: false });
  addEventListener('keydown', function (e) {
    if (locked && ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', ' ', 'Home', 'End'].indexOf(e.key) >= 0) { e.preventDefault(); return; }
    if (['ArrowUp', 'PageUp', 'Home'].indexOf(e.key) >= 0 && out()) e.preventDefault();
  });
  if (atBottom()) full();
})();
