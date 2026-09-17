import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "리모 — 레인서울 2년차",
  description: "레인서울 2년차 팀 리모의 프로젝트와 구성원",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
