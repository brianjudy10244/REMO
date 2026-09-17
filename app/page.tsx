import Image from "next/image";
import Link from "next/link";
import { SiteFrame } from "@/app/components/site-chrome";
import { getSiteData } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { projects, members } = await getSiteData();

  return (
    <SiteFrame>
      <main>
        <section className="home-hero">
          <div className="hero-copy">
            <p className="eyebrow">RAIN SEOUL · SECOND YEAR</p>
            <h1>같이 만들고,<br />함께 나아가는<br /><span>TEAM REMO.</span></h1>
            <p className="hero-lead">레인서울에서 두 번째 해를 보내는 우리.<br />서로 다른 시선으로 네 개의 프로젝트를 만듭니다.</p>
            <div className="hero-actions">
              <Link className="button button-dark" href="/projects">프로젝트 보기</Link>
              <Link className="text-link" href="/about">REMO 이야기 <span>↗</span></Link>
            </div>
          </div>
          <figure className="team-photo hero-photo">
            <Image src="/assets/remo-team.jpg" alt="레인서울에서 함께한 REMO 팀 단체 사진" fill priority sizes="(max-width: 800px) 100vw, 58vw" />
            <figcaption><span>OUR TEAM, REMO</span><span>SEOUL · 2026</span></figcaption>
          </figure>
        </section>

        <section className="home-index" aria-label="REMO 소개">
          <div className="index-number">02</div>
          <div><small>YEARS TOGETHER</small><p>레인서울에서 함께한 시간</p></div>
          <div className="index-number">{String(members.length).padStart(2, "0")}</div>
          <div><small>TEAM MEMBERS</small><p>REMO를 만드는 사람들</p></div>
          <div className="index-number">{String(projects.length).padStart(2, "0")}</div>
          <div><small>PROJECTS</small><p>우리가 만드는 결과</p></div>
        </section>

        <section className="home-preview section-space">
          <div className="section-heading">
            <div><p className="eyebrow">SELECTED PROJECTS</p><h2>우리가 만드는 것<span>.</span></h2></div>
            <Link className="text-link" href="/projects">전체 프로젝트 <span>↗</span></Link>
          </div>
          <div className="project-preview-grid">
            {projects.map((project, index) => (
              <Link className={`project-card tone-${index % 4}`} href="/projects" key={project.id}>
                <div><span>PROJECT</span><span>{String(index + 1).padStart(2, "0")}</span></div>
                <h3>{project.name}</h3>
                <p>REMO PROJECT <span>↗</span></p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </SiteFrame>
  );
}
