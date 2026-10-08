import type { Metadata } from "next";
import { SiteFrame } from "@/app/components/site-chrome";
import { StudySpaceLanding } from "./landing";
import "./studyspace.css";
import "./studyspace-unified.css";
export const metadata: Metadata = { title: "StudySpace — 공부를 한곳에 · REMO", description: "계획, 학습, 할 일과 회고를 잇는 StudySpace 노션 템플릿. 필요한 기능을 알려주세요." };
export default function Page() { return <SiteFrame><StudySpaceLanding /></SiteFrame>; }
