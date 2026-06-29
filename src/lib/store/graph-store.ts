import { prisma } from "@/lib/db/prisma";
import { sampleGraph } from "@/lib/simulation/sample-graph";
import type {
  ArchitectureGraph,
  ServiceNode,
  ServiceTier,
} from "@/lib/simulation/types";

export type GraphSource = "aurora" | "sample";

export type GraphLoadResult = {
  graph: ArchitectureGraph;
  source: GraphSource;
};

const CACHE_TTL_MS = 15_000;
let graphCache: {
  graph: ArchitectureGraph;
  source: GraphSource;
  at: number;
} | null = null;

function readCache(): GraphLoadResult | null {
  if (!graphCache) return null;
  if (Date.now() - graphCache.at > CACHE_TTL_MS) {
    graphCache = null;
    return null;
  }
  return { graph: graphCache.graph, source: graphCache.source };
}

function writeCache(graph: ArchitectureGraph, source: GraphSource) {
  graphCache = { graph, source, at: Date.now() };
}

export function invalidateGraphCache() {
  graphCache = null;
}
function toArchitectureGraph(
  services: {
    id: string;
    name: string;
    tier: string;
    weight: number;
    restoreTimeMin: number;
    restoreCost: number;
  }[],
  dependencies: { dependentId: string; dependencyId: string }[],
): ArchitectureGraph {
  return {
    services: services.map((s) => ({
      id: s.id,
      name: s.name,
      tier: s.tier as ServiceTier,
      weight: s.weight,
      restoreTimeMin: s.restoreTimeMin,
      restoreCost: s.restoreCost,
    })),
    dependencies: dependencies.map((d) => ({
      from: d.dependentId,
      to: d.dependencyId,
    })),
  };
}

export async function getGraph(): Promise<GraphLoadResult> {
  const cached = readCache();
  if (cached) return cached;

  try {
    const [services, dependencies] = await Promise.all([
      prisma.service.findMany({ orderBy: { id: "asc" } }),
      prisma.dependency.findMany(),
    ]);

    if (services.length === 0) {
      const graph = structuredClone(sampleGraph);
      writeCache(graph, "sample");
      void seedGraph(sampleGraph)
        .then(() => invalidateGraphCache())
        .catch((err) =>
          console.error("[getGraph] background seed failed:", err),
        );
      return { graph, source: "sample" };
    }

    const graph = toArchitectureGraph(services, dependencies);
    writeCache(graph, "aurora");
    return { graph, source: "aurora" };
  } catch (error) {
    console.error("[getGraph] Database error, using sample graph:", error);
    const graph = structuredClone(sampleGraph);
    writeCache(graph, "sample");
    return { graph, source: "sample" };
  }
}

export async function seedGraph(
  graph: ArchitectureGraph,
): Promise<ArchitectureGraph> {
  await prisma.$transaction(async (tx) => {
    await tx.dependency.deleteMany();
    await tx.service.deleteMany();

    for (const service of graph.services) {
      await tx.service.create({
        data: {
          id: service.id,
          name: service.name,
          tier: service.tier,
          weight: service.weight,
          restoreTimeMin: service.restoreTimeMin,
          restoreCost: service.restoreCost,
        },
      });
    }

    for (const dep of graph.dependencies) {
      await tx.dependency.create({
        data: {
          dependentId: dep.from,
          dependencyId: dep.to,
        },
      });
    }
  });

  invalidateGraphCache();
  return graph;
}

export async function resetGraph(): Promise<ArchitectureGraph> {
  return seedGraph(sampleGraph);
}

export async function addService(
  service: ServiceNode,
  dependsOn: string[] = [],
): Promise<ArchitectureGraph> {
  const existing = await prisma.service.findUnique({
    where: { id: service.id },
  });
  if (existing) {
    throw new Error(`Service already exists: ${service.id}`);
  }

  for (const depId of dependsOn) {
    const dep = await prisma.service.findUnique({ where: { id: depId } });
    if (!dep) {
      throw new Error(`Unknown dependency: ${depId}`);
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.service.create({
      data: {
        id: service.id,
        name: service.name,
        tier: service.tier,
        weight: service.weight,
        restoreTimeMin: service.restoreTimeMin,
        restoreCost: service.restoreCost,
      },
    });

    for (const depId of dependsOn) {
      await tx.dependency.create({
        data: {
          dependentId: service.id,
          dependencyId: depId,
        },
      });
    }
  });

  invalidateGraphCache();
  return (await getGraph()).graph;
}

export async function deleteService(id: string): Promise<ArchitectureGraph> {
  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) {
    throw new Error(`Service not found: ${id}`);
  }

  const count = await prisma.service.count();
  if (count <= 1) {
    throw new Error("Cannot delete the last service in the architecture");
  }

  await prisma.service.delete({ where: { id } });

  invalidateGraphCache();
  return (await getGraph()).graph;
}

export async function addDependency(
  dependentId: string,
  dependencyId: string,
): Promise<ArchitectureGraph> {
  if (dependentId === dependencyId) {
    throw new Error("A service cannot depend on itself");
  }

  const [dependent, dependency] = await Promise.all([
    prisma.service.findUnique({ where: { id: dependentId } }),
    prisma.service.findUnique({ where: { id: dependencyId } }),
  ]);

  if (!dependent) {
    throw new Error(`Unknown service: ${dependentId}`);
  }
  if (!dependency) {
    throw new Error(`Unknown service: ${dependencyId}`);
  }

  const existing = await prisma.dependency.findFirst({
    where: { dependentId, dependencyId },
  });
  if (existing) {
    throw new Error("Dependency already exists");
  }

  await prisma.dependency.create({
    data: { dependentId, dependencyId },
  });

  invalidateGraphCache();
  return (await getGraph()).graph;
}

export async function saveSimulationRun(
  failedIds: string[],
  resultJson: object,
): Promise<void> {
  await prisma.simulationRun.create({
    data: {
      failedIds,
      resultJson,
    },
  });
}
