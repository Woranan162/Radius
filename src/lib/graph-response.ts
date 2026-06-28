import { layoutForService } from "@/lib/graph-layout";
import type { GraphSource } from "@/lib/store/graph-store";
import type { ArchitectureGraph } from "@/lib/simulation/types";

export type GraphResponse = {
  source?: GraphSource;
  nodes: {
    id: string;
    name: string;
    tier: string;
    weight: number;
    position: { x: number; y: number };
  }[];
  edges: { id: string; source: string; target: string }[];
  services: ArchitectureGraph["services"];
};

export function architectureGraphToResponse(
  graph: ArchitectureGraph,
): GraphResponse {
  const serviceIds = graph.services.map((s) => s.id);
  const nodes = graph.services.map((service) => ({
    id: service.id,
    name: service.name,
    tier: service.tier,
    weight: service.weight,
    position: layoutForService(service.id, serviceIds),
  }));

  const edges = graph.dependencies.map((dep, i) => ({
    id: `e-${dep.from}-${dep.to}-${i}`,
    source: dep.from,
    target: dep.to,
  }));

  return { nodes, edges, services: graph.services };
}

export function responseToArchitectureGraph(
  response: GraphResponse,
): ArchitectureGraph {
  return {
    services: response.services,
    dependencies: response.edges.map((edge) => ({
      from: edge.source,
      to: edge.target,
    })),
  };
}
