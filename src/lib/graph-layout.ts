/** Canvas positions for React Flow nodes (Steps 23–24) */
export const graphLayout: Record<string, { x: number; y: number }> = {
  "api-gateway": { x: 250, y: 0 },
  "auth-service": { x: 0, y: 200 },
  "orders-api": { x: 250, y: 200 },
  "payment-provider": { x: 500, y: 200 },
  "redis-cache": { x: 250, y: 400 },
};

export function layoutForService(
  id: string,
  index: number,
): { x: number; y: number } {
  return (
    graphLayout[id] ?? {
      x: 100 + (index % 3) * 220,
      y: 100 + Math.floor(index / 3) * 160,
    }
  );
}
