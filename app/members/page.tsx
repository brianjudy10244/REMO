import type { Metadata } from "next";
import { PageHero, SiteFrame } from "@/app/components/site-chrome";
import { getSiteData } from "@/lib/db";

export const metadata: Metadata = { title: "멤버 — REMO" };
export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const { members } = await getSiteData();
  return (
    <SiteFrame>
      <main>
        <PageHero index="03" eyebrow="OUR PEOPLE" title="REMO라는 우리" description="서로 다른 장점과 생각을 가진 열 명이 한 팀으로 움직입니다. REMO를 만드는 사람들을 소개합니다." />
        <section className="members-zigzag section-space" aria-label="REMO 멤버 목록">
          {members.map((member, index) => (
            <article className="member-zigzag" key={member.id}>
              <span className="member-sequence">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2>{member.name}</h2>
                <p>TEAM REMO · MEMBER {String(index + 1).padStart(2, "0")}</p>
              </div>
              <span className="member-direction" aria-hidden="true">↘</span>
            </article>
          ))}
        </section>
      </main>
    </SiteFrame>
  );
}
