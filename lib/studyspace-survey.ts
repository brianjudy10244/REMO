import { z } from "zod";
import { groups, validPriorities } from "@/lib/studyspace-options";
export const surveySchema = z.object({
 stage: z.enum(["student", "graduate", "working", "other"]),
 notionUsage: z.enum(["daily", "sometimes", "tried", "never"]),
 pain: z.enum(["scattered", "planning", "overdue", "focus", "review", "none"]),
 features: z.array(z.enum(["plan", "learn", "manage", "review", "now"])).min(1).max(3),
 priorities: z.record(z.string()),
 quickAction: z.enum(["schedule", "tasks", "reflection", "unsure"]),
 interest: z.enum(["yes", "maybe", "no"]),
 feedback: z.string().trim().max(1000).optional().default(""),
}).refine(data => new Set(data.features).size === data.features.length && validPriorities(data.features, data.priorities), { message: "선택한 공간마다 해당 기능을 하나씩 골라주세요." });
export type SurveyAnswers = z.infer<typeof surveySchema>;
export type SurveyResponse = SurveyAnswers & { id: string; submittedAt: string; surveyVersion: number };
