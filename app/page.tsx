import Image from "next/image";
import Link from "next/link";
import { getSiteData } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { settings } = await getSiteData();
  return (
    <section className="hero">
      <div>
        <div className="kicker"><span className="line" /> TEAM REMO</div>
        <h1>{settings.headline}<br />하나의 <span>{settings.teamName}.</span></h1>
        <p style={{ whiteSpace: "pre-line" }}>{settings.description}</p>
        <Link className="admin" href="/projects">우리의 프로젝트 ↗</Link>
      </div>
      <div className="hero-art">
        <Image src={settings.heroAssetUrl || "/assets/remo-knot.png"} alt="" width={1402} height={1122} priority />
      </div>
    </section>
  );
}
