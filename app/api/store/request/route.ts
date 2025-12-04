import { CatalogRequestStatus } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await getCurrentUser();
  const db = getDb();
  const body = (await request.json()) as { catalogItemId?: string; agentId?: string };

  if (!body.catalogItemId) {
    return NextResponse.json({ error: "catalogItemId fehlt" }, { status: 400 });
  }

  const item = await db.catalogItem.findFirst({
    where: { id: body.catalogItemId, tenantId: session.tenantId, isActive: true },
  });

  if (!item) {
    return NextResponse.json({ error: "Catalog Item gehört nicht zu diesem Tenant oder ist inaktiv." }, { status: 404 });
  }

  const requestRow = await db.catalogRequest.create({
    data: {
      id: undefined,
      tenantId: session.tenantId,
      catalogItemId: item.id,
      requesterUserId: session.id,
      agentId: body.agentId ?? null,
      status: CatalogRequestStatus.requested,
    },
  });

  return NextResponse.json(requestRow, { status: 201 });
}
