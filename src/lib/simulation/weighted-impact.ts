import type {
  ArchitectureGraph,
  BlastRadiusResult,
  WeightedImpactResult,
} from "./types";
import { serviceById } from "./graph-utils";

/**
 * Step 15 — Weighted impact score.
 * Not all outages are equal: losing auth matters more than losing cache.
 */
export function computeWeightedImpact(
  graph: ArchitectureGraph,
  blast: BlastRadiusResult,
): WeightedImpactResult {
  const byId = serviceById(graph);
  const totalWeight = graph.services.reduce((sum, s) => sum + s.weight, 0);

  const affectedWeight = blast.affectedIds.reduce(
    (sum, id) => sum + (byId[id]?.weight ?? 0),
    0,
  );

  const impactPct =
    totalWeight === 0 ? 0 : (affectedWeight / totalWeight) * 100;

  return {
    affectedWeight,
    totalWeight,
    impactPct: Math.round(impactPct * 10) / 10,
  };
}
