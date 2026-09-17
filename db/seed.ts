import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is required.");
const sql = neon(url);

const projects = ["무디즘", "PLN", "데이터플로우", "노웨사"];
const members = ["유진", "정우", "브루노", "이든", "막스", "조이", "로", "겸", "쏠", "비크"];

await sql`INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING`;
for (const [position, name] of projects.entries()) {
  await sql`INSERT INTO projects (name, position) VALUES (${name}, ${position + 1}) ON CONFLICT (name) DO NOTHING`;
}
for (const [position, name] of members.entries()) {
  await sql`INSERT INTO members (name, position) VALUES (${name}, ${position + 1}) ON CONFLICT (name) DO NOTHING`;
}
console.log("REMO initial content is ready.");
