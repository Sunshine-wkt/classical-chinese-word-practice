import fs from 'node:fs';
import path from 'node:path';
import { lesson, passages, terms } from '../source/tangshi-question-data.mjs';

const projectRoot = path.resolve(import.meta.dirname, '..');
const basePage = fs.readFileSync(path.join(projectRoot, 'client/public/xiaoyaoyou-interactive.html'), 'utf8');
const inheritedStyle = basePage.match(/<style>([\s\S]*?)<\/style>/)?.[1];
const style = `${inheritedStyle?.replace('第七篇・莊子', `${lesson.index}・${lesson.title}`)}
/* 第九篇三詩分節：維持墨卷課堂閱讀節奏，加入詩題書籤及手機頂欄的長標題處理。 */
.poem-heading{margin:36px 0 4px;padding:12px 0 10px;border-top:2px solid #004936;color:#004936;font-family:"BiauKai","DFKai-SB","PMingLiU",serif;font-size:1.38rem;font-weight:600;letter-spacing:.1em}.poem-heading:first-of-type{margin-top:0}.poem-heading .term{font:inherit}.poem-heading+.passage{border-top:1px dashed #cfc5b4}
@media(max-width:650px){.bar{align-items:center;gap:8px;padding:9px 12px}.brand{flex:1;max-width:none;gap:7px;font-size:.85rem;letter-spacing:.02em;line-height:1.2}.brand>span:last-child{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tools{width:122px;flex:0 0 122px;flex-direction:row;flex-wrap:wrap;justify-content:flex-end;gap:5px}.score{width:100%;font-size:.67rem;text-align:right;white-space:nowrap}.reset,.return-link{padding:6px 7px;font-size:.8rem;line-height:1.2}.poem-heading{margin-top:28px;font-size:1.22rem}}
`;
if (!style) throw new Error('無法擷取既有墨卷課堂樣式。');

function renderInline(source) {
  return source.replace(/\{\{([^|}]+)\|([^}]+)\}\}/g, (_, rawIds, word) => `<button class="term" data-id="${rawIds.split(',')[0]}" data-ids="${rawIds}">${word}</button>`);
}

let lineNumber = 0;
function renderPoem(poem) {
  const lines = poem.lines.map((line) => {
    lineNumber += 1;
    return `    <section class="passage"><span class="num">${lineNumber}</span><p>${renderInline(line)}</p></section>`;
  }).join('\n');
  return `    <h3 class="poem-heading">${renderInline(poem.title)}</h3>\n${lines}`;
}

const termData = JSON.stringify(terms);
const html = `<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>《${lesson.title}》｜原文及詞解</title>
  <style>${style}</style>
</head>
<body>
  <header class="bar"><div class="brand"><img class="logo" src="/manus-storage/school-logo_6402c49c.jpeg" alt="羅桂祥中學中文科"><span class="dot"></span><span>《${lesson.title}》</span></div><div class="tools"><span class="score" id="score">首次答對 0 / ${terms.length}　｜　已完成 0 / ${terms.length}</span><button class="reset" id="reset">重設進度</button><a class="reset return-link" href="practice-hub.html">返回目錄</a></div></header>
  <main><article class="sheet"><header class="head"><h1>${lesson.title}</h1><p>王維・李白・杜甫　｜　原文及詞解</p></header><div class="body"><h2>${lesson.title}</h2>
${passages.map(renderPoem).join('\n')}
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

fs.writeFileSync(path.join(projectRoot, 'client/public/tangshi-interactive.html'), html);
console.log(`已建立 ${terms.length} 題《${lesson.title}》離線互動頁。`);
