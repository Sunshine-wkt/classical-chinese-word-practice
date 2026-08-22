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

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
  }

  function addHubControlStyles() {
    if (document.getElementById("card-progress-styles")) return;
    const style = document.createElement("style");
    style.id = "card-progress-styles";
    style.textContent = `
      .lesson-card .card-progress{display:grid;gap:4px;width:100%;margin:13px 0 8px;padding:9px 11px;border-left:2px solid rgba(0,73,54,.42);background:rgba(246,241,230,.72);color:#4f5a55;font-size:.78rem;line-height:1.5}.lesson-card .card-progress strong{color:#004936;font-size:.84rem;letter-spacing:.02em}.lesson-card .card-progress.is-empty{border-left-color:rgba(143,125,95,.45);color:#7b827d;background:rgba(246,241,230,.48)}
      .clear-record-control{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:0 0 24px;padding:15px 18px;border:1px solid rgba(143,125,95,.3);border-left:5px solid rgba(0,73,54,.62);background:rgba(255,253,247,.9);box-shadow:0 8px 20px rgba(31,38,37,.06)}.clear-record-copy{margin:0;color:#53605a;font-size:.88rem;line-height:1.6}.clear-record-button{flex:0 0 auto;min-height:40px;padding:9px 13px;border:1px solid rgba(169,66,53,.5);border-radius:0;color:#8b382e;background:#fffdf7;font:inherit;font-size:.88rem;font-weight:700;cursor:pointer;transition:transform .16s cubic-bezier(.23,1,.32,1),background .16s cubic-bezier(.23,1,.32,1),color .16s cubic-bezier(.23,1,.32,1)}.clear-record-button:hover{color:#fff9ea;background:#a94235}.clear-record-button:active{transform:scale(.97)}.clear-record-status{margin:8px 0 0;color:#59645f;font-size:.82rem;line-height:1.5}@media(max-width:700px){.clear-record-control{align-items:flex-start;flex-direction:column;gap:10px;padding:15px 16px}.clear-record-button{width:100%}}
    `;
    document.head.appendChild(style);
  }

  function formatShortDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "日期未能顯示";
    return date.toLocaleDateString("zh-HK", { year: "numeric", month: "short", day: "numeric" });
  }

  function renderCardProgress(grouped) {
    document.querySelectorAll(".lesson-card[href]").forEach(card => {
      const href = card.getAttribute("href") || "";
      const cardPracticeId = href.split("/").pop()?.replace(/-interactive\.html(?:\?.*)?$/i, "") || "";
      const record = grouped.get(cardPracticeId);
      let progress = card.querySelector(".card-progress");
      if (!progress) {
        progress = document.createElement("div");
        progress.className = "card-progress";
        const meta = card.querySelector(".card-meta");
        if (meta) meta.before(progress); else card.appendChild(progress);
      }

      if (!record) {
        progress.className = "card-progress is-empty";
        progress.textContent = "尚未完成此篇練習";
        return;
      }

      progress.className = "card-progress";
      progress.innerHTML = `<span>最近完成：${escapeHtml(formatShortDate(record.latest))}</span><strong>最佳首次答對：${record.best} / ${record.total}</strong>`;
    });
  }

  function addClearRecordControl() {
    const intro = document.querySelector(".platform-intro");
    if (!intro || document.getElementById("clear-all-records")) return;
    const control = document.createElement("section");
    control.id = "clear-all-records";
    control.className = "clear-record-control";
    control.setAttribute("aria-label", "本機答題紀錄設定");
    control.innerHTML = `<div><p class="clear-record-copy">不想保留這部裝置的練習紀錄？可清除所有本機紀錄，題目內容不受影響。</p><p class="clear-record-status" aria-live="polite"></p></div><button class="clear-record-button" type="button">清除所有記錄</button>`;
    intro.insertAdjacentElement("afterend", control);
    const button = control.querySelector("button");
    const status = control.querySelector(".clear-record-status");
    button.addEventListener("click", () => {
      if (!readRecords().length) {
        status.textContent = "目前沒有可清除的本機記錄。";
        return;
      }
      const approved = window.confirm("確定清除這部裝置內所有篇章的答題紀錄嗎？此操作無法復原，題目內容不會受影響。");
      if (!approved) {
        status.textContent = "已保留本機答題紀錄。";
        return;
      }
      try {
        localStorage.removeItem(STORAGE_KEY);
        renderHub();
        status.textContent = "已清除這部裝置的所有本機答題紀錄。";
      } catch {
        status.textContent = "目前無法清除本機答題紀錄，請在瀏覽器設定中清除本網站資料。";
      }
    });
  }

  function renderHub() {
    if (!document.querySelector(".lesson-card")) return;
    addHubControlStyles();
    addClearRecordControl();
    const grouped = new Map();
    readRecords().forEach(record => {
      const current = grouped.get(record.practiceId) || { best: 0, total: record.questionCount, latest: record.completedAt };
      current.best = Math.max(current.best, record.firstTryCorrect);
      current.total = record.questionCount;
      if (new Date(record.completedAt) > new Date(current.latest)) current.latest = record.completedAt;
      grouped.set(record.practiceId, current);
    });
    renderCardProgress(grouped);
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
      showPracticeNotice(writeRecords(records) ? "本次成績已儲存在這部裝置；返回目錄可在相應篇章卡查看本機進度。" : "此瀏覽器目前不允許保存本機答題紀錄；練習成績仍可在本頁查看。");
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
