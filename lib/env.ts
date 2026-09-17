export function requiredEnv(name: "DATABASE_URL" | "AUTH_SECRET" | "ADMIN_PASSWORD_HASH" | "BLOB_READ_WRITE_TOKEN") {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

export function adminUsername() {
  return process.env.ADMIN_USERNAME || "remo_admin";
}
