/**
 * Step 13 — Shared types for the simulation engine.
 * No database: we use plain TypeScript objects in memory.
 */

/** How important a service is when measuring blast radius impact */
export type ServiceTier = "critical" | "customer-facing" | "internal";

/** One node in the architecture graph */
export interface ServiceNode {
  id: string;
  name: string;
  tier: ServiceTier;
  /** Higher weight = more important in impact calculations (Step 15) */
  weight: number;
  restoreTimeMin: number;
  restoreCost: number;
}

/**
 * Directed edge: `from` depends on `to`.
 * Example: orders-api → auth-service means orders-api needs auth-service.
 */
export interface DependencyEdge {
  from: string;
  to: string;
}

/** Full graph loaded from JSON or (later) the database */
export interface ArchitectureGraph {
  services: ServiceNode[];
  dependencies: DependencyEdge[];
}

/** Input to a failure simulation */
export interface SimulationInput {
  graph: ArchitectureGraph;
  /** One or more service ids that failed */
  failedIds: string[];
}

/** Output of blast-radius (Step 14) */
export interface BlastRadiusResult {
  failedIds: string[];
  /** All failed + downstream services that can no longer function */
  affectedIds: string[];
  /**
   * Hop distance from the nearest failed node.
   * 0 = failed itself, 1 = direct dependent, 2 = dependent of dependent, ...
   */
  depthByService: Record<string, number>;
}

/** Output of weighted impact (Step 15) */
export interface WeightedImpactResult {
  affectedWeight: number;
  totalWeight: number;
  /** 0–100: share of system weight that is down */
  impactPct: number;
}

/** One parallel-safe group in the recovery plan (Step 16) */
export interface RecoveryWave {
  wave: number;
  serviceIds: string[];
  /** Longest restore time in this wave (parallel work) */
  estMinutes: number;
  /** Sum of restore costs in this wave */
  estCost: number;
}

/** Output of recovery planner (Step 16) */
export interface RecoveryPlanResult {
  waves: RecoveryWave[];
  totalMinutes: number;
  totalCost: number;
}

/** One row in the SPOF leaderboard (Step 17) */
export interface SpofRankingEntry {
  serviceId: string;
  rank: number;
  impactPct: number;
  affectedCount: number;
}

/** Full simulation — combines Steps 14–16 */
export interface SimulationResult {
  blast: BlastRadiusResult;
  impact: WeightedImpactResult;
  recovery: RecoveryPlanResult;
}
