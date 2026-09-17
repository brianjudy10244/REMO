import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { getSiteData } from "@/lib/db";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "리모 — 레인서울 2년차",
  description: "레인서울 2년차 팀 리모의 프로젝트와 구성원",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { settings, projects, members } = await getSiteData();
  return (
    <html lang="ko">
      <body>
        <div className="shell">
          <header className="header">
            <Link className="wordmark" href="/">{settings.teamName}<span className="star">✳</span></Link>
            <NavBar projectsCount={projects.length} membersCount={members.length} intro={settings.intro} />
          </header>
          <main>{children}</main>
          <footer>
            <span>{settings.teamName} · {settings.intro}</span>
            <Link className="admin" href="/admin">관리자</Link>
            <span>© 2026 TEAM REMO</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
