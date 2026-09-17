import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { adminUsername, requiredEnv } from "@/lib/env";

export const sessionCookie = "remo_admin_session";
const secret = () => new TextEncoder().encode(requiredEnv("AUTH_SECRET"));

export async function checkCredentials(username: string, password: string) {
  if (username !== adminUsername()) return false;
  return bcrypt.compare(password, requiredEnv("ADMIN_PASSWORD_HASH"));
}

export async function createSession() {
  return new SignJWT({ role: "admin" }).setProtectedHeader({ alg: "HS256" }).setSubject(adminUsername()).setIssuedAt().setExpirationTime("8h").sign(secret());
}

export async function verifySession(token?: string) {
  if (!token) return false;
  try {
    const verified = await jwtVerify(token, secret());
    return verified.payload.sub === adminUsername() && verified.payload.role === "admin";
  } catch { return false; }
}
