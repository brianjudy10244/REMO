import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { deleteBoardPost, updateBoardPost } from "@/lib/db";
import { sessionCookie, verifySession } from "@/lib/auth";
import { boardOwnerCookie, boardOwnerHash, isBoardOwnerToken } from "@/lib/board-owner";

export const runtime = "nodejs";

const postSchema = z.object({
  title: z.string().trim().min(1).max(120),
  author: z.string().trim().max(40).transform((value) => value || "익명"),
  content: z.string().trim().min(1).max(10000),
});

async function permissions() {
  const cookieStore = await cookies();
  const token = cookieStore.get(boardOwnerCookie)?.value;
  return {
    admin: await verifySession(cookieStore.get(sessionCookie)?.value),
    ownerHash: isBoardOwnerToken(token) ? boardOwnerHash(token) : "",
  };
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { admin, ownerHash } = await permissions();
  if (!admin && !ownerHash) return NextResponse.json({ error: "이 브라우저에서 작성한 글만 수정할 수 있습니다." }, { status: 403 });
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) return NextResponse.json({ error: "게시글을 찾을 수 없습니다." }, { status: 404 });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "요청 내용을 확인해 주세요." }, { status: 400 }); }
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "제목과 내용을 입력해 주세요." }, { status: 400 });

  try {
    const post = await updateBoardPost(id, parsed.data, ownerHash, admin);
    return post ? NextResponse.json({ post }) : NextResponse.json({ error: "이 글을 수정할 권한이 없습니다." }, { status: 403 });
  } catch (error) {
    console.error("Failed to update board post", error);
    return NextResponse.json({ error: "게시글을 수정하지 못했습니다." }, { status: 503 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { admin, ownerHash } = await permissions();
  if (!admin && !ownerHash) return NextResponse.json({ error: "이 브라우저에서 작성한 글만 삭제할 수 있습니다." }, { status: 403 });
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) return NextResponse.json({ error: "게시글을 찾을 수 없습니다." }, { status: 404 });
  try {
    return await deleteBoardPost(id, ownerHash, admin)
      ? NextResponse.json({ ok: true })
      : NextResponse.json({ error: "이 글을 삭제할 권한이 없습니다." }, { status: 403 });
  } catch (error) {
    console.error("Failed to delete board post", error);
    return NextResponse.json({ error: "게시글을 삭제하지 못했습니다." }, { status: 503 });
  }
}
