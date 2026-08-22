import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { ArrowRight, BookOpenCheck, GraduationCap, LockKeyhole, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

function formatDate(value: Date | null) {
  return value ? new Date(value).toLocaleString("zh-HK", { dateStyle: "medium", timeStyle: "short" }) : "未完成";
}

/** 全端試行入口；與 client/public 的 GitHub Pages 學生版分開。 */
export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const attempts = trpc.pilot.myAttempts.useQuery(undefined, { enabled: isAuthenticated });

  return (
    <div className="min-h-screen bg-[#efe9dc] text-[#202926]">
      <header className="border-b border-white/10 bg-[#00382b] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#f5d66a]">羅桂祥中學中文科・試行環境</p>
            <h1 className="mt-1 truncate font-serif text-xl tracking-[0.12em] sm:text-2xl">指定篇章文言字詞學習紀錄</h1>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a className="hidden text-sm text-white/80 underline-offset-4 hover:underline sm:inline" href="practice-hub.html">公開離線學生版</a>
            {loading ? null : isAuthenticated ? (
              <Button variant="outline" size="sm" className="border-white/45 bg-transparent text-white hover:bg-white/10 hover:text-white" onClick={logout}>登出</Button>
            ) : (
              <Button size="sm" className="bg-[#f5d66a] text-[#24342e] hover:bg-[#f8e18a]" onClick={() => startLogin()}>登入試行版</Button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="relative overflow-hidden rounded-2xl border border-[#d8cfbe] bg-[#fffdf7] p-7 shadow-[0_22px_60px_rgba(22,35,30,0.12)] sm:p-10">
            <div className="absolute inset-y-0 left-0 w-1.5 bg-[#004936]" />
            <Badge className="bg-[#a94235] text-white hover:bg-[#a94235]">安全試行</Badge>
            <h2 className="mt-5 max-w-2xl font-serif text-3xl leading-tight tracking-[0.08em] text-[#004936] sm:text-4xl">先試一篇，再決定是否推展全校</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#4c5852]">本環境只試行范仲淹《岳陽樓記》。每次作答都獨立保存首次答對分數、完成題數及嘗試次數；目前不使用班別名冊，也不會覆蓋現有公開學生練習。</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {isAuthenticated ? (
                <Button asChild className="bg-[#004936] hover:bg-[#00382b]"><Link href="/pilot/yueyang"><BookOpenCheck className="mr-2 h-4 w-4" />開始《岳陽樓記》試行</Link></Button>
              ) : (
                <Button className="bg-[#004936] hover:bg-[#00382b]" onClick={() => startLogin()}><LockKeyhole className="mr-2 h-4 w-4" />登入後開始試行</Button>
              )}
              {user?.role === "admin" ? (
                <Button asChild variant="outline" className="border-[#004936]/40 text-[#004936] hover:bg-[#e9f4ef]"><Link href="/teacher"><GraduationCap className="mr-2 h-4 w-4" />教師後台</Link></Button>
              ) : null}
            </div>
          </div>

          <Card className="border-[#d8cfbe] bg-[#fffdf7] shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#004936]"><ShieldCheck className="h-5 w-5" />試行資料界線</CardTitle>
              <CardDescription className="leading-6">以最少資料原則驗證流程，不建立真實學生名冊。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-6 text-[#4c5852]">
              <p><strong className="text-[#202926]">登入：</strong>使用測試環境既有的安全登入機制；正式校方單一登入會在試行驗收後才接駁。</p>
              <p><strong className="text-[#202926]">紀錄：</strong>每次練習各自保存，不覆蓋舊成績；教師查看功能只開放管理員帳戶。</p>
              <p><strong className="text-[#202926]">回復：</strong>原有 GitHub Pages 網址與 12 篇離線練習保持獨立，試行未獲採納亦不影響學生現用版本。</p>
            </CardContent>
          </Card>
        </section>

        {isAuthenticated ? (
          <section className="mt-10">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#a94235]">我的試行紀錄</p>
                <h2 className="mt-1 font-serif text-2xl text-[#004936]">{user?.name || "學習者"}的歷次練習</h2>
              </div>
              <span className="text-sm text-muted-foreground">每次完成均另存一筆紀錄</span>
            </div>
            <div className="overflow-hidden rounded-xl border border-[#d8cfbe] bg-[#fffdf7]">
              {attempts.isLoading ? <p className="p-6 text-sm text-muted-foreground">正在讀取試行紀錄……</p> : null}
              {attempts.data?.length === 0 ? <p className="p-6 text-sm text-muted-foreground">尚未開始試行。完成一次《岳陽樓記》後，紀錄會顯示在這裏。</p> : null}
              {attempts.data?.length ? (
                <div className="divide-y divide-[#e4ddcf]">
                  {attempts.data.map(attempt => (
                    <div className="grid gap-1 p-5 sm:grid-cols-[1fr_auto] sm:items-center" key={attempt.id}>
                      <div><p className="font-semibold text-[#004936]">《{attempt.practiceTitle}》</p><p className="mt-1 text-sm text-muted-foreground">開始：{formatDate(attempt.startedAt)}　｜　完成：{formatDate(attempt.completedAt)}</p></div>
                      <div className="text-sm font-semibold text-[#202926]">首次答對 {attempt.firstTryCorrectCount} / {attempt.questionCount}　｜　{attempt.status === "completed" ? "已完成" : "進行中"}</div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        <a className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-[#004936] underline-offset-4 hover:underline" href="practice-hub.html">返回原有的免登入離線學生練習 <ArrowRight className="h-4 w-4" /></a>
      </main>
    </div>
  );
}
