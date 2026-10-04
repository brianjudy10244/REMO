import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { createBoardPost, getBoardPosts } from "@/lib/db";
import { boardOwnerCookie, boardOwnerHash, isBoardOwnerToken, newBoardOwnerToken } from "@/lib/board-owner";

export const runtime = "nodejs";

const postSchema = z.object({
  title: z.string().trim().min(1).max(120),
  author: z.string().trim().max(40).transform((value) => value || "익명"),
  content: z.string().trim().min(1).max(10000),
});

export async function GET() {
  try {
    const token = (await cookies()).get(boardOwnerCookie)?.value;
    return NextResponse.json({ posts: await getBoardPosts(isBoardOwnerToken(token) ? boardOwnerHash(token) : "") });
  } catch (error) {
    console.error("Failed to load board posts", error);
    return NextResponse.json({ error: "게시글을 불러오지 못했습니다." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "요청 내용을 확인해 주세요." }, { status: 400 });
  }

  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "제목과 내용을 입력해 주세요. (제목 120자, 내용 10,000자 이내)" }, { status: 400 });
  }

  try {
    const existingToken = (await cookies()).get(boardOwnerCookie)?.value;
    const token = isBoardOwnerToken(existingToken) ? existingToken : newBoardOwnerToken();
    const post = await createBoardPost(parsed.data, boardOwnerHash(token));
    const response = NextResponse.json({ post }, { status: 201 });
    response.cookies.set(boardOwnerCookie, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  } catch (error) {
    console.error("Failed to save board post", error);
    return NextResponse.json({ error: "게시글을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요." }, { status: 503 });
  }
}
