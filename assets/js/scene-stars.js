/* Blue Spark — scene-stars.js
   About-page hero: a drifting field of 240 stylized 8-point compass stars (canvas 2D).
   The tier-1 medallion PNG stays the brand centerpiece (HTML overlay); this field is atmosphere.
   Static single frame under prefers-reduced-motion. */
(function () {
  "use strict";
  var canvas = document.getElementById("starfield-scene");
  if (!canvas) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var COLORS = ["#1E3A8A", "#2E4DB8", "#4068D1", "#5C6473", "#8A93A4", "#93C5FD"];
  var COUNT = 240;
  var stars = [];

  function size() {
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function seed() {
    stars = [];
    var w = canvas.clientWidth, h = canvas.clientHeight;
    for (var i = 0; i < COUNT; i++) {
      var depth = Math.random();                    /* 0 near — 1 far */
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: (2.2 + Math.random() * 7) * (1 - depth * 0.7),
        rot: Math.random() * Math.PI,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        depth: depth,
        vx: (Math.random() - 0.5) * 0.06 * (1 - depth),
        vy: (-0.04 - Math.random() * 0.08) * (1 - depth),
        vr: (Math.random() - 0.5) * 0.0016,
        tw: Math.random() * Math.PI * 2,
        tws: 0.4 + Math.random() * 0.9,
        glow: Math.random() < 0.12
      });
    }
  }

  /* 8-point compass star: 4-point star with deeply inset waists, rotated 45° */
  function starPath(cx, cy, r, rot) {
    var inner = r * 0.34;
    ctx.beginPath();
    for (var i = 0; i < 8; i++) {
      var angle = rot + (i * Math.PI) / 4;
      var rad = (i % 2 === 0) ? r : inner;
      var x = cx + Math.cos(angle - Math.PI / 2) * rad;
      var y = cy + Math.sin(angle - Math.PI / 2) * rad;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  function frame(t) {
    var w = canvas.clientWidth, h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);

    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      if (!reduced) {
        s.x += s.vx; s.y += s.vy; s.rot += s.vr; s.tw += 0.016 * s.tws;
        if (s.y < -12) { s.y = h + 12; s.x = Math.random() * w; }
        if (s.x < -12) s.x = w + 12;
        if (s.x > w + 12) s.x = -12;
      }
      var alpha = 0.35 + 0.65 * (1 - s.depth);
      var twinkle = reduced ? 1 : 0.72 + 0.28 * Math.sin(s.tw);

      ctx.save();
      ctx.globalAlpha = alpha * twinkle;
      if (s.glow) { ctx.shadowColor = "rgba(64, 104, 209, 0.85)"; ctx.shadowBlur = 14; }
      ctx.fillStyle = s.color;
      starPath(s.x, s.y, s.r, s.rot);
      ctx.fill();
      /* silver rim on the brightest few */
      if (s.r > 5.2) {
        ctx.globalAlpha = alpha * 0.5 * twinkle;
        ctx.strokeStyle = "rgba(240, 243, 248, 0.75)";
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  size();
  addEventListener("resize", size);

  if (reduced) { frame(0); return; }
  var loop = function (t) { frame(t); requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
})();
