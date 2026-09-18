import type { Metadata } from "next";
import { PageHero, SiteFrame } from "@/app/components/site-chrome";
import { getSiteData } from "@/lib/db";

export const metadata: Metadata = { title: "프로젝트 — REMO" };
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const { projects } = await getSiteData();
  return (
    <SiteFrame>
      <main>
        <PageHero index="02" eyebrow="OUR PROJECTS" title="우리가 만드는 것" description="REMO의 네 프로젝트를 소개합니다. 서로 다른 주제와 방법으로 우리만의 결과를 만듭니다." />
        <section className="project-list section-space">
          {projects.map((project, index) => <article className={`project-row tone-${index % 4}`} key={project.id}><div><span>PROJECT</span><b>{String(index + 1).padStart(2, "0")}</b></div><h2>{project.name}</h2><p>TEAM REMO<br />LEINN SEOUL · YEAR 02</p><span className="row-arrow">↗</span></article>)}
        </section>
      </main>
    </SiteFrame>
  );
}
