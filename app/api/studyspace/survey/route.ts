import { NextResponse } from "next/server";
import { surveySchema } from "@/lib/studyspace-survey";
import { saveSurvey } from "@/lib/studyspace-db";
export const runtime = "nodejs";
export async function POST(request: Request) {
 const origin = request.headers.get("origin");
 if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ error: "페이지에서 다시 제출해 주세요." }, { status: 403 });
 let body: unknown;
 try { const raw = await request.text(); if (new TextEncoder().encode(raw).length > 16384) return NextResponse.json({ error: "입력 내용이 너무 깁니다." }, { status: 413 }); body = JSON.parse(raw); }
 catch { return NextResponse.json({ error: "설문 내용을 확인해 주세요." }, { status: 400 }); }
 const parsed = surveySchema.safeParse(body);
 if (!parsed.success) return NextResponse.json({ error: "공간은 1~3개, 공간별 세부 기능은 하나씩 골라 주세요." }, { status: 400 });
 try { await saveSurvey(parsed.data); return NextResponse.json({ ok: true }, { status: 201, headers: { "Cache-Control": "no-store" } }); }
 catch (error) { console.error("StudySpace survey save failed", error); return NextResponse.json({ error: "저장하지 못했습니다. 잠시 후 다시 제출해 주세요." }, { status: 503 }); }
}
