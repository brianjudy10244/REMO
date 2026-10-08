import { neon } from "@neondatabase/serverless";
import { requiredEnv } from "@/lib/env";
import type { SurveyAnswers, SurveyResponse } from "@/lib/studyspace-survey";
const sql = () => neon(requiredEnv("DATABASE_URL"));
let ready: Promise<void> | null = null;
async function ensureTable() {
 if (!ready) ready = (async () => {
  const query = sql();
  await query`CREATE TABLE IF NOT EXISTS studyspace_survey_responses (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(), answers JSONB NOT NULL,
   survey_version INTEGER NOT NULL DEFAULT 3, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
  await query`CREATE INDEX IF NOT EXISTS studyspace_survey_created_idx ON studyspace_survey_responses (created_at DESC)`;
 })().catch(error => { ready = null; throw error; });
 await ready;
}
export async function saveSurvey(answers: SurveyAnswers) {
 await ensureTable(); const query = sql();
 await query`INSERT INTO studyspace_survey_responses (answers, survey_version) VALUES (${JSON.stringify(answers)}::jsonb, 3)`;
}
export async function readSurveys(): Promise<SurveyResponse[]> {
 await ensureTable(); const query = sql();
 const rows = await query`SELECT id, answers, survey_version, created_at FROM studyspace_survey_responses ORDER BY created_at DESC`;
 return rows.map(row => ({ ...(row.answers as SurveyAnswers), id: String(row.id), submittedAt: new Date(String(row.created_at)).toISOString(), surveyVersion: Number(row.survey_version) }));
}
