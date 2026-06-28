import { computeBlastRadius } from "./blast-radius";
import type { ArchitectureGraph, SpofRankingEntry } from "./types";
import { computeWeightedImpact } from "./weighted-impact";

/**
 * Step 17 — Single Point of Failure (SPOF) ranking.
 * Simulate each service failing alone; rank by weighted impact %.
 */
export function computeSpofRankings(
  graph: ArchitectureGraph,
): SpofRankingEntry[] {
  const entries = graph.services.map((service) => {
    const blast = computeBlastRadius({
      graph,
      failedIds: [service.id],
    });
    const impact = computeWeightedImpact(graph, blast);

    return {
      serviceId: service.id,
      rank: 0,
      impactPct: impact.impactPct,
      affectedCount: blast.affectedIds.length,
    };
  });

  entries.sort((a, b) => b.impactPct - a.impactPct);

  return entries.map((entry, index) => ({
    serviceId: entry.serviceId,
    rank: index + 1,
    impactPct: entry.impactPct,
    affectedCount: entry.affectedCount,
  }));
}
