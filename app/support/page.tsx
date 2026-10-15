import type { Metadata } from "next";
import { PageHero, SiteFrame } from "@/app/components/site-chrome";
import { SupportChat } from "./support-chat";
import "./support.css";

export const metadata: Metadata = {
  title: "고객 상담 — REMO",
  description: "REMO 팀, 구성원, 프로젝트와 게시판에 관한 질문을 문서 근거와 함께 확인하세요.",
};

export default function SupportPage() {
  return <SiteFrame><main>
    <PageHero index="06" eyebrow="REMO SUPPORT" title="고객 상담" description="REMO 팀, 구성원, 프로젝트와 게시판에 관해 물어보세요. 새 브리핑 문서에서 근거를 찾아 답합니다." />
    <section className="support-layout section-space" aria-label="REMO 고객 상담">
      <aside className="support-intro">
        <p className="eyebrow">HOW IT WORKS</p>
        <h2>확인된 내용으로<br />답할게요<span>.</span></h2>
        <p>미션과 핵심 가치, 구성원, 프로젝트, 게시판 운영 방식을 문서에서 찾아 답합니다. 문서에 없는 내용은 임의로 만들어 답하지 않습니다.</p>
        <div className="support-source"><span>01 / REFERENCE</span><a href="https://docs.google.com/document/d/1qMLG4ENcxf4EMzkAbq2ACEUmo3STpbZoXKo2tpBdAKQ/edit" target="_blank" rel="noopener noreferrer">REMO 핵심 현황 및 전략 브리핑 <span aria-hidden="true">↗</span></a><small>게시판 기록은 문서에 실린 예시이며 실시간 현황은 아닙니다.</small></div>
      </aside>
      <SupportChat />
    </section>
  </main></SiteFrame>;
}
