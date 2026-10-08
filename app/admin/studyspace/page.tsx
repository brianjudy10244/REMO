import { Dashboard } from "./dashboard";
import "./studyspace-admin.css";
export const metadata = { title: "StudySpace 설문 관리자 — REMO", robots: { index: false, follow: false } };
export default function Page() { return <><header className="studyspace-admin-nav"><a href="/admin">← 팀 콘텐츠 관리</a><a href="/projects/studyspace">STUDYSPACE ↗</a><a href="/api/auth/logout">로그아웃</a></header><Dashboard /></>; }
