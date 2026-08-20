import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(import.meta.dirname, '..');
const lessons = [
  { slug: 'limpo', title: '廉頗藺相如列傳', count: 55, termBlock: /const terms=\[([\s\S]*?)\]\.map/ },
  { slug: 'yueyang', title: '岳陽樓記', count: 46, termBlock: /const terms=\[([\s\S]*?)\];\s*const excerpts=/ },
  { slug: 'shishuo', title: '師說', count: 15, termBlock: /const terms=\[([\s\S]*?)\];\s*const excerpts=/ },
];

for (const lesson of lessons) {
  const html = fs.readFileSync(path.join(projectRoot, 'client/public', `${lesson.slug}-interactive.html`), 'utf8');
  const termMatch = html.match(lesson.termBlock);
  assert.ok(termMatch, `找不到《${lesson.title}》題目資料。`);
  const terms = [...termMatch[1].matchAll(/\['([a-z0-9-]+)'\s*,\s*'([^']+)'/g)].map((match) => ({ id: match[1], word: match[2] }));
  const excerptMatch = html.match(/const excerpts=(\{[\s\S]*?\});/);
  assert.ok(excerptMatch, `找不到《${lesson.title}》的節錄句資料。`);
  const excerpts = JSON.parse(excerptMatch[1]);
  assert.equal(terms.length, lesson.count, `《${lesson.title}》題目數必須為 ${lesson.count} 題。`);
  assert.equal(Object.keys(excerpts).length, lesson.count, `《${lesson.title}》必須為每題提供專屬節錄句。`);
  for (const term of terms) {
    const excerpt = excerpts[term.id];
    assert.ok(excerpt, `《${lesson.title}》「${term.word}」缺少節錄句。`);
    assert.ok(excerpt.includes(term.word), `《${lesson.title}》「${term.word}」節錄必須包含目標詞。`);
    assert.match(excerpt, /[。！？；][」』）]*$/, `《${lesson.title}》「${term.word}」節錄必須以完整原文標點收結。`);
    assert.ok([...excerpt].length < 90, `《${lesson.title}》「${term.word}」節錄不得過長。`);
  }
  assert.ok(html.includes('`原句：${t.excerpt}`'), `《${lesson.title}》彈窗必須讀取題目專屬節錄句。`);
  assert.doesNotMatch(html, /原句：\$\{trigger\.(?:parentElement|closest)/, `《${lesson.title}》不得再由原文段落擷取整段文字。`);
  const documentation = fs.readFileSync(path.join(projectRoot, 'source', `${lesson.slug}-sentence-excerpts.md`), 'utf8');
  assert.ok(documentation.includes(`共 ${lesson.count} 題`), `《${lesson.title}》節錄文件必須記錄題目總數。`);
  console.log(`《${lesson.title}》：${lesson.count} 題節錄句及彈窗資料驗證通過。`);
}

for (const slug of ['lunren', 'yueyang', 'limpo', 'shishuo', 'liuguolun']) {
  const html = fs.readFileSync(path.join(projectRoot, 'client/public', `${slug}-interactive.html`), 'utf8');
  assert.match(html, /<a class="[^"]*return-link[^"]*" href="practice-hub\.html">返回目錄<\/a>/, `《${slug}》必須提供「返回目錄」連結。`);
  assert.match(html, /\.return-link\{display:inline-flex;align-items:center;justify-content:center;text-decoration:none;\}/, `《${slug}》返回目錄連結必須維持頂欄控制的簡約樣式。`);
  console.log(`《${slug}》返回目錄連結驗證通過。`);
}
