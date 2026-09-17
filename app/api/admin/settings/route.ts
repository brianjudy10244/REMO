import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { sessionCookie, verifySession } from "@/lib/auth";
import { updateSettings } from "@/lib/db";
const schema = z.object({ teamName: z.string().trim().min(1).max(80), intro: z.string().trim().min(1).max(120), headline: z.string().trim().min(1).max(120), description: z.string().trim().min(1).max(400), heroAssetUrl: z.string().url().nullable().optional().transform((value) => value ?? null) });
export async function PUT(request: Request) { if (!(await verifySession((await cookies()).get(sessionCookie)?.value))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); try { await updateSettings(schema.parse(await request.json())); return NextResponse.json({ ok: true }); } catch (error) { return NextResponse.json({ error: error instanceof z.ZodError ? "Invalid fields" : "Database unavailable" }, { status: error instanceof z.ZodError ? 400 : 503 }); } }
