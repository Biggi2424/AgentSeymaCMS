import { TicketPriority, TicketSource, TicketStatus } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";

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

  const status = (body.status as TicketStatus | undefined) ?? TicketStatus.new;
  const priority = (body.priority as TicketPriority | undefined) ?? TicketPriority.normal;
  const source = (body.source as TicketSource | undefined) ?? TicketSource.portal;
  const title = (body.title as string | undefined)?.trim();
  const description = (body.description as string | undefined)?.trim() ?? "";

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const ticket = await db.ticket.create({
    data: {
      tenantId: user.tenantId,
      humanId,
      title,
      description,
      status,
      priority,
      requesterUserId: body.requesterUserId ?? user.id,
      assigneeUserId: body.assigneeUserId ?? null,
      source,
    },
  });

  return NextResponse.json(ticket, { status: 201 });
}
