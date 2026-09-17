import Image from "next/image";
import Link from "next/link";
import { getSiteData } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getSiteData();
  const { settings, projects, members } = data;
  return <div className="shell">
    <header className="header"><Link className="wordmark" href="/">{settings.teamName}<span className="star">✳</span></Link><nav className="nav"><a href="#projects">프로젝트 {String(projects.length).padStart(2,"0")}</a><a href="#members">구성원 {String(members.length).padStart(2,"0")}</a><span>{settings.intro}</span></nav></header>
    <main>
      <section className="hero"><div><div className="kicker"><span className="line"/> TEAM REMO</div><h1>{settings.headline}<br/>하나의 <span>{settings.teamName}.</span></h1><p style={{ whiteSpace: "pre-line" }}>{settings.description}</p><a className="admin" href="#projects">우리의 프로젝트 ↗</a></div><div className="hero-art"><Image src={settings.heroAssetUrl || "/assets/rimo-knot.png"} alt="" width={1402} height={1122} priority /></div></section>
      <section className="section" id="projects"><div className="heading"><div><div className="kicker">01 — OUR PROJECTS</div><h2>우리가 만드는 것<span className="star">.</span></h2></div><p>{projects.length}개의 프로젝트, 리모의 네 가지 시선.</p></div><div className="projects">{projects.map((project,i)=><article className={'project p'+i%4} key={project.id}><small>PROJECT {String(i+1).padStart(2,"0")}</small><h3>{project.name}</h3><small>리모의 프로젝트</small></article>)}</div></section>
      <section className="section" id="members"><div className="heading"><div><div className="kicker">02 — OUR PEOPLE</div><h2>리모라는 우리<span className="star">.</span></h2></div><p>함께하는 {members.length}명을 소개합니다.</p></div><div className="members">{members.map((member,i)=><div className="member" key={member.id}><small>{String(i+1).padStart(2,"0")}</small><b>{member.name}</b></div>)}</div></section>
    </main><footer><span>{settings.teamName} · {settings.intro}</span><Link className="admin" href="/admin">관리자</Link><span>© 2026 TEAM REMO</span></footer>
  </div>;
}
