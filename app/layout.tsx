import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "REMO — LEINN Seoul 2년차",
  description: "LEINN Seoul 2년차, TEAM REMO의 프로젝트와 구성원",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
