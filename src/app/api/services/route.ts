import { NextResponse } from "next/server";
import { getGraph } from "@/lib/store/graph-store";
import type { ServiceTier } from "@/lib/simulation/types";
import { addService } from "@/lib/store/graph-store";

/** Step 19 — GET /api/services */
export async function GET() {
  const { graph } = await getGraph();
  return NextResponse.json({ services: graph.services });
}

/** Step 20 — POST /api/services */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      tier = "internal",
      weight = 3,
      restoreTimeMin = 10,
      restoreCost = 1000,
      dependsOn = [],
    } = body as {
      id?: string;
      name?: string;
      tier?: ServiceTier;
      weight?: number;
      restoreTimeMin?: number;
      restoreCost?: number;
      dependsOn?: string[];
    };

    if (!id || !name) {
      return NextResponse.json(
        { error: "id and name are required" },
        { status: 400 },
      );
    }

    const graph = await addService(
      { id, name, tier, weight, restoreTimeMin, restoreCost },
      dependsOn,
    );

    return NextResponse.json(
      { ok: true, services: graph.services },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
