/* Blue Spark — main.js
   The interaction layer for the shipped shell: two disclosure menus, the
   mobile menu, the current-destination marker, and one page-load moment
   (the Home H1).

   There is no scroll reveal, no parallax, no marquee and no clock. Motion
   answers a person's action or happens once on load, and every path is
   skipped entirely under prefers-reduced-motion, leaving all content in its
   final state. */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Save-Data ---------- */
  /* `prefers-reduced-data` is a Media Queries Level 5 draft with no shipping
     implementation, so the canvas needs a signal that exists. The Network
     Information API's saveData flag (Chrome, Edge and Firefox behind a flag)
     and a 2g effective type are mirrored onto <html>, where styles.css reads
     them. main.js is parsed before cosmos.js on every canvas page, so the
     class is set before the canvas module runs. */
  var connection = navigator.connection || {};
  if (connection.saveData || /(^|-)2g$/.test(connection.effectiveType || "")) {
    document.documentElement.classList.add("save-data");
  }

  /* ---------- Current destination ---------- */
  /* body[data-page] carries the clean route, e.g. "/product". The matching
     link, and the menu that contains it, are marked for the reader. */
  var page = document.body.getAttribute("data-page");
  if (page) {
    var links = document.querySelectorAll(".nav a[href], .mobile-menu a[href]");
    Array.prototype.forEach.call(links, function (a) {
      var target = (a.getAttribute("href") || "").split("#")[0];
      if (target === page) {
        a.setAttribute("aria-current", "page");
        var group = a.closest("details.menu");
        if (group) group.setAttribute("data-current", "true");
      }
    });
  }

  /* ---------- Disclosure menus ---------- */
  var menus = Array.prototype.slice.call(document.querySelectorAll("details.menu"));

  function closeMenu(menu, returnFocus) {
    if (!menu.open) return;
    menu.open = false;
    if (returnFocus) {
      var summary = menu.querySelector("summary");
      if (summary) summary.focus();
    }
  }

  menus.forEach(function (menu) {
    /* Only one menu is open at a time. */
    menu.addEventListener("toggle", function () {
      if (!menu.open) return;
      menus.forEach(function (other) {
        if (other !== menu) other.open = false;
      });
    });

    /* Escape closes and returns focus to the summary that opened it. */
    menu.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu(menu, true);
    });

    /* Leaving the group closes it. relatedTarget is null when focus moves
       to a non-focusable area, which is also a departure. */
    menu.addEventListener("focusout", function (e) {
      if (!menu.open) return;
      if (!e.relatedTarget || !menu.contains(e.relatedTarget)) menu.open = false;
    });
  });

  document.addEventListener("click", function (e) {
    menus.forEach(function (menu) {
      if (menu.open && !menu.contains(e.target)) menu.open = false;
    });
  });

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var mobileMenu = document.querySelector(".mobile-menu");

  if (toggle && mobileMenu) {
    var setMobileMenu = function (open) {
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        var first = mobileMenu.querySelector("a[href], button");
        if (first) first.focus();
      } else {
        toggle.focus();
      }
    };

    toggle.addEventListener("click", function () {
      setMobileMenu(!document.body.classList.contains("nav-open"));
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("nav-open")) {
        setMobileMenu(false);
      }
    });
  }

  /* ---------- The one page-load moment: the Home H1 ---------- */
  /* A single headline, once, on load. No other element on the site animates
     without a person acting on it first. */
  if (reduced) return;

  if (typeof window.gsap !== "undefined") {
    var plugins = [];
    if (typeof window.ScrollTrigger !== "undefined") plugins.push(window.ScrollTrigger);
    if (typeof window.SplitText !== "undefined") plugins.push(window.SplitText);
    if (plugins.length) gsap.registerPlugin.apply(gsap, plugins);
  }

  var headlineDone = false;

  function revealHeadline() {
    if (headlineDone) return;
    headlineDone = true;
    if (typeof window.gsap === "undefined" || typeof window.SplitText === "undefined") return;
    Array.prototype.forEach.call(document.querySelectorAll("[data-split]"), function (el) {
      try {
        var split = new SplitText(el, { type: "words,chars", wordsClass: "split-word", charsClass: "split-char" });
        gsap.fromTo(split.chars,
          { yPercent: 100, opacity: 0 },
          {
            yPercent: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.015,
            delay: parseFloat(el.getAttribute("data-split-delay") || 0.08),
            onComplete: function () { split.revert(); }
          });
      } catch (e) {
        /* Leave the headline exactly as authored. */
      }
    });
  }

  if (document.readyState === "complete" || !document.fonts) {
    revealHeadline();
  } else {
    document.fonts.ready.then(revealHeadline);
    setTimeout(revealHeadline, 1500); /* safety net if the font never settles */
  }
})();
