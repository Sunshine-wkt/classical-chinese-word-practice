import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Check, RotateCcw, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";

type Lesson = {
  questionCount: number;
  passages: string[];
  terms: Array<{ id: string; word: string; excerpt: string; options: string[] }>;
};

function MarkedPassage({ text, lesson, completed, onOpen }: { text: string; lesson: Lesson; completed: Set<string>; onOpen: (id: string) => void }) {
  const matcher = /\{\{([^|]+)\|([^}]+)\}\}/g;
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;
  while ((match = matcher.exec(text))) {
    parts.push(text.slice(cursor, match.index));
    const term = lesson.terms.find(item => item.id === match?.[1]);
    const isDone = completed.has(match[1]);
    parts.push(
      <button key={`${match[1]}-${match.index}`} className={`rounded-sm px-1 transition-colors ${isDone ? "bg-[#bcd9cd] font-bold text-[#004936]" : "bg-[#f5d66a] hover:bg-[#f8e18a]"}`} onClick={() => onOpen(match![1])}>
        {match[2]}{isDone ? <span className="ml-0.5 text-xs">✓</span> : null}
        <span className="sr-only">：{term?.word}</span>
      </button>,
    );
    cursor = match.index + match[0].length;
  }
  parts.push(text.slice(cursor));
  return <p className="font-serif text-xl leading-[2.05] tracking-[0.04em] text-[#27312d] sm:text-2xl">{parts}</p>;
}

