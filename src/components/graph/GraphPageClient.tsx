"use client";

import { MarketingNav } from "@/components/layout/MarketingNav";
import { ArchitectureGraphView } from "@/components/graph/ArchitectureGraphView";

export function GraphPageClient() {
  return (
    <div className="flex h-screen-safe flex-col overflow-hidden bg-white">
      <MarketingNav />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <ArchitectureGraphView />
      </div>
    </div>
  );
}
