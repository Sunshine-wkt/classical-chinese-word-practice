import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(import.meta.dirname, '..');
const lessons = [
  { slug: 'limpo', title: '廉頗藺相如列傳' },
  { slug: 'yueyang', title: '岳陽樓記' },
  { slug: 'shishuo', title: '師說' },
];

function replaceOnce(text, from, to, label) {
  if (!text.includes(from)) throw new Error(`找不到 ${label} 的預期程式碼。`);
  return text.replace(from, to);
}

for (const lesson of lessons) {
  const excerpts = JSON.parse(fs.readFileSync(path.join(projectRoot, 'source', `${lesson.slug}-sentence-excerpts.candidates.json`), 'utf8'));
  const byId = Object.fromEntries(excerpts.map(({ id, excerpt }) => [id, excerpt]));
  const objectDeclaration = `const excerpts=${JSON.stringify(byId)};`;
  const htmlPath = path.join(projectRoot, 'client/public', `${lesson.slug}-interactive.html`);
  let html = fs.readFileSync(htmlPath, 'utf8');

  if (!html.includes('const excerpts=')) {
    if (lesson.slug === 'limpo') {
      html = replaceOnce(html, '    const terms=[', `    ${objectDeclaration}\n    const terms=[`, lesson.title);
      html = replaceOnce(html, '.map(([id,word,meaning])=>({id,word,meaning}));', '.map(([id,word,meaning])=>({id,word,meaning,excerpt:excerpts[id]}));', lesson.title);
    } else {
      const lettersDeclaration = html.includes('    const letters=') ? '    const letters=' : 'const letters=';
      html = replaceOnce(html, lettersDeclaration, `${lettersDeclaration.startsWith('    ') ? '    ' : ''}${objectDeclaration}\n${lettersDeclaration}`, lesson.title);
      if (lesson.slug === 'yueyang') {
        html = replaceOnce(html, 'const t={id:x[0],word:x[1],meaning:x[2],d:x[3]};', 'const t={id:x[0],word:x[1],meaning:x[2],d:x[3],excerpt:excerpts[x[0]]};', lesson.title);
      } else {
        html = replaceOnce(html, 'answer:x[4]}]', 'answer:x[4],excerpt:excerpts[x[0]]}]', lesson.title);
      }
    }
  }

  html = html
    .replace('`原句：${trigger.parentElement.textContent.trim()}`', '`原句：${t.excerpt}`')
    .replace('`原句：${trigger.closest(\'.passage\').querySelector(\'p\').textContent.trim()}`', '`原句：${t.excerpt}`');
  if (!html.includes('`原句：${t.excerpt}`')) throw new Error(`${lesson.title} 未改用題目專屬節錄句。`);
  fs.writeFileSync(htmlPath, html);

  const documentation = [
    `# 《${lesson.title}》題目完整句子節錄`,
    '',
    `共 ${excerpts.length} 題。每題的「原句」只顯示包含目標詞、且語意完整的原文節錄句；不會再顯示整段原文。`,
    '',
    '| # | ID | 詞語 | 完整句子節錄 | 字數 |',
    '| ---: | --- | --- | --- | ---: |',
    ...excerpts.map((record, index) => `| ${index + 1} | ${record.id} | ${record.word} | ${record.excerpt} | ${record.length} |`),
    '',
  ].join('\n');
  fs.writeFileSync(path.join(projectRoot, 'source', `${lesson.slug}-sentence-excerpts.md`), documentation);
  console.log(`已更新《${lesson.title}》${excerpts.length} 題的彈窗節錄句。`);
}
