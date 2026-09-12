/* Blue Spark — main.js
   Shared interaction layer: clock, nav, reveals (GSAP ScrollTrigger w/ IO fallback),
   SplitText hero headlines, scroll progress, SVG draw-on-scroll, timeline scrub, pin sections.
   All motion is gated behind prefers-reduced-motion and degrades to fully readable static pages. */
(function () {
  "use strict";
  document.documentElement.classList.add("js");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- UTC status-bar clock ---------- */
  var utcEl = document.querySelector("[data-utc]");
  if (utcEl) {
    var tick = function () {
      var d = new Date();
      var p = function (n) { return String(n).padStart(2, "0"); };
      utcEl.textContent = p(d.getUTCHours()) + ":" + p(d.getUTCMinutes()) + ":" + p(d.getUTCSeconds()) + " UTC";
    };
    tick(); setInterval(tick, 1000);
  }

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("nav-open")) {
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
    document.querySelectorAll(".mobile-menu a").forEach(function (a, i) {
      a.style.setProperty("--i", i);
      a.insertAdjacentHTML("beforeend", '<span class="idx">' + String(i + 1).padStart(2, "0") + "</span>");
    });
  }

  /* ---------- Active nav link ---------- */
  var page = document.body.getAttribute("data-page");
  if (page) {
    document.querySelectorAll(".nav-links a[href]").forEach(function (a) {
      var href = a.getAttribute("href").split("#")[0];
      if (href === page + ".html" || (page === "index" && href === "index.html")) a.classList.add("active");
    });
  }

  /* ---------- Scroll progress ---------- */
  var bar = document.querySelector(".scroll-progress");
  if (bar) {
    var setBar = function () {
      var h = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = "scaleX(" + (h > 0 ? (scrollY / h) : 0) + ")";
    };
    addEventListener("scroll", setBar, { passive: true });
    addEventListener("resize", setBar);
    setBar();
  }

  /* ---------- Motion: GSAP if present, else IntersectionObserver ---------- */
  var hasGsap = typeof window.gsap !== "undefined";
  if (hasGsap && typeof window.ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    if (typeof window.SplitText !== "undefined") gsap.registerPlugin(SplitText);
  }

  if (reduced) {
    /* Static page: everything visible, nothing moves. */
    document.querySelectorAll("[data-reveal]").forEach(function (el) { el.classList.add("is-in"); });
    return;
  }

  /* SplitText headlines — chars rise in. Runs only when fonts are ready to avoid bad metrics. */
  function splitHeadlines() {
    if (!hasGsap || typeof window.SplitText === "undefined") return;
    document.querySelectorAll("[data-split]").forEach(function (el) {
      try {
        var split = new SplitText(el, { type: "words,chars", wordsClass: "split-word", charsClass: "split-char" });
        gsap.set(split.chars, { yPercent: 110, opacity: 0 });
        gsap.to(split.chars, {
          yPercent: 0, opacity: 1, duration: 0.9, ease: "expo.out",
          stagger: 0.02, delay: parseFloat(el.getAttribute("data-split-delay") || 0.1)
        });
      } catch (e) { /* leave headline visible */ }
    });
  }

  if (document.readyState === "complete" || document.fonts === undefined) {
    splitHeadlines();
  } else {
    document.fonts.ready.then(splitHeadlines);
    setTimeout(splitHeadlines, 1500); /* safety net */
  }

  if (hasGsap && typeof window.ScrollTrigger !== "undefined") {
    /* Standard reveals */
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      gsap.fromTo(el,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: "expo.out",
          delay: parseFloat(el.getAttribute("data-delay") || 0),
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onStart: function () { el.classList.add("is-in"); }
        });
    });

    /* Stagger groups: children with [data-reveal] inside [data-stagger] cascade */
    document.querySelectorAll("[data-stagger]").forEach(function (group) {
      var kids = group.querySelectorAll("[data-reveal]");
      if (!kids.length) return;
      gsap.fromTo(kids,
        { opacity: 0, y: 26 },
        {
          opacity: 1, y: 0, duration: 0.85, ease: "expo.out", stagger: 0.09,
          scrollTrigger: { trigger: group, start: "top 82%", once: true },
          onStart: function () { kids.forEach(function (k) { k.classList.add("is-in"); }); }
        });
    });

    /* SVG line drawing on scroll */
    document.querySelectorAll("[data-draw] path, [data-draw] line, [data-draw] circle").forEach(function (p) {
      var len;
      try { len = p.getTotalLength(); } catch (e) { return; }
      if (!len) return;
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(p, {
        strokeDashoffset: 0, duration: 1.6, ease: "power2.out",
        scrollTrigger: { trigger: p.closest("svg"), start: "top 78%", once: true }
      });
    });

    /* Timeline scrub marker: element travels down the spine as you scroll */
    document.querySelectorAll("[data-scrub-y]").forEach(function (el) {
      var wrap = el.closest("[data-scrub-wrap]") || el.parentElement;
      gsap.fromTo(el, { yPercent: 0 }, {
        yPercent: 100, ease: "none",
        scrollTrigger: { trigger: wrap, start: "top 70%", end: "bottom 60%", scrub: 0.6 }
      });
    });

    /* Pinned capability board: section pins while tiles cascade (opt-in) */
    document.querySelectorAll("[data-pin-board]").forEach(function (board) {
      var tiles = board.querySelectorAll("[data-tile]");
      if (!tiles.length) return;
      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: board, start: "top 18%", end: "+=" + (tiles.length * 38) + "%",
          pin: true, scrub: 0.5, anticipatePin: 1
        }
      });
      tl.from(tiles, { opacity: 0, y: 44, scale: 0.97, stagger: 0.14, ease: "expo.out" });
      tl.to({}, { duration: 0.4 }); /* rest beat */
    });

    /* Layer arcs scrub (technology — five-layer memory) */
    document.querySelectorAll("[data-arc-scrub]").forEach(function (svg) {
      var arcs = svg.querySelectorAll("[data-arc]");
      if (!arcs.length) return;
      gsap.fromTo(arcs, { drawSVG: false, opacity: 0.15, strokeDashoffset: function (i, el) { try { return el.getTotalLength(); } catch (e) { return 600; } } }, {
        opacity: 1, strokeDashoffset: 0, ease: "none", stagger: 0.1,
        scrollTrigger: { trigger: svg, start: "top 75%", end: "bottom 45%", scrub: 0.5 }
      });
    });
  } else {
    /* IntersectionObserver fallback */
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll("[data-reveal]").forEach(function (el) { io.observe(el); });
  }

  /* Hero medallion parallax drift (subtle, transform-only) */
  if (hasGsap && !reduced) {
    document.querySelectorAll("[data-medallion-parallax]").forEach(function (el) {
      gsap.to(el, {
        yPercent: -7, ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 }
      });
    });
  }
})();
