import { buildDependenciesMap, serviceById } from "./graph-utils";
import type {
  ArchitectureGraph,
  BlastRadiusResult,
  RecoveryPlanResult,
  RecoveryWave,
} from "./types";

/**
 * Step 16 — Min-cost recovery waves.
 *
 * Rules:
 * 1. Only affected services need restoration.
 * 2. A service waits until all its affected dependencies are restored.
 * 3. Services ready at the same time form one wave (parallel).
 * 4. Within a wave, sort by restoreCost ascending (greedy min-cost).
 */
export function computeRecoveryPlan(
  graph: ArchitectureGraph,
  blast: BlastRadiusResult,
): RecoveryPlanResult {
  const affectedSet = new Set(blast.affectedIds);
  const dependenciesOf = buildDependenciesMap(graph);
  const byId = serviceById(graph);

  const remaining = new Set(blast.affectedIds);
  const restored = new Set<string>();
  const waves: RecoveryWave[] = [];
  let waveNumber = 1;

  while (remaining.size > 0) {
    const ready: string[] = [];

    for (const serviceId of remaining) {
      const deps = dependenciesOf.get(serviceId) ?? [];
      const blocked = deps.some(
        (dep) => affectedSet.has(dep) && !restored.has(dep),
      );
      if (!blocked) {
        ready.push(serviceId);
      }
    }

    if (ready.length === 0) {
      throw new Error(
        "Circular dependency in affected subgraph — cannot compute recovery order",
      );
    }

    ready.sort(
      (a, b) =>
        (byId[a]?.restoreCost ?? 0) - (byId[b]?.restoreCost ?? 0),
    );

    const estMinutes = Math.max(
      ...ready.map((id) => byId[id]?.restoreTimeMin ?? 0),
    );
    const estCost = ready.reduce(
      (sum, id) => sum + (byId[id]?.restoreCost ?? 0),
      0,
    );

    waves.push({
      wave: waveNumber,
      serviceIds: ready,
      estMinutes,
      estCost,
    });

    for (const id of ready) {
      remaining.delete(id);
      restored.add(id);
    }
    waveNumber++;
  }

  return {
    waves,
    totalMinutes: waves.reduce((sum, w) => sum + w.estMinutes, 0),
    totalCost: waves.reduce((sum, w) => sum + w.estCost, 0),
  };
}