export default function YueyangPilot() {
  const { isAuthenticated, loading } = useAuth();
  const lessonQuery = trpc.pilot.lesson.useQuery(undefined, { enabled: isAuthenticated });
  const startAttempt = trpc.pilot.start.useMutation();
  const answer = trpc.pilot.answer.useMutation();
  const complete = trpc.pilot.complete.useMutation();
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [activeTermId, setActiveTermId] = useState<string | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => new Set());
  const [triesByTerm, setTriesByTerm] = useState<Record<string, number>>({});
  const [correctMeanings, setCorrectMeanings] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<"error" | "correct" | null>(null);
  const [finished, setFinished] = useState(false);
  const completionSent = useRef(false);
  const lesson = lessonQuery.data;
  const activeTerm = lesson?.terms.find(term => term.id === activeTermId) ?? null;

  const startNewAttempt = () => {
    startAttempt.mutate(undefined, {
      onSuccess: result => {
        setAttemptId(result.attemptId);
        setCompletedIds(new Set());
        setTriesByTerm({});
        setCorrectMeanings({});
        setFeedback(null);
        setFinished(false);
        completionSent.current = false;
      },
    });
  };

  const choose = (selectedIndex: number) => {
    if (!activeTerm || !attemptId || answer.isPending) return;
    answer.mutate({ attemptId, termId: activeTerm.id, selectedIndex }, {
      onSuccess: result => {
        setTriesByTerm(current => ({ ...current, [activeTerm.id]: result.termAttemptCount }));
        if (result.isCorrect) {
          setCompletedIds(current => new Set([...Array.from(current), activeTerm.id]));
          setCorrectMeanings(current => ({ ...current, [activeTerm.id]: result.correctMeaning || "" }));
          setFeedback("correct");
        } else {
          setFeedback("error");
        }
      },
    });
  };

  useEffect(() => {
    if (!attemptId || !lesson || completedIds.size !== lesson.questionCount || completionSent.current) return;
    completionSent.current = true;
    complete.mutate({ attemptId }, { onSuccess: () => setFinished(true) });
  }, [attemptId, completedIds, complete, lesson]);

  if (loading || lessonQuery.isLoading) return <main className="grid min-h-screen place-items-center bg-[#efe9dc] text-[#004936]">正在載入試行教材……</main>;
  if (!isAuthenticated) return <main className="grid min-h-screen place-items-center bg-[#efe9dc] p-6"><section className="max-w-md rounded-2xl border border-[#d8cfbe] bg-[#fffdf7] p-8 text-center shadow-sm"><ShieldCheck className="mx-auto h-10 w-10 text-[#004936]" /><h1 className="mt-4 font-serif text-2xl text-[#004936]">請先登入試行版</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">登入後才會建立個人的《岳陽樓記》練習紀錄。</p><Button className="mt-6 bg-[#004936] hover:bg-[#00382b]" onClick={() => startLogin()}>登入試行版</Button></section></main>;
  if (!lesson) return <main className="grid min-h-screen place-items-center bg-[#efe9dc]">暫時未能載入試行教材。</main>;

  return (
    <div className="min-h-screen bg-[#efe9dc] text-[#202926]">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#00382b] text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <div><p className="text-xs tracking-[0.18em] text-[#f5d66a]">全端試行・學習紀錄版</p><h1 className="font-serif text-xl tracking-[0.1em]">范仲淹《岳陽樓記》</h1></div>
          <div className="flex items-center gap-3"><span className="text-sm whitespace-nowrap">首次答對 {correctMeanings && completedIds.size ? Object.keys(correctMeanings).filter(id => triesByTerm[id] === 1).length : 0} / {lesson.questionCount}　｜　已完成 {completedIds.size} / {lesson.questionCount}</span><Link href="/"><Button size="sm" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white">返回試行首頁</Button></Link></div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
        {!attemptId ? (
          <section className="rounded-2xl border border-[#d8cfbe] bg-[#fffdf7] p-8 shadow-sm sm:p-12"><p className="text-sm font-semibold text-[#a94235]">《岳陽樓記》・46 題</p><h2 className="mt-2 font-serif text-3xl tracking-[0.08em] text-[#004936]">開始一個新的練習紀錄</h2><p className="mt-5 max-w-2xl leading-8 text-[#4c5852]">開始後，系統會建立一筆新的試行紀錄。每次作答均會保留；首次答對才計分，答錯須選到正確答案才完成，但補答不加分。</p><Button className="mt-8 bg-[#004936] hover:bg-[#00382b]" onClick={startNewAttempt} disabled={startAttempt.isPending}>{startAttempt.isPending ? "正在建立紀錄……" : "開始本課試行"}</Button>{startAttempt.error ? <p className="mt-4 text-sm font-medium text-destructive">未能建立紀錄，請稍後重試。</p> : null}</section>
        ) : (
          <>
            <section className="mb-7 rounded-xl border border-[#d8cfbe] bg-[#fffdf7] p-5 text-sm leading-7 text-[#4c5852]"><strong className="text-[#004936]">試行提示：</strong>黃色詞語尚未完成；答對後會改為墨綠色並加上勾號。這次練習會在全部 46 題完成後儲存為一筆完整紀錄。</section>
            <article className="overflow-hidden rounded-2xl border border-[#d8cfbe] bg-[#fffdf7] shadow-[0_20px_55px_rgba(22,35,30,0.11)]">
              <header className="border-b border-[#d8cfbe] bg-[linear-gradient(135deg,rgba(0,73,54,0.06),transparent_60%)] px-8 py-10 text-center"><p className="text-sm font-semibold tracking-[0.16em] text-[#a94235]">原文及詞解・試行版</p><h2 className="mt-3 font-serif text-4xl tracking-[0.14em] text-[#004936]">岳陽樓記</h2></header>
              <div className="space-y-0 px-6 py-7 sm:px-12 sm:py-10">
                {lesson.passages.map((passage, index) => <section key={index} className="relative border-b border-dashed border-[#d8cfbe] py-7 pl-10 sm:pl-14"><span className="absolute left-0 top-7 grid h-8 w-8 place-items-center rounded-full border border-[#004936]/50 font-serif text-sm text-[#004936]">{index + 1}</span><MarkedPassage text={passage} lesson={lesson} completed={completedIds} onOpen={id => { setActiveTermId(id); setFeedback(null); }} /></section>)}
              </div>
            </article>
            {finished ? <section className="mt-8 rounded-xl border border-[#004936]/30 bg-[#e9f4ef] p-7"><p className="text-sm font-semibold text-[#004936]">本課總分摘要已儲存</p><h2 className="mt-2 font-serif text-3xl text-[#004936]">首次答對 {Object.keys(correctMeanings).filter(id => triesByTerm[id] === 1).length} / {lesson.questionCount}</h2><p className="mt-3 text-[#375247]">共作答 {Object.values(triesByTerm).reduce((sum, count) => sum + count, 0)} 次；你可另開一次試行，系統會保留這次紀錄。</p><Button variant="outline" className="mt-5 border-[#004936]/40 text-[#004936] hover:bg-white" onClick={startNewAttempt}><RotateCcw className="mr-2 h-4 w-4" />另開一次試行</Button></section> : null}
          </>
        )}
      </main>

      <Dialog open={Boolean(activeTerm)} onOpenChange={open => { if (!open) setActiveTermId(null); }}>
        <DialogContent className="max-w-xl border-t-4 border-t-[#004936] bg-[#fffdf7]">
          {activeTerm ? <><DialogHeader><DialogTitle className="font-serif text-3xl text-[#004936]">{activeTerm.word}</DialogTitle><DialogDescription className="border-l-4 border-[#f5d66a] bg-[#f6f1e6] px-4 py-3 text-base leading-7 text-[#38443e]">原句：{activeTerm.excerpt}</DialogDescription></DialogHeader>
            {completedIds.has(activeTerm.id) ? <div className="rounded-lg bg-[#e9f4ef] p-5 font-semibold text-[#004936]">已完成。正確答案：{correctMeanings[activeTerm.id]}</div> : <div><p className="mb-4 text-sm font-semibold text-[#68716c]">本題嘗試：{triesByTerm[activeTerm.id] || 0} 次</p>{feedback === "error" ? <p className="mb-4 font-bold text-[#a94235]">錯誤</p> : null}<div className="grid gap-2">{activeTerm.options.map((option, index) => <Button key={option} variant="outline" className="h-auto justify-start whitespace-normal border-[#d8cfbe] px-4 py-3 text-left leading-6 hover:border-[#004936] hover:bg-[#f7fbf8]" disabled={answer.isPending} onClick={() => choose(index)}><span className="mr-3 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#eee8dc] text-xs text-[#49534e]">{String.fromCharCode(65 + index)}</span>{option}</Button>)}</div>{answer.error ? <p className="mt-4 text-sm font-medium text-destructive">儲存作答時出現問題，請重新選擇。</p> : null}</div>}
          </> : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
