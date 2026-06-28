import type { ArchitectureGraph } from "./types";

/**
 * Hardcoded demo architecture — no database needed.
 * Shape matches a small e-commerce / SaaS backend.
 */
export const sampleGraph: ArchitectureGraph = {
  services: [
    {
      id: "api-gateway",
      name: "API Gateway",
      tier: "critical",
      weight: 10,
      restoreTimeMin: 8,
      restoreCost: 2000,
    },
    {
      id: "auth-service",
      name: "Auth Service",
      tier: "critical",
      weight: 10,
      restoreTimeMin: 15,
      restoreCost: 5000,
    },
    {
      id: "orders-api",
      name: "Orders API",
      tier: "customer-facing",
      weight: 7,
      restoreTimeMin: 10,
      restoreCost: 3000,
    },
    {
      id: "payment-provider",
      name: "Payment Provider",
      tier: "critical",
      weight: 10,
      restoreTimeMin: 15,
      restoreCost: 8000,
    },
    {
      id: "redis-cache",
      name: "Redis Cache",
      tier: "internal",
      weight: 3,
      restoreTimeMin: 5,
      restoreCost: 500,
    },
  ],
  dependencies: [
    { from: "api-gateway", to: "auth-service" },
    { from: "api-gateway", to: "orders-api" },
    { from: "orders-api", to: "auth-service" },
    { from: "orders-api", to: "payment-provider" },
    { from: "orders-api", to: "redis-cache" },
  ],
};
