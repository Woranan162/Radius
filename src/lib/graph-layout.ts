/** Canvas positions for React Flow nodes (Steps 23–24) */
export const graphLayout: Record<string, { x: number; y: number }> = {
  "api-gateway": { x: 250, y: 0 },
  "auth-service": { x: 0, y: 200 },
  "orders-api": { x: 250, y: 200 },
  "payment-provider": { x: 500, y: 200 },
  "redis-cache": { x: 250, y: 400 },
};

/** Place custom services in a visible column to the right of the seed graph */
export function layoutForService(
  id: string,
  allServiceIds: string[],
): { x: number; y: number } {
  if (graphLayout[id]) return graphLayout[id];

  const customIds = allServiceIds.filter((sid) => !graphLayout[sid]);
  const customIndex = Math.max(0, customIds.indexOf(id));

  return {
    x: 620,
    y: 40 + customIndex * 110,
  };
}
