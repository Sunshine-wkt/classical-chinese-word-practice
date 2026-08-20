import { useEffect } from "react";

/** 設計：墨卷課堂——根路徑先進入篇章練習索引，再開啟個別互動閱讀頁。 */
export default function Home() {
  useEffect(() => {
    window.location.replace("/practice-hub.html");
  }, []);

  return (
    <main className="min-h-screen grid place-items-center bg-stone-100 p-6 text-stone-800">
      <a className="rounded border border-stone-400 bg-white px-4 py-3" href="/practice-hub.html">開啟篇章練習索引</a>
    </main>
  );
}
