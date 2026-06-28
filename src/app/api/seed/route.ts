import { NextResponse } from "next/server";
import { resetGraph } from "@/lib/store/graph-store";

/** Step 22 — Reset graph to demo seed data */
export async function POST() {
  const graph = await resetGraph();
  return NextResponse.json({
    ok: true,
    message: "Graph reset to demo seed",
    serviceCount: graph.services.length,
  });
}
