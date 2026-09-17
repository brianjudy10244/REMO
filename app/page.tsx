import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFrame } from "@/app/components/site-chrome";

export const metadata: Metadata = { title: "REMO — LEINN Seoul, Year 02" };

export default function HomePage() {
  return (
    <SiteFrame>
      <main className="landing-main">
        <section className="landing-hero" aria-labelledby="landing-title">
          <div className="landing-heading">
            <p className="eyebrow">LEINN SEOUL · SECOND YEAR</p>
            <h1 id="landing-title">
              <span>WE ARE</span>
              REMO<span className="landing-dot">.</span>
            </h1>
          </div>

          <figure className="landing-photo">
            <Image
              src="/assets/remo-team.jpg"
              alt="레인서울에서 함께한 REMO 팀 단체 사진"
              width={1170}
              height={870}
              priority
              sizes="(max-width: 720px) calc(100vw - 36px), (max-width: 1200px) 92vw, 80vw"
            />
            <figcaption>
              <span>REMO, TOGETHER</span>
              <span>SEOUL · 2026</span>
            </figcaption>
          </figure>

          <div className="landing-aside">
            <p>서로 다른 우리가 모여<br />하나의 장면을 만듭니다.</p>
            <Link className="landing-enter" href="/about">
              팀 이야기 보기 <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div className="landing-edition" aria-hidden="true">
            <span>TEAM PORTRAIT</span>
            <span>ISSUE 02</span>
          </div>
        </section>
      </main>
    </SiteFrame>
  );
}
