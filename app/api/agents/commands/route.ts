import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";

type AgentAction = "reconnect" | "disable";

function uniqTags(current: string[], additions: string[]) {
  return Array.from(new Set([...current, ...additions]));
}

export async function POST(request: NextRequest) {
  const session = await getCurrentUser();
  const db = getDb();
  const body = (await request.json()) as { agentId?: string; action?: AgentAction };
  const agentId = body.agentId;
  const action = body.action;

  if (!agentId || !action) {
    return NextResponse.json({ error: "agentId and action are required" }, { status: 400 });
  }

  const agent = await db.agent.findFirst({
    where: { id: agentId, tenantId: session.tenantId },
  });

  if (!agent) {
    return NextResponse.json({ error: "Agent not found for this tenant" }, { status: 404 });
  }

  if (action === "reconnect") {
    const updatedTags = uniqTags(agent.tags, ["reconnect-requested"]);
    await db.$transaction([
      db.agent.update({
        where: { id: agent.id },
        data: {
          tags: { set: updatedTags },
          lastSeenAt: agent.lastSeenAt ?? new Date(),
        },
      }),
      db.agentEvent.create({
        data: {
          tenantId: session.tenantId,
          agentId: agent.id,
          eventType: "reconnect_requested",
          severity: "info",
          message: `Reconnect requested by ${session.displayName}`,
          payloadJson: { userId: session.id },
        },
      }),
    ]);
    return NextResponse.json({ ok: true, status: "reconnect_requested" });
  }

  if (action === "disable") {
    const updatedTags = uniqTags(agent.tags, ["disabled"]);
    await db.$transaction([
      db.agent.update({
        where: { id: agent.id },
        data: {
          tags: { set: updatedTags },
          onlineStatus: "offline",
        },
      }),
      db.agentEvent.create({
        data: {
          tenantId: session.tenantId,
          agentId: agent.id,
          eventType: "agent_disabled",
          severity: "warning",
          message: `Agent disabled via portal`,
          payloadJson: { userId: session.id },
        },
      }),
    ]);
    return NextResponse.json({ ok: true, status: "disabled" });
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
}
