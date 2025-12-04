import { DeploymentRolloutStrategy, DeploymentStatus } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await getCurrentUser();
  const db = getDb();
  const body = (await request.json()) as {
    packageId?: string;
    deviceGroupId?: string;
    name?: string;
    rolloutStrategy?: DeploymentRolloutStrategy;
    ringConfigJson?: unknown;
    startTime?: string;
  };

  if (!body.packageId || !body.deviceGroupId || !body.name) {
    return NextResponse.json({ error: "packageId, deviceGroupId und name sind Pflichtfelder." }, { status: 400 });
  }

  const pkg = await db.package.findFirst({
    where: { id: body.packageId, tenantId: session.tenantId },
  });
  const group = await db.deviceGroup.findFirst({
    where: { id: body.deviceGroupId, tenantId: session.tenantId },
  });

  if (!pkg || !group) {
    return NextResponse.json({ error: "Package oder Device Group gehört nicht zu diesem Tenant." }, { status: 404 });
  }

  const rolloutStrategy = body.rolloutStrategy ?? DeploymentRolloutStrategy.all_at_once;

  const deployment = await db.deployment.create({
    data: {
      tenantId: session.tenantId,
      packageId: pkg.id,
      deviceGroupId: group.id,
      name: body.name,
      rolloutStrategy,
      ringConfigJson: body.ringConfigJson ?? null,
      startTime: body.startTime ? new Date(body.startTime) : null,
      status: DeploymentStatus.pending,
      createdBy: session.id,
    },
  });

  return NextResponse.json(deployment, { status: 201 });
}
