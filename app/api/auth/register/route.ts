import { NextResponse, type NextRequest } from "next/server";
import { randomBytes } from "crypto";
import { getDb } from "@/lib/db";
import { hashPassword, setSessionCookie } from "@/lib/auth";

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export async function POST(request: NextRequest) {
  const db = getDb();
  const body = (await request.json()) as { email?: string; password?: string; displayName?: string };
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  const displayName = (body.displayName ?? "").trim();

  if (!email || !password || !displayName) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const existing = await db.user.findFirst({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  const slugBase = slugify(email.split("@")[0] || displayName) || "tenant";
  const slug = `${slugBase}-${randomBytes(3).toString("hex")}`;

  const tenant = await db.tenant.create({
    data: {
      name: displayName,
      slug,
    },
  });

  const user = await db.user.create({
    data: {
      tenantId: tenant.id,
      email,
      displayName,
      role: "owner",
      authProvider: "local",
      passwordHash: hashPassword(password),
      plan: "trial",
      trialExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      tokensQuotaPeriod: 50000,
      tokensUsedPeriod: 0,
      throttleState: "normal",
      tenantType: "user",
      personaRole: "user",
    },
  });

  await setSessionCookie(user.id);
  return NextResponse.json({ ok: true }, { status: 201 });
}
