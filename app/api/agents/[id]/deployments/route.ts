import { NextResponse } from "next/server";

interface RouteContext {
  params: { id: string };
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = context.params;

  const deployments = [
    {
      id: "deploy-1",
      agentId: id,
      packageName: "Office 365",
      status: "pending",
    },
  ];

  return NextResponse.json({ deployments });
}
