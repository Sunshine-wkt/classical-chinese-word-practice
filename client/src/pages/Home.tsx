import { useEffect } from "react";

/** 設計：墨卷課堂——根路徑只導向同一個離線互動篇章頁，讓預覽與交付內容一致。 */
export default function Home() {
  useEffect(() => {
    window.location.replace("/lunren-interactive.html");
  }, []);

  return (
    <main className="min-h-screen grid place-items-center bg-stone-100 p-6 text-stone-800">
      <a className="rounded border border-stone-400 bg-white px-4 py-3" href="/lunren-interactive.html">開啟互動篇章頁</a>
    </main>
  );
}
