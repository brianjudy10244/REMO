import { NextResponse } from "next/server";
import { sessionCookie } from "@/lib/auth";
export async function GET() { const response = NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")); response.cookies.set(sessionCookie, "", { httpOnly: true, expires: new Date(0), path: "/" }); return response; }
