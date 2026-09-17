import { neon } from "@neondatabase/serverless";
import { requiredEnv } from "@/lib/env";
import type { Asset, Item, SiteData, SiteSettings } from "@/lib/types";

const sql = () => neon(requiredEnv("DATABASE_URL"));

const settingsDefaults: SiteSettings = {
  teamName: "REMO",
  intro: "레인서울 2년차",
  headline: "열 명의 시선,",
  description: "레인서울에서 함께하는 두 번째 해.\n우리의 이름으로, 우리의 프로젝트를 만듭니다.",
  heroAssetUrl: null,
};

function item(row: Record<string, unknown>): Item {
  return { id: String(row.id), name: String(row.name), position: Number(row.position), isVisible: Boolean(row.is_visible) };
}

function asset(row: Record<string, unknown>): Asset {
  return { id: String(row.id), name: String(row.name), url: String(row.url), contentType: String(row.content_type), sizeBytes: Number(row.size_bytes), createdAt: new Date(String(row.created_at)).toISOString() };
}

export async function getSiteData(includeHidden = false): Promise<SiteData> {
  if (!process.env.DATABASE_URL) {
    return { settings: settingsDefaults, projects: ["무디즘", "PLN", "데이터플로우", "노웨사"].map((name, i) => ({ id: `demo-p-${i}`, name, position: i + 1, isVisible: true })), members: ["유진", "정우", "브루노", "이든", "막스", "조이", "로", "겸", "쏠", "비크"].map((name, i) => ({ id: `demo-m-${i}`, name, position: i + 1, isVisible: true })), assets: [] };
  }
  const query = sql();
  const [settingsRows, projectRows, memberRows, assetRows] = await Promise.all([
    query`SELECT team_name, intro, headline, description, hero_asset_url FROM site_settings WHERE id = 1`,
    includeHidden ? query`SELECT id, name, position, is_visible FROM projects ORDER BY position` : query`SELECT id, name, position, is_visible FROM projects WHERE is_visible = TRUE ORDER BY position`,
    includeHidden ? query`SELECT id, name, position, is_visible FROM members ORDER BY position` : query`SELECT id, name, position, is_visible FROM members WHERE is_visible = TRUE ORDER BY position`,
    includeHidden ? query`SELECT id, name, url, content_type, size_bytes, created_at FROM assets ORDER BY created_at DESC` : Promise.resolve([]),
  ]);
  const row = settingsRows[0];
  const settings = row ? { teamName: String(row.team_name), intro: String(row.intro), headline: String(row.headline), description: String(row.description), heroAssetUrl: row.hero_asset_url ? String(row.hero_asset_url) : null } : settingsDefaults;
  return { settings, projects: projectRows.map(item), members: memberRows.map(item), assets: assetRows.map(asset) };
}

export async function updateSettings(data: SiteSettings) {
  const query = sql();
  await query`INSERT INTO site_settings (id, team_name, intro, headline, description, hero_asset_url)
    VALUES (1, ${data.teamName}, ${data.intro}, ${data.headline}, ${data.description}, ${data.heroAssetUrl})
    ON CONFLICT (id) DO UPDATE SET team_name = EXCLUDED.team_name, intro = EXCLUDED.intro, headline = EXCLUDED.headline, description = EXCLUDED.description, hero_asset_url = EXCLUDED.hero_asset_url, updated_at = NOW()`;
}

export async function createItem(kind: "projects" | "members", name: string, isVisible: boolean) {
  const query = sql();
  const rows = kind === "projects" ? await query`SELECT COALESCE(MAX(position), 0) + 1 AS next_position FROM projects` : await query`SELECT COALESCE(MAX(position), 0) + 1 AS next_position FROM members`;
  const position = Number(rows[0].next_position);
  const rowsCreated = kind === "projects"
    ? await query`INSERT INTO projects (name, position, is_visible) VALUES (${name}, ${position}, ${isVisible}) RETURNING id, name, position, is_visible`
    : await query`INSERT INTO members (name, position, is_visible) VALUES (${name}, ${position}, ${isVisible}) RETURNING id, name, position, is_visible`;
  return item(rowsCreated[0]);
}

export async function updateItem(kind: "projects" | "members", id: string, name: string, isVisible: boolean) {
  const query = sql();
  const rows = kind === "projects"
    ? await query`UPDATE projects SET name=${name}, is_visible=${isVisible}, updated_at=NOW() WHERE id=${id} RETURNING id, name, position, is_visible`
    : await query`UPDATE members SET name=${name}, is_visible=${isVisible}, updated_at=NOW() WHERE id=${id} RETURNING id, name, position, is_visible`;
  if (!rows[0]) throw new Error("Item was not found.");
  return item(rows[0]);
}

export async function deleteItem(kind: "projects" | "members", id: string) {
  const query = sql();
  if (kind === "projects") await query`DELETE FROM projects WHERE id=${id}`;
  else await query`DELETE FROM members WHERE id=${id}`;
}

export async function reorderItems(kind: "projects" | "members", ids: string[]) {
  const query = sql();
  await query`BEGIN`;
  try {
    for (const [index, id] of ids.entries()) {
      if (kind === "projects") await query`UPDATE projects SET position=${index + 1}, updated_at=NOW() WHERE id=${id}`;
      else await query`UPDATE members SET position=${index + 1}, updated_at=NOW() WHERE id=${id}`;
    }
    await query`COMMIT`;
  } catch (error) {
    await query`ROLLBACK`;
    throw error;
  }
}

export async function saveAsset(data: Omit<Asset, "id" | "createdAt">) {
  const query = sql();
  const rows = await query`INSERT INTO assets (name, url, content_type, size_bytes) VALUES (${data.name}, ${data.url}, ${data.contentType}, ${data.sizeBytes}) RETURNING id, name, url, content_type, size_bytes, created_at`;
  return asset(rows[0]);
}

export async function deleteAssetRecord(id: string) {
  const query = sql();
  const rows = await query`DELETE FROM assets WHERE id=${id} RETURNING url`;
  if (!rows[0]) throw new Error("Asset was not found.");
  return String(rows[0].url);
}
