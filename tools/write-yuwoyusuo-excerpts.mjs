import fs from 'node:fs';
import path from 'node:path';
import { lesson, terms } from '../source/yuwoyusuo-question-data.mjs';

const projectRoot = path.resolve(import.meta.dirname, '..');
const rows = terms.map((term, index) => `| ${index + 1} | ${term.word} | ${term.excerpt} |`).join('\n');
const content = `# 《${lesson.title}》完整句子節錄\n\n本表記錄 ${terms.length} 題彈窗的原句。每則均包含目標詞，並只保留表達完整意思的原文句子或分句。\n\n| 題次 | 詞語 | 原句節錄 |\n| --- | --- | --- |\n${rows}\n`;

fs.writeFileSync(path.join(projectRoot, 'source/yuwoyusuo-sentence-excerpts.md'), content);
console.log(`已寫入 ${terms.length} 則《${lesson.title}》完整句子節錄。`);
