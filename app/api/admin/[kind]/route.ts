import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { sessionCookie, verifySession } from "@/lib/auth";
import { createItem, getSiteData } from "@/lib/db";
const kindSchema = z.enum(["projects", "members"]);
const bodySchema = z.object({ name: z.string().trim().min(1).max(80), isVisible: z.boolean().default(true) });
async function authorized() { return verifySession((await cookies()).get(sessionCookie)?.value); }
export async function GET(_: Request, context: { params: Promise<{ kind: string }> }) { if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); const { kind } = await context.params; if (!kindSchema.safeParse(kind).success) return NextResponse.json({ error: "Unknown collection" }, { status: 404 }); return NextResponse.json((await getSiteData(true))[kind as "projects" | "members"]); }
export async function POST(request: Request, context: { params: Promise<{ kind: string }> }) { if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); const { kind } = await context.params; const parsedKind = kindSchema.safeParse(kind); if (!parsedKind.success) return NextResponse.json({ error: "Unknown collection" }, { status: 404 }); try { const body = bodySchema.parse(await request.json()); const item = await createItem(parsedKind.data, body.name, body.isVisible); return NextResponse.json(item, { status: 201 }); } catch (error) { return NextResponse.json({ error: error instanceof z.ZodError ? "Invalid fields" : "Could not create item" }, { status: error instanceof z.ZodError ? 400 : 503 }); } }
