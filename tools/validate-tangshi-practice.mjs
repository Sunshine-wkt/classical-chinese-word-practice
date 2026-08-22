import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { lesson, passages, terms } from '../source/tangshi-question-data.mjs';

const projectRoot = path.resolve(import.meta.dirname, '..');
const html = fs.readFileSync(path.join(projectRoot, 'client/public/tangshi-interactive.html'), 'utf8');
const coverage = fs.readFileSync(path.join(projectRoot, 'source/tangshi-annotation-coverage.md'), 'utf8');
const excerpts = fs.readFileSync(path.join(projectRoot, 'source/tangshi-sentence-excerpts.md'), 'utf8');

assert.equal(terms.length, 23, '教師筆記 18 則注釋必須拆為 23 個題目。');
assert.match(coverage, /18 則編號注釋/);
assert.match(coverage, /23 個互動詞語題目/);
assert.match(html, new RegExp(`<title>《${lesson.title}》｜原文及詞解</title>`));
assert.match(html, /第九篇・唐詩三首/);
assert.match(html, /href="practice-hub\.html">返回目錄<\/a>/);
assert.match(html, /const done=new Set,first=new Set,tries=new Map/);
assert.match(html, /錯誤/);
assert.match(html, /confirm\('確定要重設本課的完成進度嗎？'\)/);
assert.match(html, /sentence\.textContent=\`原句：\$\{t\.excerpt\}\`/);
assert.doesNotMatch(html, /https?:\/\/|fonts\.google|cdn\./);

const markedIds = new Set([...html.matchAll(/data-ids="([^"]+)"/g)].flatMap((match) => match[1].split(',')));
assert.equal(markedIds.size, terms.length, '所有拆分後題目均須對應到原文詞語位置。');
const sourceText = passages.flatMap((poem) => [poem.title, ...poem.lines]).join('\n').replace(/\{\{[^|}]+\|([^}]+)\}\}/g, '$1');
for (const term of terms) {
  assert.ok(markedIds.has(term.id), `${term.id} 必須有原文位置。`);
  assert.ok(sourceText.includes(term.word), `${term.word} 必須可在官方原文中定位。`);
  assert.equal(term.options.length, 4, `${term.word} 必須有四個選項。`);
  assert.equal(new Set(term.options).size, 4, `${term.word} 的四個選項不可重複。`);
  assert.equal(term.options[term.answer], term.meaning, `${term.word} 的正解必須逐字保留教師筆記詞義。`);
  assert.ok(term.excerpt.includes(term.word), `${term.word} 的節錄句必須包含目標詞。`);
  assert.match(term.excerpt, /[。！？；][」』]?$/, `${term.word} 的節錄句必須以原文標點收結。`);
  assert.ok(term.excerpt.length < 120, `${term.word} 的節錄句應避免過長。`);
  assert.ok(excerpts.includes(`| ${term.word} | ${term.excerpt} |`), `${term.word} 必須記錄於節錄文件。`);
}

console.log(`《${lesson.title}》驗證通過：18 則教師筆記注釋拆為 ${terms.length} 題；正解、選項、覆蓋表、原文位置、完整句子節錄與返回目錄連結均符合要求。`);
