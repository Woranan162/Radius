import { buildDependentsMap } from "./graph-utils";
import type { ArchitectureGraph, BlastRadiusResult, SimulationInput } from "./types";

/**
 * Step 14 — Blast radius via BFS.
 *
 * Edge model: `from` depends on `to`.
 * When `to` fails, `from` is affected (and anything that depends on `from`, etc.)
 *
 * We build a reverse map: dependency id → list of dependents.
 * BFS walks outward from failed nodes along that map.
 */
export function computeBlastRadius(input: SimulationInput): BlastRadiusResult {
  const { graph, failedIds } = input;

  const dependentsOf = buildDependentsMap(graph);
  const depthByService: Record<string, number> = {};
  const affectedSet = new Set<string>();
  const queue: string[] = [];

  for (const id of failedIds) {
    if (!serviceExists(graph, id)) {
      throw new Error(`Unknown service id: ${id}`);
    }
    affectedSet.add(id);
    depthByService[id] = 0;
    queue.push(id);
  }

  while (queue.length > 0) {
    const failedDependency = queue.shift()!;
    const currentDepth = depthByService[failedDependency];

    for (const dependent of dependentsOf.get(failedDependency) ?? []) {
      if (!affectedSet.has(dependent)) {
        affectedSet.add(dependent);
        depthByService[dependent] = currentDepth + 1;
        queue.push(dependent);
      }
    }
  }

  return {
    failedIds: [...failedIds],
    affectedIds: [...affectedSet],
    depthByService,
  };
}

function serviceExists(graph: ArchitectureGraph, id: string): boolean {
  return graph.services.some((s) => s.id === id);
}
