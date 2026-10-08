"use client";
import { useEffect, useRef } from "react";
import { markup } from "./markup";
import { initSurvey } from "./survey-client";
export function StudySpaceLanding() {
 const root = useRef<HTMLDivElement>(null);
 useEffect(() => { if (root.current) return initSurvey(root.current); }, []);
 return <div id="studyspace-top" className="studyspace" ref={root} dangerouslySetInnerHTML={{ __html: markup }} />;
}
