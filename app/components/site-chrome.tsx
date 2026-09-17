"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/about", label: "팀 소개" },
  { href: "/about-us", label: "ABOUT US" },
  { href: "/projects", label: "프로젝트" },
  { href: "/members", label: "멤버" },
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="site-header">
      <Link className="site-logo" href="/" aria-label="REMO 홈">REMO<span>✳</span></Link>
      <nav className="site-nav" aria-label="주요 메뉴">
        {navItems.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return <Link className={active ? "active" : ""} href={item.href} key={item.href}>{item.label}</Link>;
        })}
      </nav>
      <span className="header-meta">LEINN SEOUL · YEAR 02</span>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link className="site-logo" href="/">REMO<span>✳</span></Link>
      <p>서로 다른 우리가 모여, REMO가 됩니다.</p>
      <div><Link href="/admin">관리자</Link><span>© 2026 TEAM REMO</span></div>
    </footer>
  );
}

export function SiteFrame({ children }: { children: ReactNode }) {
  return <div className="site-shell"><SiteHeader />{children}<SiteFooter /></div>;
}

export function PageHero({ index, eyebrow, title, description }: { index: string; eyebrow: string; title: string; description: string }) {
  return (
    <section className="page-hero">
      <span className="page-index">{index}</span>
      <div><p className="eyebrow">{eyebrow}</p><h1>{title}<span>.</span></h1></div>
      <p>{description}</p>
    </section>
  );
}
