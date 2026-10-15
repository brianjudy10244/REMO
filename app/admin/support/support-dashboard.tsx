"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { SupportExchange } from "@/lib/support-chat-db";

type DashboardData = { total: number; exchanges: SupportExchange[] };

export function SupportDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/admin/support", { cache: "no-store" });
      if (response.status === 401) { location.href = "/admin/login"; return; }
      const result = await response.json() as DashboardData & { error?: string };
      if (!response.ok) throw new Error(result.error || "상담 기록을 불러오지 못했습니다.");
      setData(result);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "상담 기록을 불러오지 못했습니다."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);
  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (data?.exchanges || []).filter((item) => !term || `${item.question} ${item.answer}`.toLowerCase().includes(term));
  }, [data, search]);

  return <main className="support-admin-main">
    <div className="support-admin-heading"><div><p className="support-admin-eyebrow">REMO STUDIO / SUPPORT</p><h1>고객 상담 기록<span>.</span></h1><p>방문자가 남긴 질문과 챗봇의 답변을 Neon에 저장합니다.</p></div><div className="support-admin-count"><strong>{data?.total ?? "—"}</strong><span>저장된 상담</span></div></div>
    <div className="support-admin-controls"><label>기록 검색<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="질문이나 답변 검색" /></label><button type="button" onClick={() => void load()} disabled={loading}>새로고침 ↗</button></div>
    <div className="support-admin-list-head"><span>상담 내역</span><span>최근 {data?.exchanges.length ?? 0}건 표시 · 질문과 답변 검색은 표시된 기록에 적용됩니다</span></div>
    {error && <p className="support-admin-error" role="alert">{error}</p>}
    {loading && !data ? <p className="support-admin-empty">기록을 불러오는 중입니다.</p> : visible.length === 0 ? <p className="support-admin-empty">{search ? "검색 결과가 없습니다." : "저장된 상담 기록이 없습니다."}</p> : <div className="support-admin-list">{visible.map((item) => <article className="support-admin-entry" key={item.id}>
      <div className="support-admin-meta"><time dateTime={item.createdAt}>{new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Seoul" }).format(new Date(item.createdAt))}</time><span>대화 {item.conversationId.slice(0, 8)}</span></div>
      <div className="support-admin-dialog"><div><span>QUESTION</span><p>{item.question}</p></div><div><span>ANSWER</span><p>{item.answer}</p>{item.sources.length > 0 && <div className="support-admin-sources">{item.sources.map((source) => <a key={source.id} href={source.url} target="_blank" rel="noopener noreferrer">[{source.id}] {source.title} ↗</a>)}</div>}</div></div>
    </article>)}</div>}
  </main>;
}
