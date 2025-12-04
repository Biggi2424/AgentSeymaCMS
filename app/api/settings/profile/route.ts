import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function PATCH(request: NextRequest) {
  const session = await getCurrentUser();
  const db = getDb();
  const body = (await request.json()) as { displayName?: string };

  const displayName = (body.displayName ?? "").trim();
  if (!displayName) {
    return NextResponse.json({ error: "Display Name is required" }, { status: 400 });
  }

  await db.user.update({
    where: { id: session.id },
    data: { displayName },
  });

  return NextResponse.json({ ok: true });
}
