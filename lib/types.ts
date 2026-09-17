export type Item = { id: string; name: string; position: number; isVisible: boolean };
export type Asset = { id: string; name: string; url: string; contentType: string; sizeBytes: number; createdAt: string };
export type SiteSettings = { teamName: string; intro: string; headline: string; description: string; heroAssetUrl: string | null };
export type SiteData = { settings: SiteSettings; projects: Item[]; members: Item[]; assets: Asset[] };
