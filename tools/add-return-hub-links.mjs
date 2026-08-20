import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(import.meta.dirname, '..');
const lessons = [
  { slug: 'lunren', reset: '<button class="reset-btn" type="button" id="reset-btn">重設進度</button>', classes: 'reset-btn return-link' },
  { slug: 'yueyang', reset: '<button class="reset" id="reset">重設進度</button>', classes: 'reset return-link' },
  { slug: 'limpo', reset: '<button class="reset" id="reset" type="button">重設進度</button>', classes: 'reset return-link' },
  { slug: 'shishuo', reset: '<button class="reset" id="reset">重設進度</button>', classes: 'reset return-link' },
  { slug: 'liuguolun', reset: '<button class="reset" id="reset">重設進度</button>', classes: 'reset return-link' },
];

for (const lesson of lessons) {
  const htmlPath = path.join(projectRoot, 'client/public', `${lesson.slug}-interactive.html`);
  let html = fs.readFileSync(htmlPath, 'utf8');
  const link = `<a class="${lesson.classes}" href="practice-hub.html">返回目錄</a>`;
  if (!html.includes('href="practice-hub.html"')) {
    if (!html.includes(lesson.reset)) throw new Error(`找不到 ${lesson.slug} 的重設按鈕標記。`);
    html = html.replace(lesson.reset, `${lesson.reset}${link}`);
  }
  if (!html.includes('.return-link{')) {
    const style = '/* 墨卷課堂導航：返回目錄沿用頂欄控制的紙本份量與配色。 */.return-link{display:inline-flex;align-items:center;justify-content:center;text-decoration:none;}';
    html = html.replace('</style>', `${style}</style>`);
  }
  fs.writeFileSync(htmlPath, html);
  console.log(`《${lesson.slug}》已加入返回目錄連結。`);
}
