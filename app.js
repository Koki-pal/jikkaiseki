/* 実解析学 学習ノート — application shell */
(function () {
  "use strict";
  // merge exercise packs (content/uNx.js): {unit, section, items} appends to a section; {unit, newSection:{id,no,title}, items} adds one
  (window.EXTRA || []).forEach((x) => {
    const u = (window.UNITS || []).find((v) => v.id === x.unit); if (!u) return;
    if (x.newSection) { u.sections.push(Object.assign({}, x.newSection, { items: x.items || [] })); return; }
    const s = u.sections.find((v) => v.id === x.section); if (s) s.items.push(...(x.items || []));
  });
  // PATCH packs (content/uN?.js): {id, set:{...}} merges fields into an item; {after|before:id, items:[...]} inserts items;
  // {unit, set:{...}} merges fields into a unit (lead, blurb, map ...). Applied after EXTRA so packs can target exercises too.
  const findItem = (id) => { for (const u of window.UNITS || []) for (const s of u.sections) { const i = s.items.findIndex((it) => it.id === id); if (i >= 0) return { u, s, i }; } return null; };
  (window.PATCH || []).forEach((p) => {
    if (p.unit && p.set) { const u = (window.UNITS || []).find((v) => v.id === p.unit); if (u) Object.assign(u, p.set); return; }
    if (p.id && p.set) { const f = findItem(p.id); if (f) Object.assign(f.s.items[f.i], p.set); else console.warn("PATCH: no item", p.id); return; }
    const ref = p.after || p.before; if (!ref || !p.items) return;
    const f = findItem(ref); if (!f) { console.warn("PATCH: no anchor", ref); return; }
    f.s.items.splice(p.after ? f.i + 1 : f.i, 0, ...p.items);
  });
  // books: the manifest groups units into books (so a new textbook/field can be added without touching this file)
  const BOOKS = (window.MANIFEST && window.MANIFEST.books) || [{ id: "main", title: "実解析学", units: (window.UNITS || []).map((u) => ({ id: u.id })) }];
  const UNITMETA = {};
  BOOKS.forEach((b, bi) => (b.units || []).forEach((m, k) => (UNITMETA[m.id] = Object.assign({ book: b, bookIndex: bi, order: k }, m))));
  (window.UNITS || []).forEach((u) => { const m = UNITMETA[u.id] || { book: BOOKS[0], bookIndex: 0, order: u.no }; u.book = m.book; u.chapter = m.chapter || u.no; u._ord = m.bookIndex * 1000 + (m.order != null ? m.order : u.no); });
  const UNITS = (window.UNITS || []).slice().sort((a, b) => a._ord - b._ord);
  const BOOK0 = BOOKS[0];
  // unit label: "実解析学1 第2章" (chapters restart in each book)
  const UN = (u) => ((u.book && (u.book.label || u.book.title)) || "") + " 第" + u.chapter + "章";
  // safety net: a bare "<" inside $...$ would be parsed as an HTML tag and break the formula
  const MATHSEG = /\$\$[\s\S]+?\$\$|\$[^$]+?\$/g;
  const fixMath0 = (s) => (typeof s === "string" ? s.replace(MATHSEG, (m) => m.replace(/<(?![=])/g, "\\lt ")) : s);
  // apply fn only to plain text: not inside $...$ and not inside HTML tags
  const SPLIT = /(\$\$[\s\S]+?\$\$|\$[^$]+?\$|<[^>]+>)/g;
  const onText = (s, fn) => s.split(SPLIT).map((t, i) => (i % 2 ? t : fn(t))).join("");
  // 、。 -> ，． and no spaces between Japanese text and Arabic numerals ("第 5 章" -> "第5章"), so digits read as plain half-width figures
  const JP = "\\u3040-\\u30ff\\u3400-\\u9fff\\uff01-\\uff60\\u3000-\\u303f";
  const SP1 = new RegExp("([" + JP + "])[ \\u00a0]+(?=[0-9])", "g"), SP2 = new RegExp("([0-9])[ \\u00a0]+(?=[" + JP + "])", "g");
  const punct = (t) => t.replace(/\u3001/g, "，").replace(/\u3002/g, "．").replace(SP1, "$1").replace(SP2, "$1");
  /* ---------- reference index: textbook numbers -> item ids (per book) ---------- */
  // 定理/命題/定義... share one counter per chapter in the textbook, so "X.Y" alone identifies the item.
  const NUMIX = new Map(); // key `${bookId}|${kind}|${num}` -> {id, unitId}
  const putNum = (b, kind, num, it, u) => { const k = `${b}|${kind}|${num}`; if (!NUMIX.has(k)) NUMIX.set(k, { id: it.id, uid: u.id }); };
  const expandList = (s) => {
    // "7.7-2, 3" -> ["7.7-2","7.7-3"]; "4.3-1–5" -> 1..5; "10, 11" -> ["10","11"]
    const out = []; let prefix = "";
    String(s).replace(/[（(][^）)]*[）)]/g, "").split(/[,，、・]\s*/).forEach((tok) => {
      tok = tok.trim(); if (!tok) return;
      const m = tok.match(/^((?:[0-9]+\.)?[0-9]+-)?([0-9]+)(?:\s*[–〜~-]\s*([0-9]+))?$/);
      if (!m) return;
      if (m[1]) prefix = m[1];
      const a = +m[2], z = m[3] ? +m[3] : a;
      for (let k = a; k <= z && k - a < 40; k++) out.push(prefix + k);
    });
    return out;
  };
  UNITS.forEach((u) => u.sections.forEach((s) => s.items.forEach((it) => {
    if (!it.id || !it.num) return;
    const b = u.book.id;
    if (it.t === "thm" || it.t === "def") {
      String(it.num).replace(/(定理|命題|補題|系|定義)\s*([0-9]+-[0-9]+′?)/g, (m, kind, n) => { putNum(u.id, "H", n, it, u); return m; });
      String(it.num).replace(/(定理|命題|補題|系|定義|例)\s*(L?[0-9]+\.[0-9]+′?)((?:・[0-9]+\.[0-9]+)*)/g, (m, kind, n, more) => {
        putNum(b, "N", n, it, u); (more || "").split("・").filter(Boolean).forEach((x) => putNum(b, "N", x, it, u)); return m;
      });
    } else if (it.t === "ex") {
      const lab = it.lab || "";
      if (lab === "問") expandList(it.num).forEach((n) => putNum(b, "問", n, it, u));
      else if (lab === "章末問題") expandList(it.num).forEach((n) => putNum(b, "章末", /-/.test(n) ? n : u.chapter + "-" + n, it, u));
    }
  })));
  function lookupRef(text, u) {
    if (!u) return null; const b = u.book.id;
    let m;
    if ((m = text.match(/^(?:定理|命題|補題|系|定義)\s?([0-9]+-[0-9]+′?)/))) return NUMIX.get(`${u.id}|H|${m[1]}`) || NUMIX.get(`${u.id}|H|${m[1].replace(/′$/, "")}`);
    if ((m = text.match(/^(?:定理|命題|補題|系|定義)\s?(L?[0-9]+\.[0-9]+′?)/))) return NUMIX.get(`${b}|N|${m[1]}`);
    if ((m = text.match(/^問\s?([0-9]+\.[0-9]+-[0-9]+)/))) return NUMIX.get(`${b}|問|${m[1]}`);
    if ((m = text.match(/^章末(?:問題)?\s?([0-9]+)-([0-9]+)/))) return NUMIX.get(`${b}|章末|${m[1]}-${m[2]}`);
    if ((m = text.match(/^章末(?:問題)?\s?([0-9]+)/))) return NUMIX.get(`${b}|章末|${u.chapter}-${m[1]}`);
    return null;
  }
  // underline references such as 定理 1.34 / 命題 L1.2 / 問 2.1-3 / 系 2, and turn them into review links when the target exists
  const REFRE = /((?:定理|命題|補題|系|定義|例題|問|章末問題|章末|演習|補充)\s?[0-9A-Z][0-9A-Z.\-′]*)/g;
  let CUR_UNIT = null, CUR_ITEM = null;
  const underline = (t) => t.replace(REFRE, (m) => {
    const tail = /[.\-]$/.test(m) ? m.slice(-1) : "", core = tail ? m.slice(0, -1) : m;
    const hit = lookupRef(core, CUR_UNIT);
    if (hit && hit.id !== CUR_ITEM) return `<a class="ref" data-ref="${hit.id}" href="#${hit.uid}.${hit.id}">${core}</a>${tail}`;
    return `<u class="ref">${core}</u>${tail}`;
  });
  const fixMath = (s) => (typeof s === "string" ? linkify(onText(fixMath0(s), (t) => underline(punct(t)))) : s);
  const fixPlain = (s) => (typeof s === "string" ? onText(s, punct) : s);
  // inline review links [[id]] / [[id|text]] -> link to that item (label = its number)
  const IDX0 = new Map();
  UNITS.forEach((u) => u.sections.forEach((s) => s.items.forEach((it) => {
    if (it.t === "br") { it.t = "story"; if (!it.kind) it.kind = it.title || "つなぎ"; }
    if (it.id) IDX0.set(it.id, { it, u });
  })));
  const refLabel = (it) => {
    const n = String(it.num || "").replace(/[（(].*$/, "").trim();
    if (it.t === "ex") return ((it.lab || "演習") + " " + n).trim();
    return n || (it.title ? String(it.title).replace(/<[^>]+>/g, "") : it.id);
  };
  const LINKRE = /\[\[([A-Za-z0-9_\-]+)(?:\|([^\]]*))?\]\]/g;
  const linkify = (s) => s.replace(LINKRE, (m, id, txt) => {
    const h = IDX0.get(id); if (!h) return txt || id;
    return `<a class="ref" data-ref="${id}" href="#${h.u.id}.${id}">${txt || refLabel(h.it)}</a>`;
  });
  const FIELDS = ["body", "idea", "why", "weak", "core", "proof", "ex", "cx", "dev", "q", "a", "hint", "html", "cap"];
  UNITS.forEach((u) => {
    CUR_UNIT = u; CUR_ITEM = null;
    ["lead", "blurb"].forEach((k) => (u[k] = fixPlain(u[k])));
    if (u.lead) u.lead = fixMath(u.lead);
    ["title", "short"].forEach((k) => (u[k] = fixPlain(u[k])));
    u.sections.forEach((s) => { s.title = fixPlain(s.title); s.no = fixPlain(s.no); });
    u.sections.forEach((s) => s.items.forEach((it) => {
      ["title", "num", "label", "kind"].forEach((k) => (it[k] = fixPlain(it[k])));
      CUR_ITEM = it.id;
      if (window.CX && window.CX[it.id] && !it.cx) it.cx = window.CX[it.id];
      FIELDS.forEach((k) => { if (it[k]) it[k] = fixMath(it[k]); });
      if (it.title) it.title = fixPlain(it.title);
      if (Array.isArray(it.flow)) it.flow = it.flow.map(fixMath);
    }));
  });
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, attrs = {}, html) => {
    const e = document.createElement(tag);
    for (const k in attrs) {
      if (k === "class") e.className = attrs[k];
      else if (k.startsWith("on")) e.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== undefined && attrs[k] !== null) e.setAttribute(k, attrs[k]);
    }
    if (html !== undefined) e.innerHTML = html;
    return e;
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const plain = (html) => { const d = document.createElement("div"); d.innerHTML = html || ""; return (d.textContent || "").replace(/\s+/g, " ").trim(); };
  const LV = { 1: ["基本", "lv1", "●○○"], 2: ["標準", "lv2", "●●○"], 3: ["発展", "lv3", "●●●"] };
  const KINDNAME = { thm: "定理", def: "定義", ex: "演習" };
  const exLab = (it) => it.lab || "演習";
  // "核心と流れ": what the proof fundamentally rests on + the outline, so the reader can write the proof alone
  const hasPlan = (it) => !!(it.core || (it.flow && it.flow.length));
  function planHTML(it, forPrint) {
    let h = '<div class="cf">';
    if (it.core) h += `<p class="cfk"><b>核心</b>${it.core}</p>`;
    if (it.flow && it.flow.length) h += `<span class="cfh">流れ</span><ol>${it.flow.map((f) => `<li>${f}</li>`).join("")}</ol>`;
    if (!forPrint) h += `<p class="cfn">${it.t === "ex" ? "この方針をもとに，まず自分で解答を書いてみるとよい．書けたら解答を開いて照らし合わせる．" : "この骨組みを見ながら，まず自分で証明を書いてみるとよい．書けたら証明タブで確かめ，AI に添削させることもできる．"}</p>`;
    return h + "</div>";
  }

  /* ---------- index of all items ---------- */
  const ITEMS = new Map(); // id -> {item, unit, section}
  UNITS.forEach((u) => u.sections.forEach((s) => s.items.forEach((it) => { if (it.id) ITEMS.set(it.id, { it, u, s }); })));
  const unitItems = (u, t) => u.sections.flatMap((s) => s.items).filter((it) => it.t === t);

  /* ---------- progress: kept in the signed-in site account (login.js) ---------- */
  let PROG = { read: {}, ex: {}, quiz: [] };
  let ACCT = null;
  const storeMode = () => (ACCT && ACCT.mode === "cloud" ? "account" : "local");
  function storeLabel() {
    if (ACCT && ACCT.owner) return "学習記録の保存先：オーナーの claude.ai アカウント（非公開の領域）．利用者の記録とは別に管理される．";
    const who = ACCT ? `${esc(ACCT.name)} さんの` : "";
    if (ACCT && ACCT.exportFile) return `学習記録の保存先：${who}アカウント（暗号化してこのブラウザに保存）．別の端末で続けるときは，右上の名前ボタンから「記録をファイルに書き出す」を行い，その端末のログイン画面で読み込む．`;
    return storeMode() === "account"
      ? `学習記録の保存先：${who}アカウント（暗号化して保存）．別の端末でも同じ名前とパスコードでログインすれば引き継がれる．`
      : `学習記録の保存先：${who}アカウント（このブラウザのみ）．claude.ai 上で開くと端末をまたいで引き継がれる．`;
  }
  function resetProgress() {
    PROG = { read: {}, ex: {}, quiz: [] };
    saveProgress();
    toast("学習記録を消去した"); route();
  }
  function saveProgress() {
    if (!ACCT) return;
    ACCT.data.progress = { read: PROG.read, ex: PROG.ex, quiz: PROG.quiz.slice(-40) };
    ACCT.save();
  }
  const mergeProg = (d) => {
    if (!d) return;
    PROG.read = Object.assign({}, d.read || {}, PROG.read);
    PROG.ex = Object.assign({}, d.ex || {}, PROG.ex);
    PROG.quiz = (d.quiz || []).concat(PROG.quiz.filter((q) => !(d.quiz || []).some((x) => x.t === q.t)));
  };
  (window.ACCOUNT ? window.ACCOUNT.ready : new Promise(() => {})).then(async (a) => {
    ACCT = a;
    mergeProg(a.data.progress);
    if (a.isNew) {
      // a fresh account takes over whatever this browser / claude.ai account had recorded before logins existed
      try { const raw = localStorage.getItem("kaiseki1-progress"); if (raw) mergeProg(JSON.parse(raw)); } catch (e) { /* ignore */ }
      try {
        const [db, user] = window.claude && window.claude.use ? await Promise.all([window.claude.use("db"), window.claude.use("user")]) : [];
        const id = user && (await user.id());
        if (db && id) { const snap = await db.doc("data/users/" + id + "/progress").get(); if (snap.exists) mergeProg(snap.data()); }
      } catch (e) { /* no legacy record */ }
    }
    saveProgress();
    refreshProgressUI();
    restoreChat(a.data.chat);
    // items drawn before login finished: redraw so their memos appear
    if (a.data.memos && Object.keys(a.data.memos).length) { $("#view").dataset.unit = ""; route(); }
  });
  function unitStats(u) {
    const thms = unitItems(u, "thm"), exs = unitItems(u, "ex");
    const r = thms.filter((t) => PROG.read[t.id]).length, ok = exs.filter((e) => PROG.ex[e.id] === "ok").length;
    const done = exs.filter((e) => PROG.ex[e.id]).length;
    const total = thms.length + exs.length;
    return { thms: thms.length, exs: exs.length, r, ok, done, pct: total ? Math.round((r + ok) / total * 100) : 0 };
  }

  /* ---------- MathJax ---------- */
  let mjQueue = Promise.resolve();
  function typeset(node) {
    mjQueue = mjQueue.then(async () => {
      const MJ = window.MathJax;
      if (!MJ || !MJ.startup || !MJ.startup.promise) return;
      await MJ.startup.promise;
      if (MJ.typesetClear) MJ.typesetClear([node]);
      await MJ.typesetPromise([node]);
    }).catch((e) => console.warn("MathJax", e));
    return mjQueue;
  }

  /* ---------- environment ---------- */
  // on an ordinary public web host (not claude.ai, not a local preview) the ai/*.md texts can be read by Claude / ChatGPT from their URL
  const PUBLIC_HOST = /^https?:$/.test(location.protocol) && !/(^|\.)(claude\.ai|claudeusercontent\.com|anthropic\.com)$/.test(location.hostname) && !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  // save a file: claude.ai's download capability when present, otherwise an ordinary browser download
  async function saveFile(filename, data, mime) {
    let dl = null; try { dl = window.claude && window.claude.use ? await window.claude.use("downloads") : null; } catch (e) { dl = null; }
    if (dl) { await dl.save({ filename, data }); return; }
    const a = el("a", { href: URL.createObjectURL(new Blob([data], { type: (mime || "text/plain") + ";charset=utf-8" })), download: filename });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }

  /* ---------- toast ---------- */
  let toastT;
  function toast(msg) {
    let t = $(".toast"); if (!t) { t = el("div", { class: "toast", role: "status" }); document.body.appendChild(t); }
    t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 2600);
  }

  /* ---------- rail ---------- */
  function renderRail(active) {
    const rail = $("#rail"); rail.innerHTML = "";
    let lastBook = null;
    UNITS.forEach((u) => {
      if (u.book !== lastBook) { lastBook = u.book; rail.appendChild(el("h4", {}, esc(u.book.title + (u.book.subtitle ? "　" + u.book.subtitle : "")))); }
      const st = unitStats(u);
      const a = el("a", { class: "unit" + (active === u.id ? " on" : ""), href: "#" + u.id },
        `<span class="no">${u.chapter}</span><span>${esc(u.title)}<span class="meter"><i style="width:${st.pct}%"></i></span></span>`);
      rail.appendChild(a);
      if (active === u.id) u.sections.forEach((s) => rail.appendChild(el("a", { class: "sec", href: "#" + u.id + "." + s.id }, `${esc(s.no)} ${esc(s.title)}`)));
    });
    const tools = el("div", { class: "tools" });
    tools.appendChild(el("h4", {}, "道具"));
    tools.appendChild(el("a", { class: "tbtn", href: "#quiz" }, "小テスト"));
    tools.appendChild(el("a", { class: "tbtn", href: "#review" }, "復習リスト"));
    tools.appendChild(el("a", { class: "tbtn", href: "#memos" }, "メモ一覧"));
    tools.appendChild(el("button", { class: "tbtn", type: "button", onclick: cycleTheme }, "表示テーマを切り替え"));
    const rb = el("button", { class: "tbtn", type: "button" }, "学習記録を消去");
    rb.addEventListener("click", () => {
      if (rb.dataset.arm) { resetProgress(); return; }
      rb.dataset.arm = "1"; rb.textContent = "もう一度押すと消去する"; rb.classList.add("warn");
      setTimeout(() => { delete rb.dataset.arm; rb.textContent = "学習記録を消去"; rb.classList.remove("warn"); }, 4000);
    });
    tools.appendChild(rb);
    tools.appendChild(el("p", { class: "storenote" }, esc((ACCT ? ACCT.name + " · " : "") + (storeMode() === "account" ? "記録：アカウントに保存中" : "記録：このブラウザに保存中"))));
    rail.appendChild(tools);
  }
  function cycleTheme() {
    const r = document.documentElement, cur = r.getAttribute("data-theme");
    const dark = cur ? cur === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    r.setAttribute("data-theme", dark ? "light" : "dark");
    try { localStorage.setItem("kaiseki1-theme", dark ? "light" : "dark"); } catch (e) { /* ignore */ }
  }
  try { const th = localStorage.getItem("kaiseki1-theme"); if (th) document.documentElement.setAttribute("data-theme", th); } catch (e) { /* ignore */ }
  function refreshProgressUI() {
    const h = location.hash.slice(1); renderRail(h.split(".")[0]);
    if (!h) renderHome();
  }

  /* ---------- map ---------- */
  const MAPCOL = { ax: "--muted", def: "--def", thm: "--accent", key: "--warn", app: "--plot3" };
  function renderMap(u, host) {
    const nodes = u.map.nodes, edges = u.map.edges;
    const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
    const layer = {}; nodes.forEach((n) => (layer[n.id] = 0));
    for (let it = 0; it < nodes.length; it++) edges.forEach(([a, b]) => { if (layer[b] < layer[a] + 1) layer[b] = layer[a] + 1; });
    if (u.map.layers) Object.assign(layer, u.map.layers);
    const rows = []; nodes.forEach((n) => { (rows[layer[n.id]] = rows[layer[n.id]] || []).push(n); });
    const tw = (s) => Math.max(64, [...s].reduce((w, c) => w + (c.charCodeAt(0) > 255 ? 13 : 7.4), 0) + 22);
    const gapX = 14, gapY = 58, H = 30;
    let W = 0; rows.forEach((r) => { const w = r.reduce((a, n) => a + tw(n.label), 0) + gapX * (r.length - 1); W = Math.max(W, w); });
    W = Math.max(W + 20, 320);
    // order each row by the mean position of its parents (fewer crossings)
    const parents = {}; edges.forEach(([a, b]) => { (parents[b] = parents[b] || []).push(a); });
    const order = {}; rows.forEach((r) => r.forEach((n, i) => (order[n.id] = i / Math.max(1, r.length - 1))));
    for (let pass = 0; pass < 3; pass++) rows.forEach((r, i) => {
      if (i === 0) return;
      r.forEach((n) => { const ps = parents[n.id] || []; n._k = ps.length ? ps.reduce((a, p) => a + order[p], 0) / ps.length : order[n.id]; });
      r.sort((x, y) => x._k - y._k); r.forEach((n, j) => (order[n.id] = j / Math.max(1, r.length - 1)));
    });
    const pos = {};
    rows.forEach((r, i) => { const w = r.reduce((a, n) => a + tw(n.label), 0) + gapX * (r.length - 1); let x = (W - w) / 2; r.forEach((n) => { pos[n.id] = { x, y: 10 + i * gapY, w: tw(n.label) }; x += tw(n.label) + gapX; }); });
    const Ht = 10 + rows.length * gapY - gapY + H + 12;
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", `0 0 ${W} ${Ht}`); svg.setAttribute("width", W); svg.setAttribute("height", Ht);
    svg.setAttribute("role", "img"); svg.setAttribute("aria-label", u.title + " の単元マップ");
    const cs = getComputedStyle(document.documentElement);
    const col = (v) => cs.getPropertyValue(v).trim();
    // main axis: the chains of results that lead into the central theorems (kind "key"), or u.map.axis if given
    const axis = new Set();
    if (u.map.axis) u.map.axis.forEach(([a, b]) => axis.add(a + ">" + b));
    else {
      const rank = { key: 3, thm: 2, def: 1, app: 0, ax: 1 };
      const goals = u.map.goal ? [].concat(u.map.goal) : nodes.filter((n) => n.kind === "key").map((n) => n.id);
      const walk = (id, seen) => {
        if (seen.has(id)) return; seen.add(id);
        const ps = (parents[id] || []).filter((p) => byId[p]);
        if (!ps.length) return;
        // follow the deepest prerequisite (and every other central theorem feeding in)
        const best = ps.slice().sort((x, y) => (layer[y] - layer[x]) || ((rank[byId[y].kind] || 0) - (rank[byId[x].kind] || 0)))[0];
        ps.forEach((p) => { if (p === best || byId[p].kind === "key") { axis.add(p + ">" + id); walk(p, seen); } });
      };
      goals.forEach((g) => walk(g, new Set()));
    }
    const edgeEls = [];
    const drawEdge = ([a, b], main) => {
      const p = pos[a], q = pos[b]; if (!p || !q) return;
      const x1 = p.x + p.w / 2, y1 = p.y + H, x2 = q.x + q.w / 2, y2 = q.y;
      const c = main ? col("--warn") : col("--muted");
      const path = document.createElementNS(ns, "path");
      path.setAttribute("d", `M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2 - 3}`);
      path.setAttribute("fill", "none"); path.setAttribute("stroke", c); path.setAttribute("stroke-opacity", main ? ".9" : ".28"); path.setAttribute("stroke-width", main ? "2.6" : "1");
      const s2 = main ? 5.5 : 3.5;
      const ar = document.createElementNS(ns, "path"); ar.setAttribute("d", `M${x2 - s2},${y2 - s2 - 3} L${x2},${y2 - 1} L${x2 + s2},${y2 - s2 - 3}Z`); ar.setAttribute("fill", c); ar.setAttribute("fill-opacity", main ? ".95" : ".4");
      const g = document.createElementNS(ns, "g"); g.setAttribute("class", "medge" + (main ? " main" : "")); g.appendChild(path); g.appendChild(ar);
      svg.appendChild(g); edgeEls.push({ a, b, g, main });
    };
    edges.filter(([a, b]) => !axis.has(a + ">" + b)).forEach((e) => drawEdge(e, false));
    edges.filter(([a, b]) => axis.has(a + ">" + b)).forEach((e) => drawEdge(e, true));
    nodes.forEach((n) => {
      const p = pos[n.id], g = document.createElementNS(ns, "g"); g.setAttribute("class", "mnode"); g.setAttribute("tabindex", "0");
      const c = col(MAPCOL[n.kind] || "--accent"), done = n.ref && (PROG.read[n.ref] || PROG.ex[n.ref] === "ok");
      const r = document.createElementNS(ns, "rect");
      r.setAttribute("x", p.x); r.setAttribute("y", p.y); r.setAttribute("width", p.w); r.setAttribute("height", H); r.setAttribute("rx", n.kind === "ax" ? 2 : 6);
      r.setAttribute("fill", done ? col("--accent-soft") : col("--sheet")); r.setAttribute("stroke", c); r.setAttribute("stroke-width", n.kind === "key" ? 2 : 1.3);
      g.appendChild(r);
      const t = document.createElementNS(ns, "text"); t.setAttribute("x", p.x + p.w / 2); t.setAttribute("y", p.y + 19.5); t.setAttribute("text-anchor", "middle"); t.setAttribute("fill", col("--ink"));
      t.textContent = (done ? "✓ " : "") + n.label; g.appendChild(t);
      const title = document.createElementNS(ns, "title"); title.textContent = n.tip || n.label; g.appendChild(title);
      g.addEventListener("mouseenter", () => edgeEls.forEach((e) => e.g.classList.toggle("hot", e.a === n.id || e.b === n.id)));
      g.addEventListener("mouseleave", () => edgeEls.forEach((e) => e.g.classList.remove("hot")));
      const go = () => { if (n.ref) jump(n.ref); };
      g.addEventListener("click", go); g.addEventListener("keydown", (e) => { if (e.key === "Enter") go(); });
      svg.appendChild(g);
    });
    const box = el("div", { class: "mapbox" });
    box.appendChild(el("div", { class: "mhead" }, `<b>単元マップ</b><span class="legend"><span><i style="background:var(--muted)"></i>前提</span><span><i style="background:var(--def)"></i>定義</span><span><i style="background:var(--accent)"></i>定理</span><span><i style="background:var(--warn)"></i>中心定理</span><span><i style="background:var(--plot3)"></i>応用</span><span><i style="background:var(--warn);height:3px;border-radius:0"></i>主軸</span><span>✓ 読了</span></span>`));
    const sc = el("div", { class: "mapscroll" }); sc.appendChild(svg); box.appendChild(sc);
    const tg = el("button", { type: "button", class: "sbtn", style: "margin-left:4px" }, "主軸だけを表示");
    tg.addEventListener("click", () => { const on = svg.classList.toggle("axisonly"); tg.textContent = on ? "すべての矢印を表示" : "主軸だけを表示"; });
    const foot = el("div", { class: "fc", style: "font-size:12.5px;color:var(--muted);padding:2px 4px 4px;display:flex;flex-wrap:wrap;gap:6px;align-items:center" }, "太い赤の矢印は中心定理へ向かう主軸，細い矢印はそのほかの依存関係である．ノードに触れるとその前後の矢印が浮かび，押すとその項目へ移動する．");
    foot.appendChild(tg); box.appendChild(foot);
    host.appendChild(box);
  }

  /* ---------- enumerated sub-questions: (i)(ii)… / (1)(2)… / (a)(b)… each start on a new line ---------- */
  const ENUM_FAMILIES = [
    ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi", "xii", "xiii", "xiv", "xv", "xvi", "xvii", "xviii", "xix", "xx"],
    Array.from({ length: 20 }, (_, k) => String(k + 1)),
    "abcdefgh".split("")
  ];
  function enumBreaks(html) {
    if (!html) return html;
    const parts = String(html).split(/(\$\$[\s\S]*?\$\$|\$[^$]*?\$|<[^>]+>)/g);
    const text = parts.filter((p, i) => i % 2 === 0).join(" ");
    // no look-behind assertions here: older Safari (before 16.4) rejects them and the whole page would stop rendering
    const has = (m) => new RegExp("(^|[^A-Za-z])[（(]" + m + "[)）]").test(text);
    const fams = ENUM_FAMILIES.filter((f) => has(f[0]) && has(f[1]));
    if (!fams.length) return html;
    const alt = fams.map((f) => f.join("|")).join("|");
    // a marker, a full-width bracket (to skip references written inside （…）), or a problem number "12." when several problems share one box
    const multi = /^\s*(<p[^>]*>)?\s*(<b>)?\s*\d{1,2}\.(\s|<\/b>)/.test(html);
    const re = new RegExp("([ \\t　]*)([（(](?:" + alt + ")[)）])|[（）]" + (multi ? "|([ \\t　]*)(\\d{1,2}\\.)(?=\\s|$)" : ""), "g");
    // the character just before the marker / number (what the look-behind used to check)
    const before = (str, off, lead) => (lead ? " " : str.charAt(off - 1));
    // depth: inside （…）; justMarked: nothing but blanks since the last marker, so "(d) (c) の…" keeps (c) as a reference
    let depth = 0, justMarked = false;
    const out = parts.map((p, i) => {
      if (i % 2) { if (!/^<(br|\/?p)\b/.test(p)) justMarked = false; return p; }
      let last = 0;
      const r = p.replace(re, (m, lead1, mk, lead2, num, off) => {
        if (typeof lead2 === "number") { off = lead2; lead2 = num = undefined; } // non-multi pattern has fewer groups
        if (p.slice(last, off).replace(/[\s　]/g, "")) justMarked = false;
        last = off + m.length;
        if (m === "（") { depth++; justMarked = false; return m; }
        if (m === "）") { depth = Math.max(0, depth - 1); justMarked = false; return m; }
        // "f(a)" (a letter right before) is not a marker; "2.3." style numbers are not problem numbers
        if (mk && /[A-Za-z]/.test(before(p, off, lead1))) return m;
        if (num && /[\d.]/.test(before(p, off, lead2))) return m;
        const keep = depth > 0 || justMarked;
        justMarked = true;
        return keep ? m : "<br>" + (mk || num);
      });
      if (p.slice(last).replace(/[\s　]/g, "")) justMarked = false;
      return r;
    }).join("");
    // no break at the very start of a paragraph / list item, nor right after another break
    return out.replace(/(<p[^>]*>|<li>|<br>|^)\s*<br>/g, "$1").replace(/(<p[^>]*>|<li>|^)\s*<br>/g, "$1");
  }

  /* ---------- per-item memo, kept in the signed-in account ---------- */
  const memos = () => {
    if (!ACCT) return {};
    // never write into a frozen object (data read back from the platform is immutable)
    if (!Object.isExtensible(ACCT.data)) ACCT.data = JSON.parse(JSON.stringify(ACCT.data));
    if (!ACCT.data.memos || !Object.isExtensible(ACCT.data.memos)) ACCT.data.memos = Object.assign({}, ACCT.data.memos);
    return ACCT.data.memos;
  };
  function attachMemo(box, it) {
    const btn = $(".memobtn", box);
    if (!btn || !it.id) return;
    const pane = el("div", { class: "pane memo" }, `<label for="memo-${it.id}" style="font-size:12.5px;color:var(--muted)">メモ（自分だけに見える．アカウントに保存される）</label><textarea id="memo-${it.id}" placeholder="気づいたこと，わからない点，覚え方など"></textarea><div class="memost"></div>`);
    const ta = $("textarea", pane), st = $(".memost", pane);
    const sync = () => { const v = memos()[it.id] || ""; ta.value = v; btn.classList.toggle("has", !!v); pane.hidden = !v; };
    sync();
    btn.addEventListener("click", () => {
      if (!ACCT) { toast("ログインするとメモを残せる"); return; }
      pane.hidden = !pane.hidden; if (!pane.hidden) ta.focus();
    });
    let t;
    ta.addEventListener("input", () => {
      if (!ACCT) return;
      const v = ta.value.trim() ? ta.value : "";
      if (v) memos()[it.id] = v; else delete memos()[it.id];
      btn.classList.toggle("has", !!v);
      clearTimeout(t); st.textContent = "保存中…";
      t = setTimeout(() => { ACCT.save(); st.textContent = "保存した"; }, 700);
    });
    box.appendChild(pane);
  }
  // a memo attached to a whole page (home or a unit): button + pane, same storage as item memos
  function memoBlock(key, what) {
    const wrap = el("div", { class: "pagememo" });
    const btn = el("button", { type: "button", class: "tbtn memobtn pm-btn" }, "メモ");
    const pane = el("div", { class: "pane memo" }, `<label for="memo-${key.replace(/[^A-Za-z0-9_-]/g, "_")}" style="font-size:12.5px;color:var(--muted)">${esc(what)}のメモ（自分だけに見える．アカウントに保存される）</label><textarea id="memo-${key.replace(/[^A-Za-z0-9_-]/g, "_")}" placeholder="学習計画，全体を通しての疑問，覚えておきたいことなど"></textarea><div class="memost"></div>`);
    const ta = $("textarea", pane), st = $(".memost", pane);
    const sync = () => { const v = memos()[key] || ""; ta.value = v; btn.classList.toggle("has", !!v); btn.textContent = v ? "メモ（あり）" : "メモ"; pane.hidden = !v; };
    sync();
    btn.addEventListener("click", () => { if (!ACCT) { toast("ログインするとメモを残せる"); return; } pane.hidden = !pane.hidden; if (!pane.hidden) ta.focus(); });
    let t;
    ta.addEventListener("input", () => {
      if (!ACCT) return;
      const v = ta.value.trim() ? ta.value : "";
      if (v) memos()[key] = v; else delete memos()[key];
      btn.classList.toggle("has", !!v); btn.textContent = v ? "メモ（あり）" : "メモ";
      clearTimeout(t); st.textContent = "保存中…";
      t = setTimeout(() => { ACCT.save(); st.textContent = "保存した"; }, 700);
    });
    wrap.appendChild(pane);
    return { btn, pane: wrap };
  }
  function renderMemos() {
    const v = $("#view"); v.innerHTML = "";
    v.appendChild(el("header", { class: "uhead" }, `<div class="eyebrow">MEMO</div><h1>メモ一覧</h1><p class="lead">定理・定義・演習に書いたメモをまとめて表示する．各項目の見出しにある「メモ」ボタンから書ける．</p>`));
    const M = memos(); let n = 0;
    const pageMemo = (title, href, text) => { v.appendChild(el("div", { class: "note item" }, `<span class="nl">${esc(title)}</span><p style="white-space:pre-wrap;margin:.3em 0">${esc(text)}</p><a href="${href}" style="font-size:13px">ページを開く</a>`)); n++; };
    if (M["@home"]) pageMemo("サイト全体のメモ", "#", M["@home"]);
    UNITS.forEach((u) => { if (M["@unit:" + u.id]) pageMemo(UN(u) + " " + u.title + " のメモ", "#" + u.id, M["@unit:" + u.id]); });
    UNITS.forEach((u) => {
      const list = u.sections.flatMap((s) => s.items).filter((it) => it.id && M[it.id]);
      if (!list.length) return;
      v.appendChild(el("h2", { class: "sec" }, `<span class="sn">UNIT ${u.no}</span>${esc(u.title)}`));
      list.forEach((it) => { v.appendChild(safeRenderItem(it, u)); n++; });
    });
    if (!n) v.appendChild(el("p", {}, ACCT ? "まだメモはない．" : "ログインするとメモを残せる．"));
    typeset(v);
  }

  /* ---------- item rendering ---------- */
  function lvBadge(lv, word) { const L = LV[lv] || LV[1]; return `<span class="badge ${L[1]}" title="${word}：${L[0]}"><span class="dots">${L[2]}</span> ${L[0]}</span>`; }
  function renderItem(it, u) {
    let node;
    if (it.t === "p") { node = el("div", { class: "prose item" }, it.html); if (it.id) node.id = it.id; return node; }
    if (it.t === "story") {
      node = el("div", { class: "story item", id: it.id }, `<span class="sl">${esc(it.kind || "つなぎ")}</span>${it.html}`);
      return node;
    }
    if (it.t === "note" || it.t === "fix") {
      node = el("div", { class: "note item" + (it.t === "fix" ? " fix" : ""), id: it.id }, `<span class="nl">${it.t === "fix" ? "注意" : esc(it.label || "補足")}</span>${it.html}`);
      return node;
    }
    if (it.t === "fig") {
      node = el("div", { class: "fig item", id: it.id }, `<div class="ft">図 ${esc(it.title)}</div>${it.cap ? `<div class="fc">${it.cap}</div>` : ""}`);
      const host = el("div"); node.appendChild(host);
      requestAnimationFrame(() => { try { window.WIDGETS[it.w](host); } catch (e) { host.textContent = "図を表示できなかった．"; console.error(e); } });
      return node;
    }
    const kind = it.t === "thm" ? "thm" : it.t === "def" ? "def" : "ex";
    node = el("div", { class: "item " + kind, id: it.id });
    const box = el("div", { class: "box" });
    const label = it.t === "ex" ? `${esc(exLab(it))} ${esc(it.num)}` : `${esc(it.num)}`;
    let head = `<span class="lab">${label}</span>${it.title ? `<span class="ititle">${it.title}</span>` : ""}<span class="sp"></span>`;
    if (it.t === "thm") head += `${lvBadge(it.lv || 1, "証明の難しさ")}<label class="readmark"><input type="checkbox" data-read="${it.id}"${PROG.read[it.id] ? " checked" : ""}>読んだ</label>`;
    if (it.t === "ex") head += `${lvBadge(it.lv || 1, "難易度")}`;
    head += `<button type="button" class="texbtn memobtn" title="この項目にメモを書く" aria-label="メモ">メモ</button>`;
    head += `<button type="button" class="texbtn" title="この項目を TeX に書き出す" aria-label="TeX に書き出す">TeX</button>`;
    box.appendChild(el("div", { class: "ihead" }, head));
    $(".texbtn:not(.memobtn)", box).addEventListener("click", () => openTexDialog({ kind: "item", it, u }));
    box.appendChild(el("div", { class: "stmt" }, it.t === "ex" ? enumBreaks(it.q) : it.body));
    attachMemo(box, it);
    const pre = (it.pre || []).map((id) => IDX0.get(id)).filter(Boolean);
    if (pre.length) box.appendChild(el("div", { class: "prereq" }, `<span class="pl">復習</span>` + pre.map((h) => `<a class="ref chip" data-ref="${h.it.id}" href="#${h.u.id}.${h.it.id}">${refLabel(h.it)}${h.it.title && h.it.t !== "ex" ? `<span class="pt">${h.it.title}</span>` : ""}</a>`).join("")));
    if (it.t === "thm" || it.t === "def") {
      const tabs = [];
      if (it.idea) tabs.push(["直観", it.idea]);
      if (it.why) tabs.push(["なぜこう定義するか", it.why]);
      if (it.weak) tabs.push(["弱点と注意", it.weak]);
      if (hasPlan(it)) tabs.push(["核心と流れ", planHTML(it)]);
      if (it.proof) tabs.push(["証明", it.proof]);
      if (it.ex) tabs.push(["例", it.ex]);
      if (it.cx) tabs.push(["反例・考察", it.cx]);
      if (it.dev) tabs.push(["発展", it.dev]);
      if (it.proof && it.t === "thm") tabs.push(["自分で書く", `<label for="pw-${it.id}" style="font-size:13px;color:var(--muted)">核心と流れを頼りに証明を書いてみるとよい．AI が，使ってよい既出の結果だけで書けているか，論理の飛躍がないかを添削する．数式は $x^2$ のように書けるほか，手書きの写真や音声からも入力できる．</label><div class="attempt"><textarea id="pw-${it.id}"></textarea></div><div class="exact"><button type="button" class="sbtn" data-pcheck>AI に添削してもらう</button></div>`]);
      tabs.push(["AI に質問", null]);
      const bar = el("div", { class: "tabs", role: "tablist" });
      const panes = [];
      tabs.forEach(([name, html], i) => {
        const b = el("button", { class: "tab", type: "button", role: "tab", "aria-selected": "false" }, name);
        bar.appendChild(b);
        if (html === null) { b.addEventListener("click", () => openAI(ctxFor(it, u), "")); return; }
        const pane = el("div", { class: "pane" + (name === "自分で書く" ? " attempt" : ""), role: "tabpanel" }, html + (name === "証明" ? `<span class="qed">∎</span><div style="clear:both"></div>` : ""));
        pane.hidden = true; panes.push([b, pane]);
        b.addEventListener("click", () => {
          const open = !pane.hidden;
          panes.forEach(([bb, pp]) => { pp.hidden = true; bb.setAttribute("aria-selected", "false"); });
          if (!open) { pane.hidden = false; b.setAttribute("aria-selected", "true"); }
        });
      });
      box.appendChild(bar);
      panes.forEach(([, p]) => box.appendChild(p));
      const pc = $("[data-pcheck]", box);
      if (pc) pc.addEventListener("click", () => {
        const v = $("textarea", pc.closest(".pane")).value.trim();
        if (!v) { toast("先に証明を書くとよい"); return; }
        openAI(ctxFor(it, u), "この定理の証明を自分で書きました．添削してください．正しい点，誤りや論理の飛躍，まだ示していない結果を使っていないか（使ってよいのはこの定理より前に示した結果と定義だけ）を具体的に指摘してください．\n\n【自分の証明】\n" + v, true);
      });
    }
    if (it.t === "ex") {
      const acts = el("div", { class: "exact" });
      const hint = it.hint ? el("div", { class: "pane" }, `<b>ヒント</b>　${it.hint}`) : null;
      const plan = hasPlan(it) ? el("div", { class: "pane" }, `<b>解答の方針（核心と流れ）</b>${planHTML(it)}`) : null;
      const ans = el("div", { class: "pane" }, `<b>解答</b>${it.a}`);
      const deep = it.idea || it.dev ? el("div", { class: "pane" }, `${it.idea ? `<p class="dl"><b>直観</b></p>${it.idea}` : ""}${it.dev ? `<p class="dl"><b>発展とつながり</b></p>${it.dev}` : ""}`) : null;
      const att = el("div", { class: "pane attempt" }, `<label for="att-${it.id}" style="font-size:13px;color:var(--muted)">自分の答案を書いて AI に添削させることができる（数式は $x^2$ のように書けるほか，手書きの写真や音声からも入力できる）．</label><textarea id="att-${it.id}"></textarea><div class="exact"><button type="button" class="sbtn" data-check>AI に添削してもらう</button></div>`);
      [hint, plan, ans, deep, att].forEach((p) => p && (p.hidden = true));
      if (hint) acts.appendChild(el("button", { class: "sbtn", type: "button", onclick: () => { hint.hidden = !hint.hidden; } }, "ヒント"));
      if (plan) acts.appendChild(el("button", { class: "sbtn", type: "button", onclick: () => { plan.hidden = !plan.hidden; } }, "方針"));
      acts.appendChild(el("button", { class: "sbtn", type: "button", onclick: () => { ans.hidden = !ans.hidden; } }, "解答を表示"));
      if (deep) acts.appendChild(el("button", { class: "sbtn", type: "button", onclick: () => { deep.hidden = !deep.hidden; } }, "直観と発展"));
      acts.appendChild(el("button", { class: "sbtn", type: "button", onclick: () => { att.hidden = !att.hidden; if (!att.hidden) $("textarea", att).focus(); } }, "答案を書く"));
      acts.appendChild(el("button", { class: "sbtn", type: "button", onclick: () => openAI(ctxFor(it, u), "") }, "AI に質問"));
      box.appendChild(acts);
      [hint, plan, ans, deep, att].forEach((p) => p && box.appendChild(p));
      $("[data-check]", att).addEventListener("click", () => {
        const v = $("textarea", att).value.trim();
        if (!v) { toast("先に答案を書くとよい"); return; }
        openAI(ctxFor(it, u, true), "次の答案を添削してください．正しい点，誤りや論理の飛躍，書き直し方を具体的に指摘してください．\n\n【答案】\n" + v, true);
      });
      const gr = el("div", { class: "grade" }, `自己採点：`);
      [["ok", "できた"], ["meh", "あやしい"], ["ng", "できなかった"]].forEach(([k, w]) => {
        const b = el("button", { type: "button", class: k + (PROG.ex[it.id] === k ? " on" : "") }, w);
        b.addEventListener("click", () => {
          PROG.ex[it.id] = PROG.ex[it.id] === k ? undefined : k; if (!PROG.ex[it.id]) delete PROG.ex[it.id];
          gr.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x.classList.contains(PROG.ex[it.id])));
          saveProgress(); renderRail(u.id);
        });
        gr.appendChild(b);
      });
      box.appendChild(gr);
    }
    node.appendChild(box);
    node.querySelectorAll(".attempt textarea").forEach(attachComposer);
    const rm = $("[data-read]", node);
    if (rm) rm.addEventListener("change", () => { if (rm.checked) PROG.read[it.id] = 1; else delete PROG.read[it.id]; saveProgress(); renderRail(u.id); });
    return node;
  }

  /* ---------- answer composer: photo / voice input, LaTeX tidy-up, live preview ---------- */
  let samplePromise = null;
  const getSample = () => (samplePromise = samplePromise || (async () => { try { return window.claude && window.claude.use ? await window.claude.use("sample") : null; } catch (e) { return null; } })());
  const OCR_PROMPT = `添付画像は大学の実解析学（測度論・ルベーグ積分）の答案（手書きまたは印刷）である．書かれている内容を忠実に文字に起こせ．
- 数式はすべて LaTeX で書き，文中は $...$，独立した式は $$...$$ で囲む．
- 書かれていないことを補ったり，誤りを直したりしてはならない．計算や論理が誤っていてもそのまま写す．
- 読めない箇所は［?］と書く．取り消し線の部分は写さない．
- 句読点は「，」「．」を使う．
- 出力は書き起こした本文だけとし，前置きや説明は付けない．`;
  const TIDY_PROMPT = `次の文章は，学習者が音声入力やキーボードで素早く打ち込んだ実解析学（測度論・ルベーグ積分）の答案である．数式の部分（読み上げ調の「エックスの二乗」「イプシロンより小さい」「インテグラル 0 から 1」なども含む）を LaTeX に直し，$...$ または $$...$$ で囲め．
- 内容・論理・計算は一切変えない（誤りがあっても直さない．書かれていないことを補わない）．
- 日本語の文はそのまま残し，誤変換が明らかな語だけ直す．
- 句読点は「，」「．」に統一する．
- 出力は整形後の本文だけとし，説明は付けない．

【入力】
`;
  function attachComposer(ta) {
    if (!ta || ta.dataset.cmp) return; ta.dataset.cmp = "1";
    const bar = el("div", { class: "cmpbar" });
    const status = el("span", { class: "cmpst", "aria-live": "polite" });
    const prev = el("div", { class: "cmpprev" }); prev.hidden = true;
    const file = el("input", { type: "file", accept: "image/*", capture: "environment" }); file.hidden = true;
    const bPhoto = el("button", { type: "button", class: "sbtn" }, "写真から読み取る");
    const bVoice = el("button", { type: "button", class: "sbtn" }, "音声入力");
    const bTidy = el("button", { type: "button", class: "sbtn" }, "数式を整形");
    const bUndo = el("button", { type: "button", class: "sbtn" }, "整形前に戻す"); bUndo.hidden = true;
    const bPrev = el("button", { type: "button", class: "sbtn" }, "プレビュー");
    [bPhoto, bVoice, bTidy, bUndo, bPrev, status, file].forEach((x) => bar.appendChild(x));
    ta.insertAdjacentElement("afterend", bar); bar.insertAdjacentElement("afterend", prev);
    const say = (t) => { status.textContent = t || ""; };
    let pT;
    const renderPrev = () => { if (prev.hidden) return; prev.innerHTML = ta.value.trim() ? md(ta.value) : "<p style='color:var(--muted)'>（まだ何も書かれていない）</p>"; typeset(prev); };
    ta.addEventListener("input", () => { clearTimeout(pT); pT = setTimeout(renderPrev, 600); });
    bPrev.addEventListener("click", () => { prev.hidden = !prev.hidden; bPrev.classList.toggle("on", !prev.hidden); renderPrev(); });
    const insertText = (t) => {
      const a = ta.selectionStart ?? ta.value.length, b = ta.selectionEnd ?? ta.value.length;
      ta.value = ta.value.slice(0, a) + t + ta.value.slice(b); ta.selectionStart = ta.selectionEnd = a + t.length;
      ta.dispatchEvent(new Event("input"));
    };
    // photo -> transcription (only where this view can send images)
    getSample().then(async (sm) => {
      if (!sm) { bPhoto.hidden = true; bTidy.hidden = true; return; }
      const caps = await (sm.limits ? sm.limits().catch(() => null) : null);
      if (!caps || !caps.images) bPhoto.hidden = true; else if (caps.images.mediaTypes) file.accept = caps.images.mediaTypes.join(",");
    });
    bPhoto.addEventListener("click", () => file.click());
    file.addEventListener("change", async () => {
      const f = file.files && file.files[0]; file.value = ""; if (!f) return;
      const sm = await getSample(); if (!sm) return;
      bPhoto.disabled = true; say("画像を読み取っている…");
      const base = ta.value; const sep = base && !base.endsWith("\n") ? "\n" : "";
      try {
        const { text } = await sm(OCR_PROMPT, { images: [f], cache: false, onText: ({ text: t }) => { ta.value = base + sep + t; } });
        ta.value = base + sep + text.trim(); ta.dispatchEvent(new Event("input"));
        say("読み取った．誤認識がないか確かめ，必要なら直してから添削に出すとよい．");
        if (prev.hidden) bPrev.click();
      } catch (e) {
        ta.value = base;
        say({ images_unavailable: "この表示環境では画像を送れない．", image_rejected: "この画像形式は読み取れない．JPEG か PNG で試すとよい．", not_granted: "AI の利用が許可されていない．", rate_limited: "混み合っている．少し待ってから試すとよい．" }[e && e.code] || "読み取りに失敗した．もう一度試すとよい．");
      } finally { bPhoto.disabled = false; }
    });
    // voice (Web Speech API, where the browser allows the microphone)
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    let rec = null;
    bVoice.addEventListener("click", () => {
      if (!SR) { say("このブラウザでは音声入力が使えない．端末のキーボードの音声入力で話してから「数式を整形」を押すと同じことができる．"); return; }
      if (rec) { rec.stop(); return; }
      rec = new SR(); rec.lang = "ja-JP"; rec.continuous = true; rec.interimResults = true;
      bVoice.classList.add("on"); bVoice.textContent = "停止"; say("聞き取り中…（話し終えたら停止を押す）");
      rec.onresult = (ev) => {
        let interim = "";
        for (let i = ev.resultIndex; i < ev.results.length; i++) { const r = ev.results[i]; if (r.isFinal) insertText(r[0].transcript); else interim += r[0].transcript; }
        say(interim ? "聞き取り中：" + interim : "聞き取り中…");
      };
      rec.onerror = (ev) => { say(ev.error === "not-allowed" || ev.error === "service-not-allowed" ? "このページではマイクを使えない．端末のキーボードの音声入力で話してから「数式を整形」を押すとよい．" : "音声入力が中断した．"); };
      rec.onend = () => { rec = null; bVoice.classList.remove("on"); bVoice.textContent = "音声入力"; if (/聞き取り中/.test(status.textContent)) say("音声を入力した．読み上げた数式は「数式を整形」で LaTeX に直せる．"); };
      try { rec.start(); } catch (e) { rec = null; say("音声入力を開始できなかった．"); }
    });
    // tidy: spoken / loose math -> LaTeX, without changing content
    let before = null;
    bTidy.addEventListener("click", async () => {
      const v = ta.value.trim(); if (!v) { say("先に何か書くか話すとよい．"); return; }
      const sm = await getSample(); if (!sm) { say("この表示環境では AI を呼び出せない．"); return; }
      before = ta.value; bTidy.disabled = true; say("数式を整形している…");
      try {
        const { text } = await sm(TIDY_PROMPT + v, { cache: false, modelTier: "quick" });
        ta.value = text.trim(); ta.dispatchEvent(new Event("input")); bUndo.hidden = false;
        say("整形した．意図と違う箇所は直接直すか，整形前に戻せる．"); if (prev.hidden) bPrev.click();
      } catch (e) { say("整形に失敗した．"); } finally { bTidy.disabled = false; }
    });
    bUndo.addEventListener("click", () => { if (before != null) { ta.value = before; before = null; bUndo.hidden = true; ta.dispatchEvent(new Event("input")); say("整形前に戻した．"); } });
  }

  /* ---------- open the whole notes (or one unit) in Claude / ChatGPT ---------- */
  function notesText(u) { return u ? window.MDEXPORT.oneUnitMd(u, true, UNITS) : window.MDEXPORT.siteMd(UNITS, true); }
  function notesFileName(u) { return u ? `実解析学_${UN(u).replace(/\s+/g, "")}_${u.title}.md` : "実解析学_学習ノート_全体.md"; }
  async function openNotesIn(target, u) {
    const scope = u ? UN(u) + " " + u.title : "全体";
    const text = notesText(u);
    const copied = await copyText(text);
    if (target === "copy") { toast(copied ? `${scope}の全文をコピーしました（${Math.round(text.length / 1000)} 千字）．AI に貼り付けて使えます` : "コピーできませんでした．「ファイルに保存」を使ってください"); return; }
    const url = PUBLIC_HOST ? new URL("ai/" + (u ? u.id : "all") + ".md", location.href).href : "";
    let q = `以下は大学の講義「実解析学（測度論・ルベーグ積分）」の学習ノート（${scope}）です．この内容を前提に，私の学習を手伝ってください．数式は LaTeX で書き，答えだけでなく考え方を説明してください．`;
    q += url ? `\n\nノートの全文はこの URL にあります（Markdown）：\n${url}\n\n読めない場合は，続けて全文を貼り付けます．まずは読み込んだ内容の章立てを簡単に確認してください．` : `\n\n続けてノートの全文を貼り付けます（または添付します）．読み込んだら，章立てを簡単に確認してください．`;
    const base = target === "chatgpt" ? "https://chatgpt.com/" : "https://claude.ai/new";
    const a = el("a", { href: base + "?q=" + encodeURIComponent(q), target: "_blank", rel: "noopener noreferrer" });
    document.body.appendChild(a); a.click(); a.remove();
    toast(copied ? "AI を開きました．全文もコピーしてあるので，必要なら貼り付けてください（長すぎて貼れないときは「ファイルに保存」して添付）" : "AI を開きました．「ファイルに保存」したノートを添付してください");
  }
  function aiBar(u) {
    const what = u ? "この単元" : "サイト全体";
    const bar = el("div", { class: "aibar" }, `<span class="ail">${what}を AI で開く</span>`);
    [["Claude", "claude"], ["ChatGPT", "chatgpt"], ["全文をコピー", "copy"]].forEach(([lab, t]) => bar.appendChild(el("button", { type: "button", class: "sbtn", onclick: () => openNotesIn(t, u) }, lab)));
    bar.appendChild(el("button", { type: "button", class: "sbtn", onclick: async () => { try { await saveFile(notesFileName(u), notesText(u), "text/markdown"); toast("保存した．Claude や ChatGPT に添付して使える"); } catch (e) { toast(e && e.code === "cancelled" ? "保存を取り消した" : "保存できなかった"); } } }, "ファイルに保存（.md）"));
    return bar;
  }

  /* ---------- views ---------- */
  function renderHome() {
    const v = $("#view"); v.innerHTML = "";
    let T = 0, E = 0, R = 0, O = 0; UNITS.forEach((u) => { const s = unitStats(u); T += s.thms; E += s.exs; R += s.r; O += s.ok; });
    const B = Object.assign({}, BOOK0, (window.MANIFEST && window.MANIFEST.site) || {});
    v.appendChild(el("section", { class: "hero" }, `<div class="eyebrow">${esc(B.eyebrow || "REAL ANALYSIS")}</div><h1>${esc(B.title)}</h1>
      <p>${B.intro || ""}</p>
      <div class="stats"><span><b>${T}</b>定理・命題・例題</span><span><b>${E}</b>演習</span><span><b>${R}</b>読了した定理</span><span><b>${O}</b>できた演習</span></div>`));
    {
      const hero = $(".hero", v), hm = memoBlock("@home", "サイト全体");
      const acts = el("div", { class: "acts heroacts" }); acts.appendChild(hm.btn);
      hero.appendChild(acts); hero.appendChild(hm.pane); hero.appendChild(aiBar(null));
    }
    BOOKS.forEach((bk) => {
      const us = UNITS.filter((u) => u.book === bk); if (!us.length) return;
      if (BOOKS.length > 1) v.appendChild(el("h2", { class: "sec" }, `${esc(bk.title)}<span style="font-size:13px;color:var(--muted);margin-left:10px">${esc(bk.subtitle || bk.author || "")}</span>`));
      const grid = el("div", { class: "units" });
      us.forEach((u) => {
        const st = unitStats(u);
        grid.appendChild(el("a", { class: "ucard", href: "#" + u.id }, `<span class="n">${esc(UN(u))}</span><h3>${esc(u.title)}</h3><p>${u.blurb || ""}</p><span class="meter"><i style="width:${st.pct}%"></i></span><span class="cnt">定理 ${st.r}/${st.thms} 読了 · 演習 ${st.ok}/${st.exs} 正解</span>`));
      });
      v.appendChild(grid);
    });
    v.appendChild(el("div", { class: "howto" }, `
      <div><h4>単元マップから入る</h4><p>各単元の冒頭に，定理どうしの依存関係を図にしてある．太い赤の矢印が中心定理へ向かう主軸である．まず主軸をたどってから細部へ入ると迷わない．</p></div>
      <div><h4>証明は自分で書いてから開く</h4><p>直観で意味をつかみ，核心と流れで証明が根本的に何を使うかと大まかな手順を確かめる．それを頼りに自分で書き，証明タブで照らし合わせる．手書きの答案は写真から，口頭の説明は音声から入力できる．</p></div>
      <div><h4>演習は方針から</h4><p>問と章末問題には，ヒント，解答の方針（核心と流れ），詳しい解答，直観と発展を段階的に用意した．答案を書けば AI が添削する．</p></div>
      <div><h4>参照から復習へ</h4><p>本文中の下線付きの番号（定理 2.5，問 3.1-1 など）は該当箇所へのリンクである．触れると内容が浮かび，押すと移動し，右下のボタンで元の位置に戻れる．</p></div>`));
    const texAll = el("button", { class: "tbtn", type: "button" }, "全体を TeX に書き出す");
    texAll.addEventListener("click", () => openTexDialog({ kind: "all" }));
    const about = el("div", { class: "about" }, `<h4>このノートについて</h4>
      <p>章立てと定理・命題の番号は講義資料（参考文献）に対応させてある．本文は資料に沿って書き，定理には直観・証明の核心と流れ・反例や考察を補った．資料にあるレポート問題・研究レポート・問にはすべて詳しい解答を付けた．資料の記述に誤植や不十分な点があるところは「注意」として記した．</p>
      <p>証明と解答では，その時点までに示した結果と定義だけを使う．ほかの箇所を引用するときは番号で示し，番号はその箇所へのリンクになっている．</p>
      <p class="store">${storeLabel()}</p>
      <h4 style="margin-top:14px">参考文献</h4>
      <p class="refs">${BOOKS.map((b, i) => `[${i + 1}] 講義資料『${esc(b.title)}』${b.subtitle ? "（" + esc(b.subtitle) + "）" : ""}．`).join("<br>")}</p>`);
    about.appendChild(texAll);
    v.appendChild(about);
    typeset(v);
  }
  // one item that fails to render (old browser, bad content) must not stop the rest of the unit
  function safeRenderItem(it, u) {
    try { return renderItem(it, u); }
    catch (e) {
      console.error("render failed", it && it.id, e);
      return el("div", { class: "note item", id: it && it.id }, `<span class="nl">表示エラー</span><p>${esc((it && (it.num || it.title)) || "この項目")} を表示できなかった．ブラウザを最新版に更新すると表示されることがある．</p>`);
    }
  }
  function renderUnit(u, focus) {
    const v = $("#view"); v.innerHTML = "";
    const s = unitStats(u);
    const head = el("header", { class: "uhead" }, `<div class="eyebrow">${esc(UN(u))} · 定理 ${s.thms} · 演習 ${s.exs}</div><h1>${esc(u.title)}</h1><div class="lead">${u.lead}</div>`);
    const acts = el("div", { class: "acts" });
    acts.appendChild(el("button", { class: "tbtn", type: "button", onclick: () => setPrint(true) }, "印刷用表示（全展開）"));
    acts.appendChild(el("button", { class: "tbtn", type: "button", onclick: () => downloadUnit(u) }, "この単元を HTML で保存"));
    acts.appendChild(el("button", { class: "tbtn", type: "button", onclick: () => openTexDialog({ kind: "unit", u }) }, "この単元を TeX に書き出す"));
    acts.appendChild(el("button", { class: "tbtn", type: "button", onclick: () => { location.hash = "quiz"; setTimeout(() => startQuizFor([u.id]), 30); } }, "この単元の小テスト"));
    acts.appendChild(el("button", { class: "tbtn", type: "button", onclick: () => openAI({ label: UN(u) + " " + u.title, text: unitSummary(u) }, "") }, "この単元について AI に質問"));
    const um = memoBlock("@unit:" + u.id, "この単元");
    acts.insertBefore(um.btn, acts.firstChild);
    head.appendChild(acts);
    head.appendChild(um.pane);
    head.appendChild(aiBar(u));
    v.appendChild(head);
    renderMap(u, v);
    u.sections.forEach((sec) => {
      v.appendChild(el("h2", { class: "sec", id: sec.id }, `<span class="sn">${esc(sec.no)}</span>${esc(sec.title)}`));
      sec.items.forEach((it) => v.appendChild(safeRenderItem(it, u)));
    });
    // prev/next
    const i = UNITS.indexOf(u);
    const nav = el("div", { style: "display:flex;justify-content:space-between;gap:10px;margin-top:40px;flex-wrap:wrap" });
    nav.appendChild(i > 0 ? el("a", { class: "tbtn", href: "#" + UNITS[i - 1].id }, "← " + esc(UNITS[i - 1].title)) : el("span"));
    nav.appendChild(i < UNITS.length - 1 ? el("a", { class: "tbtn", href: "#" + UNITS[i + 1].id }, esc(UNITS[i + 1].title) + " →") : el("span"));
    v.appendChild(nav);
    typeset(v).then(() => { if (focus) jump(focus, true); });
    if (!focus) window.scrollTo(0, 0);
  }
  function unitSummary(u) {
    return u.title + "：" + plain(u.lead) + "\n主な結果：" + unitItems(u, "thm").map((t) => t.num + (t.title ? "（" + plain(t.title) + "）" : "")).join("，");
  }
  function jump(id, noRoute) {
    const target = document.getElementById(id);
    if (!target) {
      const rec = ITEMS.get(id); if (rec && !noRoute) { location.hash = rec.u.id + "." + id; } return;
    }
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    target.classList.remove("flash"); void target.offsetWidth; target.classList.add("flash");
  }

  /* ---------- review list ---------- */
  function renderReview() {
    const v = $("#view"); v.innerHTML = "";
    v.appendChild(el("header", { class: "uhead" }, `<div class="eyebrow">REVIEW</div><h1>復習リスト</h1><p class="lead">自己採点でできなかった，あやしいと付けた演習の一覧である．もう一度解いてできたにすると外れる．</p>`));
    let n = 0;
    UNITS.forEach((u) => {
      const list = unitItems(u, "ex").filter((e) => PROG.ex[e.id] === "ng" || PROG.ex[e.id] === "meh");
      if (!list.length) return;
      v.appendChild(el("h2", { class: "sec" }, `<span class="sn">UNIT ${u.no}</span>${esc(u.title)}`));
      list.forEach((it) => { v.appendChild(safeRenderItem(it, u)); n++; });
    });
    if (!n) v.appendChild(el("p", {}, "まだない．各演習の下にある自己採点ボタンを使うと，ここに集まる．"));
    typeset(v);
  }

  /* ---------- quiz ---------- */
  let QZ = null;
  function renderQuiz() {
    const v = $("#view"); v.innerHTML = "";
    v.appendChild(el("header", { class: "uhead" }, `<div class="eyebrow">QUIZ</div><h1>小テスト</h1><p class="lead">単元と難易度を選ぶと，演習からランダムに出題する．解いてから解答を開き，自己採点する．結果は記録される．</p>`));
    const sel = { units: new Set(UNITS.map((u) => u.id)), lv: new Set([1, 2, 3]), n: 5 };
    const box = el("div", { class: "qsetup box" });
    const uc = el("div", { class: "chips" });
    UNITS.forEach((u) => { const c = el("button", { type: "button", class: "chip on" }, `${u.no}. ${esc(u.short || u.title)}`); c.addEventListener("click", () => { sel.units.has(u.id) ? sel.units.delete(u.id) : sel.units.add(u.id); c.classList.toggle("on"); }); uc.appendChild(c); });
    const lc = el("div", { class: "chips" });
    [1, 2, 3].forEach((l) => { const c = el("button", { type: "button", class: "chip on" }, LV[l][0]); c.addEventListener("click", () => { sel.lv.has(l) ? sel.lv.delete(l) : sel.lv.add(l); c.classList.toggle("on"); }); lc.appendChild(c); });
    const nc = el("div", { class: "chips" });
    [5, 10, 15].forEach((k) => { const c = el("button", { type: "button", class: "chip" + (k === 5 ? " on" : "") }, k + " 問"); c.addEventListener("click", () => { sel.n = k; nc.querySelectorAll(".chip").forEach((x) => x.classList.remove("on")); c.classList.add("on"); }); nc.appendChild(c); });
    const only = el("label", { class: "readmark", style: "font-size:13px" }, `<input type="checkbox" id="qonly">まだ「できた」になっていない問題だけ`);
    box.append(el("b", {}, "単元"), uc, el("b", {}, "難易度"), lc, el("b", {}, "問題数"), nc, only);
    const go = el("button", { class: "tbtn primary", type: "button" }, "はじめる");
    go.addEventListener("click", () => startQuiz([...sel.units], [...sel.lv], sel.n, $("#qonly").checked));
    box.appendChild(el("div", {}, "")).appendChild(go);
    v.appendChild(box);
    if (PROG.quiz.length) {
      const t = el("table", { class: "qsum", style: "margin-top:22px;border-collapse:collapse" });
      t.innerHTML = `<tr><td><b>最近の結果</b></td><td></td><td></td></tr>` + PROG.quiz.slice(-8).reverse().map((q) => `<tr><td>${new Date(q.t).toLocaleString("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}</td><td>${q.ok} / ${q.n} 正解</td><td>${esc(q.units || "")}</td></tr>`).join("");
      v.appendChild(el("div", { class: "tblwrap" })).appendChild(t);
    }
  }
  function startQuizFor(units) { startQuiz(units, [1, 2, 3], 5, false); }
  function startQuiz(units, lvs, n, onlyOpen) {
    let pool = [];
    UNITS.filter((u) => units.includes(u.id)).forEach((u) => unitItems(u, "ex").forEach((e) => { if (lvs.includes(e.lv || 1) && (!onlyOpen || PROG.ex[e.id] !== "ok")) pool.push([e, u]); }));
    if (!pool.length) { toast("条件に合う演習がない"); return; }
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    QZ = { list: pool.slice(0, n), i: 0, res: [], units: UNITS.filter((u) => units.includes(u.id)).map((u) => UN(u)).join("・") };
    quizStep();
  }
  function quizStep() {
    const v = $("#view"); v.innerHTML = "";
    if (QZ.i >= QZ.list.length) {
      const ok = QZ.res.filter((r) => r === "ok").length;
      PROG.quiz.push({ t: Date.now(), n: QZ.list.length, ok, units: QZ.units }); saveProgress();
      v.appendChild(el("header", { class: "uhead" }, `<div class="eyebrow">QUIZ · 結果</div><h1>${ok} / ${QZ.list.length} 正解</h1><p class="lead">できなかった，あやしいと採点した問題は復習リストに入った．</p>`));
      const t = el("table", { class: "qsum" });
      t.innerHTML = QZ.list.map(([e, u], i) => `<tr><td>${esc(UN(u))} ${esc(exLab(e))} ${esc(e.num)}</td><td>${{ ok: "できた", meh: "あやしい", ng: "できなかった" }[QZ.res[i]] || "—"}</td><td><a href="#${u.id}.${e.id}">本文で見る</a></td></tr>`).join("");
      v.appendChild(el("div", { class: "tblwrap" })).appendChild(t);
      const again = el("div", { class: "uhead acts", style: "border:0;display:flex;gap:8px;margin-top:16px" });
      again.appendChild(el("a", { class: "tbtn primary", href: "#quiz", onclick: () => setTimeout(renderQuiz, 0) }, "もう一度"));
      again.appendChild(el("a", { class: "tbtn", href: "#review" }, "復習リストへ"));
      v.appendChild(again);
      renderRail("");
      return;
    }
    const [e, u] = QZ.list[QZ.i];
    v.appendChild(el("div", { class: "qprog" }, `第 ${QZ.i + 1} 問 / ${QZ.list.length}　·　${esc(UN(u))} ${esc(u.title)}`));
    v.appendChild(el("div", { class: "qbar" }, `<i style="width:${QZ.i / QZ.list.length * 100}%"></i>`));
    const card = renderItem(e, u);
    // replace self-grade with quiz grading
    const gr = $(".grade", card); gr.innerHTML = "採点して次へ：";
    [["ok", "できた"], ["meh", "あやしい"], ["ng", "できなかった"]].forEach(([k, w]) => {
      const b = el("button", { type: "button", class: k }, w);
      b.addEventListener("click", () => { QZ.res.push(k); PROG.ex[e.id] = k; saveProgress(); QZ.i++; quizStep(); window.scrollTo(0, 0); });
      gr.appendChild(b);
    });
    v.appendChild(card);
    typeset(v);
  }

  /* ---------- search ---------- */
  const SIDX = [];
  UNITS.forEach((u) => u.sections.forEach((s) => s.items.forEach((it) => {
    if (!it.id || it.t === "p") return;
    const title = it.t === "ex" ? exLab(it) + " " + it.num : (it.num || "") + (it.title ? "（" + plain(it.title) + "）" : "");
    const body = plain(it.t === "ex" ? it.q : it.body || it.html || it.cap || "");
    const kind = it.t === "fig" ? "図 " + it.title : title;
    SIDX.push({ id: it.id, u, s, kind, text: (kind + " " + body + " " + plain(it.idea || "") + " " + plain(it.core || "") + " " + (it.tags || "")).toLowerCase(), body });
  })));
  function doSearch(q) {
    q = q.trim().toLowerCase();
    let ov = $("#searchOv");
    if (!q) { if (ov) ov.remove(); return; }
    const terms = q.split(/\s+/);
    const hits = SIDX.filter((r) => terms.every((t) => r.text.includes(t))).slice(0, 40);
    if (!ov) {
      ov = el("div", { class: "overlay", id: "searchOv" });
      ov.addEventListener("click", (e) => { if (e.target === ov) { ov.remove(); } });
      document.body.appendChild(ov);
    }
    ov.innerHTML = "";
    const p = el("div", { class: "panel" }, `<h3>「${esc(q)}」の検索結果 <span style="font-family:var(--f-ui);font-size:13px;color:var(--muted)">${hits.length} 件</span></h3>`);
    hits.forEach((h) => {
      const a = el("a", { class: "res", href: "#" + h.u.id + "." + h.id }, `<div class="rk">${esc(UN(h.u))} · ${esc(h.s.no)} ${esc(h.s.title)}</div><div>${esc(h.kind)}</div><div class="rs">${snippet(h.body, terms[0])}</div>`);
      a.addEventListener("click", () => { ov.remove(); $("#q").value = ""; });
      p.appendChild(a);
    });
    if (!hits.length) p.appendChild(el("p", {}, "見つからなかった．別の言い方（中間値，ロピタル，一様収束，ヤコビなど）を試すとよい．"));
    ov.appendChild(p);
    typeset(p);
  }
  // cut a snippet around the first hit without splitting a formula; highlight only outside formulas
  function snippet(body, term) {
    const toks = String(body).split(/(\$\$[\s\S]+?\$\$|\$[^$]+?\$)/g).filter((t) => t !== "");
    let pos = 0, hit = -1;
    const spans = toks.map((t) => { const s = { t, a: pos, math: t.startsWith("$") }; pos += t.length; return s; });
    const low = String(body).toLowerCase(), i = low.indexOf(term);
    if (i >= 0) hit = i;
    const from = Math.max(0, hit - 50), to = (hit < 0 ? 0 : hit) + 110;
    const re = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    let out = from > 0 ? "…" : "";
    spans.forEach((s) => {
      const b = s.a + s.t.length; if (b <= from || s.a >= to) return;
      if (s.math) out += esc(s.t);
      else out += esc(s.t.slice(Math.max(0, from - s.a), to - s.a)).replace(re, (m) => `<mark>${m}</mark>`);
    });
    return out + (to < pos ? "…" : "");
  }
  let sT; $("#q").addEventListener("input", (e) => { clearTimeout(sT); sT = setTimeout(() => doSearch(e.target.value), 160); });
  $("#q").addEventListener("keydown", (e) => { if (e.key === "Escape") { e.target.value = ""; doSearch(""); } });

  /* ---------- AI tutor ---------- */
  const RULES = `あなたは大学 3 年生向け「実解析学（測度論・ルベーグ積分）」の個別指導チューターです．次の方針で答えてください．
- 日本語で，学習者に語りかけるように説明する．
- 数式は必ず LaTeX で書き，インラインは $...$，別行は $$...$$ で囲む．
- ε-δ 論法など厳密な議論を正確に保ちつつ，図形的・直観的な意味も一言添える．
- 学習者の答案を見せられたら，まず正しい部分を認め，次に誤り・論理の飛躍・書き足すべき点を具体的に指摘し，最後に整った書き方の例を示す．
- 演習の模範解答が文脈として与えられていても，学習者が「答えを教えて」と求めるまでは全部を見せず，ヒントから段階的に導く．
- 不確かなことは断定しない．講義資料の範囲を超える話題は「発展」と断って簡潔に．
- 1 回の返答は長くても 700 字程度を目安にし，必要なら「続けますか？」と聞く．
- 句読点は全角の「，」と「．」を使う（読点・句点の「\u3001」「\u3002」は使わない）．
- 文末は「です・ます」調にそろえる．`;
  let aiCtx = null, turns = [], aiBusy = false, aiCtl = null, sampleFn;
  const chat = $("#chat");
  function ctxFor(it, u, withAnswer) {
    const lab = it.t === "ex" ? `${UN(u)} ${exLab(it)} ${it.num}` : `${UN(u)} ${it.num}${it.title ? "（" + plain(it.title) + "）" : ""}`;
    let text = `【単元】${UN(u)} ${u.title}\n【項目】${lab}\n【内容】${plain(it.t === "ex" ? it.q : it.body)}`;
    if (it.idea) text += `\n【直観】${plain(it.idea)}`;
    if (hasPlan(it)) text += `\n【証明の核心と流れ】${plain(planHTML(it, true))}`;
    if (it.proof) text += `\n【サイトに載せている証明】${plain(it.proof)}`;
    if (it.cx) text += `\n【反例・考察】${plain(it.cx)}`;
    if (it.t === "ex") text += `\n【模範解答（学習者にはまだ見せないこと．添削の基準に使う）】${plain(it.a)}`;
    return { label: lab, text };
  }
  function setCtx(c) { aiCtx = c; $("#aiCtx").textContent = c ? "文脈：" + c.label : "文脈：なし（サイト全体について質問できます）"; renderSuggest(); }
  function renderSuggest() {
    const s = $("#suggest"); s.innerHTML = "";
    const qs = aiCtx ? ["この内容をやさしく説明して", "証明の核心をもっと詳しく", "具体例を出して", "自分で証明を書くので見てほしい"] : ["ε-δ 論法のコツは？", "一様収束と各点収束の違いは？", "試験に出やすい定理は？"];
    qs.forEach((q) => s.appendChild(el("button", { type: "button", onclick: () => send(q) }, q)));
  }
  function md(t) {
    t = String(t).replace(/\u3001/g, "，").replace(/\u3002/g, "．");
    // keep $...$ intact; escape HTML; light markdown
    const parts = String(t).split(/(\$\$[\s\S]*?\$\$|\$[^$\n]*?\$)/g);
    let out = parts.map((p, i) => (i % 2 ? esc(p) : esc(p).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/`([^`]+)`/g, "<code>$1</code>"))).join("");
    out = out.split(/\n{2,}/).map((para) => {
      const lines = para.split("\n");
      if (lines.every((l) => /^\s*([-*・]|\d+[.)])\s+/.test(l))) return "<ul>" + lines.map((l) => "<li>" + l.replace(/^\s*([-*・]|\d+[.)])\s+/, "") + "</li>").join("") + "</ul>";
      return "<p>" + lines.map((l) => l.replace(/^#+\s*/, "")).join("<br>") + "</p>";
    }).join("");
    return out;
  }
  function addMsg(role, html) { const m = el("div", { class: "msg " + role }, html); chat.appendChild(m); chat.scrollTop = chat.scrollHeight; return m; }

  /* chat history lives in the site account: newest turns only, so the encrypted record stays small */
  let lastAsked = "";
  function persistChat() {
    if (!ACCT) return;
    let keep = turns.slice(-30), size = 0, from = keep.length;
    while (from > 0 && size + keep[from - 1].content.length < 24000) size += keep[--from].content.length;
    keep = keep.slice(from);
    if (keep.length && keep[0].role !== "user") keep = keep.slice(1);
    ACCT.data.chat = keep;
    ACCT.save();
  }
  function restoreChat(saved) {
    if (!Array.isArray(saved) || !saved.length) return;
    turns = saved.slice();
    chat.innerHTML = "";
    addMsg("sys", "前回までの会話");
    turns.forEach((t) => addMsg(t.role === "user" ? "u" : "a", md(t.content)));
    typeset(chat);
  }

  /* hand the question to an outside AI: copy a self-contained prompt, then open ChatGPT / Claude */
  function handoffPrompt() {
    const q = $("#aiInput").value.trim() || lastAsked || (turns.filter((t) => t.role === "user").slice(-1)[0] || {}).content || "";
    // a short preamble (not the full RULES) so the prompt more often fits in the ?q= link
    let p = "あなたは大学 3 年生向け「実解析学（測度論・ルベーグ積分）」の個別指導チューターです．教材は講義資料『実解析学1』『実解析学2』（ルベーグの測度論・ルベーグ積分）．数式は LaTeX（$...$）で書き，答えだけでなく考え方を「です・ます」調で説明してください．演習の模範解答が含まれていても，求められるまでは全部を見せずヒントから導いてください．\n\n";
    if (aiCtx) p += `以下は学習者がいま見ている箇所です．\n${aiCtx.text}\n\n`;
    const recent = turns.slice(-6);
    if (recent.length) p += "【これまでのやりとり】\n" + recent.map((t) => (t.role === "user" ? "学習者：" : "チューター：") + t.content).join("\n\n") + "\n\n";
    p += "【質問】\n" + (q || "（ここに質問を書く）");
    return p;
  }
  async function copyText(s) {
    try { await navigator.clipboard.writeText(s); return true; } catch (e) { /* fall through */ }
    try {
      const ta = el("textarea", { style: "position:fixed;left:-9999px;top:0" }); ta.value = s; document.body.appendChild(ta);
      ta.select(); const ok = document.execCommand("copy"); ta.remove(); return ok;
    } catch (e) { return false; }
  }
  async function handoff(base) {
    const p = handoffPrompt();
    const copied = await copyText(p);
    if (!base) {
      if (copied) toast("質問文（文脈つき）をコピーしました．お好きな AI に貼り付けてお使いください");
      else { addMsg("sys", "コピーできませんでした．下の文を選択してコピーしてください．"); addMsg("sys", "<pre style='white-space:pre-wrap;font-size:12px'>" + esc(p) + "</pre>"); }
      return;
    }
    const enc = encodeURIComponent(p), fits = enc.length < 7500;
    const a = el("a", { href: base + (fits ? "?q=" + enc : ""), target: "_blank", rel: "noopener noreferrer" });
    document.body.appendChild(a); a.click(); a.remove();
    toast(fits ? "質問を入れた状態で開きました（コピーもしました）" : copied ? "長いので質問文をコピーしました．開いた画面に貼り付けて送信してください" : "開いた画面に質問を書いて送信してください");
  }
  function openAI(ctx, prefill, autoSend) {
    $("#drawer").classList.add("open");
    if (ctx !== undefined) setCtx(ctx);
    if (!chat.children.length) addMsg("sys", "定理の意味，証明の行間，演習のヒントなど，何でも質問してください．答案の添削もできます．回答には少し時間がかかります．");
    if (prefill) { $("#aiInput").value = prefill; }
    if (autoSend && prefill) send(prefill);
    else setTimeout(() => $("#aiInput").focus(), 220);
  }
  async function send(text) {
    text = (text || "").trim(); if (!text || aiBusy) return;
    $("#aiInput").value = "";
    addMsg("u", md(text)); typeset(chat.lastChild);
    if (sampleFn === undefined) { try { sampleFn = window.claude && window.claude.use ? await window.claude.use("sample") : null; } catch (e) { sampleFn = null; } }
    lastAsked = text;
    if (!sampleFn) { $("#aiInput").value = text; addMsg("sys", "このページから直接 AI を呼び出すことはできません．下の「Claude」「ChatGPT」のボタンを押すと，この質問を文脈ごと渡して開きます（「質問文をコピー」で好きな AI に貼り付けることもできます）．"); return; }
    turns.push({ role: "user", content: text });
    const intro = RULES + (aiCtx ? `\n\n以下は学習者がいま見ている箇所です．\n${aiCtx.text}` : "\n\n学習者はサイト全体（実数の連続性，極限，微分，積分，無限小解析，級数，関数列，整級数，多変数関数，極値，曲線，微分方程式，リーマン積分，重積分，ベクトル解析）を学んでいます．");
    const input = [{ role: "user", content: intro }, { role: "assistant", content: "わかりました．その方針で答えます．" }, ...turns.slice(-12)];
    const box = addMsg("a", "<span style='color:var(--muted)'>考えています…</span>");
    aiBusy = true; $("#aiSend").textContent = "停止"; aiCtl = new AbortController();
    try {
      const { text: ans, truncated } = await sampleFn(input, { cache: false, signal: aiCtl.signal, onText: ({ text: t }) => { box.innerHTML = md(t); chat.scrollTop = chat.scrollHeight; } });
      box.innerHTML = md(ans) + (truncated ? "<p style='color:var(--muted);font-size:12px'>（長いので途中で切れました．「続けて」と送ると続きを書きます）</p>" : "");
      turns.push({ role: "assistant", content: ans });
      persistChat();
      typeset(box);
    } catch (e) {
      turns.pop();
      const copy = { not_granted: "AI の利用が許可されませんでした．次にページを開いたとき，送信すると改めて確認が出ます．", rate_limited: "短時間に質問が集中しました．少し待ってから送ってください．", cancelled: "停止しました．", prompt_too_large: "会話が長くなりすぎました．「会話を消す」で新しく始めてください．", session_expired: "ログインの有効期限が切れました．ページを開き直してください．" }[e && e.code] || "回答を取得できませんでした．時間をおいてもう一度送ってください．";
      box.innerHTML = (e && e.text ? md(e.text) : "") + `<p style="color:var(--muted);font-size:12.5px">${copy}</p>`;
      if (e && e.text) typeset(box);
    } finally { aiBusy = false; $("#aiSend").textContent = "送信"; aiCtl = null; }
  }
  $("#compose").addEventListener("submit", (e) => { e.preventDefault(); if (aiBusy) { aiCtl && aiCtl.abort(); return; } send($("#aiInput").value); });
  $("#aiInput").addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); if (!aiBusy) send(e.target.value); } });
  $("#aiBtn").addEventListener("click", () => { const d = $("#drawer"); d.classList.contains("open") ? d.classList.remove("open") : openAI(); });
  $("#aiClose").addEventListener("click", () => $("#drawer").classList.remove("open"));
  $("#aiClear").addEventListener("click", () => { turns = []; chat.innerHTML = ""; persistChat(); openAI(); });
  $("#aiCopy").addEventListener("click", () => handoff(null));
  $("#aiGpt").addEventListener("click", () => handoff("https://chatgpt.com/"));
  $("#aiClaude").addEventListener("click", () => handoff("https://claude.ai/new"));
  $("#aiCtxClear").addEventListener("click", () => setCtx(null));
  renderSuggest();

  /* ---------- print / download ---------- */
  function setPrint(on) {
    document.body.classList.toggle("print", on);
    document.querySelectorAll(".pane").forEach((p) => { if (on) p.dataset.wasHidden = p.hidden ? "1" : ""; if (!p.classList.contains("attempt")) p.hidden = on ? false : p.dataset.wasHidden === "1"; });
    if (on) { window.scrollTo(0, 0); toast("証明と解答をすべて展開した"); }
  }
  $("#printExit").addEventListener("click", () => setPrint(false));
  async function downloadUnit(u) {
    const parts = [];
    u.sections.forEach((s) => {
      parts.push(`<h2>${esc(s.no)} ${esc(s.title)}</h2>`);
      s.items.forEach((it) => {
        if (it.t === "p") parts.push(it.html);
        else if (it.t === "note" || it.t === "fix") parts.push(`<div class="note"><b>${it.t === "fix" ? "注意" : esc(it.label || "補足")}</b> ${it.html}</div>`);
        else if (it.t === "fig") parts.push(`<p class="muted">［図 ${esc(it.title)}：サイト上で動かせる］</p>`);
        else if (it.t === "ex") parts.push(`<div class="box ex"><b>${esc(exLab(it))} ${esc(it.num)}</b>（${LV[it.lv || 1][0]}）${it.q}${it.hint ? `<p><i>ヒント</i>：${it.hint}</p>` : ""}<div class="sol"><b>解答</b>${it.a}</div></div>`);
        else parts.push(`<div class="box ${it.t}"><b>${esc(it.num)}</b>${it.title ? "（" + it.title + "）" : ""}${it.body}${it.idea ? `<div class="sol"><b>直観</b>${it.idea}</div>` : ""}${hasPlan(it) ? `<div class="sol"><b>核心と流れ</b>${planHTML(it, true)}</div>` : ""}${it.proof ? `<div class="sol"><b>証明</b>${it.proof} ∎</div>` : ""}${it.ex ? `<div class="sol"><b>例</b>${it.ex}</div>` : ""}${it.cx ? `<div class="sol"><b>反例・考察</b>${it.cx}</div>` : ""}</div>`);
      });
    });
    const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>実解析学 ${esc(UN(u))} ${esc(u.title)}</title>
<script>window.MathJax=${JSON.stringify({ tex: window.MathJax.config ? window.MathJax.config.tex : { inlineMath: [["$", "$"]], displayMath: [["$$", "$$"]] }, svg: { fontCache: "global" } })};<\/script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-svg.js"><\/script>
<style>body{font-family:"Hiragino Sans","Yu Gothic",sans-serif;max-width:46em;margin:2em auto;padding:0 1em;line-height:1.8;color:#111}h1,h2{font-family:"Hiragino Mincho ProN","Yu Mincho",serif}h2{border-top:2px solid #111;padding-top:.4em;margin-top:2em}.box{border:1px solid #bbb;border-left:3px solid #2a46c2;padding:.6em 1em;margin:1em 0;break-inside:avoid}.box.def{border-left-color:#1b7a63}.box.ex{border-left-color:#111}.sol{border-top:1px dashed #bbb;margin-top:.6em;padding-top:.4em}.note{border-left:3px solid #888;padding:.2em 1em;margin:1em 0}.muted{color:#777}@media print{body{margin:0}}</style></head><body>
<h1>${esc(UN(u))} ${esc(u.title)}</h1><p>${u.lead}</p>${parts.join("\n")}</body></html>`;
    try { await saveFile(`実解析学_${UN(u).replace(/\s+/g, "")}.html`, html, "text/html"); toast("保存した"); }
    catch (e) { toast(e && e.code === "cancelled" ? "保存を取り消した" : "保存できなかった"); }
  }

  /* ---------- review links: jump with a way back, hover preview ---------- */
  const BACK = [];
  let backBtn = null;
  function showBack() {
    if (!BACK.length) { if (backBtn) backBtn.hidden = true; return; }
    if (!backBtn) {
      backBtn = el("button", { class: "backbtn", type: "button" }, "↩ 元の位置に戻る");
      backBtn.addEventListener("click", () => {
        const b = BACK.pop(); if (!b) return;
        const restore = () => window.scrollTo({ top: b.y, behavior: "smooth" });
        if (location.hash !== b.hash) { location.hash = b.hash.slice(1) || ""; setTimeout(() => setTimeout(restore, 120), 0); } else restore();
        showBack();
      });
      document.body.appendChild(backBtn);
    }
    backBtn.hidden = false;
    backBtn.textContent = "↩ 元の位置に戻る" + (BACK.length > 1 ? `（${BACK.length}）` : "");
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest("a.ref[data-ref]");
    if (!a) return;
    e.preventDefault(); hidePop();
    const id = a.dataset.ref, rec = ITEMS.get(id); if (!rec) return;
    BACK.push({ hash: location.hash, y: window.scrollY }); if (BACK.length > 20) BACK.shift();
    const curUnit = location.hash.slice(1).split(".")[0];
    if (curUnit === rec.u.id && document.getElementById(id)) jump(id, true);
    else location.hash = rec.u.id + "." + id;
    showBack();
  });
  let pop = null, popT = null;
  function hidePop() { clearTimeout(popT); if (pop) { pop.remove(); pop = null; } }
  function itemPreview(it) {
    if (it.t === "ex") return `<div class="rph">${esc(exLab(it))} ${esc(it.num)}</div>${it.q}`;
    if (it.t === "thm" || it.t === "def") return `<div class="rph">${esc(it.num || "")}${it.title ? "　" + it.title : ""}</div>${it.body}`;
    return it.html || "";
  }
  document.addEventListener("mouseover", (e) => {
    const a = e.target.closest && e.target.closest("a.ref[data-ref]");
    if (!a || !window.matchMedia("(hover:hover)").matches) return;
    clearTimeout(popT);
    popT = setTimeout(() => {
      const rec = ITEMS.get(a.dataset.ref); if (!rec) return;
      hidePop();
      pop = el("div", { class: "refpop", role: "tooltip" }, itemPreview(rec.it) + `<div class="rph" style="margin-top:6px">押すとこの項目へ移動する（戻るボタンで元の位置へ）</div>`);
      document.body.appendChild(pop);
      const r = a.getBoundingClientRect(), H = window.innerHeight;
      pop.style.left = Math.max(12, Math.min(r.left, window.innerWidth - pop.offsetWidth - 12)) + "px";
      if (r.bottom + 12 + pop.offsetHeight < H) pop.style.top = r.bottom + 8 + "px"; else pop.style.top = Math.max(12, r.top - pop.offsetHeight - 8) + "px";
      typeset(pop);
      pop.addEventListener("mouseleave", hidePop);
    }, 320);
  });
  document.addEventListener("mouseout", (e) => {
    const a = e.target.closest && e.target.closest("a.ref[data-ref]");
    if (!a) return;
    const to = e.relatedTarget; if (pop && to && pop.contains(to)) return;
    clearTimeout(popT); setTimeout(() => { if (pop && !pop.matches(":hover")) hidePop(); }, 200);
  });

  /* ---------- LaTeX export ---------- */
  const TEXMACROS = String.raw`\newcommand{\R}{\mathbb{R}}
\newcommand{\N}{\mathbb{N}}
\newcommand{\Z}{\mathbb{Z}}
\newcommand{\Q}{\mathbb{Q}}
\renewcommand{\C}{\mathbb{C}}
\newcommand{\eps}{\varepsilon}
\newcommand{\dd}{\,\mathrm{d}}
\newcommand{\abs}[1]{\left|#1\right|}
\newcommand{\norm}[1]{\left\|#1\right\|}
\DeclareMathOperator{\sgn}{sgn}
\DeclareMathOperator{\grad}{grad}
\DeclareMathOperator{\rot}{rot}
\DeclareMathOperator{\Div}{div}
\DeclareMathOperator{\Arctan}{Arctan}
\DeclareMathOperator{\Arcsin}{Arcsin}
\DeclareMathOperator{\Arccos}{Arccos}
\providecommand{\coth}{\operatorname{coth}}`;
  function texPreamble(engine, title, author) {
    const cls = engine === "uplatex" ? String.raw`\documentclass[uplatex,dvipdfmx,a4paper,11pt]{jsarticle}` : String.raw`\documentclass[a4paper,11pt]{ltjsarticle}`;
    return String.raw`% ${engine === "uplatex" ? "upLaTeX + dvipdfmx" : "LuaLaTeX"} でコンパイルする．
% 生成元：${BOOK0.title} 学習ノート（${BOOK0.author || ""}『${BOOK0.title}』${BOOK0.publisher ? "，" + BOOK0.publisher : ""} 準拠）
${cls}
\usepackage{amsmath,amssymb,amsthm,bm,mathtools}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\newtheoremstyle{kstyle}{\topsep}{\topsep}{\normalfont}{}{\bfseries}{}{1em}{\thmname{#1}\thmnote{\ （#3）}}
\theoremstyle{kstyle}
\newcommand{\kitemname}{}
\newtheorem*{kitemx}{\kitemname}
\newenvironment{kitem}[1]{\renewcommand{\kitemname}{#1}\begin{kitemx}}{\end{kitemx}}
\newenvironment{kside}[1]{\par\smallskip\noindent\textbf{#1}\quad}{\par\smallskip}
\newenvironment{kstory}[1]{\par\medskip\begin{quote}\small\textsf{#1}\par}{\end{quote}\medskip}
\renewcommand{\proofname}{証明}
${TEXMACROS}
\title{${title}}
\author{${author}}
\date{}
\begin{document}
\maketitle
`;
  }
  const TEXSPECIAL = /[\\#%&_{}~^]/g;
  const texEscText = (t) => t.replace(TEXSPECIAL, (c) => ({ "\\": "\\textbackslash{}", "~": "\\textasciitilde{}", "^": "\\textasciicircum{}" }[c] || "\\" + c));
  const texMath = (m) => {
    let t = m.replace(/\\lt\b/g, "<").replace(/\\gt\b/g, ">");
    if (t.startsWith("$$")) return "\n\\[\n" + t.slice(2, -2).trim() + "\n\\]\n";
    return t;
  };
  const texText = (t) => t.split(/(\$\$[\s\S]+?\$\$|\$[^$]+?\$)/g).map((x, i) => (i % 2 ? texMath(x) : texEscText(x.replace(/\s+/g, " ")))).join("");
  function htmlToTex(html) {
    if (!html) return "";
    const d = document.createElement("div"); d.innerHTML = html;
    const walk = (n) => {
      if (n.nodeType === 3) return texText(n.nodeValue);
      if (n.nodeType !== 1) return "";
      const tag = n.tagName.toLowerCase(), kids = () => [...n.childNodes].map(walk).join("");
      switch (tag) {
        case "p": case "div": return "\n" + kids().trim() + "\n\n";
        case "b": case "strong": return "\\textbf{" + kids() + "}";
        case "i": case "em": return "\\textit{" + kids() + "}";
        case "code": return "\\texttt{" + kids() + "}";
        case "sup": return "\\textsuperscript{" + kids() + "}";
        case "sub": return "\\textsubscript{" + kids() + "}";
        case "br": return "\\\\\n";
        case "ul": return "\n\\begin{itemize}\n" + kids() + "\\end{itemize}\n";
        case "ol": return "\n\\begin{enumerate}\n" + kids() + "\\end{enumerate}\n";
        case "li": return "\\item " + kids().trim() + "\n";
        case "h3": case "h4": case "h5": return "\n\\paragraph{" + kids().trim() + "}\n";
        case "table": {
          const rows = [...n.querySelectorAll("tr")].map((tr) => [...tr.children].map((c) => walk(c).replace(/\n+/g, " ").trim()));
          const w = Math.max(1, ...rows.map((r) => r.length));
          return "\n\\begin{center}\\begin{tabular}{" + "l".repeat(w) + "}\n" + rows.map((r) => r.join(" & ") + " \\\\").join("\n") + "\n\\end{tabular}\\end{center}\n";
        }
        case "td": case "th": return kids();
        case "svg": case "button": case "input": case "textarea": case "script": case "style": return "";
        default: return kids();
      }
    };
    return walk(d).replace(/\n{3,}/g, "\n\n").trim();
  }
  const texLabel = (s) => texEscText(plain(s || ""));
  function itemTex(it, opt) {
    const o = [];
    const side = (name, html) => { if (html) o.push(`\\begin{kside}{${name}}\n${htmlToTex(html)}\n\\end{kside}`); };
    const plan = () => {
      if (!opt.plan || !hasPlan(it)) return;
      if (it.core) side(it.t === "ex" ? "解答の核心" : "証明の核心", it.core);
      if (it.flow && it.flow.length) o.push("\\begin{kside}{流れ}\n\\begin{enumerate}[label=(\\arabic*),nosep]\n" + it.flow.map((f) => "\\item " + htmlToTex(f)).join("\n") + "\n\\end{enumerate}\n\\end{kside}");
    };
    if (it.t === "p") { o.push(htmlToTex(it.html)); return o.join("\n\n"); }
    if (it.t === "story") { if (opt.story) o.push(`\\begin{kstory}{${texLabel(it.kind || "つなぎ")}}\n${htmlToTex(it.html)}\n\\end{kstory}`); return o.join("\n\n"); }
    if (it.t === "note" || it.t === "fix") { o.push(`\\begin{kside}{${it.t === "fix" ? "注意" : texLabel(it.label || "補足")}}\n${htmlToTex(it.html)}\n\\end{kside}`); return o.join("\n\n"); }
    if (it.t === "fig") { o.push(`\\begin{kside}{図}${texLabel(it.title)}（サイト上で操作できる図）${it.cap ? "\n" + htmlToTex(it.cap) : ""}\n\\end{kside}`); return o.join("\n\n"); }
    if (it.t === "ex") {
      if (!opt.ex) return "";
      o.push(`\\begin{kitem}{${texLabel(exLab(it) + " " + it.num)}}\n${htmlToTex(it.q)}\n\\end{kitem}`);
      if (it.hint && opt.plan) side("ヒント", it.hint);
      plan();
      o.push(`\\begin{proof}[解答]\n${htmlToTex(it.a)}\n\\end{proof}`);
      if (opt.idea) side("直観", it.idea);
      if (opt.dev) side("発展とつながり", it.dev);
      return o.join("\n\n");
    }
    o.push(`\\begin{kitem}{${texLabel(it.num || (it.t === "def" ? "定義" : "定理"))}}${it.title ? "[" + texLabel(it.title) + "]" : ""}\n${htmlToTex(it.body)}\n\\end{kitem}`);
    if (opt.idea) { side("直観", it.idea); side("なぜこう定義するか", it.why); side("弱点と注意", it.weak); }
    plan();
    if (it.proof) o.push(`\\begin{proof}\n${htmlToTex(it.proof)}\n\\end{proof}`);
    if (opt.example) side("例", it.ex);
    if (opt.cx) side("反例・考察", it.cx);
    if (opt.dev) side("発展", it.dev);
    return o.join("\n\n");
  }
  function unitTex(u, opt) {
    const o = [`\\section*{${texLabel(UN(u))}　${texLabel(u.title)}}\n\\addcontentsline{toc}{section}{${u.no}　${texLabel(u.title)}}`];
    if (u.lead && opt.story) o.push(htmlToTex(u.lead));
    u.sections.forEach((s) => {
      const body = s.items.map((it) => itemTex(it, opt)).filter(Boolean);
      if (!body.length) return;
      o.push(`\\subsection*{${texLabel(s.no)}　${texLabel(s.title)}}\n\\addcontentsline{toc}{subsection}{${texLabel(s.no)}　${texLabel(s.title)}}`);
      o.push(...body);
    });
    return o.join("\n\n");
  }
  function openTexDialog(scope) {
    // scope: {kind:"item", it, u} | {kind:"unit", u} | {kind:"all"}
    const ov = el("div", { class: "overlay" });
    ov.addEventListener("click", (e) => { if (e.target === ov) ov.remove(); });
    const p = el("div", { class: "panel", role: "dialog", "aria-label": "TeX に書き出す" });
    const what = scope.kind === "item" ? (scope.it.t === "ex" ? exLab(scope.it) + " " + scope.it.num : scope.it.num || "この項目") : scope.kind === "unit" ? `${UN(scope.u)}　${scope.u.title}` : "全単元";
    p.appendChild(el("h3", {}, "TeX に書き出す"));
    p.appendChild(el("p", { style: "font-size:13.5px;color:var(--muted);margin:0 0 4px" }, `対象：${esc(what)}．証明と解答はすべて展開した形で書き出す．`));
    const opts = el("div", { class: "texopts" });
    const OPT = [["idea", "直観・定義の動機・弱点", true], ["plan", "核心と流れ・ヒント", true], ["example", "例", true], ["cx", "反例・考察", true], ["dev", "発展", true], ["story", "リード文・つなぎ", true], ["ex", "問・章末問題と解答", true]];
    const opt = {}; OPT.forEach(([k, w, d]) => { opt[k] = d; const lb = el("label", {}, `<input type="checkbox"${d ? " checked" : ""}>${w}`); lb.querySelector("input").addEventListener("change", (e) => { opt[k] = e.target.checked; build(); }); opts.appendChild(lb); });
    const eng = el("select", { "aria-label": "コンパイラ" }, `<option value="lualatex">LuaLaTeX（ltjsarticle）</option><option value="uplatex">upLaTeX（jsarticle）</option>`);
    eng.addEventListener("change", build); opts.appendChild(eng);
    p.appendChild(opts);
    const ta = el("textarea", { class: "texbox", spellcheck: "false", "aria-label": "TeX ソース" });
    p.appendChild(ta);
    const acts = el("div", { class: "texopts" });
    const bCopy = el("button", { type: "button", class: "tbtn primary" }, "コピー");
    const bSave = el("button", { type: "button", class: "tbtn" }, ".tex として保存");
    const bClose = el("button", { type: "button", class: "tbtn" }, "閉じる");
    acts.append(bCopy, bSave, bClose); p.appendChild(acts);
    ov.appendChild(p); document.body.appendChild(ov);
    function build() {
      const B = BOOK0, author = "学習ノート";
      const refs = B.author ? `\n\n\\section*{参考文献}\n[1] ${texEscText(B.author)}『${texEscText(B.title)}』${texEscText(B.publisher || "")}${B.year ? "，" + B.year + " 年" : ""}．\n` : "";
      let body, title;
      if (scope.kind === "item") { title = texLabel(what); body = itemTex(scope.it, Object.assign({}, opt, { ex: true, story: true })); }
      else if (scope.kind === "unit") { title = `${texLabel(B.title)}\\\\\\large ${texLabel(UN(scope.u))}　${texLabel(scope.u.title)}`; body = unitTex(scope.u, opt); }
      else { title = texLabel(B.title) + "\\\\\\large 学習ノート"; body = "\\tableofcontents\n\\clearpage\n\n" + UNITS.filter((u) => u.book === B).map((u) => unitTex(u, opt)).join("\n\n\\clearpage\n\n"); }
      ta.value = texPreamble(eng.value, title, texEscText(author)) + "\n" + body + (scope.kind === "item" ? "" : refs) + "\n\n\\end{document}\n";
    }
    build();
    bClose.addEventListener("click", () => ov.remove());
    bCopy.addEventListener("click", async () => { try { await navigator.clipboard.writeText(ta.value); toast("コピーした"); } catch (e) { ta.select(); document.execCommand && document.execCommand("copy"); toast("選択した．コピーして使うとよい"); } });
    bSave.addEventListener("click", async () => {
      const name = scope.kind === "item" ? `実解析学_${plain(what).replace(/\s+/g, "")}.tex` : scope.kind === "unit" ? `実解析学_${UN(scope.u).replace(/\s+/g, "")}.tex` : `実解析学_全体.tex`;
      try { await saveFile(name, ta.value, "application/x-tex"); toast("保存した"); } catch (e) { toast(e && e.code === "cancelled" ? "保存を取り消した" : "保存できなかった"); }
    });
  }

  /* ---------- router ---------- */
  function route() {
    const h = decodeURIComponent(location.hash.slice(1));
    const [uid, focus] = h.split(".");
    $("#rail").classList.remove("open");
    document.body.classList.remove("print");
    const ov = $("#searchOv"); if (ov) ov.remove();
    if (uid === "quiz") { renderRail(""); if (!QZ || QZ.i >= QZ.list.length || QZ.i === 0) renderQuiz(); else quizStep(); return; }
    if (uid === "review") { renderRail(""); renderReview(); return; }
    if (uid === "memos") { renderRail(""); renderMemos(); return; }
    const u = UNITS.find((x) => x.id === uid);
    if (!u) { renderRail(""); renderHome(); window.scrollTo(0, 0); return; }
    const sameUnit = $("#view").dataset.unit === u.id;
    renderRail(u.id);
    if (sameUnit && focus) { jump(focus, true); return; }
    $("#view").dataset.unit = u.id;
    renderUnit(u, focus);
  }
  const _render = renderHome; // keep reference
  window.addEventListener("hashchange", () => { const id = decodeURIComponent(location.hash.slice(1)).split(".")[0]; if (!UNITS.some((x) => x.id === id)) $("#view").dataset.unit = ""; route(); });
  $("#brand").addEventListener("click", () => { location.hash = ""; $("#view").dataset.unit = ""; route(); });
  $("#menuBtn").addEventListener("click", () => $("#rail").classList.toggle("open"));
  $("#quizBtn").addEventListener("click", () => { QZ = null; location.hash = "quiz"; if (location.hash === "#quiz") renderQuiz(); });
  void _render;
  route();
})();
