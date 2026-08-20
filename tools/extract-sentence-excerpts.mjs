import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(import.meta.dirname, '..');
const lessons = [
  { slug: 'limpo', title: '廉頗藺相如列傳' },
  { slug: 'yueyang', title: '岳陽樓記' },
  { slug: 'shishuo', title: '師說' },
];

function plainText(value) {
  return value.replace(/<[^>]*>/g, '').replace(/\s+/g, '').trim();
}

function pageParagraphs(html, slug) {
  if (slug !== 'yueyang') {
    return [...html.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/g)].map((match) => match[1]);
  }
  const rawMatch = html.match(/const raw=\[([\s\S]*?)\];\s*const terms=/);
  if (!rawMatch) throw new Error('無法讀取《岳陽樓記》原文資料。');
  return [...rawMatch[1].matchAll(/`([\s\S]*?)`/g)].map((match) =>
    match[1].replace(/\{\{([^|]+)\|([^}]+)\}\}/g, '<button class="term" data-id="$1">$2</button>'),
  );
}

function sentenceAt(text, position) {
  const boundaries = /[。！？；]/g;
  let previousEnd = 0;
  let next;
  while ((next = boundaries.exec(text))) {
    if (next.index >= position) {
      let end = next.index + 1;
      while (text[end] && '」』）'.includes(text[end])) end += 1;
      return text.slice(previousEnd, end);
    }
    previousEnd = next.index + 1;
    while (text[previousEnd] && '」』）'.includes(text[previousEnd])) previousEnd += 1;
  }
  return text.slice(previousEnd);
}

function collectExcerpts(html, slug) {
  const ids = new Set();
  const records = [];
  for (const paragraph of pageParagraphs(html, slug)) {
    const markedText = plainText(paragraph.replace(
      /<button[^>]*data-id="([^"]+)"[^>]*>([^<]+)<\/button>/g,
      (_, id, word) => `⟪${id}⟫${word}⟬`,
    ));
    const text = markedText.replace(/⟪[^⟫]+⟫|⟬/g, '');
    for (const button of paragraph.matchAll(/<button[^>]*data-id="([^"]+)"[^>]*>([^<]+)<\/button>/g)) {
      const [, id, word] = button;
      if (ids.has(id)) throw new Error(`${slug} 的 data-id 重複：${id}`);
      ids.add(id);
      const markerPosition = markedText.indexOf(`⟪${id}⟫`);
      const visiblePosition = markedText.slice(0, markerPosition).replace(/⟪[^⟫]+⟫|⟬/g, '').length;
      const excerpt = sentenceAt(text, visiblePosition);
      if (!excerpt.includes(word)) throw new Error(`${slug} 的「${word}」節錄未包含目標詞。`);
      records.push({ id, word, excerpt, length: [...excerpt].length });
    }
  }
  return records;
}

for (const lesson of lessons) {
  const htmlPath = path.join(projectRoot, 'client/public', `${lesson.slug}-interactive.html`);
  const html = fs.readFileSync(htmlPath, 'utf8');
  const records = collectExcerpts(html, lesson.slug);
  const table = [
    `# 《${lesson.title}》題目完整句子節錄`,
    '',
    `共 ${records.length} 題。每則均由可點選詞語所在的原文標點句擷取，供彈窗顯示使用。`,
    '',
    '| # | ID | 詞語 | 完整句子節錄 | 字數 |',
    '| ---: | --- | --- | --- | ---: |',
    ...records.map((record, index) => `| ${index + 1} | ${record.id} | ${record.word} | ${record.excerpt} | ${record.length} |`),
    '',
  ].join('\n');
  fs.writeFileSync(path.join(projectRoot, 'source', `${lesson.slug}-sentence-excerpts.candidates.md`), table);
  fs.writeFileSync(path.join(projectRoot, 'source', `${lesson.slug}-sentence-excerpts.candidates.json`), `${JSON.stringify(records, null, 2)}\n`);
  console.log(`${lesson.title}：${records.length} 題；最長節錄 ${Math.max(...records.map((record) => record.length))} 字。`);
}
