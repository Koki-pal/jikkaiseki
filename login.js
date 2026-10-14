/* Accounts (external version) — each visitor creates an account with a name and a self-chosen passcode.
 * Records (progress, memos, AI conversation) are encrypted with a key made from the name and passcode (AES-GCM)
 * and kept in this browser (localStorage). To continue on another device, write the record to a file
 * ("記録をファイルに書き出す") and read it in on the other device ("記録ファイルを読み込む").
 * This is a static page: there is no server, so nothing leaves the visitor's browser unless they export it.
 */
(function () {
  "use strict";
  const P = "jikkaiseki-";
  const K_SESSION = P + "session", K_LASTNAME = P + "lastname", K_ACCT = P + "acct:";

  const LS = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } }
  };
  const te = new TextEncoder(), td = new TextDecoder();
  const hex = (buf) => Array.from(new Uint8Array(buf), (x) => x.toString(16).padStart(2, "0")).join("");
  const b64 = (buf) => { let s = ""; new Uint8Array(buf).forEach((c) => { s += String.fromCharCode(c); }); return btoa(s); };
  const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const sha = async (s) => hex(await crypto.subtle.digest("SHA-256", te.encode(s)));
  const normName = (n) => String(n || "").normalize("NFKC").trim().replace(/\s+/g, " ");
  const hasCrypto = !!(window.crypto && crypto.subtle);

  async function deriveKey(name, pass) {
    const base = await crypto.subtle.importKey("raw", te.encode(pass), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey({ name: "PBKDF2", salt: te.encode(P + "salt:" + name.toLowerCase()), iterations: 150000, hash: "SHA-256" },
      base, { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
  }
  const accountId = (name, pass) => sha(P + "id:" + name.toLowerCase() + "\n" + pass);
  async function seal(key, obj) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, te.encode(JSON.stringify(obj)));
    return { iv: b64(iv), ct: b64(ct), v: 1, updated: Date.now() };
  }
  async function open(key, box) {
    const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(box.iv) }, key, unb64(box.ct));
    return JSON.parse(td.decode(pt));
  }
  const loadBox = (id) => { try { const raw = LS.get(K_ACCT + id); return raw ? JSON.parse(raw) : null; } catch (e) { return null; } };

  /* a file the visitor saves; ordinary download (this version is hosted outside claude.ai) */
  function saveFile(filename, text) {
    const blob = new Blob([text], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  /* read an exported record file and store it in this browser; returns the number of accounts read */
  function importFile(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => {
        try {
          const d = JSON.parse(r.result);
          if (!d || d.app !== "jikkaiseki-notes" || !d.id || !d.box || !d.box.ct) throw new Error("format");
          const cur = loadBox(d.id);
          if (!cur || (d.box.updated || 0) >= (cur.updated || 0)) LS.set(K_ACCT + d.id, JSON.stringify(d.box));
          resolve(d.name || "");
        } catch (e) { reject(e); }
      };
      r.onerror = () => reject(r.error);
      r.readAsText(file);
    });
  }

  /* ---------- UI ---------- */
  const css = `
body.locked .top,body.locked .frame,body.locked .drawer,body.locked .printbar{visibility:hidden}
.gate{position:fixed;inset:0;z-index:100;background:var(--paper,#eef1f0);display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:max(48px,env(safe-area-inset-top,0px)) 16px 32px}
.gate .card{width:min(440px,100%);background:var(--sheet,#fff);border:1px solid var(--rule,#d5dcdc);border-radius:10px;padding:22px 22px 18px;box-shadow:var(--shadow,none)}
.gate h1{font-family:var(--f-disp,serif);font-weight:800;font-size:26px;margin:0 0 2px;letter-spacing:.04em}
.gate .sub{font-family:var(--f-ui,sans-serif);font-size:12px;color:var(--muted,#5a6670);margin:0 0 18px;letter-spacing:.06em}
.gate h2{font-family:var(--f-disp,serif);font-size:17px;margin:0 0 10px}
.gate label{display:block;font-size:13px;color:var(--muted,#5a6670);margin:10px 0 4px}
.gate input[type=text],.gate input[type=password]{width:100%;border:1px solid var(--rule,#d5dcdc);background:var(--paper,#eef1f0);color:var(--ink,#17202a);border-radius:6px;padding:8px 10px;font:inherit;font-size:15px}
.gate .row{display:flex;gap:8px;align-items:center;margin-top:16px;flex-wrap:wrap}
.gate .row .sp{flex:1}
.gate .chk{display:flex;gap:6px;align-items:center;font-size:13px;color:var(--ink,#17202a);margin-top:12px}
.gate .err{color:var(--warn,#c0392b);font-size:13px;min-height:1.4em;margin:8px 0 0}
.gate .ok{color:var(--lv1,#2f8a57)}
.gate .hint{font-size:12.5px;color:var(--muted,#5a6670);line-height:1.7;margin:14px 0 0;border-top:1px dashed var(--rule,#d5dcdc);padding-top:10px}
.gate .seg{display:flex;border:1px solid var(--rule,#d5dcdc);border-radius:7px;overflow:hidden;margin-bottom:6px}
.gate .seg button{flex:1;border:0;background:none;padding:7px 0;font-size:14px;cursor:pointer;color:var(--muted,#5a6670)}
.gate .seg button[aria-pressed=true]{background:var(--accent,#2a46c2);color:var(--sheet,#fff)}
.gate .linkbtn{background:none;border:0;padding:0;color:var(--accent,#2a46c2);text-decoration:underline;cursor:pointer;font-size:13px}
.acct-btn{max-width:11em;overflow:hidden;text-overflow:ellipsis}
`;
  document.head.appendChild(Object.assign(document.createElement("style"), { textContent: css }));
  document.body.classList.add("locked");

  const gate = document.createElement("div");
  gate.className = "gate";
  gate.setAttribute("role", "dialog");
  gate.setAttribute("aria-modal", "true");
  document.body.appendChild(gate);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const head = `<h1>実解析学</h1><p class="sub">学習ノート</p>`;

  let resolveReady;
  const ready = new Promise((r) => { resolveReady = r; });

  function showAccount(mode, msg, okMsg) {
    gate.hidden = false;
    const reg = mode === "register";
    gate.innerHTML = `<form class="card" id="gAcct">${head}
      <div class="seg"><button type="button" data-m="login" aria-pressed="${!reg}">ログイン</button><button type="button" data-m="register" aria-pressed="${reg}">新しく作る</button></div>
      <label for="gName">名前（ニックネーム可）</label>
      <input type="text" id="gName" autocomplete="username" maxlength="40" required value="${esc(LS.get(K_LASTNAME) || "")}">
      <label for="gPass">${reg ? "自分で決めるパスコード（4 文字以上）" : "自分のパスコード"}</label>
      <input type="password" id="gPass" autocomplete="${reg ? "new-password" : "current-password"}" minlength="4" required>
      ${reg ? `<label for="gPass2">パスコード（確認）</label><input type="password" id="gPass2" autocomplete="new-password" required>` : ""}
      <label class="chk"><input type="checkbox" id="gKeep" checked> この端末ではログインしたままにする</label>
      <p class="err${okMsg ? " ok" : ""}" id="gErr">${esc(okMsg || msg || "")}</p>
      <div class="row"><span class="sp"></span><button class="tbtn primary" type="submit" id="gGo">${reg ? "作成して入る" : "ログイン"}</button></div>
      <p class="hint">${reg
        ? "名前とパスコードの組がその人のアカウントになります．学習記録・メモ・AI との会話がアカウントごとに，このブラウザに保存されます．パスコードを忘れると記録は取り出せないので控えておいてください．"
        : "はじめての人は「新しく作る」から．記録はこのブラウザに保存されます．"}
        別の端末で使っていた記録は，その端末で「記録をファイルに書き出す」を行い，ここで
        <button type="button" class="linkbtn" id="gImp">記録ファイルを読み込む</button>と続きから使えます．
        <input type="file" id="gFile" accept=".json,application/json" hidden></p></form>`;
    gate.querySelectorAll(".seg button").forEach((b) => b.addEventListener("click", () => showAccount(b.dataset.m)));
    const nameI = gate.querySelector("#gName"), passI = gate.querySelector("#gPass"), err = gate.querySelector("#gErr"), go = gate.querySelector("#gGo");
    const fileI = gate.querySelector("#gFile");
    gate.querySelector("#gImp").addEventListener("click", () => fileI.click());
    fileI.addEventListener("change", async () => {
      const f = fileI.files && fileI.files[0]; if (!f) return;
      try { const n = await importFile(f); if (n) LS.set(K_LASTNAME, n); showAccount("login", "", "記録を読み込みました．名前とパスコードでログインしてください．"); }
      catch (e) { err.classList.remove("ok"); err.textContent = "記録ファイルを読み込めませんでした．このサイトで書き出したファイルか確かめてください．"; }
    });
    setTimeout(() => (nameI.value ? passI : nameI).focus(), 50);
    gate.querySelector("#gAcct").addEventListener("submit", async (e) => {
      e.preventDefault();
      err.classList.remove("ok");
      if (!hasCrypto) { err.textContent = "このブラウザでは暗号化が使えないため，アカウントを作れません（https で開いているか確かめてください）．"; return; }
      const name = normName(nameI.value), pass = passI.value;
      if (!name) { err.textContent = "名前を入れてください．"; return; }
      if (pass.length < 4) { err.textContent = "パスコードは 4 文字以上にしてください．"; return; }
      if (reg && pass !== gate.querySelector("#gPass2").value) { err.textContent = "確認用のパスコードが一致しません．"; return; }
      go.disabled = true; err.textContent = ""; go.textContent = "確認中…";
      try {
        const [id, key] = await Promise.all([accountId(name, pass), deriveKey(name, pass)]);
        const box = loadBox(id);
        let data;
        if (box) {
          try { data = await open(key, box); } catch (x) { data = null; }
          if (!data) { err.textContent = "記録を開けませんでした．"; return; }
        } else if (!reg) {
          err.textContent = "名前かパスコードが違います（はじめてなら「新しく作る」，別の端末の記録なら「記録ファイルを読み込む」）．"; return;
        } else {
          data = { name, created: Date.now(), isNew: true };
        }
        LS.set(K_LASTNAME, name);
        if (gate.querySelector("#gKeep").checked) {
          const raw = await crypto.subtle.exportKey("raw", key);
          LS.set(K_SESSION, JSON.stringify({ name, id, k: b64(raw) }));
        } else LS.del(K_SESSION);
        enter(name, id, key, data);
      } catch (x) {
        console.error(x); err.textContent = "ログインに失敗しました．ページを開き直してみてください．";
      } finally { go.disabled = false; go.textContent = reg ? "作成して入る" : "ログイン"; }
    });
  }

  /* ---------- the account object handed to app.js ---------- */
  let saveTimer = null;
  function enter(name, id, key, data) {
    const isNew = !!data.isNew; delete data.isNew;
    const acct = {
      name, data, isNew,
      get mode() { return "local"; },
      save() {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(async () => {
          try { LS.set(K_ACCT + id, JSON.stringify(await seal(key, acct.data))); } catch (e) { console.warn("account save", e); }
        }, 600);
      },
      async exportFile() {
        clearTimeout(saveTimer);
        const box = await seal(key, acct.data);
        LS.set(K_ACCT + id, JSON.stringify(box));
        const d = new Date(), ds = d.getFullYear() + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0");
        saveFile(`実解析学_学習記録_${name.replace(/[\\/:*?"<>|\s]+/g, "_")}_${ds}.json`, JSON.stringify({ app: "jikkaiseki-notes", v: 1, name, id, box }));
      },
      logout() { LS.del(K_SESSION); location.reload(); }
    };
    gate.hidden = true; gate.innerHTML = "";
    document.body.classList.remove("locked");
    mountAccountButton(acct);
    if (isNew) acct.save();
    resolveReady(acct);
  }

  function mountAccountButton(acct) {
    const top = document.querySelector(".top");
    if (!top || document.getElementById("acctBtn")) return;
    const b = document.createElement("button");
    b.type = "button"; b.className = "tbtn acct-btn"; b.id = "acctBtn";
    b.textContent = acct.name; b.title = acct.name + " としてログイン中";
    b.addEventListener("click", () => showAccountPanel(acct));
    top.appendChild(b);
  }
  function showAccountPanel(acct) {
    gate.hidden = false;
    gate.innerHTML = `<div class="card">${head}
      <h2>${esc(acct.name)} としてログイン中</h2>
      <p style="font-size:13.5px;line-height:1.8;margin:0">学習記録・メモ・AI との会話は，暗号化してこのブラウザに保存しています．別の端末やブラウザで続けるとき，またはバックアップしたいときは，記録をファイルに書き出してください．書き出したファイルは名前とパスコードがないと開けません．</p>
      <div class="row"><button class="tbtn" type="button" id="gExp">記録をファイルに書き出す</button></div>
      <p class="hint">ブラウザの履歴やサイトデータを消すと，このブラウザの記録も消えます．ときどき書き出しておくと安心です．</p>
      <div class="row"><button class="tbtn warn" type="button" id="gOut">ログアウト</button><span class="sp"></span><button class="tbtn primary" type="button" id="gBack">戻る</button></div></div>`;
    gate.querySelector("#gExp").addEventListener("click", async () => { try { await acct.exportFile(); gate.querySelector("#gExp").textContent = "書き出しました"; } catch (e) { console.warn(e); } });
    gate.querySelector("#gOut").addEventListener("click", () => acct.logout());
    gate.querySelector("#gBack").addEventListener("click", () => { gate.hidden = true; gate.innerHTML = ""; });
  }

  /* ---------- start ---------- */
  (async () => {
    const raw = LS.get(K_SESSION);
    if (raw && hasCrypto) {
      try {
        const s = JSON.parse(raw);
        const key = await crypto.subtle.importKey("raw", unb64(s.k), { name: "AES-GCM" }, true, ["encrypt", "decrypt"]);
        const box = loadBox(s.id);
        if (box) { enter(s.name, s.id, key, await open(key, box)); return; }
      } catch (e) { console.warn("session restore", e); }
      LS.del(K_SESSION);
    }
    showAccount(LS.get(K_LASTNAME) ? "login" : "register");
  })();

  window.ACCOUNT = { ready };
})();
