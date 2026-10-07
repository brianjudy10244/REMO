import { NextResponse } from "next/server";
import { z } from "zod";
import { deleteBoardPost, updateBoardPost } from "@/lib/db";

export const runtime = "nodejs";

const postSchema = z.object({
  title: z.string().trim().min(1).max(120),
  author: z.string().trim().max(40).transform((value) => value || "익명"),
  content: z.string().trim().min(1).max(10000),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) return NextResponse.json({ error: "게시글을 찾을 수 없습니다." }, { status: 404 });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "요청 내용을 확인해 주세요." }, { status: 400 }); }
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "제목과 내용을 입력해 주세요." }, { status: 400 });

  try {
    const post = await updateBoardPost(id, parsed.data);
    return post ? NextResponse.json({ post }) : NextResponse.json({ error: "게시글을 찾을 수 없습니다." }, { status: 404 });
  } catch (error) {
    console.error("Failed to update board post", error);
    return NextResponse.json({ error: "게시글을 수정하지 못했습니다." }, { status: 503 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) return NextResponse.json({ error: "게시글을 찾을 수 없습니다." }, { status: 404 });
  try {
    return await deleteBoardPost(id)
      ? NextResponse.json({ ok: true })
      : NextResponse.json({ error: "게시글을 찾을 수 없습니다." }, { status: 404 });
  } catch (error) {
    console.error("Failed to delete board post", error);
    return NextResponse.json({ error: "게시글을 삭제하지 못했습니다." }, { status: 503 });
  }
}
