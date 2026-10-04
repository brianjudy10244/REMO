import { createHash, randomBytes } from "node:crypto";

export const boardOwnerCookie = "remo_board_owner";

const ownerTokenPattern = /^[A-Za-z0-9_-]{43}$/;

export function isBoardOwnerToken(value?: string): value is string {
  return Boolean(value && ownerTokenPattern.test(value));
}

export function newBoardOwnerToken(): string {
  return randomBytes(32).toString("base64url");
}

export function boardOwnerHash(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
