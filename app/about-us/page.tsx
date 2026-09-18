import type { Metadata } from "next";
import Image from "next/image";
import { PageHero, SiteFrame } from "@/app/components/site-chrome";

export const metadata: Metadata = {
  title: "ABOUT US — REMO",
  description: "TEAM REMO의 미션, 비전, 핵심가치",
};

const coreValues = [
  {
    number: "01",
    title: "학습",
    english: "GROWTH",
    description: "우리는 함께 학습합니다. 개인의 경험과 배움을 팀으로 연결하며, 시행착오와 프로젝트를 통해 성장합니다. 지레짐작하지 않고 적극적으로 질문하고 행동합니다. 개인의 성장이 팀의 성장으로 이어지고, 팀의 성장이 다시 개인의 성장을 돕는 선순환을 만듭니다.",
  },
  {
    number: "02",
    title: "협력",
    english: "COLLABORATION",
    description: "우리는 함께 성과를 만듭니다. 개인의 강점과 다양성을 통해 더 큰 가치를 만들어내며, 서로의 성장을 응원합니다. 다양한 관점과 생각을 환영하며, 개인의 성과를 팀의 성과로 확장합니다. 우리는 혼자서 빠르게 가기보다 함께 멀리 가는 길을 선택합니다.",
  },
  {
    number: "03",
    title: "신뢰",
    english: "PSYCHOLOGICAL SAFETY",
    description: "우리는 신뢰를 쌓아갑니다. 어려움과 실수, 아쉬움을 그때그때 공유하며, 팀원 모두에게 안전한 팀이 될 것입니다. 서로를 믿고 의지할 수 있는 공동체가 되기를 희망합니다.",
  },
  {
    number: "04",
    title: "책임",
    english: "ACCOUNTABILITY",
    description: "우리는 서로를 책임집니다. 역할과 약속에 책임을 다하며, 문제를 외면하거나 미루지 않고 스스로 그리고 함께 해결하려 노력합니다. 말하는 것과 말하지 않는 것 모두 의사 표현입니다. 자신의 의사 표현에 대한 결과를 책임집니다.",
  },
  {
    number: "05",
    title: "실행",
    english: "EXPERIMENT",
    description: "골대가 보이면 일단 합니다. 목적지를 정하면 우선 실행합니다.",
  },
];

export default function AboutUsPage() {
  return (
    <SiteFrame>
      <main>
        <PageHero
          index="04"
          eyebrow="MISSION · VISION · CORE VALUE"
          title="ABOUT US"
          description="REMO가 같은 방향으로 움직이기 위해 함께 세운 약속입니다. 우리가 존재하는 이유와 도달할 모습, 일하는 방식을 소개합니다."
        />

        <section className="about-us-portrait section-space" aria-label="REMO 팀 소개">
          <figure>
            <Image src="/assets/remo-team.jpg" alt="LEINN Seoul에서 함께한 REMO 팀 단체 사진" width={1170} height={870} priority sizes="(max-width: 800px) 100vw, 92vw" />
            <figcaption><span>TOGETHER, WE ARE REMO</span><span>LEINN SEOUL · YEAR 02</span></figcaption>
          </figure>
          <div>
            <p className="eyebrow">WHO WE ARE</p>
            <h2>다른 시선이 모일 때<br />더 좋은 답이 나옵니다.</h2>
            <p>REMO는 열 명의 구성원이 함께 배우고, 실험하고, 결과를 만드는 팀입니다. 각자의 관점과 경험을 연결해 우리의 가능성을 넓혀갑니다.</p>
          </div>
        </section>

        <section className="mvc-statements section-space" aria-label="미션과 비전">
          <article className="mvc-statement mvc-mission">
            <div className="mvc-label"><span>01</span><p>MISSION</p></div>
            <h2>가치와 문제를<br />비즈니스로 풀어내며<br /><strong>실행으로 증명한다.</strong></h2>
            <p>우리가 존재하는 이유</p>
          </article>
          <article className="mvc-statement mvc-vision">
            <div className="mvc-label"><span>02</span><p>VISION · YEAR 02</p></div>
            <h2>혼자가 아닌 팀으로 선순환하며,<br /><strong>시장의 평가 속에서 성장한다.</strong></h2>
            <div className="vision-target"><span>OUR TARGET</span><p>인당 매출 600만원 <em>OR</em> 수익 n원 달성</p></div>
          </article>
        </section>

        <section className="core-values-section section-space" aria-labelledby="core-values-title">
          <header className="core-values-heading">
            <div><p className="eyebrow">HOW WE WORK TOGETHER</p><h2 id="core-values-title">CORE VALUE<span>.</span></h2></div>
            <p>함께 성장하고 성과를 만들기 위해<br />REMO가 선택한 다섯 가지 태도입니다.</p>
          </header>
          <ol className="core-value-list">
            {coreValues.map((value) => (
              <li key={value.number}>
                <span className="core-value-number">{value.number}</span>
                <div className="core-value-name"><small>{value.english}</small><h3>{value.title}</h3></div>
                <p>{value.description}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </SiteFrame>
  );
}
