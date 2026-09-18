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
              src="/assets/remo-ocean-cover.jpg"
              alt="푸른 바다에서 해안으로 밀려오는 파도"
              width={500}
              height={751}
              priority
              sizes="(max-width: 720px) calc(100vw - 18px), (max-width: 1200px) 46vw, 520px"
            />
            <figcaption>
              <span>A WAVE, TOGETHER</span>
              <span>LEINN SEOUL · 2026</span>
            </figcaption>
          </figure>

          <div className="landing-aside">
            <p>서로 다른 우리가 모여<br />한 장면을 만듭니다.</p>
            <Link className="landing-enter" href="/about-us">
              ABOUT US 보기 <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div className="landing-edition" aria-hidden="true">
            <span>COVER STORY</span>
            <span>ISSUE 02</span>
          </div>
        </section>
      </main>
    </SiteFrame>
  );
}
