"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function BoardComposer() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    try {
      const response = await fetch("/api/board", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.get("title"),
          author: formData.get("author"),
          content: formData.get("content"),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "게시글을 저장하지 못했습니다.");
      window.dispatchEvent(new CustomEvent("remo-board-changed", { detail: { post: result.post } }));
      form.reset();
      setSuccess("글을 등록했습니다. 글 옆의 ··· 메뉴에서 수정하거나 삭제할 수 있습니다.");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "게시글을 저장하지 못했습니다.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="board-composer" onSubmit={submit}>
      <label>
        작성자 <span>선택</span>
        <input name="author" maxLength={40} placeholder="이름 또는 익명" />
      </label>
      <label>
        제목
        <input name="title" required maxLength={120} placeholder="제목을 입력해 주세요" />
      </label>
      <label>
        내용
        <textarea name="content" required maxLength={10000} rows={5} placeholder="팀과 나누고 싶은 이야기를 적어 주세요" />
      </label>
      {error && <p className="board-error" role="alert">{error}</p>}
      {success && <p className="board-admin-note" role="status">{success}</p>}
      <button type="submit" disabled={saving}>{saving ? "저장 중…" : "글 등록하기 ↗"}</button>
    </form>
  );
}
