import { NextResponse } from "next/server";
import { getGraph, saveSimulationRun } from "@/lib/store/graph-store";
import { runSimulation } from "@/lib/simulation/simulate";

/** Step 21 — POST /api/simulate */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { failedIds } = body as { failedIds?: string[] };

    if (!failedIds?.length) {
      return NextResponse.json(
        { error: "failedIds must be a non-empty array" },
        { status: 400 },
      );
    }

    const { graph } = await getGraph();
    const result = runSimulation({ graph, failedIds });

    void saveSimulationRun(failedIds, result).catch((err) =>
      console.error("[POST /api/simulate] save failed:", err),
    );

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Simulation failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
