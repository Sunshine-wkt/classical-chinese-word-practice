import fs from 'node:fs';
import path from 'node:path';
import { lesson, terms } from '../source/cisan-question-data.mjs';
const projectRoot = path.resolve(import.meta.dirname, '..');
const rows = terms.map((term) => `| ${term.word} | ${term.excerpt} |`).join('\n');
fs.writeFileSync(path.join(projectRoot, 'source/cisan-sentence-excerpts.md'), `# 《${lesson.title}》逐題完整句子節錄\n\n本文件記錄每題彈窗使用的完整句子節錄；每則均包含目標詞、與教育局官方原文一致，並以原文標點收結。\n\n| 詞語 | 原句節錄 |\n| --- | --- |\n${rows}\n`);
console.log(`已寫入 ${terms.length} 則《${lesson.title}》句子節錄。`);
