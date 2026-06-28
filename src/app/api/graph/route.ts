import { NextResponse } from "next/server";
import { getGraph } from "@/lib/store/graph-store";
import { architectureGraphToResponse } from "@/lib/graph-response";

/** Full graph with layout positions for the UI */
export async function GET() {
  try {
    const graph = await getGraph();
    return NextResponse.json(architectureGraphToResponse(graph), {
      headers: { "Cache-Control": "private, max-age=10" },
    });
  } catch (error) {
    console.error("[GET /api/graph]", error);
    const message =
      error instanceof Error ? error.message : "Database unavailable";
    return NextResponse.json(
      {
        error: `${message}. Is Postgres running? Try: docker compose up -d`,
      },
      { status: 503 },
    );
  }
}
