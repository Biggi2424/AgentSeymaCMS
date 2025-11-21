import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const payload = await request.json();

  // Spaeter: Agent in DB anlegen/aktualisieren und Events loggen.
  return NextResponse.json(
    {
      status: "ok",
      received: payload,
      message: "Agent-Check-in stub (noch ohne DB).",
    },
    { status: 200 },
  );
}
