"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar({ projectsCount, membersCount, intro }: { projectsCount: number; membersCount: number; intro: string }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <nav className="nav">
      <Link href="/" className={isActive("/") ? "active" : ""}>홈</Link>
      <Link href="/team-photo" className={isActive("/team-photo") ? "active" : ""}>팀사진</Link>
      <Link href="/projects" className={isActive("/projects") ? "active" : ""}>프로젝트 {String(projectsCount).padStart(2, "0")}</Link>
      <Link href="/members" className={isActive("/members") ? "active" : ""}>구성원 {String(membersCount).padStart(2, "0")}</Link>
      <span>{intro}</span>
    </nav>
  );
}
