import { NextResponse } from "next/server";
import { getGraph } from "@/lib/store/graph-store";
import { computeSpofRankings } from "@/lib/simulation/spof";
import { serviceById } from "@/lib/simulation/graph-utils";

/** SPOF leaderboard via API */
export async function GET() {
  const { graph } = await getGraph();
  const rankings = computeSpofRankings(graph).map((row) => ({
    ...row,
    name: serviceById(graph)[row.serviceId]?.name ?? row.serviceId,
  }));

  return NextResponse.json({ rankings });
}
