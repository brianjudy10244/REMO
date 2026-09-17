import { NextRequest, NextResponse } from "next/server";
import { sessionCookie, verifySession } from "@/lib/auth";
export async function middleware(request: NextRequest) { if (!request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/admin/login")) return NextResponse.next(); if (await verifySession(request.cookies.get(sessionCookie)?.value)) return NextResponse.next(); return NextResponse.redirect(new URL("/admin/login", request.url)); }
export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
