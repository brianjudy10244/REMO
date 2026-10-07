"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { BoardPost } from "@/lib/db";

export function BoardPostActions({ post, canManage }: { post: BoardPost; canManage: boolean }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch(`/api/board/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.get("title"),
          author: formData.get("author"),
          content: formData.get("content"),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "게시글을 수정하지 못했습니다.");
      window.dispatchEvent(new CustomEvent("remo-board-changed", { detail: { post: result.post } }));
      setEditing(false);
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "게시글을 수정하지 못했습니다.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/board/${post.id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "게시글을 삭제하지 못했습니다.");
      window.dispatchEvent(new CustomEvent("remo-board-changed", { detail: { deletedId: post.id } }));
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "게시글을 삭제하지 못했습니다.");
      setBusy(false);
    }
  }

  if (confirmingDelete) {
    return <div className="board-delete-confirm" role="alertdialog" aria-labelledby={`delete-${post.id}`}>
      <p id={`delete-${post.id}`}>이 글을 삭제할까요? 삭제한 글은 복구할 수 없습니다.</p>
      {error && <p className="board-error" role="alert">{error}</p>}
      <div>
        <button type="button" disabled={busy} onClick={remove}>{busy ? "삭제 중…" : "삭제하기"}</button>
        <button type="button" disabled={busy} onClick={() => { setConfirmingDelete(false); setError(""); }}>취소</button>
      </div>
    </div>;
  }

  if (!editing) {
    return <details className="board-post-actions">
      <summary aria-label={`${post.title} 관리 메뉴`}>···</summary>
      <div className="board-post-menu">
        <button type="button" disabled={busy} onClick={() => { if (canManage) setEditing(true); else setError("글을 작성한 브라우저에서 열어 주세요. 작성자 확인 정보가 없는 예전 글은 관리자에게 문의해 주세요."); }}>수정</button>
        <button type="button" disabled={busy} onClick={() => { if (canManage) setConfirmingDelete(true); else setError("글을 작성한 브라우저에서 열어 주세요. 작성자 확인 정보가 없는 예전 글은 관리자에게 문의해 주세요."); }}>삭제</button>
      </div>
      {error && <p className="board-error" role="alert">{error}</p>}
    </details>;
  }

  return <form className="board-edit-form" onSubmit={save}>
    <label>제목<input name="title" required maxLength={120} defaultValue={post.title} /></label>
    <label>작성자<input name="author" maxLength={40} defaultValue={post.author} /></label>
    <label>내용<textarea name="content" required maxLength={10000} rows={5} defaultValue={post.content} /></label>
    {error && <p className="board-error" role="alert">{error}</p>}
    <div><button type="submit" disabled={busy}>{busy ? "저장 중…" : "수정 내용 저장"}</button><button type="button" disabled={busy} onClick={() => { setEditing(false); setError(""); }}>취소</button></div>
  </form>;
}
