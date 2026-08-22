import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const publicDir = path.join(projectRoot, "client", "public");
const script = fs.readFileSync(path.join(publicDir, "practice-records-v2.js"), "utf8");
const scriptTag = '<script src="practice-records-v2.js" defer></script>';
const pages = fs.readdirSync(publicDir).filter(file => file.endsWith("-interactive.html"));

assert.equal(pages.length, 12, "必須保留十二篇互動頁。");
for (const page of pages) {
  const html = fs.readFileSync(path.join(publicDir, page), "utf8");
  assert.ok(html.includes(scriptTag), `${page} 必須載入本機答題紀錄模組。`);
  assert.ok(!html.includes("登入試行版"), `${page} 不得顯示登入試行文案。`);
}

const hub = fs.readFileSync(path.join(publicDir, "practice-hub.html"), "utf8");
assert.ok(hub.includes(scriptTag), "統一目錄必須載入本機答題紀錄模組。");
assert.match(script, /localStorage/, "本機紀錄模組必須使用瀏覽器本機儲存。");
assert.match(script, /firstTryCorrect/, "本機紀錄模組必須相容《論仁、論孝、論君子》的首次答對狀態。 ");
assert.match(script, /attemptsByTerm/, "本機紀錄模組必須相容《論仁、論孝、論君子》的作答次數狀態。 ");
assert.match(script, /firstTry/, "本機紀錄模組必須相容《廉頗藺相如列傳》的首次答對狀態。 ");
assert.match(script, /unlock-panel/, "本機紀錄模組必須相容《論仁、論孝、論君子》的完成摘要容器。 ");
assert.match(script, /renderCardProgress/, "本機紀錄模組必須更新十二張篇章卡的進度摘要。 ");
assert.match(script, /最近完成/, "篇章卡必須顯示最近完成日期。 ");
assert.match(script, /最佳首次答對/, "篇章卡必須顯示最佳首次答對分數。 ");
assert.match(script, /尚未完成此篇練習/, "未完成篇章必須提供清晰空狀態。 ");
assert.doesNotMatch(script, /我的答題紀錄|下載備份|清除本機紀錄/, "目錄頁不得再顯示答題紀錄摘要或備份控制項。 ");
assert.doesNotMatch(script, /fetch\(|XMLHttpRequest|axios|\/api\//, "本機紀錄模組不得傳送網絡請求。 ");

console.log(`本機答題紀錄驗證通過：${pages.length} 篇互動頁、統一目錄及零網絡傳送規則均符合要求。`);
