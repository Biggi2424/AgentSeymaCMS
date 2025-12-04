import { cookies } from "next/headers";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { getDb } from "@/lib/db";

export type UserRole = "owner" | "admin" | "operator" | "viewer";

export type TenantType = "user" | "company";
export type PersonaRole = "user" | "company_admin" | "company_agent";
export type PlanType = "trial" | "free" | "pro" | "enterprise";
export type ThrottleState = "normal" | "warning" | "throttled";

export interface SessionUser {
  id: string;
  tenantId: string;
  tenantType: TenantType;
  personaRole: PersonaRole;
  email: string;
  displayName: string;
  role: UserRole;
  plan: PlanType;
  trialExpiresAt: string | null;
  tokensUsedPeriod: number;
  tokensQuotaPeriod: number;
  throttleState: ThrottleState;
}

const SESSION_COOKIE = "neyraq_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
const AUTH_SECRET = process.env.AUTH_SECRET ?? "dev-secret-change-me";

export class UnauthenticatedError extends Error {
  constructor() {
    super("Unauthenticated");
    this.name = "UnauthenticatedError";
  }
}

function signSession(payload: Record<string, unknown>): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", AUTH_SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verifySession(token: string): any {
  const [body, sig] = token.split(".");
  if (!body || !sig) {
    throw new UnauthenticatedError();
  }
  const expected = createHmac("sha256", AUTH_SECRET).update(body).digest("base64url");
  const match = timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  if (!match) throw new UnauthenticatedError();
  return JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const derived = scryptSync(password, salt, 64).toString("hex");
  return timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(derived, "hex"));
}

export async function setSessionCookie(userId: string) {
  const token = signSession({ userId });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<SessionUser> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) throw new UnauthenticatedError();

  const payload = verifySession(token) as { userId?: string };
  if (!payload.userId) throw new UnauthenticatedError();

  const db = getDb();
  const user = await db.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user) throw new UnauthenticatedError();

  return {
    id: user.id,
    tenantId: user.tenantId,
    tenantType: (user.tenantType as TenantType) ?? "user",
    personaRole: (user.personaRole as PersonaRole) ?? "user",
    email: user.email,
    displayName: user.displayName,
    role: user.role as UserRole,
    plan: (user.plan as PlanType) ?? "free",
    trialExpiresAt: user.trialExpiresAt ? user.trialExpiresAt.toISOString() : null,
    tokensUsedPeriod: user.tokensUsedPeriod ?? 0,
    tokensQuotaPeriod: user.tokensQuotaPeriod ?? 0,
    throttleState: (user.throttleState as ThrottleState) ?? "normal",
  };
}
