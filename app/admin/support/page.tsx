import { SupportDashboard } from "./support-dashboard";
import "./support-admin.css";

export const metadata = { title: "고객 상담 기록 — REMO", robots: { index: false, follow: false } };

export default function Page() {
  return <div className="support-admin-page">
    <header className="support-admin-nav"><a className="wordmark" href="/admin">REMO<span className="star">✳</span></a><span>고객 상담 기록</span><a href="/support">상담 페이지 ↗</a><a href="/api/auth/logout">로그아웃</a></header>
    <SupportDashboard />
  </div>;
}
