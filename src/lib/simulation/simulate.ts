import { computeBlastRadius } from "./blast-radius";
import { computeRecoveryPlan } from "./recovery";
import type { SimulationInput, SimulationResult } from "./types";
import { computeWeightedImpact } from "./weighted-impact";

/** Run full simulation: blast radius + impact + recovery */
export function runSimulation(input: SimulationInput): SimulationResult {
  const blast = computeBlastRadius(input);
  const impact = computeWeightedImpact(input.graph, blast);
  const recovery = computeRecoveryPlan(input.graph, blast);

  return { blast, impact, recovery };
}
