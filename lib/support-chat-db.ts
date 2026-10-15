import { neon } from "@neondatabase/serverless";
import { requiredEnv } from "@/lib/env";

export type SupportSource = { id: string; title: string; document: string; url: string };
export type SupportExchange = {
  id: string;
  conversationId: string;
  question: string;
  answer: string;
  sources: SupportSource[];
  model: string | null;
  createdAt: string;
};

const sql = () => neon(requiredEnv("DATABASE_URL"));
let ready: Promise<void> | null = null;

async function ensureTable() {
  if (!ready) ready = (async () => {
    const query = sql();
    await query`CREATE TABLE IF NOT EXISTS support_chat_exchanges (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      conversation_id UUID NOT NULL,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      sources JSONB NOT NULL DEFAULT '[]'::jsonb,
      model TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`;
    await query`CREATE INDEX IF NOT EXISTS support_chat_created_idx ON support_chat_exchanges (created_at DESC)`;
    await query`CREATE INDEX IF NOT EXISTS support_chat_conversation_idx ON support_chat_exchanges (conversation_id, created_at)`;
  })().catch((error) => { ready = null; throw error; });
  await ready;
}

export async function saveSupportExchange(input: {
  conversationId: string;
  question: string;
  answer: string;
  sources: SupportSource[];
  model: string | null;
}) {
  await ensureTable();
  const query = sql();
  await query`INSERT INTO support_chat_exchanges (conversation_id, question, answer, sources, model)
    VALUES (${input.conversationId}::uuid, ${input.question}, ${input.answer}, ${JSON.stringify(input.sources)}::jsonb, ${input.model})`;
}

export async function readSupportExchanges() {
  await ensureTable();
  const query = sql();
  const [countRows, exchangeRows] = await Promise.all([
    query`SELECT COUNT(*)::integer AS total FROM support_chat_exchanges`,
    query`SELECT id, conversation_id, question, answer, sources, model, created_at
      FROM support_chat_exchanges ORDER BY created_at DESC LIMIT 100`,
  ]);
  const exchanges: SupportExchange[] = exchangeRows.map((row) => ({
    id: String(row.id),
    conversationId: String(row.conversation_id),
    question: String(row.question),
    answer: String(row.answer),
    sources: Array.isArray(row.sources) ? row.sources as SupportSource[] : [],
    model: row.model == null ? null : String(row.model),
    createdAt: new Date(String(row.created_at)).toISOString(),
  }));
  return { total: Number(countRows[0]?.total || 0), exchanges };
}
