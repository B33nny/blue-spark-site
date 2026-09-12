/* Blue Spark — cosmos.js
   Fullscreen WebGL nebula + starfield in the Deep Blue palette.
   Falls back to a 2D canvas starfield when WebGL is unavailable.
   Honors prefers-reduced-motion by rendering a single static frame. */
(function () {
  "use strict";
  var canvas = document.getElementById("cosmos");
  if (!canvas) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  var mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  var scroll = 0;

  var VERT = [
    "attribute vec2 aPos;",
    "void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }"
  ].join("\n");

  /* Fragment: layered twinkling stars + drifting nebula (value-noise fbm), Deep Blue field */
  var FRAG = [
    "precision highp float;",
    "uniform vec2 uRes;",
    "uniform float uTime;",
    "uniform vec2 uMouse;",
    "uniform float uScroll;",

    "float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }",
    "float noise(vec2 p){",
    "  vec2 i = floor(p), f = fract(p);",
    "  vec2 u = f*f*(3.0-2.0*f);",
    "  float a = hash(i), b = hash(i+vec2(1.0,0.0)), c = hash(i+vec2(0.0,1.0)), d = hash(i+vec2(1.0,1.0));",
    "  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);",
    "}",
    "float fbm(vec2 p){",
    "  float v = 0.0, a = 0.5;",
    "  for(int i=0;i<4;i++){ v += a*noise(p); p = p*2.03 + vec2(17.7, 9.2); a *= 0.5; }",
    "  return v;",
    "}",

    "float starLayer(vec2 uv, float density, float speed, float t){",
    "  vec2 g = floor(uv*density);",
    "  vec2 f = fract(uv*density);",
    "  float h = hash(g);",
    "  if(h < 0.92) return 0.0;",
    "  vec2 c = vec2(hash(g+0.13), hash(g+0.71));",
    "  float d = length(f - c);",
    "  float tw = 0.55 + 0.45*sin(t*speed + h*97.0);",
    "  float bright = smoothstep(0.10, 0.0, d) * tw * (0.35 + 0.65*hash(g+2.7));",
    "  return bright;",
    "}",

    "void main(){",
    "  vec2 uv = (gl_FragCoord.xy - 0.5*uRes) / uRes.y;",
    "  vec2 par = (uMouse - 0.5) * 0.06;",
    "  uv += par;",
    "  uv.y += uScroll * 0.12;",
    "  float t = uTime;",

    /* nebula — two drifting fbm fields mapped into Deep Blue hues */
    "  vec2 q = uv*1.4 + vec2(t*0.008, -t*0.005);",
    "  float n1 = fbm(q + fbm(q*1.7 + t*0.01)*0.55);",
    "  float n2 = fbm(q*1.9 - vec2(t*0.006, t*0.009) + 4.7);",
    "  vec3 deep1 = vec3(0.023, 0.031, 0.059);",   /* #06080F */
    "  vec3 deep2 = vec3(0.059, 0.122, 0.361);",  /* #0F1F5C */
    "  vec3 deep3 = vec3(0.118, 0.227, 0.541);",  /* #1E3A8A */
    "  vec3 deep4 = vec3(0.180, 0.302, 0.722);",  /* #2E4DB8 */
    "  vec3 col = deep1;",
    "  col = mix(col, deep2, smoothstep(0.35, 0.85, n1)*0.85);",
    "  col = mix(col, deep3, smoothstep(0.55, 0.95, n2)*0.35);",
    "  col = mix(col, deep4, smoothstep(0.72, 1.0, n1*n2*2.1)*0.22);",

    /* stars — three parallax layers */
    "  float s = 0.0;",
    "  s += starLayer(uv + vec2(t*0.004, 0.0), 14.0, 0.6, t);",
    "  s += starLayer(uv*1.6 + vec2(t*0.007, t*0.002), 22.0, 0.9, t)*0.8;",
    "  s += starLayer(uv*2.4 - vec2(t*0.011, 0.0), 34.0, 1.4, t)*0.55;",
    "  col += vec3(0.94, 0.97, 1.0) * s * 0.85;",
    "  col += vec3(0.58, 0.77, 0.99) * starLayer(uv*1.2 + 31.7, 10.0, 0.5, t) * 0.5;", /* cool blue stars */

    /* central warm spark — a quiet point of light, upper third */
    "  vec2 sp = vec2(0.0, 0.32) - uv + par*0.5;",
    "  float d = length(sp);",
    "  float pulse = 0.82 + 0.18*sin(t*1.96);",  /* 3.2s brand pulse */
    "  col += vec3(1.0, 0.973, 0.906) * (smoothstep(0.045, 0.0, d) * 0.9 * pulse);",
    "  col += vec3(1.0, 0.973, 0.906) * (smoothstep(0.16, 0.0, d) * 0.12 * pulse);",

    /* vignette */
    "  float vig = smoothstep(1.25, 0.35, length(uv*vec2(0.85, 1.0)));",
    "  col *= mix(0.55, 1.0, vig);",

    "  gl_FragColor = vec4(col, 1.0);",
    "}"
  ].join("\n");

  function glInit() {
    var gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" })
          || canvas.getContext("experimental-webgl");
    if (!gl) return null;
    function sh(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null; }
      return s;
    }
    var vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var uRes = gl.getUniformLocation(prog, "uRes");
    var uTime = gl.getUniformLocation(prog, "uTime");
    var uMouse = gl.getUniformLocation(prog, "uMouse");
    var uScroll = gl.getUniformLocation(prog, "uScroll");
    return {
      draw: function (t) {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, t);
        gl.uniform2f(uMouse, mouse.x, mouse.y);
        gl.uniform1f(uScroll, scroll);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      },
      resize: function () {
        canvas.width = Math.floor(innerWidth * dpr);
        canvas.height = Math.floor(innerHeight * dpr);
      }
    };
  }

  /* 2D fallback: static-ish drifting starfield */
  function fallback2D() {
    document.body.classList.add("no-webgl");
    var c2 = document.createElement("canvas");
    c2.id = "cosmos2d";
    c2.style.cssText = "position:fixed;inset:0;width:100vw;height:100vh;z-index:-2;background:#06080F;";
    document.body.prepend(c2);
    var ctx = c2.getContext("2d");
    var stars = [];
    function seed() {
      stars = [];
      var n = Math.floor((innerWidth * innerHeight) / 9000);
      for (var i = 0; i < n; i++) {
        stars.push({
          x: Math.random() * innerWidth, y: Math.random() * innerHeight,
          r: Math.random() * 1.3 + 0.2, a: Math.random() * 0.5 + 0.15,
          p: Math.random() * Math.PI * 2, s: Math.random() * 0.9 + 0.25
        });
      }
    }
    function size() { c2.width = innerWidth; c2.height = innerHeight; seed(); }
    function frame(t) {
      ctx.fillStyle = "#06080F"; ctx.fillRect(0, 0, c2.width, c2.height);
      var g = ctx.createRadialGradient(c2.width * 0.5, -c2.height * 0.1, 0, c2.width * 0.5, -c2.height * 0.1, c2.height);
      g.addColorStop(0, "rgba(46,77,184,0.22)"); g.addColorStop(1, "rgba(6,8,15,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, c2.width, c2.height);
      for (var i = 0; i < stars.length; i++) {
        var st = stars[i];
        var tw = reduced ? st.a : st.a * (0.6 + 0.4 * Math.sin(t * 0.001 * st.s + st.p));
        ctx.globalAlpha = tw;
        ctx.fillStyle = "#E7EEF9";
        ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    size();
    addEventListener("resize", size);
    if (reduced) { frame(0); }
    else {
      var loop = function (t) { frame(t); requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
    }
  }

  var glApi = null;
  try { glApi = glInit(); } catch (e) { glApi = null; }
  if (!glApi) { fallback2D(); return; }

  addEventListener("resize", function () { glApi.resize(); if (reduced) glApi.draw(12.5); });
  addEventListener("mousemove", function (e) {
    mouse.tx = e.clientX / innerWidth; mouse.ty = 1 - e.clientY / innerHeight;
  }, { passive: true });
  addEventListener("scroll", function () {
    scroll = (window.scrollY || 0) / Math.max(innerHeight, 1);
  }, { passive: true });

  glApi.resize();
  if (reduced) { glApi.draw(12.5); return; }

  var start = performance.now();
  var running = true;
  document.addEventListener("visibilitychange", function () { running = !document.hidden; });
  (function loop(now) {
    if (running) {
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      glApi.draw((now - start) * 0.001);
    }
    requestAnimationFrame(loop);
  })(start);
})();
