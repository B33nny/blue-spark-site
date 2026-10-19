/* Blue Spark News — share + copy helpers (progressive enhancement).
   No framework; safe if JS is blocked (links still work, copy degrades to select). */
(function () {
  "use strict";

  // Native share button: use the Web Share API where available, else fall back
  // to copying the page link.
  document.querySelectorAll("[data-share-native]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      var url = btn.getAttribute("data-url") || location.href;
      var title = btn.getAttribute("data-title") || document.title;
      if (navigator.share) {
        e.preventDefault();
        navigator.share({ title: title, url: url }).catch(function () {});
      } else {
        e.preventDefault();
        copyText(url, btn, "Link copied");
      }
    });
  });

  // Copy-to-clipboard buttons (Social Wire posts + copy-link).
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      // Allow a referenced element's text via data-copy="#id"
      if (text && text.charAt(0) === "#") {
        var el = document.querySelector(text);
        text = el ? el.innerText.trim() : "";
      }
      copyText(text, btn, btn.getAttribute("data-done") || "Copied");
    });
  });

  function copyText(text, btn, doneLabel) {
    var label = btn.querySelector(".lbl") || btn;
    var original = label.textContent;
    function flash() {
      btn.classList.add("done");
      label.textContent = doneLabel;
      setTimeout(function () {
        btn.classList.remove("done");
        label.textContent = original;
      }, 1800);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(flash).catch(fallback);
    } else {
      fallback();
    }
    function fallback() {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        flash();
      } catch (err) {
        /* give up silently; the text is still visible on the page */
      }
    }
  }

  // Section ribbon: highlight the section currently in view.
  var links = Array.prototype.slice.call(document.querySelectorAll(".nw-ribbon a"));
  if (links.length && "IntersectionObserver" in window) {
    var map = {};
    links.forEach(function (a) {
      var id = a.getAttribute("href");
      if (id && id.charAt(0) === "#") map[id.slice(1)] = a;
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) { a.classList.remove("on"); });
          var a = map[en.target.id];
          if (a) a.classList.add("on");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) io.observe(sec);
    });
  }
})();
