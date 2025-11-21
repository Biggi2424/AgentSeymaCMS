import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Spaeter: Deployment in DB schreiben und Jobs planen.
  const deployment = {
    id: randomUUID(),
    ...body,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json(deployment, { status: 201 });
}
