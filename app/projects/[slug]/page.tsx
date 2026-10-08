import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { SiteFrame } from "@/app/components/site-chrome";
import { getSiteData } from "@/lib/db";
import { getProjectDetail, getProjectHref, getProjectSlug } from "@/lib/project-details";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { projects } = await getSiteData();
  const project = projects.find((item) => getProjectSlug(item) === slug);
  return { title: project ? `${project.name} — REMO 프로젝트` : "프로젝트 — REMO" };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  if (slug === "pln") permanentRedirect("/projects/studyspace");
  const { projects } = await getSiteData();
  const index = projects.findIndex((item) => getProjectSlug(item) === slug);
  if (index < 0) notFound();
  const project = projects[index];
  const detail = getProjectDetail(project);
  const nextProject = projects.length > 1 ? projects[(index + 1) % projects.length] : null;

  return (
    <SiteFrame>
      <main className="project-detail">
        <nav className="project-breadcrumb" aria-label="현재 위치">
          <Link href="/projects">← 프로젝트 목록</Link>
          <span>{project.name}</span>
        </nav>
        <header className={`project-detail-hero tone-${index % 4}`}>
          <div className="project-detail-topline"><span>PROJECT {String(index + 1).padStart(2, "0")}</span><span>TEAM REMO</span></div>
          <h1>{project.name}<span>.</span></h1>
          <div className="project-detail-bottomline"><p>LEINN SEOUL · YEAR 02</p><span aria-hidden="true">↓</span></div>
        </header>
        <nav className="project-section-nav" aria-label="프로젝트 내용">
          <a href="#introduction">01 소개</a>
          <a href="#activities">02 진행 내용</a>
          <a href="#archive">03 사진과 기록</a>
        </nav>
        <section id="introduction" className="project-detail-section">
          <div><p className="eyebrow">01 / INTRODUCTION</p><h2>프로젝트 소개</h2></div>
          <div className="project-detail-copy">
            <p className="project-detail-lead">{detail?.introduction ?? `${project.name}의 소개를 준비하고 있습니다.`}</p>
            {!detail?.introduction && <p className="project-pending">프로젝트의 시작 이야기와 어떤 일을 하는지 이곳에 담을 예정입니다.</p>}
          </div>
        </section>
        <section id="activities" className="project-detail-section">
          <div><p className="eyebrow">02 / IN PROGRESS</p><h2>진행 내용</h2></div>
          <div className="project-detail-copy">
            {detail?.activities.length ? <ul className="project-activity-list">{detail.activities.map((activity, i) => <li key={i}>{activity}</li>)}</ul> : <p className="project-pending">진행 중인 일과 앞으로의 계획을 정리해 공유하겠습니다.</p>}
          </div>
        </section>
        <section id="archive" className="project-detail-section">
          <div><p className="eyebrow">03 / ARCHIVE</p><h2>사진과 기록</h2></div>
          <div className="project-detail-copy">
            {detail?.images.length ? <div className="project-detail-gallery">{detail.images.map((image) => <figure key={image.src}><img src={image.src} alt={image.alt} /><figcaption>{image.caption}</figcaption></figure>)}</div> : <div className="project-archive-empty"><span aria-hidden="true">↗</span><p>활동 사진과 결과물은 준비되는 대로 소개하겠습니다.</p></div>}
          </div>
        </section>
        <nav className="project-detail-pagination" aria-label="다른 프로젝트 보기">
          <Link href="/projects" className="text-link">모든 프로젝트 보기</Link>
          {nextProject && <Link href={getProjectHref(nextProject)} className="project-next"><span>다음 프로젝트</span><strong>{nextProject.name}</strong><b aria-hidden="true">↗</b></Link>}
        </nav>
      </main>
    </SiteFrame>
  );
}
