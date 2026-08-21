import fs from 'node:fs';
import path from 'node:path';
import { lesson, passages, terms } from '../source/xiaoyaoyou-question-data.mjs';

const projectRoot = path.resolve(import.meta.dirname, '..');
const basePage = fs.readFileSync(path.join(projectRoot, 'client/public/liuguolun-interactive.html'), 'utf8');
const style = basePage.match(/<style>([\s\S]*?)<\/style>/)?.[1];
if (!style) throw new Error('無法擷取既有墨卷課堂樣式。');
const xiaoyaoyouReadingStyle = `
/* 墨卷課堂閱讀紙卷：壓縮封面式留白，讓段號、原文及黃箋詞語更早進入首屏。 */
.head{padding:clamp(20px,3vw,30px) 9% 15px;text-align:left;background:linear-gradient(90deg,#0049360b,transparent 48%)}
.head:before{display:block;content:"第七篇・莊子";color:var(--red);font-size:.72rem;font-weight:800;letter-spacing:.18em}
.head:after{width:34px;margin:11px 0 0}
.head h1{margin-top:5px;font-size:clamp(1.72rem,3.3vw,2.32rem);letter-spacing:.13em}
.head p{margin:3px 0 0;color:#65706a;font-size:.72rem;letter-spacing:.16em}
.body{padding-top:clamp(17px,3vw,30px)}
.body>h2{margin-bottom:8px;font-size:1.42rem}
.score{color:#f3eee2;font-size:.82rem;letter-spacing:.04em;opacity:.9}
`;

function renderPassage(source, index) {
  const html = source.replace(/\{\{([^|}]+)\|([^}]+)\}\}/g, (_, rawIds, word) => {
    const ids = rawIds.split(',');
    return `<button class="term" data-id="${ids[0]}" data-ids="${rawIds}">${word}</button>`;
  });
  return `    <section class="passage"><span class="num">${index + 1}</span><p>${html}</p></section>`;
}

const termData = JSON.stringify(terms);
const html = `<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${lesson.author}《${lesson.title}》｜原文及詞解</title>
  <style>${style}${xiaoyaoyouReadingStyle}</style>
</head>
<body>
  <header class="bar"><div class="brand"><img class="logo" src="/manus-storage/school-logo_6402c49c.jpeg" alt="羅桂祥中學中文科"><span class="dot"></span><span>${lesson.author}《${lesson.title}》</span></div><div class="tools"><span class="score" id="score">首次答對 0 / ${terms.length}　｜　已完成 0 / ${terms.length}</span><button class="reset" id="reset">重設進度</button><a class="reset return-link" href="practice-hub.html">返回目錄</a></div></header>
  <main><article class="sheet"><header class="head"><h1>${lesson.title}</h1><p>原文及詞解</p></header><div class="body"><h2>${lesson.title}</h2>
${passages.map(renderPassage).join('\n')}
    <section class="summary" id="summary" hidden><h2>本課總分摘要</h2><strong id="final"></strong><p id="sumtext"></p></section>
  </div></article></main>
  <div class="modal-bg" id="bg" aria-hidden="true"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="mt"><div class="modal-top"><h3 id="mt"></h3><button class="close" id="close">關閉彈窗</button></div><p class="sentence" id="sentence"></p><div id="content"></div></section></div>
  <script>
    const terms=${termData};
    const letters=['A','B','C','D'];
    const map=Object.fromEntries(terms.map(t=>[t.id,t]));
    const done=new Set,first=new Set,tries=new Map;let active=null,previous=null;
    const bg=document.getElementById('bg'),mt=document.getElementById('mt'),sentence=document.getElementById('sentence'),content=document.getElementById('content');
    function update(){const n=done.size,s=first.size;document.getElementById('score').textContent=\`首次答對 \${s} / \${terms.length}　｜　已完成 \${n} / \${terms.length}\`;document.querySelectorAll('.term').forEach(b=>{const ids=b.dataset.ids.split(',');b.classList.toggle('done',ids.every(id=>done.has(id)))});if(n===terms.length){document.getElementById('summary').hidden=false;const total=[...tries.values()].reduce((a,b)=>a+b,0);document.getElementById('final').textContent=\`首次答對總分：\${s} / \${terms.length}\`;document.getElementById('sumtext').textContent=\`共作答 \${total} 次；首次答對 \${s} 題，補答完成 \${n-s} 題。\`}}
    function options(t,error=false){const n=tries.get(t.id)||0;content.innerHTML=\`\${error?'<p class="error" role="status">錯誤</p>':''}<p class="attempt">本題嘗試：\${n} 次</p><div class="options">\${t.options.map((x,i)=>\`<button class="option" data-i="\${i}"><span class="key">\${letters[i]}</span><span>\${x}</span></button>\`).join('')}</div>\`;content.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;const next=(tries.get(t.id)||0)+1;tries.set(t.id,next);if(i===t.answer){done.add(t.id);if(next===1)first.add(t.id);update();content.innerHTML=\`<p class="answer">正確答案：\${t.meaning}</p>\`}else options(t,true)})}
    function open(id,trigger){const t=map[id];active=id;previous=trigger;mt.textContent=t.word;sentence.textContent=\`原句：\${t.excerpt}\`;done.has(id)?content.innerHTML=\`<p class="answer">正確答案：\${t.meaning}</p>\`:options(t);bg.classList.add('open');bg.setAttribute('aria-hidden','false');document.getElementById('close').focus()}
    function openNext(trigger){const ids=trigger.dataset.ids.split(',');const id=ids.find(id=>!done.has(id))||ids[0];open(id,trigger)}
    function close(){bg.classList.remove('open');bg.setAttribute('aria-hidden','true');if(previous)previous.focus();active=null}
    document.querySelectorAll('.term').forEach(b=>b.onclick=()=>openNext(b));document.getElementById('close').onclick=close;bg.onclick=e=>{if(e.target===bg)close()};document.addEventListener('keydown',e=>{if(e.key==='Escape'&&active)close()});document.getElementById('reset').onclick=()=>{if(!done.size||confirm('確定要重設本課的完成進度嗎？')){done.clear();first.clear();tries.clear();document.getElementById('summary').hidden=true;update();if(active)close()}};update();
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(projectRoot, 'client/public/xiaoyaoyou-interactive.html'), html);
console.log(`已建立 ${terms.length} 題《${lesson.title}》離線互動頁。`);
