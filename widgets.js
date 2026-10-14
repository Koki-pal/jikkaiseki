/* 実解析学 学習ノート — interactive figures.
   Each widget: WIDGETS[name](host) builds its own controls + canvas and redraws on theme change. */
(function () {
  "use strict";
  const WIDGETS = {};
  window.WIDGETS = WIDGETS;

  const cssv = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const theme = () => ({
    ink: cssv("--ink"), muted: cssv("--muted"), rule: cssv("--rule"), grid: cssv("--grid"),
    accent: cssv("--accent"), a2: cssv("--plot2"), a3: cssv("--plot3"), warn: cssv("--warn"),
    band: cssv("--band"), sheet: cssv("--sheet"), ok: cssv("--lv1"),
  });
  const redrawers = new Set();
  const rerunAll = () => redrawers.forEach((f) => { try { f(); } catch (e) { console.error(e); } });
  try {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", rerunAll);
    new MutationObserver(rerunAll).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  } catch (e) { /* ignore */ }

  /* ---------- UI helpers ---------- */
  let uid = 0;
  function controls(host) {
    const row = document.createElement("div");
    row.className = "wctl";
    host.appendChild(row);
    return row;
  }
  function slider(row, label, min, max, step, val, oninput, fmt) {
    const id = "w" + (++uid);
    const wrap = document.createElement("label");
    wrap.className = "wslider";
    wrap.setAttribute("for", id);
    const t = document.createElement("span");
    const inp = document.createElement("input");
    inp.type = "range"; inp.id = id; inp.min = min; inp.max = max; inp.step = step; inp.value = val;
    const out = document.createElement("output");
    const show = () => { out.textContent = fmt ? fmt(+inp.value) : (+inp.value).toString(); };
    t.textContent = label;
    wrap.append(t, inp, out);
    row.appendChild(wrap);
    inp.addEventListener("input", () => { show(); oninput(+inp.value); });
    show();
    return inp;
  }
  function select(row, label, opts, onchange) {
    const id = "w" + (++uid);
    const wrap = document.createElement("label");
    wrap.className = "wselect";
    wrap.setAttribute("for", id);
    const t = document.createElement("span"); t.textContent = label;
    const s = document.createElement("select"); s.id = id;
    opts.forEach((o, i) => { const op = document.createElement("option"); op.value = i; op.textContent = o; s.appendChild(op); });
    s.addEventListener("change", () => onchange(+s.value));
    wrap.append(t, s);
    row.appendChild(wrap);
    return s;
  }
  function button(row, label, onclick) {
    const b = document.createElement("button");
    b.type = "button"; b.className = "wbtn"; b.textContent = label;
    b.addEventListener("click", onclick);
    row.appendChild(b);
    return b;
  }
  function readout(host) {
    const d = document.createElement("div");
    d.className = "wread";
    host.appendChild(d);
    return d;
  }

  /* ---------- Plot ---------- */
  class Plot {
    constructor(host, o) {
      this.o = Object.assign({ xmin: -1, xmax: 1, ymin: -1, ymax: 1, aspect: 0.62, equal: false }, o);
      this.c = document.createElement("canvas");
      this.c.className = "wcanvas";
      host.appendChild(this.c);
      this.ctx = this.c.getContext("2d");
      this.draw = () => {};
      const fit = () => {
        const w = Math.max(260, this.c.parentElement.clientWidth);
        let h = Math.round(w * this.o.aspect);
        h = Math.min(h, 460);
        const dpr = window.devicePixelRatio || 1;
        this.c.width = w * dpr; this.c.height = h * dpr;
        this.c.style.height = h + "px";
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this.W = w; this.H = h;
        if (this.o.equal) {
          const cx = (this.o.xmin + this.o.xmax) / 2, sx = (this.o.xmax - this.o.xmin);
          const sy = sx * h / w, cy = (this.o.ymin + this.o.ymax) / 2;
          this.ymin = cy - sy / 2; this.ymax = cy + sy / 2;
        } else { this.ymin = this.o.ymin; this.ymax = this.o.ymax; }
        this.xmin = this.o.xmin; this.xmax = this.o.xmax;
        this.draw();
      };
      this.fit = fit;
      try { new ResizeObserver(() => fit()).observe(host); } catch (e) { window.addEventListener("resize", fit); }
      redrawers.add(() => this.draw());
    }
    setView(xmin, xmax, ymin, ymax) { Object.assign(this.o, { xmin, xmax, ymin, ymax }); this.fit(); }
    X(x) { return (x - this.xmin) / (this.xmax - this.xmin) * this.W; }
    Y(y) { return this.H - (y - this.ymin) / (this.ymax - this.ymin) * this.H; }
    ix(px) { return this.xmin + px / this.W * (this.xmax - this.xmin); }
    iy(py) { return this.ymin + (this.H - py) / this.H * (this.ymax - this.ymin); }
    clear() {
      const T = theme(), g = this.ctx;
      g.fillStyle = T.sheet; g.fillRect(0, 0, this.W, this.H);
    }
    nice(span) {
      const raw = span / 8, p = Math.pow(10, Math.floor(Math.log10(raw)));
      const m = raw / p; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p;
    }
    axes(opts = {}) {
      const T = theme(), g = this.ctx;
      const sx = opts.stepx || this.nice(this.xmax - this.xmin), sy = opts.stepy || this.nice(this.ymax - this.ymin);
      g.lineWidth = 1; g.strokeStyle = T.grid;
      g.beginPath();
      for (let x = Math.ceil(this.xmin / sx) * sx; x <= this.xmax; x += sx) { g.moveTo(this.X(x), 0); g.lineTo(this.X(x), this.H); }
      for (let y = Math.ceil(this.ymin / sy) * sy; y <= this.ymax; y += sy) { g.moveTo(0, this.Y(y)); g.lineTo(this.W, this.Y(y)); }
      g.stroke();
      g.strokeStyle = T.muted; g.beginPath();
      if (this.ymin <= 0 && this.ymax >= 0) { g.moveTo(0, this.Y(0)); g.lineTo(this.W, this.Y(0)); }
      if (this.xmin <= 0 && this.xmax >= 0) { g.moveTo(this.X(0), 0); g.lineTo(this.X(0), this.H); }
      g.stroke();
      g.fillStyle = T.muted; g.font = "11px var(--f-ui), sans-serif";
      const fmt = (v, s) => { const d = Math.max(0, -Math.floor(Math.log10(s) + 1e-9)); return Math.abs(v) < s / 1e6 ? "0" : v.toFixed(d); };
      const y0 = Math.min(Math.max(this.Y(0), 12), this.H - 3);
      const x0 = Math.min(Math.max(this.X(0), 2), this.W - 30);
      g.textAlign = "center";
      for (let x = Math.ceil(this.xmin / sx) * sx; x <= this.xmax; x += sx) if (Math.abs(x) > sx / 2) g.fillText(fmt(x, sx), this.X(x), y0 + (y0 > this.H - 14 ? -4 : 13));
      g.textAlign = "left";
      for (let y = Math.ceil(this.ymin / sy) * sy; y <= this.ymax; y += sy) if (Math.abs(y) > sy / 2) g.fillText(fmt(y, sy), x0 + 4, this.Y(y) - 3);
    }
    fn(f, color, width = 2, a = this.xmin, b = this.xmax, dash) {
      const g = this.ctx; g.strokeStyle = color; g.lineWidth = width; g.setLineDash(dash || []);
      g.beginPath(); let pen = false; const n = Math.max(200, Math.round(this.W));
      for (let i = 0; i <= n; i++) {
        const x = a + (b - a) * i / n, y = f(x);
        if (!isFinite(y) || Math.abs(this.Y(y)) > 1e5) { pen = false; continue; }
        if (!pen) { g.moveTo(this.X(x), this.Y(y)); pen = true; } else g.lineTo(this.X(x), this.Y(y));
      }
      g.stroke(); g.setLineDash([]);
    }
    curve(pts, color, width = 2, close = false) {
      const g = this.ctx; g.strokeStyle = color; g.lineWidth = width; g.beginPath();
      pts.forEach(([x, y], i) => (i ? g.lineTo(this.X(x), this.Y(y)) : g.moveTo(this.X(x), this.Y(y))));
      if (close) g.closePath(); g.stroke();
    }
    line(x1, y1, x2, y2, color, width = 1.5, dash) {
      const g = this.ctx; g.strokeStyle = color; g.lineWidth = width; g.setLineDash(dash || []);
      g.beginPath(); g.moveTo(this.X(x1), this.Y(y1)); g.lineTo(this.X(x2), this.Y(y2)); g.stroke(); g.setLineDash([]);
    }
    rect(x1, y1, x2, y2, fill, stroke) {
      const g = this.ctx, X = this.X(Math.min(x1, x2)), Y = this.Y(Math.max(y1, y2));
      const w = Math.abs(this.X(x2) - this.X(x1)), h = Math.abs(this.Y(y2) - this.Y(y1));
      if (fill) { g.fillStyle = fill; g.fillRect(X, Y, w, h); }
      if (stroke) { g.strokeStyle = stroke; g.lineWidth = 1; g.strokeRect(X, Y, w, h); }
    }
    dot(x, y, color, r = 4) { const g = this.ctx; g.fillStyle = color; g.beginPath(); g.arc(this.X(x), this.Y(y), r, 0, 7); g.fill(); }
    ring(x, y, color, r = 4) { const g = this.ctx; g.strokeStyle = color; g.lineWidth = 1.5; g.beginPath(); g.arc(this.X(x), this.Y(y), r, 0, 7); g.stroke(); }
    circle(cx, cy, r, color, width = 1.5, fill) {
      const g = this.ctx; g.beginPath();
      g.ellipse(this.X(cx), this.Y(cy), Math.abs(this.X(cx + r) - this.X(cx)), Math.abs(this.Y(cy + r) - this.Y(cy)), 0, 0, 7);
      if (fill) { g.fillStyle = fill; g.fill(); }
      g.strokeStyle = color; g.lineWidth = width; g.stroke();
    }
    text(s, x, y, color, align = "left", size = 12) {
      const g = this.ctx; g.fillStyle = color; g.font = size + "px var(--f-ui), sans-serif"; g.textAlign = align;
      g.fillText(s, this.X(x), this.Y(y));
    }
    arrow(x, y, dx, dy, color, width = 1.5, pxlen) {
      const g = this.ctx; let X1 = this.X(x), Y1 = this.Y(y), X2 = this.X(x + dx), Y2 = this.Y(y + dy);
      if (pxlen) { const L = Math.hypot(X2 - X1, Y2 - Y1) || 1; X2 = X1 + (X2 - X1) / L * pxlen; Y2 = Y1 + (Y2 - Y1) / L * pxlen; }
      const a = Math.atan2(Y2 - Y1, X2 - X1), h = Math.min(7, Math.hypot(X2 - X1, Y2 - Y1) * 0.4);
      g.strokeStyle = color; g.fillStyle = color; g.lineWidth = width;
      g.beginPath(); g.moveTo(X1, Y1); g.lineTo(X2, Y2); g.stroke();
      g.beginPath(); g.moveTo(X2, Y2); g.lineTo(X2 - h * Math.cos(a - 0.4), Y2 - h * Math.sin(a - 0.4)); g.lineTo(X2 - h * Math.cos(a + 0.4), Y2 - h * Math.sin(a + 0.4)); g.closePath(); g.fill();
    }
    onPointer(cb) {
      const handler = (e) => {
        const r = this.c.getBoundingClientRect();
        const t = e.touches ? e.touches[0] : e;
        cb(this.ix(t.clientX - r.left), this.iy(t.clientY - r.top), e.type);
      };
      let down = false;
      this.c.addEventListener("pointerdown", (e) => { down = true; this.c.setPointerCapture(e.pointerId); handler(e); });
      this.c.addEventListener("pointermove", (e) => { if (down) handler(e); });
      this.c.addEventListener("pointerup", () => { down = false; });
      this.c.style.touchAction = "none";
    }
  }
  window.Plot = Plot;

  // contour/heat helpers
  function heat(P, f, levels) {
    const T = theme(), g = P.ctx, step = 6;
    const vals = [];
    let lo = Infinity, hi = -Infinity;
    for (let py = 0; py < P.H; py += step) for (let px = 0; px < P.W; px += step) {
      const v = f(P.ix(px + step / 2), P.iy(py + step / 2)); vals.push(v); if (isFinite(v)) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
    }
    // contour lines via marching squares (simple segments)
    const nx = Math.ceil(P.W / step) + 1, ny = Math.ceil(P.H / step) + 1;
    const grid = [];
    for (let j = 0; j < ny; j++) { grid.push([]); for (let i = 0; i < nx; i++) grid[j].push(f(P.ix(i * step), P.iy(j * step))); }
    const lv = levels || (() => { const out = []; const s = P.nice ? P.nice(hi - lo) : (hi - lo) / 10; for (let v = Math.ceil(lo / s) * s; v <= hi; v += s) out.push(v); return out; })();
    lv.forEach((L, k) => {
      g.strokeStyle = Math.abs(L) < 1e-9 ? T.ink : T.muted; g.lineWidth = Math.abs(L) < 1e-9 ? 1.4 : 0.8; g.globalAlpha = Math.abs(L) < 1e-9 ? 0.9 : 0.55;
      g.beginPath();
      for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
        const a = grid[j][i] - L, b = grid[j][i + 1] - L, c = grid[j + 1][i + 1] - L, d = grid[j + 1][i] - L;
        const pts = [];
        const e = (v1, v2, x1, y1, x2, y2) => { if ((v1 < 0) !== (v2 < 0) && isFinite(v1) && isFinite(v2)) { const t = v1 / (v1 - v2); pts.push([x1 + (x2 - x1) * t, y1 + (y2 - y1) * t]); } };
        const X0 = i * step, Y0 = j * step;
        e(a, b, X0, Y0, X0 + step, Y0); e(b, c, X0 + step, Y0, X0 + step, Y0 + step); e(c, d, X0 + step, Y0 + step, X0, Y0 + step); e(d, a, X0, Y0 + step, X0, Y0);
        if (pts.length >= 2) { g.moveTo(pts[0][0], pts[0][1]); g.lineTo(pts[1][0], pts[1][1]); if (pts.length === 4) { g.moveTo(pts[2][0], pts[2][1]); g.lineTo(pts[3][0], pts[3][1]); } }
      }
      g.stroke();
    });
    g.globalAlpha = 1;
  }

  /* ================= 実解析学1 第1章 ================= */
  // 有理数を長さの和 ε 以下の開区間で覆う
  WIDGETS.qcover = function (host) {
    let eps = 0.5, N = 40;
    const row = controls(host);
    slider(row, "ε", 0.05, 1.5, 0.05, eps, (v) => { eps = v; draw(); }, (v) => v.toFixed(2));
    slider(row, "有理数の個数", 5, 300, 1, N, (v) => { N = v; draw(); });
    const P = new Plot(host, { xmin: -0.1, xmax: 1.1, ymin: 0, ymax: 1, aspect: 0.32 });
    const out = readout(host);
    const qs = []; // enumerate rationals in [0,1] by denominator
    for (let q = 1; qs.length < 400; q++) for (let p = 0; p <= q; p++) { const g = (a, b) => (b ? g(b, a % b) : a); if (g(p, q) === 1) qs.push(p / q); }
    function draw() {
      const T = theme(); P.clear();
      P.line(0, 0.15, 1, 0.15, T.ink, 2);
      let tot = 0, cov = [];
      for (let i = 0; i < N; i++) { const r = eps / 2 ** (i + 2); tot += 2 * r; const y = 0.25 + 0.7 * ((i % 25) / 25); P.line(qs[i] - r, y, qs[i] + r, y, T.accent, 3); P.dot(qs[i], 0.15, T.warn, 2.2); cov.push([qs[i] - r, qs[i] + r]); }
      cov.sort((a, b) => a[0] - b[0]); let len = 0, cur = null;
      cov.forEach(([a, b]) => { a = Math.max(a, 0); b = Math.min(b, 1); if (b <= a) return; if (!cur || a > cur[1]) { if (cur) len += cur[1] - cur[0]; cur = [a, b]; } else cur[1] = Math.max(cur[1], b); });
      if (cur) len += cur[1] - cur[0];
      out.innerHTML = `i 番目の有理数 r<sub>i</sub> を長さ ε/2<sup>i</sup> の開区間で覆う．長さの総和は ${tot.toFixed(4)} &lt; ε = ${eps.toFixed(2)}，[0,1] のうち実際に覆われている部分の長さ ≈ ${len.toFixed(4)}．有理数は稠密なのに，いくらでも短い区間列で覆える：m*(ℚ) = 0（定理3-2）．`;
    }
    P.draw = draw; P.fit();
  };

  // カントール集合と悪魔の階段
  WIDGETS.cantor = function (host) {
    let n = 3;
    const row = controls(host);
    slider(row, "段階 n", 0, 9, 1, n, (v) => { n = v; draw(); });
    const P = new Plot(host, { xmin: -0.05, xmax: 1.05, ymin: -0.35, ymax: 1.08, aspect: 0.62 });
    const out = readout(host);
    function intervals(k) { let I = [[0, 1]]; for (let s = 0; s < k; s++) I = I.flatMap(([a, b]) => { const d = (b - a) / 3; return [[a, a + d], [b - d, b]]; }); return I; }
    function devil(x, depth = 30) { let y = 0, w = 0.5; for (let i = 0; i < depth; i++) { x *= 3; const d = Math.floor(Math.min(x, 2.999999)); x -= d; if (d === 1) return y + w; if (d === 2) y += w; w /= 2; } return y; }
    function draw() {
      const T = theme(); P.clear(); P.axes({ stepx: 1 / 3, stepy: 0.25 });
      for (let k = 0; k <= n; k++) intervals(k).forEach(([a, b]) => P.line(a, -0.06 - 0.032 * k, b, -0.06 - 0.032 * k, k === n ? T.accent : T.muted, k === n ? 3 : 2));
      P.fn((x) => devil(x), T.ink, 1.8, 0, 1);
      const rem = 1 - (2 / 3) ** n;
      out.innerHTML = `第 ${n} 段階で残る区間は 2<sup>${n}</sup> 個，長さの和は (2/3)<sup>${n}</sup> = ${((2 / 3) ** n).toFixed(5)}．取り除いた長さの和は ${rem.toFixed(5)} → 1．カントール集合は測度 0 なのに非可算．黒い曲線は f(x) = (0.a₁/2 a₂/2 …)₍₂₎ のグラフ（悪魔の階段）．`;
    }
    P.draw = draw; P.fit();
  };

  /* ================= 実解析学1 第2章 ================= */
  // グラフを横に切る単関数近似
  WIDGETS.lsimple = function (host) {
    const fs = [
      { name: "f(x) = x²（[0,1.5]）", f: (x) => x * x, a: 0, b: 1.5 },
      { name: "f(x) = 1 + sin(6x)·x", f: (x) => 1 + Math.sin(6 * x) * x, a: 0, b: 1.5 },
      { name: "f(x) = 1/√x", f: (x) => 1 / Math.sqrt(x), a: 0.001, b: 1.5 },
    ];
    let k = 0, n = 2;
    const row = controls(host);
    select(row, "関数", fs.map((s) => s.name), (v) => { k = v; draw(); });
    slider(row, "n", 1, 6, 1, n, (v) => { n = v; draw(); });
    const P = new Plot(host, { xmin: -0.05, xmax: 1.55, ymin: -0.2, ymax: 3.2, aspect: 0.6 });
    const out = readout(host);
    function draw() {
      const s = fs[k], T = theme(); P.clear(); P.axes();
      const fn = (x) => { const y = s.f(x); return y >= n ? n : Math.floor(y * 2 ** n) / 2 ** n; };
      for (let j = 1; j < n * 2 ** n && j / 2 ** n < P.ymax; j++) P.line(P.xmin, j / 2 ** n, P.xmax, j / 2 ** n, T.grid, 1);
      const M = 600; let I = 0, If = 0;
      for (let i = 0; i < M; i++) { const x0 = s.a + (s.b - s.a) * i / M, x1 = s.a + (s.b - s.a) * (i + 1) / M, xm = (x0 + x1) / 2; const v = fn(xm); I += v * (x1 - x0); If += s.f(xm) * (x1 - x0); P.rect(x0, 0, x1, v, T.band); }
      P.fn(s.f, T.ink, 2, s.a, s.b);
      P.fn(fn, T.accent, 1.6, s.a, s.b);
      out.innerHTML = `f<sub>${n}</sub> = Σ (k−1)/2<sup>${n}</sup>·χ<sub>A(${n},k)</sub> + ${n}·χ<sub>{f≥${n}}</sub>．値域を幅 1/2<sup>${n}</sup> で横に刻む．∫ f<sub>${n}</sub> dm ≈ ${I.toFixed(4)}，∫ f dm ≈ ${If.toFixed(4)}．n を増やすと f<sub>n</sub> は単調に増えて f に近づく．`;
    }
    P.draw = draw; P.fit();
  };

  // 積分と極限の順序交換
  WIDGETS.conv = function (host) {
    const fs = [
      { name: "f_n = n·χ(0,1/n)（∫ は常に 1）", f: (n, x) => (x > 0 && x < 1 / n ? n : 0), I: () => 1, lim: 0, ymax: 12, note: "各点で 0 に収束するが ∫f_n = 1．優関数 sup f_n ≈ 1/x は可積分でない．" },
      { name: "f_n = xⁿ（有界収束定理）", f: (n, x) => x ** n, I: (n) => 1 / (n + 1), lim: 0, ymax: 1.2, note: "x = 1 で収束しないが測度 0．|f_n| ≤ 1 なので有界収束定理より ∫ → 0．" },
      { name: "f_n = (sin πx)ⁿ（[0,1]）", f: (n, x) => Math.sin(Math.PI * x) ** n, I: null, lim: 0, ymax: 1.2, note: "x = 1/2 以外で 0 に収束．|f_n| ≤ 1 なので ∫ → 0（積分しないで分かる）．" },
      { name: "f_n = x^(1/n)（単調増加）", f: (n, x) => x ** (1 / n), I: (n) => n / (n + 1), lim: 1, ymax: 1.2, note: "f_n ↑ 1 a.e.（x = 0 を除く）．単調収束定理より ∫ → 1．" },
    ];
    let k = 0, n = 5;
    const row = controls(host);
    select(row, "関数列", fs.map((s) => s.name), (v) => { k = v; draw(); });
    slider(row, "n", 1, 40, 1, n, (v) => { n = v; draw(); });
    const P = new Plot(host, { xmin: -0.05, xmax: 1.05, ymin: -0.1, ymax: 1.2, aspect: 0.55 });
    const out = readout(host);
    function draw() {
      const s = fs[k], T = theme(); P.ymax = s.ymax; P.ymin = -s.ymax / 12; P.clear(); P.axes();
      const M = 800; let I = 0;
      for (let i = 0; i < M; i++) { const x = (i + 0.5) / M; const y = s.f(n, x); I += y / M; P.rect(i / M, 0, (i + 1) / M, y, T.band); }
      P.fn((x) => s.f(n, x), T.accent, 2, 0, 1);
      P.line(0, s.lim, 1, s.lim, T.warn, 1.5, [5, 4]);
      out.innerHTML = `∫<sub>[0,1]</sub> f<sub>${n}</sub> dm ≈ <b>${(s.I ? s.I(n) : I).toFixed(4)}</b>，∫ lim f<sub>n</sub> dm = ${s.lim}．${s.note}`;
    }
    P.draw = draw; P.fit();
  };

  /* ================= 実解析学2 第1章 ================= */
  // 開円を 2 進基本正方形で埋め尽くす
  WIDGETS.dyadic = function (host) {
    let n = 3;
    const row = controls(host);
    slider(row, "世代 n", 0, 7, 1, n, (v) => { n = v; draw(); });
    const P = new Plot(host, { xmin: -1.15, xmax: 1.15, ymin: -1.15, ymax: 1.15, aspect: 0.8, equal: true });
    const out = readout(host);
    const inDisk = (a, b, s) => { const xs = [a, a + s], ys = [b, b + s]; for (const x of xs) for (const y of ys) if (x * x + y * y >= 1) return false; return true; };
    function draw() {
      const T = theme(); P.clear(); P.axes({ stepx: 0.5, stepy: 0.5 });
      let area = 0, cnt = 0; const chosen = [];
      for (let g = 0; g <= n; g++) {
        const s = 2 ** -g, K = Math.ceil(1 / s);
        for (let i = -K; i < K; i++) for (let j = -K; j < K; j++) {
          const a = i * s, b = j * s;
          if (!inDisk(a, b, s)) continue;
          if (chosen.some(([A, B, S]) => a >= A && b >= B && a + s <= A + S && b + s <= B + S)) continue;
          chosen.push([a, b, s]); area += s * s; cnt++;
        }
      }
      const cols = [T.accent, T.a2, T.warn, T.ok, T.muted];
      chosen.forEach(([a, b, s]) => { P.rect(a, b, a + s, b + s, T.band, cols[Math.round(-Math.log2(s)) % cols.length]); });
      P.circle(0, 0, 1, T.ink, 1.8);
      out.innerHTML = `第 ${n} 世代までに選ばれた互いに素な 2 進基本正方形は ${cnt} 個，面積の和 = ${area.toFixed(5)}（π = 3.14159…）．世代を増やすと開円 x²+y²&lt;1 を埋め尽くしていく（命題1-1）．`;
    }
    P.draw = draw; P.fit();
  };
})();