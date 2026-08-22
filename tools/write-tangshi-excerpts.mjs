import fs from 'node:fs';
import path from 'node:path';
import { lesson, terms } from '../source/tangshi-question-data.mjs';

const projectRoot = path.resolve(import.meta.dirname, '..');
const rows = terms.map((term) => `| ${term.word} | ${term.excerpt} |`).join('\n');
const output = `# 《${lesson.title}》逐題完整句子節錄\n\n本文件記錄每題彈窗使用的原句節錄；除「暝」取自詩題外，每則均包含目標詞並以教育局原文標點收結。\n\n| 詞語 | 原句節錄 |\n| --- | --- |\n${rows}\n`;
fs.writeFileSync(path.join(projectRoot, 'source/tangshi-sentence-excerpts.md'), output);
console.log(`已寫入 ${terms.length} 則《${lesson.title}》句子節錄。`);
