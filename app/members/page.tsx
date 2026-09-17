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
        <section className="member-list section-space">
          {members.map((member, index) => <article className="member-card" key={member.id}><span>{String(index + 1).padStart(2, "0")}</span><div className="member-initial">{Array.from(member.name)[0]}</div><h2>{member.name}</h2><p>TEAM REMO</p></article>)}
        </section>
      </main>
    </SiteFrame>
  );
}
