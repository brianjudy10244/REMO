"use client";

import { useEffect, useState } from "react";
import type { BoardPost } from "@/lib/db";
import { BoardPostActions } from "./board-post-actions";

export function BoardList({ initialPosts, isAdmin }: { initialPosts: BoardPost[]; isAdmin: boolean }) {
  const [posts, setPosts] = useState(initialPosts);
  useEffect(() => {
    let active = true;
    let revision = 0;
    async function sync() {
      const startedAt = revision;
      try {
        const response = await fetch("/api/board", { cache: "no-store", credentials: "same-origin" });
        if (!response.ok) return;
        const result = await response.json();
        if (active && revision === startedAt) setPosts(result.posts);
      } catch { /* Keep the current list when the network is unavailable. */ }
    }
    function changed(event: Event) {
      revision += 1;
      const { post, deletedId } = (event as CustomEvent<{ post?: BoardPost; deletedId?: string }>).detail;
      if (post) setPosts((current) => current.some((item) => item.id === post.id) ? current.map((item) => item.id === post.id ? post : item) : [post, ...current]);
      if (deletedId) setPosts((current) => current.filter((item) => item.id !== deletedId));
    }
    void sync();
    window.addEventListener("remo-board-changed", changed);
    window.addEventListener("focus", sync);
    return () => {
      active = false;
      window.removeEventListener("remo-board-changed", changed);
      window.removeEventListener("focus", sync);
    };
  }, []);

  return <div className="board-list" aria-live="polite">
    <div className="board-list-heading"><p className="eyebrow">LATEST NOTES</p><span>{String(posts.length).padStart(2, "0")} POSTS</span></div>
    {posts.length ? posts.map((post, index) => <article className="board-post" key={post.id}>
      <span className="board-post-number">{String(index + 1).padStart(2, "0")}</span>
      <div className="board-post-body"><h2>{post.title}</h2><p className="board-post-meta">{post.author} <span>·</span> {new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(post.createdAt))}</p><p className="board-post-content">{post.content}</p><BoardPostActions post={post} canManage={isAdmin || post.canEdit} /></div>
    </article>) : <p className="board-empty">아직 등록된 글이 없습니다.<br />첫 이야기를 남겨 주세요.</p>}
  </div>;
}
