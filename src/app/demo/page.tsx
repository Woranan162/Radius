import { computeSpofRankings } from "@/lib/simulation/spof";
import { runSimulation } from "@/lib/simulation/simulate";
import { sampleGraph } from "@/lib/simulation/sample-graph";
import { getGraph } from "@/lib/store/graph-store";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { DemoPageView } from "@/components/demo/DemoPageView";

export default async function DemoPage({
  searchParams,
}: {
  searchParams: Promise<{ fail?: string }>;
}) {
  const params = await searchParams;
  const { graph, source } = await getGraph();

  const failId = graph.services.some((s) => s.id === params.fail)
    ? (params.fail as string)
    : graph.services[0]?.id ?? sampleGraph.services[0]!.id;

  const simulation = runSimulation({
    graph,
    failedIds: [failId],
  });

  const spofRankings = computeSpofRankings(graph);
  const serviceNames = Object.fromEntries(
    graph.services.map((s) => [s.id, s.name]),
  );

  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      <DemoPageView
        failId={failId}
        graph={graph}
        dataSource={source}
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
