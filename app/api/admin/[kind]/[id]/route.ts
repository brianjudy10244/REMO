import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { sessionCookie, verifySession } from "@/lib/auth";
import { deleteItem, updateItem } from "@/lib/db";
const kindSchema = z.enum(["projects", "members"]);
const bodySchema = z.object({ name: z.string().trim().min(1).max(80), isVisible: z.boolean() });
async function auth() { return verifySession((await cookies()).get(sessionCookie)?.value); }
export async function PUT(request: Request, context: { params: Promise<{ kind: string; id: string }> }) { if (!(await auth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); const { kind, id } = await context.params; const parsed = kindSchema.safeParse(kind); if (!parsed.success) return NextResponse.json({ error: "Unknown collection" }, { status: 404 }); try { const body = bodySchema.parse(await request.json()); return NextResponse.json(await updateItem(parsed.data, id, body.name, body.isVisible)); } catch (error) { return NextResponse.json({ error: error instanceof z.ZodError ? "Invalid fields" : "Item not found" }, { status: error instanceof z.ZodError ? 400 : 404 }); } }
export async function DELETE(_: Request, context: { params: Promise<{ kind: string; id: string }> }) { if (!(await auth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); const { kind, id } = await context.params; const parsed = kindSchema.safeParse(kind); if (!parsed.success) return NextResponse.json({ error: "Unknown collection" }, { status: 404 }); try { await deleteItem(parsed.data, id); return NextResponse.json({ ok: true }); } catch { return NextResponse.json({ error: "Could not delete item" }, { status: 503 }); } }
