import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { BarChart3, BookOpenCheck, Users } from "lucide-react";
import { Link } from "wouter";

function formatDate(value: Date | null) {
  return value ? new Date(value).toLocaleString("zh-HK", { dateStyle: "short", timeStyle: "short" }) : "—";
}

export default function TeacherDashboard() {
  const { user, loading } = useAuth();
  const attempts = trpc.teacher.yueyangAttempts.useQuery(undefined, { enabled: user?.role === "admin" });

  if (loading) return <main className="grid min-h-screen place-items-center">正在驗證教師權限……</main>;
  if (!user || user.role !== "admin") return <main className="grid min-h-screen place-items-center bg-[#efe9dc] p-6"><section className="max-w-md rounded-2xl border border-[#d8cfbe] bg-[#fffdf7] p-8 text-center"><h1 className="font-serif text-2xl text-[#004936]">教師後台只限管理員</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">試行期間，只有專案擁有者帳戶可查看所有學習紀錄。</p><Link href="/" className="mt-6 inline-block text-sm font-medium text-[#004936] underline">返回試行首頁</Link></section></main>;

  const rows = attempts.data ?? [];
  const completed = rows.filter(row => row.status === "completed");
  const average = completed.length ? Math.round((completed.reduce((sum, row) => sum + row.firstTryCorrectCount, 0) / completed.length) * 10) / 10 : 0;

  return <DashboardLayout title="教師試行後台" items={[{ icon: BarChart3, label: "試行概覽", path: "/teacher" }, { icon: BookOpenCheck, label: "學生練習", path: "/pilot/yueyang" }]}>
    <div className="mx-auto max-w-6xl space-y-7">
      <header><p className="text-sm font-semibold text-[#a94235]">只限管理員・《岳陽樓記》試行</p><h1 className="mt-1 font-serif text-3xl tracking-[0.08em] text-[#004936]">教師後台</h1><p className="mt-3 max-w-3xl leading-7 text-muted-foreground">本頁只展示試行帳戶的個別練習紀錄，尚未建立真實班別或校內名冊。每次完成均保留一筆獨立成績。</p></header>
      <section className="grid gap-4 md:grid-cols-3"><Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">已建立紀錄</CardTitle></CardHeader><CardContent className="text-3xl font-semibold text-[#004936]">{rows.length}</CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">已完成練習</CardTitle></CardHeader><CardContent className="text-3xl font-semibold text-[#004936]">{completed.length}</CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">完成紀錄平均首次答對</CardTitle></CardHeader><CardContent className="text-3xl font-semibold text-[#004936]">{average} <span className="text-base font-normal text-muted-foreground">/ 46</span></CardContent></Card></section>
      <section className="overflow-hidden rounded-xl border bg-card"><div className="flex items-center gap-2 border-b bg-muted/30 px-5 py-4"><Users className="h-5 w-5 text-[#004936]" /><h2 className="font-semibold text-[#004936]">試行紀錄</h2></div>{attempts.isLoading ? <p className="p-6 text-sm text-muted-foreground">正在讀取紀錄……</p> : rows.length === 0 ? <p className="p-6 text-sm text-muted-foreground">暫未有練習紀錄。學生完成或開始試行後會顯示於此。</p> : <div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-muted/40 text-muted-foreground"><tr><th className="px-5 py-3 font-medium">學生</th><th className="px-5 py-3 font-medium">狀態</th><th className="px-5 py-3 font-medium">首次答對</th><th className="px-5 py-3 font-medium">總作答</th><th className="px-5 py-3 font-medium">完成時間</th></tr></thead><tbody className="divide-y">{rows.map(row => <tr key={row.attemptId}><td className="px-5 py-4"><p className="font-medium">{row.studentName || "未提供名稱"}</p><p className="text-xs text-muted-foreground">{row.studentEmail || "未提供電郵"}</p></td><td className="px-5 py-4">{row.status === "completed" ? "已完成" : "進行中"}</td><td className="px-5 py-4">{row.firstTryCorrectCount} / {row.questionCount}</td><td className="px-5 py-4">{row.totalResponseCount}</td><td className="px-5 py-4 text-muted-foreground">{formatDate(row.completedAt)}</td></tr>)}</tbody></table></div>}</section>
    </div>
  </DashboardLayout>;
}
