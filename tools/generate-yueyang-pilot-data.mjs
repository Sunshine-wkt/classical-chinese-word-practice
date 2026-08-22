import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(import.meta.dirname, '..');
const sourcePath = path.join(projectRoot, 'client/public/yueyang-interactive.html');
const outputPath = path.join(projectRoot, 'server/yueyangPractice.ts');
const html = fs.readFileSync(sourcePath, 'utf8');

const rawMatch = html.match(/const raw=\[\n([\s\S]*?)\n\];\nconst terms=/);
const termsMatch = html.match(/const terms=\[\n([\s\S]*?)\];\nconst excerpts=/);
const excerptsMatch = html.match(/const excerpts=(\{[\s\S]*?\});\nconst letters=/);

if (!rawMatch || !termsMatch || !excerptsMatch) {
  throw new Error('無法由既有《岳陽樓記》離線頁擷取題目資料。');
}

const passages = [...rawMatch[1].matchAll(/`([\s\S]*?)`/g)].map(match => match[1]);
const excerpts = JSON.parse(excerptsMatch[1]);
const terms = [...termsMatch[1].matchAll(/\['([^']*)','([^']*)','([^']*)',\['([^']*)','([^']*)','([^']*)'\]\]/g)].map(match => ({
  id: match[1],
  word: match[2],
  meaning: match[3],
  distractors: [match[4], match[5], match[6]],
  excerpt: excerpts[match[1]],
}));

if (passages.length !== 5 || terms.length !== 46 || terms.some(term => !term.excerpt)) {
  throw new Error(`教材資料不完整：${passages.length} 段原文、${terms.length} 題。`);
}

const output = `/**
 * 《岳陽樓記》全端試行教材資料。
 * 此檔由 tools/generate-yueyang-pilot-data.mjs 從已核對的離線練習原樣生成；
 * 正解與答案位置只在伺服器端使用，前端只會收到四個未標示正解的選項。
 */
type SourceTerm = {
  id: string;
  word: string;
  meaning: string;
  distractors: string[];
  excerpt: string;
};

const passages = ${JSON.stringify(passages, null, 2)};
const sourceTerms: SourceTerm[] = ${JSON.stringify(terms, null, 2)};

export const YUEYANG_PILOT_META = {
  slug: "yueyang-lou-ji",
  title: "岳陽樓記",
  author: "范仲淹",
  contentVersion: "2026-08-pilot-1",
  questionCount: sourceTerms.length,
} as const;

const answerIndexFor = (termIndex: number) => (termIndex * 3 + 1) % 4;

const optionsFor = (term: SourceTerm, termIndex: number) => {
  const options = [...term.distractors];
  options.splice(answerIndexFor(termIndex), 0, term.meaning);
  return options;
};

export function getYueyangPilotLesson() {
  return {
    ...YUEYANG_PILOT_META,
    passages,
    terms: sourceTerms.map((term, termIndex) => ({
      id: term.id,
      word: term.word,
      excerpt: term.excerpt,
      options: optionsFor(term, termIndex),
    })),
  };
}

export function gradeYueyangPilotSelection(termId: string, selectedIndex: number) {
  const termIndex = sourceTerms.findIndex(term => term.id === termId);
  if (termIndex === -1 || !Number.isInteger(selectedIndex) || selectedIndex < 0 || selectedIndex > 3) {
    throw new Error("無效的《岳陽樓記》試行題目或選項。");
  }

  const term = sourceTerms[termIndex];
  const isCorrect = selectedIndex === answerIndexFor(termIndex);
  return {
    isCorrect,
    correctMeaning: isCorrect ? term.meaning : undefined,
  };
}
`;

fs.writeFileSync(outputPath, output, 'utf8');
console.log(`已建立《岳陽樓記》全端試行教材資料：${terms.length} 題。`);
