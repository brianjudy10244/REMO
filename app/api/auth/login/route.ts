import { NextResponse } from "next/server";
import { z } from "zod";
import { checkCredentials, createSession, sessionCookie } from "@/lib/auth";

const bodySchema = z.object({ username: z.string().min(1).max(100), password: z.string().min(1).max(200) });

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    if (!(await checkCredentials(body.username, body.password))) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    const response = NextResponse.json({ ok: true });
    response.cookies.set(sessionCookie, await createSession(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 });
    return response;
  } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
}
