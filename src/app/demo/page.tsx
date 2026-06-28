import { computeSpofRankings } from "@/lib/simulation/spof";
import { runSimulation } from "@/lib/simulation/simulate";
import { sampleGraph } from "@/lib/simulation/sample-graph";
import { serviceById } from "@/lib/simulation/graph-utils";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { DemoPageView } from "@/components/demo/DemoPageView";

export default async function DemoPage({
  searchParams,
}: {
  searchParams: Promise<{ fail?: string }>;
}) {
  const params = await searchParams;
  const failId =
    sampleGraph.services.some((s) => s.id === params.fail)
      ? (params.fail as string)
      : "auth-service";

  const simulation = runSimulation({
    graph: sampleGraph,
    failedIds: [failId],
  });

  const spofRankings = computeSpofRankings(sampleGraph);
  const serviceNames = Object.fromEntries(
    sampleGraph.services.map((s) => [s.id, s.name]),
  );

  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      <DemoPageView
        failId={failId}
        graph={sampleGraph}
        simulation={simulation}
        spofRankings={spofRankings}
        serviceNames={serviceNames}
      />
      <footer
        className="border-t py-6 text-center text-xs"
        style={{ borderColor: "var(--border)", color: "var(--fg-muted)" }}
      >
        Radius · H0 Hackathon
      </footer>
    </div>
  );
}
