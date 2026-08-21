import fs from 'node:fs';
import path from 'node:path';
import { lesson, terms } from '../source/xiaoyaoyou-question-data.mjs';

const projectRoot = path.resolve(import.meta.dirname, '..');
const rows = terms.map((term) => `| ${term.word} | ${term.excerpt} |`).join('\n');
const output = `# 《${lesson.title}》逐題完整句子節錄\n\n本文件記錄每題彈窗使用的原句節錄。每則節錄均包含目標詞，並以官方原文標點收結。\n\n| 詞語 | 原句節錄 |\n| --- | --- |\n${rows}\n`;
fs.writeFileSync(path.join(projectRoot, 'source/xiaoyaoyou-sentence-excerpts.md'), output);
console.log(`已寫入 ${terms.length} 則《${lesson.title}》句子節錄。`);
