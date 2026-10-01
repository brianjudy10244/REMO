import type { Metadata } from "next";
import { PageHero, SiteFrame } from "@/app/components/site-chrome";
import { getBoardPosts } from "@/lib/db";
import { BoardComposer } from "./board-composer";

export const metadata: Metadata = { title: "게시판 — REMO" };
export const dynamic = "force-dynamic";

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(value));
}

export default async function BoardPage() {
  const posts = await getBoardPosts();
  return (
    <SiteFrame>
      <main>
        <PageHero index="05" eyebrow="REMO BOARD" title="팀 게시판" description="팀의 소식과 생각을 편하게 나누는 곳입니다. 글을 남기면 팀 게시판에 저장됩니다." />
        <section className="board-layout section-space">
          <div className="board-list" aria-live="polite">
            <div className="board-list-heading"><p className="eyebrow">LATEST NOTES</p><span>{String(posts.length).padStart(2, "0")} POSTS</span></div>
            {posts.length ? posts.map((post, index) => (
              <article className="board-post" key={post.id}>
                <span className="board-post-number">{String(index + 1).padStart(2, "0")}</span>
                <div><h2>{post.title}</h2><p className="board-post-meta">{post.author} <span>·</span> {dateLabel(post.createdAt)}</p><p className="board-post-content">{post.content}</p></div>
              </article>
            )) : <p className="board-empty">아직 등록된 글이 없습니다.<br />첫 이야기를 남겨 주세요.</p>}
          </div>
          <aside className="board-write">
            <p className="eyebrow">WRITE A NOTE</p>
            <h2>팀에 남길<br />이야기가 있나요?</h2>
            <BoardComposer />
          </aside>
        </section>
      </main>
    </SiteFrame>
  );
}
