import { NextResponse, type NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const db = getDb();
  const user = await getCurrentUser();

  const tickets = await db.ticket.findMany({
    where: { tenantId: user.tenantId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ tickets });
}

export async function POST(request: NextRequest) {
  const db = getDb();
  const user = await getCurrentUser();
  const body = await request.json();

  // Einfaches Human-ID-Schema wie "T-1001" (spaeter durch Sequenz ersetzen)
  const count = await db.ticket.count({
    where: { tenantId: user.tenantId },
  });
  const humanId = `T-${1000 + count + 1}`;

  const ticket = await db.ticket.create({
    data: {
      tenantId: user.tenantId,
      humanId,
      title: body.title ?? "Untitled Ticket",
      description: body.description ?? "",
      status: body.status ?? "new",
      priority: body.priority ?? "normal",
      requesterUserId: body.requesterUserId ?? user.id,
      assigneeUserId: body.assigneeUserId ?? null,
      source: body.source ?? "portal",
    },
  });

  return NextResponse.json(ticket, { status: 201 });
}
