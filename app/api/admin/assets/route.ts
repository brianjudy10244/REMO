import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { put } from "@vercel/blob";
import { sessionCookie, verifySession } from "@/lib/auth";
import { saveAsset } from "@/lib/db";
const allowed = new Set(["image/png", "image/jpeg", "image/webp", "application/pdf"]);
export async function POST(request: Request) { if (!(await verifySession((await cookies()).get(sessionCookie)?.value))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); const form = await request.formData(); const file = form.get("file"); if (!(file instanceof File) || !allowed.has(file.type) || file.size > 10 * 1024 * 1024) return NextResponse.json({ error: "PNG, JPG, WEBP, PDF under 10MB required" }, { status: 400 }); try { const blob = await put(`remo/${crypto.randomUUID()}-${file.name}`, file, { access: "public", addRandomSuffix: true }); const asset = await saveAsset({ name: file.name, url: blob.url, contentType: file.type, sizeBytes: file.size }); return NextResponse.json(asset, { status: 201 }); } catch { return NextResponse.json({ error: "Blob upload is not configured" }, { status: 503 }); } }
