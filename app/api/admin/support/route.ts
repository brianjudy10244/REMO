import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sessionCookie, verifySession } from "@/lib/auth";
import { readSupportExchanges } from "@/lib/support-chat-db";

export const runtime = "nodejs";

export async function GET() {
  if (!(await verifySession((await cookies()).get(sessionCookie)?.value))) {
    return NextResponse.json({ error: "관리자 로그인이 필요합니다." }, { status: 401 });
  }
  try {
    return NextResponse.json(await readSupportExchanges(), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Support chat read failed", error instanceof Error ? error.name : "unknown");
    return NextResponse.json({ error: "상담 기록을 불러오지 못했습니다." }, { status: 503 });
  }
}
