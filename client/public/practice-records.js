/*
 * 羅桂祥中學中文科：免登入本機學習紀錄
 * 所有資料只保存在目前瀏覽器的 localStorage；不會向伺服器傳送資料。
 */
(() => {
  const STORAGE_KEY = "kslo-classical-chinese-practice-records-v1";
  const MAX_RECORDS = 120;

  function readRecords() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(saved) ? saved.filter(record => record && typeof record.practiceId === "string") : [];
    } catch {
      return [];
    }
  }

  function writeRecords(records) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(0, MAX_RECORDS)));
      return true;
    } catch {
      return false;
    }
  }

  function practiceId() {
    return (location.pathname.split("/").pop() || "practice").replace(/-interactive\.html$/i, "");
  }

  function practiceTitle() {
    return document.querySelector(".head h1")?.textContent?.trim() || document.querySelector("h1")?.textContent?.trim() || document.title;
  }

  function formatDate(value) {
    try {
      return new Date(value).toLocaleString("zh-HK", { dateStyle: "medium", timeStyle: "short" });
    } catch {
      return "日期未能顯示";
    }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
  }

  function downloadCsv(records) {
    const header = ["篇章", "完成日期", "首次答對", "題目總數", "總嘗試次數", "篇章版本"];
    const quote = value => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const rows = records.map(record => [record.practiceTitle, formatDate(record.completedAt), record.firstTryCorrect, record.questionCount, record.totalAttempts, record.contentVersion]);
    const blob = new Blob(["\ufeff" + [header, ...rows].map(row => row.map(quote).join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = "中文科文言字詞本機答題紀錄.csv";
    link.click();
    URL.revokeObjectURL(href);
  }

  function addHubStyles() {
    if (document.getElementById("local-record-styles")) return;
    const style = document.createElement("style");
    style.id = "local-record-styles";
    style.textContent = `
      .local-records{margin:0 0 24px;padding:clamp(25px,5vw,38px);border:1px solid rgba(143,125,95,.3);border-left:7px solid #004936;background:rgba(255,253,247,.96);box-shadow:0 16px 40px rgba(31,38,37,.1)}
      .local-record-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px}.local-record-head h2{margin:0;color:#004936;font-family:"BiauKai","DFKai-SB","PMingLiU",serif;font-size:1.5rem;letter-spacing:.11em}.local-record-head p{max-width:620px;margin:9px 0 0;color:#4f5a55;line-height:1.75}.local-record-actions{display:flex;flex-wrap:wrap;gap:8px}.local-record-button{padding:8px 10px;border:1px solid #00493666;border-radius:3px;color:#004936;background:#fffdf7;cursor:pointer}.local-record-button:hover{background:#e9f4ef}.local-record-button.danger{border-color:#a9423566;color:#8b3228}.local-record-button.danger:hover{background:#fbefec}.local-record-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:20px 0 14px}.local-record-stat{padding:13px 15px;border-left:3px solid #f5d66a;background:#f6f1e6}.local-record-stat strong{display:block;color:#004936;font:1.5rem Georgia,serif}.local-record-stat span{display:block;margin-top:2px;color:#68716c;font-size:.82rem}.local-record-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.local-record-card{padding:14px 16px;border:1px solid #d8cfbe;background:#fffdf9}.local-record-card h3{margin:0;color:#004936;font-family:"BiauKai","DFKai-SB","PMingLiU",serif;font-size:1.08rem;letter-spacing:.05em}.local-record-card p{margin:7px 0 0;color:#4f5a55;font-size:.88rem;line-height:1.65}.local-record-empty{margin:18px 0 0;padding:16px;border-left:3px solid #f5d66a;background:#f6f1e6;color:#4f5a55;line-height:1.7}@media(max-width:700px){.local-record-head{display:block}.local-record-actions{margin-top:14px}.local-record-summary,.local-record-list{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function renderHub() {
    const main = document.querySelector("main");
    const panel = document.querySelector("main .panel");
    if (!main || !panel || document.getElementById("local-records")) return;
    addHubStyles();

    const records = readRecords().sort((left, right) => new Date(right.completedAt) - new Date(left.completedAt));
    const grouped = new Map();
    records.forEach(record => {
      const current = grouped.get(record.practiceId) || { title: record.practiceTitle, attempts: 0, best: 0, total: record.questionCount, latest: record.completedAt };
      current.attempts += 1;
      current.best = Math.max(current.best, record.firstTryCorrect);
      if (new Date(record.completedAt) > new Date(current.latest)) current.latest = record.completedAt;
      grouped.set(record.practiceId, current);
    });
    const passages = [...grouped.values()].sort((left, right) => new Date(right.latest) - new Date(left.latest));
    const bestRecord = records.reduce((best, record) => !best || record.firstTryCorrect / record.questionCount > best.firstTryCorrect / best.questionCount ? record : best, null);

    const section = document.createElement("section");
    section.id = "local-records";
    section.className = "local-records";
    section.innerHTML = `
      <div class="local-record-head"><div><h2>我的答題紀錄</h2><p>紀錄只保存在這部裝置的瀏覽器內，不需要登入，也不會傳送姓名、電郵、學號或作答資料。更換裝置或清除瀏覽器網站資料前，可先下載備份。</p></div><div class="local-record-actions">${records.length ? '<button type="button" class="local-record-button" id="download-local-records">下載備份</button><button type="button" class="local-record-button danger" id="clear-local-records">清除本機紀錄</button>' : ""}</div></div>
      ${records.length ? `<div class="local-record-summary"><div class="local-record-stat"><strong>${records.length}</strong><span>完成紀錄</span></div><div class="local-record-stat"><strong>${passages.length}</strong><span>已練習篇章</span></div><div class="local-record-stat"><strong>${bestRecord.firstTryCorrect} / ${bestRecord.questionCount}</strong><span>最佳首次答對</span></div></div><div class="local-record-list">${passages.map(record => `<article class="local-record-card"><h3>${escapeHtml(record.title)}</h3><p>完成 ${record.attempts} 次　｜　最佳首次答對 ${record.best} / ${record.total}</p><p>最近完成：${escapeHtml(formatDate(record.latest))}</p></article>`).join("")}</div>` : '<p class="local-record-empty">尚未有完成紀錄。完成任何一篇練習後，首次答對分數、總嘗試次數與完成日期會自動保存在這裏。</p>'}
    `;
    main.insertBefore(section, panel);

    document.getElementById("download-local-records")?.addEventListener("click", () => downloadCsv(records));
    document.getElementById("clear-local-records")?.addEventListener("click", () => {
      if (!confirm("確定清除這部裝置上的所有答題紀錄嗎？此操作不能復原。")) return;
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
      renderHubAfterClear(section);
    });
  }

  function renderHubAfterClear(section) {
    section.remove();
    renderHub();
  }

  function getPracticeRuntime() {
    try {
      if (typeof terms === "undefined" || !Array.isArray(terms)) return null;
      if (typeof done !== "undefined" && typeof first !== "undefined" && typeof tries !== "undefined" && done instanceof Set && first instanceof Set && tries instanceof Map) {
        return { terms, done, first, tries };
      }
      if (typeof completed !== "undefined" && typeof firstTryCorrect !== "undefined" && typeof attemptsByTerm !== "undefined" && completed instanceof Set && firstTryCorrect instanceof Set && attemptsByTerm instanceof Map) {
        return { terms, done: completed, first: firstTryCorrect, tries: attemptsByTerm };
      }
      if (typeof completed !== "undefined" && typeof firstTry !== "undefined" && typeof attempts !== "undefined" && completed instanceof Set && firstTry instanceof Set && attempts instanceof Map) {
        return { terms, done: completed, first: firstTry, tries: attempts };
      }
      return null;
    } catch {
      return null;
    }
  }

  function showPracticeNotice(message) {
    const summary = document.getElementById("summary");
    if (!summary) return;
    let note = document.getElementById("local-record-notice");
    if (!note) {
      note = document.createElement("p");
      note.id = "local-record-notice";
      note.style.cssText = "margin:12px 0 0;color:#375247;font-size:.92rem;line-height:1.65";
      summary.appendChild(note);
    }
    note.textContent = message;
  }

  function initPracticePage() {
    const initial = getPracticeRuntime();
    const summary = document.getElementById("summary") || document.getElementById("unlock-panel");
    const reset = document.getElementById("reset") || document.getElementById("reset-btn");
    if (!initial || !summary || !reset) return;

    let epoch = 0;
    let recordedEpoch = -1;
    const storeCompletion = () => {
      const runtime = getPracticeRuntime();
      if (!runtime || runtime.done.size !== runtime.terms.length || recordedEpoch === epoch) return;
      const totalAttempts = [...runtime.tries.values()].reduce((sum, count) => sum + count, 0);
      const records = readRecords();
      records.unshift({
        id: `${practiceId()}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        practiceId: practiceId(),
        practiceTitle: practiceTitle(),
        questionCount: runtime.terms.length,
        firstTryCorrect: runtime.first.size,
        totalAttempts,
        completedAt: new Date().toISOString(),
        contentVersion: "offline-local-v1",
      });
      recordedEpoch = epoch;
      showPracticeNotice(writeRecords(records) ? "本次成績已儲存在這部裝置；可於「返回目錄」查看或下載本機答題紀錄。" : "此瀏覽器目前不允許保存本機答題紀錄；練習成績仍可在本頁查看。");
    };

    new MutationObserver(() => {
      if (!summary.hidden) storeCompletion();
    }).observe(summary, { attributes: true, attributeFilter: ["hidden"] });

    let completedBeforeReset = false;
    reset.addEventListener("click", () => {
      const runtime = getPracticeRuntime();
      completedBeforeReset = Boolean(runtime && runtime.done.size === runtime.terms.length);
    }, true);
    reset.addEventListener("click", () => {
      window.setTimeout(() => {
        const runtime = getPracticeRuntime();
        if (completedBeforeReset && runtime?.done.size === 0) {
          epoch += 1;
          recordedEpoch = -1;
          summary.hidden = true;
          document.getElementById("local-record-notice")?.remove();
        }
      }, 0);
    });
  }

  if (/practice-hub\.html$/i.test(location.pathname) || /\/classical-chinese-word-practice\/$/i.test(location.pathname)) {
    renderHub();
  } else {
    initPracticePage();
  }
})();
