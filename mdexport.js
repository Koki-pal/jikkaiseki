/* 実解析学 学習ノート — plain-text (Markdown + LaTeX) export of the notes.
   Used by the page (copy / save / hand to Claude or ChatGPT) and by build-ai.js (pre-generated ai/*.md). */
(function (root) {
  "use strict";
  const ENT = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&nbsp;": " " };
  let LABEL = {};
  function setLabels(units) {
    LABEL = {};
    (units || []).forEach((u) => u.sections.forEach((s) => s.items.forEach((it) => {
      if (!it.id) return;
      const n = String(it.num || "").replace(/[（(].*$/, "").trim();
      const lab = it.t === "ex" ? ((it.lab || "演習") + " " + n) : (n || it.title || "");
      LABEL[it.id] = (u.book && u.book.label ? u.book.label + " 第" + (u.chapter || u.no) + "章 " : "") + String(lab).replace(/<[^>]+>/g, "");
    })));
  }
  function htmlToMd(html) {
    if (!html) return "";
    let s = String(html);
    s = s.replace(/\[\[([A-Za-z0-9_\-]+)\|([^\]]*)\]\]/g, "$2").replace(/\[\[([A-Za-z0-9_\-]+)\]\]/g, (m, id) => (LABEL[id] ? "［" + LABEL[id] + "］" : ""));
    s = s.replace(/\\lt\b/g, "<").replace(/\\gt\b/g, ">");
    s = s.replace(/<br\s*\/?>/gi, "\n");
    s = s.replace(/<li[^>]*>/gi, "\n- ").replace(/<\/li>/gi, "");
    s = s.replace(/<\/(p|div|ol|ul|h[1-6])>/gi, "\n\n").replace(/<(p|div|ol|ul|h[1-6])[^>]*>/gi, "\n");
    s = s.replace(/<(b|strong)>/gi, "**").replace(/<\/(b|strong)>/gi, "**");
    s = s.replace(/<[^>]+>/g, "");
    s = s.replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (m) => ENT[m] || m);
    s = s.replace(/\$\$([\s\S]+?)\$\$/g, (m, x) => "\n\n$$" + x.trim() + "$$\n\n");
    s = s.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n");
    return s.trim();
  }
  const LV = { 1: "基本", 2: "標準", 3: "発展" };
  function itemMd(it, withAnswers) {
    const o = [];
    if (it.t === "p") return htmlToMd(it.html);
    if (it.t === "br" || it.t === "story") return "> **" + (it.title || it.kind || "つなぎ") + "**\n>\n" + htmlToMd(it.html).split("\n").map((l) => "> " + l).join("\n");
    if (it.t === "note" || it.t === "fix") return "**［" + (it.t === "fix" ? "注意" : it.label || "補足") + "］** " + htmlToMd(it.html);
    if (it.t === "fig") return "［図：" + (it.title || "") + "（サイト上で動かせる図）］ " + htmlToMd(it.cap);
    if (it.t === "ex") {
      o.push("#### " + (it.lab || "演習") + " " + (it.num || "") + "（" + (LV[it.lv || 1]) + "）");
      o.push(htmlToMd(it.q));
      if (it.hint) o.push("*ヒント*：" + htmlToMd(it.hint));
      if (withAnswers) {
        if (it.core) o.push("*解答の核心*：" + htmlToMd(it.core));
        o.push("**解答**\n\n" + htmlToMd(it.a));
        if (it.idea) o.push("*直観*：" + htmlToMd(it.idea));
        if (it.dev) o.push("*発展*：" + htmlToMd(it.dev));
      }
      return o.join("\n\n");
    }
    o.push("#### " + (it.num || (it.t === "def" ? "定義" : "定理")) + (it.title ? "（" + it.title + "）" : ""));
    o.push(htmlToMd(it.body));
    if (it.idea) o.push("*直観*：" + htmlToMd(it.idea));
    if (it.why) o.push("*定義の動機*：" + htmlToMd(it.why));
    if (it.weak) o.push("*注意・弱点*：" + htmlToMd(it.weak));
    if (it.core) o.push("*証明の核心*：" + htmlToMd(it.core));
    if (Array.isArray(it.flow) && it.flow.length) o.push("*証明の流れ*：\n" + it.flow.map((f, i) => (i + 1) + ". " + htmlToMd(f)).join("\n"));
    if (it.proof) o.push("**証明**\n\n" + htmlToMd(it.proof));
    if (it.ex) o.push("*例*：" + htmlToMd(it.ex));
    if (it.cx) o.push("*反例・考察*：" + htmlToMd(it.cx));
    if (it.dev) o.push("*発展*：" + htmlToMd(it.dev));
    return o.join("\n\n");
  }
  function unitName(u) {
    const b = u.book || {};
    return (b.label || b.title || "") + " 第" + (u.chapter || u.no) + "章 " + u.title;
  }
  function unitMd(u, withAnswers) {
    const o = ["## " + unitName(u), htmlToMd(u.lead)];
    u.sections.forEach((s) => {
      o.push("### " + (s.no || "") + " " + (s.title || ""));
      s.items.forEach((it) => { const t = itemMd(it, withAnswers !== false); if (t) o.push(t); });
    });
    return o.join("\n\n");
  }
  function header(scope) {
    return [
      "# 実解析学 学習ノート" + (scope ? "：" + scope : ""),
      "",
      "大学の講義「実解析学1（測度論とルベーグ積分）」「実解析学2（2 次元の測度とフビニの定理，微分と積分の関係，符号付き測度，ルベーグ空間）」の講義資料に沿った学習ノートである．",
      "数式は LaTeX（$...$，$$...$$）で書いてある．マクロ：\\R=\\mathbb{R}，\\Q=\\mathbb{Q}，\\N=\\mathbb{N}，\\Z=\\mathbb{Z}，\\eps=\\varepsilon，\\bm{x}=太字．$m^*$ は外測度，$m_*$ は内測度，$m$ はルベーグ測度．",
      "定理・命題の番号は各章ごとの講義資料の番号である（章が違えば同じ番号の別の定理がある）．［ ］内は参照先．"
    ].join("\n");
  }
  function siteMd(units, withAnswers) {
    setLabels(units);
    return header("全体") + "\n\n" + units.map((u) => unitMd(u, withAnswers)).join("\n\n---\n\n") + "\n";
  }
  function oneUnitMd(u, withAnswers, allUnits) {
    setLabels(allUnits || [u]);
    return header(unitName(u)) + "\n\n" + unitMd(u, withAnswers) + "\n";
  }
  const API = { htmlToMd, itemMd, unitMd, unitName, siteMd, oneUnitMd };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  root.MDEXPORT = API;
})(typeof window !== "undefined" ? window : globalThis);
