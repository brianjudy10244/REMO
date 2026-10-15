"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

type Source = { id: string; title: string; document: string; url: string };
type Message = { role: "user" | "assistant"; text: string; sources?: Source[] };
const suggestions = ["REMO의 미션과 목표는 무엇인가요?", "어떤 프로젝트를 진행하나요?", "게시판 글은 누가 수정할 수 있나요?"];

export function SupportChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [messages, busy]);

  async function ask(value: string) {
    const question = value.trim();
    if (busy || question.length < 2 || question.length > 500) return;
    const history = messages.slice(-6).map((item) => ({ role: item.role, text: item.text }));
    setMessages((current) => [...current, { role: "user", text: question }]);
    setDraft(""); setError(""); setBusy(true);
    try {
      const response = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question, history }),
      });
      const result = await response.json() as { answer?: string; sources?: Source[]; error?: string };
      if (!response.ok || !result.answer) throw new Error(result.error || "답변을 불러오지 못했어요.");
      setMessages((current) => [...current, { role: "assistant", text: result.answer!, sources: result.sources || [] }]);
    } catch (caught) {
      setMessages((current) => current.slice(0, -1));
      setDraft(question);
      setError(caught instanceof Error ? caught.message : "잠시 후 다시 질문해 주세요.");
    }
    finally { setBusy(false); }
  }

  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void ask(draft); }
  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); void ask(draft); }
  }

  return <div className="support-chat" aria-label="상담 대화">
    <div className="support-chat-head"><div><span className="support-online" aria-hidden="true" /> <strong>REMO 도우미</strong><p>문서를 찾아 답변합니다</p></div><span>01 / CHAT</span></div>
    <div className="support-chat-messages" role="log" aria-live="polite" aria-relevant="additions text" ref={logRef}>
      <div className="support-message assistant"><span className="support-message-label">REMO</span><p>안녕하세요. REMO의 미션, 핵심 가치, 구성원, 프로젝트와 게시판에 대해 물어보세요. 브리핑 문서에서 확인한 내용을 근거와 함께 알려드릴게요.</p></div>
      {messages.map((item, index) => <div className={`support-message ${item.role}`} key={index}><span className="support-message-label">{item.role === "user" ? "YOU" : "REMO"}</span><p>{item.text}</p>{item.sources && item.sources.length > 0 && <div className="support-citations"><span>참고한 문서</span>{item.sources.map((source) => <a key={source.id} href={source.url} target="_blank" rel="noopener noreferrer">[{source.id}] {source.title} ↗</a>)}</div>}</div>)}
      {busy && <div className="support-message assistant waiting"><span className="support-message-label">REMO</span><p>문서를 확인하고 있어요<span className="loading-dots" aria-hidden="true">...</span></p></div>}
    </div>
    {messages.length === 0 && <div className="support-suggestions"><span>이렇게 물어보세요</span><div>{suggestions.map((item) => <button type="button" key={item} onClick={() => void ask(item)}>{item} <span aria-hidden="true">↗</span></button>)}</div></div>}
    <form className="support-chat-form" onSubmit={submit}><label className="visually-hidden" htmlFor="support-question">REMO에 질문하기</label><textarea id="support-question" value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={onKeyDown} placeholder="궁금한 점을 입력하세요" maxLength={500} rows={2} disabled={busy} /><button type="submit" disabled={busy || draft.trim().length < 2} aria-label="질문 보내기">↗</button></form>
    {error && <p className="support-error" role="alert">{error}</p>}
    <p className="support-chat-note">문서에 없는 내용은 답변하지 않습니다. 개인정보는 입력하지 말아 주세요.</p>
  </div>;
}
