// Shared script for every page: letter roll, hero fit, scroll effects, smooth navigation,
// header hiding, mobile menu and custom cursor. Each part only runs when its elements exist.
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let gliding = false; // set during in-page navigation, pauses the footer auto-settle

  // Slot-machine roll: one span per letter, full word kept as aria-label
  document.querySelectorAll(".roll").forEach((link) => {
    // The word can live in a [data-roll] child, so the link keeps its other content (e.g. an arrow)
    const host = link.querySelector("[data-roll]") || link;
    const word = host.textContent.trim();
    link.setAttribute("aria-label", word);
    const box = document.createElement("span");
    box.className = "w";
    box.setAttribute("aria-hidden", "true");
    [...word].forEach((ch, i) => {
      const l = document.createElement("span");
      l.className = "l";
      l.style.setProperty("--i", i);
      if (ch === " ") {
        // Spaces get an explicit width: some browsers collapse a lone non-breaking space in an inline-flex box ("Àpropos")
        l.textContent = "\u00A0";
        l.style.minWidth = "0.26em";
      } else {
        l.textContent = ch;
      }
      box.appendChild(l);
    });
    host.replaceChildren(box);
  });

  // Fit the visible letters of the name exactly between the hero padding
  // (shared by both pages; the projects page has no hero, so these steps are skipped there)
  const hero = document.querySelector(".hero");
  const h1 = document.querySelector("[data-fit]");
  const span = h1 && h1.firstElementChild;
  const ctx = document.createElement("canvas").getContext("2d");
  const fit = () => {
    if (!h1) return;
    const cs = getComputedStyle(hero);
    const target = hero.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const F = parseFloat(getComputedStyle(h1).fontSize);
    const W = span.offsetWidth;
    ctx.font = `500 ${F}px "Inter Tight"`;
    const s = ctx.measureText("S");
    const i = ctx.measureText("i");
    const ls = -0.035 * F;
    const inkLeft = -s.actualBoundingBoxLeft;
    const inkRight = W - (i.width + ls) + i.actualBoundingBoxRight;
    const k = target / (inkRight - inkLeft);
    h1.style.fontSize = `${F * k}px`;
    span.style.marginLeft = `${-inkLeft * k}px`;
  };
  if (h1) {
    fit();
    document.fonts.ready.then(fit);
    let fitFrame;
    addEventListener("resize", () => {
      cancelAnimationFrame(fitFrame);
      fitFrame = requestAnimationFrame(fit);
    });
  }

  // Scroll effects: hero curtain and project text, once per frame
  if (!reduce) {
    const rows = document.querySelectorAll(".row");
    const looseTiles = document.querySelectorAll(".pgrid .tile");
    let ticking = false;
    const progress = (top, height) =>
      Math.min(Math.max((innerHeight * 0.15 - top) / (height * 0.6), 0), 1).toFixed(4);
    const update = () => {
      if (hero) {
        const p = Math.min(Math.max(scrollY / hero.offsetHeight, 0), 1);
        hero.style.transform = `scale(${1 - 0.08 * p})`;
        hero.style.opacity = String(1 - 0.7 * p);
      }

      rows.forEach((row) => {
        const rect = row.getBoundingClientRect();
        row.style.setProperty("--p", progress(rect.top, rect.height));
      });

      // Projects page grid: tiles that sit on the same line share one progress value,
      // whatever the column count (3, 2 or 1)
      looseTiles.forEach((tile) => {
        const rect = tile.getBoundingClientRect();
        tile.style.setProperty("--p", progress(Math.round(rect.top), rect.height));
      });

      // Footer content drifts up into place as main scrolls away
      if (footerInner) {
        const q = Math.min(Math.max((innerHeight - main.getBoundingClientRect().bottom) / innerHeight, 0), 1);
        footerInner.style.transform = `translateY(${-18 * (1 - q)}%)`;
      }
      ticking = false;
    };
    const main = document.querySelector("main");
    const footerInner = document.querySelector(".footer-inner");
    const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    addEventListener("scroll", request, { passive: true });
    addEventListener("resize", request);
    update();

    // Auto-settle: after a downward scroll stops near the end, glide to the very bottom
    let lastY = scrollY, lastDir = 0, settleTimer, settleFrame = null;
    const cancelSettle = () => {
      if (settleFrame !== null) { cancelAnimationFrame(settleFrame); settleFrame = null; }
    };
    const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const settle = () => {
      const from = scrollY;
      const to = document.documentElement.scrollHeight - innerHeight;
      const t0 = performance.now();
      const step = (now) => {
        const t = Math.min((now - t0) / 1100, 1);
        scrollTo({ top: from + (to - from) * easeInOutCubic(t), behavior: "instant" });
        settleFrame = t < 1 ? requestAnimationFrame(step) : null;
      };
      settleFrame = requestAnimationFrame(step);
    };
    if (footerInner) addEventListener("scroll", () => {
      if (scrollY !== lastY) lastDir = scrollY > lastY ? 1 : -1;
      lastY = scrollY;
      clearTimeout(settleTimer);
      if (settleFrame !== null || gliding) return;
      settleTimer = setTimeout(() => {
        if (gliding) return;
        const remaining = document.documentElement.scrollHeight - innerHeight - scrollY;
        if (lastDir === 1 && remaining > 1 && remaining < innerHeight * 0.55) settle();
      }, 160);
    }, { passive: true });
    ["wheel", "touchstart", "keydown"].forEach((type) =>
      addEventListener(type, () => { cancelSettle(); clearTimeout(settleTimer); }, { passive: true }));
  }

  // Smooth in-page navigation: glide to "#" / "#id" targets instead of jumping
  let glideFrame = null;
  const stopGlide = () => {
    if (glideFrame !== null) cancelAnimationFrame(glideFrame);
    glideFrame = null;
    gliding = false;
  };
  const easeInOutQuart = (t) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);
  const targetY = (hash) => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (hash === "#" || hash === "#top") return 0;
    const el = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!el) return null;
    if (el.id === "contact") return max; // the footer is sticky, so its spot is the page bottom
    return Math.min(Math.max(el.getBoundingClientRect().top + scrollY, 0), max);
  };
  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute("href");
    const to = targetY(hash);
    if (to === null) return;
    e.preventDefault();
    stopGlide();
    const target = hash.length > 1 && hash !== "#top" ? document.getElementById(hash.slice(1)) : null;
    const arrive = () => {
      if (target && target.id !== "contact") {
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    };
    if (reduce) { scrollTo({ top: to, behavior: "instant" }); arrive(); return; }
    const from = scrollY;
    const duration = Math.min(2200, 900 + Math.abs(to - from) * 0.12);
    const t0 = performance.now();
    gliding = true;
    const step = (now) => {
      const t = Math.min((now - t0) / duration, 1);
      scrollTo({ top: from + (to - from) * easeInOutQuart(t), behavior: "instant" });
      if (t < 1) glideFrame = requestAnimationFrame(step);
      else { stopGlide(); arrive(); }
    };
    glideFrame = requestAnimationFrame(step);
  });
  ["wheel", "touchstart", "keydown"].forEach((type) => addEventListener(type, stopGlide, { passive: true }));

  // Background videos: no autoplay with reduced motion
  if (reduce) document.querySelectorAll("video[data-bg-video]").forEach((v) => { v.removeAttribute("autoplay"); v.pause(); });

  // Pause marquees marked data-pause-offscreen while they are out of view
  if ("IntersectionObserver" in window) {
    const pauseIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.target.querySelectorAll(".mq-track").forEach((t) => {
        t.style.animationPlayState = e.isIntersecting ? "running" : "paused";
      }));
    });
    document.querySelectorAll("[data-pause-offscreen]").forEach((el) => pauseIO.observe(el));
  }

  // Hide the header once the footer covers more than half the screen
  const hdr = document.querySelector(".hdr");
  const mainEl = document.querySelector("main");
  let hdrTicking = false;
  const hasFooter = !!document.querySelector(".footer-inner");
  const updateHeader = () => {
    hdrTicking = false;
    if (!hdr) return; // pages without a header, like demarrer.html
    const hide = hasFooter && mainEl.getBoundingClientRect().bottom < innerHeight * 0.5;
    hdr.classList.toggle("hide", hide);
    if (hide && hdr.contains(document.activeElement)) document.activeElement.blur();
  };
  addEventListener("scroll", () => {
    if (!hdrTicking) { hdrTicking = true; requestAnimationFrame(updateHeader); }
  }, { passive: true });
  addEventListener("resize", updateHeader);
  updateHeader();

  // Mobile menu (pages without a menu, like demarrer.html, skip this)
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.getElementById("menu-mobile");
  if (toggle && menu) {
    const closeBtn = menu.querySelector("[data-menu-close]");
    const setMenu = (open) => {
      menu.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
      toggle.setAttribute("aria-expanded", String(open));
      if (open) closeBtn.focus();
    };
    toggle.addEventListener("click", () => setMenu(true));
    closeBtn.addEventListener("click", () => { setMenu(false); toggle.focus(); });
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
    addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
    });
  }

  // Custom cursor: a fast black dot (difference blend) and a slow grey disc above it (multiply blend).
  // Over links, buttons and option pills the dot grows into a lens and the disc shrinks into it.
  const dot = document.querySelector(".cursor-dot");
  const disc = document.querySelector(".cursor-disc");
  if (dot && disc && !reduce && matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let mx = 0, my = 0;            // real pointer
    const DOT_REST = 0.43, DOT_HOVER = 1; // 28px element: 12px at rest, 28px over links
    let x = 0, y = 0, s = DOT_REST; // dot
    let rx = 0, ry = 0, rs = 1;    // disc
    let hovering = false, started = false, frame = 0;
    const loop = () => {
      x += (mx - x) * 0.38;
      y += (my - y) * 0.38;
      rx += (mx - rx) * 0.10;
      ry += (my - ry) * 0.10;
      s += ((hovering ? DOT_HOVER : DOT_REST) - s) * 0.2;
      rs += ((hovering ? 0 : 1) - rs) * 0.2;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s})`;
      disc.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${rs})`;
      frame = requestAnimationFrame(loop);
    };
    const show = (on) => { dot.classList.toggle("is-visible", on); disc.classList.toggle("is-visible", on); };
    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      if (!started) {
        started = true;
        x = rx = mx; y = ry = my; // snap to the pointer instead of flying in from the corner
        document.documentElement.classList.add("has-dot");
        frame = requestAnimationFrame(loop);
      }
      show(true);
    };
    const onOver = (e) => { hovering = !!e.target.closest('a, button, .opt, [role="button"]'); };
    const onLeave = () => show(false);
    const onEnter = () => { if (started) show(true); };
    addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    // Clean up when the page is unloaded
    addEventListener("pagehide", () => {
      cancelAnimationFrame(frame);
      removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    }, { once: true });
  } else {
    // Touch devices and reduced motion keep the system cursor
    dot?.remove();
    disc?.remove();
  }
})();
  