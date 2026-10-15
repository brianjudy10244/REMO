import type { Metadata } from "next";
import { PageHero, SiteFrame } from "@/app/components/site-chrome";
import { SupportChat } from "./support-chat";
import "./support.css";

export const metadata: Metadata = {
  title: "고객 상담 — REMO",
  description: "REMO 팀과 게시판에 관한 질문을 문서 근거와 함께 확인하세요.",
};

export default function SupportPage() {
  return <SiteFrame><main>
    <PageHero index="06" eyebrow="REMO SUPPORT" title="고객 상담" description="REMO 팀과 게시판에 관해 궁금한 점을 물어보세요. 브리핑 문서에서 근거를 찾아 답합니다." />
    <section className="support-layout section-space" aria-label="REMO 고객 상담">
      <aside className="support-intro">
        <p className="eyebrow">HOW IT WORKS</p>
        <h2>확인된 내용으로<br />답할게요<span>.</span></h2>
        <p>팀 소개와 게시판 운영 방식은 문서를 찾아 답변합니다. 문서에 없는 내용은 임의로 만들어 답하지 않습니다.</p>
        <div className="support-source"><span>01 / REFERENCE</span><a href="https://docs.google.com/document/d/158Ht1W1tewFN_n7_qpjcsDnDUP1W6-0dKCmb9ZKPzII/edit" target="_blank" rel="noopener noreferrer">REMO 브리핑 보고서 <span aria-hidden="true">↗</span></a><small>게시글 현황은 문서 작성 시점의 기록입니다.</small></div>
      </aside>
      <SupportChat />
    </section>
  </main></SiteFrame>;
}
