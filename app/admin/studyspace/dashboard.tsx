"use client";
import { useEffect, useRef } from "react";
import { markup } from "./markup";
import { initAdmin } from "./admin-client";
export function Dashboard() { const root = useRef<HTMLDivElement>(null); useEffect(() => { if (root.current) return initAdmin(root.current); }, []); return <div className="studyspace-admin" ref={root} dangerouslySetInnerHTML={{ __html: markup }} />; }
