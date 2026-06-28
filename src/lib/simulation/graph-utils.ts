import type { ArchitectureGraph } from "./types";

/** dependency id → services that depend on it */
export function buildDependentsMap(
  graph: ArchitectureGraph,
): Map<string, string[]> {
  const map = new Map<string, string[]>();

  for (const edge of graph.dependencies) {
    const list = map.get(edge.to) ?? [];
    list.push(edge.from);
    map.set(edge.to, list);
  }

  return map;
}

/** service id → dependency ids it relies on */
export function buildDependenciesMap(
  graph: ArchitectureGraph,
): Map<string, string[]> {
  const map = new Map<string, string[]>();

  for (const edge of graph.dependencies) {
    const list = map.get(edge.from) ?? [];
    list.push(edge.to);
    map.set(edge.from, list);
  }

  return map;
}

export function serviceById(
  graph: ArchitectureGraph,
): Record<string, (typeof graph.services)[number]> {
  return Object.fromEntries(graph.services.map((s) => [s.id, s]));
}
