import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero, SiteFrame } from "@/app/components/site-chrome";

export const metadata: Metadata = { title: "팀 소개 — REMO" };

export default function AboutPage() {
  return (
    <SiteFrame>
      <main>
        <PageHero index="01" eyebrow="ABOUT REMO" title="우리는 REMO" description="레인서울에서 만나 두 번째 해를 함께 보내는 팀입니다. 각자의 관점과 경험을 연결해 새로운 프로젝트를 만듭니다." />
        <section className="about-layout section-space">
          <figure className="team-photo about-photo"><Image src="/assets/remo-team.jpg" alt="REMO 팀 단체 사진" fill priority sizes="(max-width: 800px) 100vw, 62vw" /></figure>
          <div className="about-copy">
            <p className="eyebrow">TOGETHER, WE ARE REMO</p>
            <h2>다른 시선이 모일 때<br />더 좋은 답이 나옵니다.</h2>
            <p>REMO는 열 명의 구성원이 함께 배우고, 실험하고, 결과를 만드는 팀입니다. 무디즘, PLN, 데이터플로우, 노웨사 네 프로젝트를 통해 우리의 가능성을 넓혀갑니다.</p>
            <Link className="button button-dark" href="/members">멤버 만나기</Link>
          </div>
        </section>
        <section className="values section-space">
          {[["01", "CONNECT", "각자의 생각을 연결합니다."], ["02", "CREATE", "아이디어를 실제 결과로 만듭니다."], ["03", "GROW", "과정과 배움을 함께 나눕니다."]].map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}
        </section>
      </main>
    </SiteFrame>
  );
}
