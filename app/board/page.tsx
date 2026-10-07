import type { Metadata } from "next";
import { PageHero, SiteFrame } from "@/app/components/site-chrome";
import { getBoardPosts } from "@/lib/db";
import { BoardComposer } from "./board-composer";
import { BoardList } from "./board-list";

export const metadata: Metadata = { title: "게시판 — REMO" };
export const dynamic = "force-dynamic";

export default async function BoardPage() {
  const posts = await getBoardPosts();
  return (
    <SiteFrame>
      <main>
        <PageHero index="05" eyebrow="REMO BOARD" title="팀 게시판" description="팀의 소식과 생각을 편하게 나누는 곳입니다. 글을 남기면 팀 게시판에 저장됩니다." />
        <section className="board-layout section-space">
          <BoardList initialPosts={posts} />
          <aside className="board-write">
            <p className="eyebrow">WRITE A NOTE</p>
            <h2>팀에 남길<br />이야기가 있나요?</h2>
            <p className="board-admin-note">누구나 글 옆의 ··· 메뉴에서 게시글을 수정하거나 삭제할 수 있습니다. 함께 사용하는 게시판이니 다른 사람의 글을 바꿀 때도 신중하게 확인해 주세요.</p>
            <BoardComposer />
          </aside>
        </section>
      </main>
    </SiteFrame>
  );
}
