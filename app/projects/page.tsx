import { getSiteData } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const { projects } = await getSiteData();
  return (
    <section className="section" id="projects">
      <div className="heading">
        <div>
          <div className="kicker">01 — OUR PROJECTS</div>
          <h2>우리가 만드는 것<span className="star">.</span></h2>
        </div>
        <p>{projects.length}개의 프로젝트, 리모의 네 가지 시선.</p>
      </div>
      <div className="projects">
        {projects.map((project, i) => (
          <article className={"project p" + (i % 4)} key={project.id}>
            <small>PROJECT {String(i + 1).padStart(2, "0")}</small>
            <h3>{project.name}</h3>
            <small>리모의 프로젝트</small>
          </article>
        ))}
      </div>
    </section>
  );
}
