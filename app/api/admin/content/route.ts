import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSiteData } from "@/lib/db";
import { sessionCookie, verifySession } from "@/lib/auth";
export async function GET() { if (!(await verifySession((await cookies()).get(sessionCookie)?.value))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); try { return NextResponse.json(await getSiteData(true)); } catch { return NextResponse.json({ error: "Database is not configured" }, { status: 503 }); } }
