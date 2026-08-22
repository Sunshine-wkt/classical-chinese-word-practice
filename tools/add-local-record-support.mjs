import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const publicDir = path.join(projectRoot, "client", "public");
const scriptTag = '<script src="practice-records-v2.js" defer></script>';
const legacyScriptPattern = /<script src="practice-records(?:-v2)?\.js" defer><\/script>/g;
const pages = fs.readdirSync(publicDir).filter(file => file.endsWith("-interactive.html"));

if (pages.length !== 12) throw new Error(`預期 12 篇互動頁，實際找到 ${pages.length} 篇。`);

for (const page of pages) {
  const pagePath = path.join(publicDir, page);
  const html = fs.readFileSync(pagePath, "utf8");
  const withoutLegacyScript = html.replace(legacyScriptPattern, "");
  if (!withoutLegacyScript.includes("</body>")) throw new Error(`${page} 缺少 </body> 標籤。`);
  fs.writeFileSync(pagePath, withoutLegacyScript.replace("</body>", `${scriptTag}</body>`), "utf8");
}

const hubPath = path.join(publicDir, "practice-hub.html");
const hub = fs.readFileSync(hubPath, "utf8");
const hubWithoutLegacyScript = hub.replace(legacyScriptPattern, "");
if (!hubWithoutLegacyScript.includes("</body>")) throw new Error("practice-hub.html 缺少 </body> 標籤。");
fs.writeFileSync(hubPath, hubWithoutLegacyScript.replace("</body>", `${scriptTag}</body>`), "utf8");

console.log(`已為 ${pages.length} 篇互動頁及統一目錄加入本機答題紀錄。`);
