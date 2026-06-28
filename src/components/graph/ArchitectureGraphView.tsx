"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Node, Edge, NodeTypes } from "@xyflow/react";

import ServiceNodeComponent, {
  type ServiceNodeData,
} from "./ServiceNode";
import { SimulationPanel } from "./SimulationPanel";
import { GraphCanvas } from "./GraphCanvas";
import {
  architectureGraphToResponse,
  responseToArchitectureGraph,
  type GraphResponse,
} from "@/lib/graph-response";
import { sampleGraph } from "@/lib/simulation/sample-graph";
import { runSimulation } from "@/lib/simulation/simulate";
import { computeSpofRankings } from "@/lib/simulation/spof";
import { serviceById } from "@/lib/simulation/graph-utils";
import { useIsDesktop } from "@/hooks/use-media-query";
import type { SimulationResult } from "@/lib/simulation/types";
import type { GraphSource } from "@/lib/store/graph-store";
import { DataSourceBadge } from "./DataSourceBadge";
import { AddServiceForm } from "./AddServiceForm";

type SpofRow = {
  rank: number;
  serviceId: string;
  name: string;
  impactPct: number;
  affectedCount: number;
};

const nodeTypes: NodeTypes = {
  service: ServiceNodeComponent,
};

const INITIAL_GRAPH = architectureGraphToResponse(sampleGraph);

function normalizeGraphResponse(data: Partial<GraphResponse>): GraphResponse {
  if (!data.nodes?.length) return INITIAL_GRAPH;
  return {
    nodes: data.nodes,
    edges: data.edges ?? INITIAL_GRAPH.edges,
    services: data.services?.length ? data.services : INITIAL_GRAPH.services,
  };
}

export function ArchitectureGraphView() {
  const isDesktop = useIsDesktop();
  const [graphData, setGraphData] = useState<GraphResponse>(INITIAL_GRAPH);
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [failedId, setFailedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [tab, setTab] = useState<"impact" | "recovery" | "spof">("impact");
  const [error, setError] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [dataSource, setDataSource] = useState<GraphSource | null>(null);
  const [addFormOpen, setAddFormOpen] = useState(false);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  const architectureGraph = useMemo(
    () => responseToArchitectureGraph(graphData),
    [graphData],
  );

  const spof = useMemo<SpofRow[]>(() => {
    const names = serviceById(architectureGraph);
    return computeSpofRankings(architectureGraph).map((row) => ({
      ...row,
      name: names[row.serviceId]?.name ?? row.serviceId,
    }));
  }, [architectureGraph]);

  const syncFromServer = useCallback(async () => {
    setSyncing(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch(`/api/graph?_=${Date.now()}`, {
        signal: controller.signal,
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = (await res.json()) as Partial<GraphResponse>;
      setGraphData(normalizeGraphResponse(data));
      if (data.source) setDataSource(data.source);
    } catch {
      setDataSource("sample");
      /* Keep local sample graph */
    } finally {
      clearTimeout(timeout);
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    void syncFromServer();
  }, [syncFromServer]);

  useEffect(() => {
    setPanelOpen(isDesktop);
  }, [isDesktop]);

  const serviceNames = useMemo(
    () => Object.fromEntries(graphData.nodes.map((n) => [n.id, n.name])),
    [graphData],
  );

  const affectedSet = useMemo(
    () => new Set(simulation?.blast.affectedIds ?? []),
    [simulation],
  );

  const flowNodes: Node[] = useMemo(() => {
    return graphData.nodes.map((n) => {
      let status: ServiceNodeData["status"] = "healthy";
      if (failedId === n.id) status = "failed";
      else if (affectedSet.has(n.id)) status = "affected";

      return {
        id: n.id,
        type: "service",
        position: n.position,
        width: 150,
        height: 58,
        data: {
          label: n.name,
          tier: n.tier,
          weight: n.weight,
          status,
        } satisfies ServiceNodeData,
      };
    });
  }, [graphData, failedId, affectedSet]);

  const flowEdges: Edge[] = useMemo(() => {
    return graphData.edges.map((e) => {
      const hot = affectedSet.has(e.source) || affectedSet.has(e.target);
      return {
        id: e.id,
        source: e.source,
        target: e.target,
        animated: hot,
        style: {
          stroke: hot ? "#d9730d" : "rgba(55, 53, 47, 0.2)",
          strokeWidth: 1,
        },
      };
    });
  }, [graphData, affectedSet]);

  const onNodeClick = useCallback(
    (_: unknown, node: Node) => {
      setFailedId(node.id);
      setTab("impact");
      setError(null);
      if (!isDesktop) setPanelOpen(true);

      const result = runSimulation({
        graph: architectureGraph,
        failedIds: [node.id],
      });
      setSimulation(result);

      void fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ failedIds: [node.id] }),
      }).catch(() => {});
    },
    [architectureGraph, isDesktop],
  );

  const onDeleteSelected = useCallback(async () => {
    if (!failedId) return;

    const name = serviceNames[failedId] ?? failedId;
    if (
      !window.confirm(
        `Remove "${name}" from the architecture?\n\nConnected dependencies are removed and SPOF rankings recalculate automatically.`,
      )
    ) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/services/${encodeURIComponent(failedId)}`, {
        method: "DELETE",
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "Delete failed");
      }

      setFailedId(null);
      setSimulation(null);
      setTab("spof");
      await syncFromServer();
      setAddedMessage(`${name} removed — graph and rankings recalculated`);
      window.setTimeout(() => setAddedMessage(null), 5000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  }, [failedId, serviceNames, syncFromServer]);

  const onReset = useCallback(async () => {
    setError(null);
    setLoading(true);
    setSimulation(null);
    setFailedId(null);
    setGraphData(INITIAL_GRAPH);

    try {
      await fetch("/api/seed", { method: "POST" });
      await syncFromServer();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Reset failed");
    } finally {
      setLoading(false);
    }
  }, [syncFromServer]);

  const showPanel = isDesktop || panelOpen;
  const impactLabel =
    simulation != null ? `${simulation.impact.impactPct}% impact` : null;

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
      {/* Graph canvas — must keep explicit flex height for React Flow */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div
          className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b px-3 py-2 sm:px-4"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="min-w-0">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <DataSourceBadge source={dataSource} syncing={syncing} />
              <p className="text-[11px] font-medium sm:text-[12px]" style={{ color: "var(--fg)" }}>
                <span className="hidden sm:inline">Dependency graph · </span>
                click a node to simulate failure
              </p>
            </div>
            <p className="hidden text-[11px] sm:block" style={{ color: "var(--fg-muted)" }}>
              {graphData.nodes.length} services · {graphData.edges.length} dependencies
            </p>
          </div>
          <div className="flex items-center gap-1">
            {!isDesktop && (
              <button
                type="button"
                onClick={() => setPanelOpen((v) => !v)}
                className="btn-ghost text-[12px] !px-2 !py-1 lg:hidden"
              >
                {showPanel ? "Hide results" : "Show results"}
                {impactLabel && !showPanel && (
                  <span className="ml-1 font-medium" style={{ color: "var(--warning)" }}>
                    · {impactLabel}
                  </span>
                )}
              </button>
            )}
            <button
              type="button"
              onClick={() => setAddFormOpen((v) => !v)}
              className="btn-ghost text-[12px] !px-2 !py-1"
            >
              {addFormOpen ? "Close add" : "Add service"}
            </button>
            <button
              type="button"
              onClick={() => void onDeleteSelected()}
              disabled={loading || !failedId}
              className="btn-ghost text-[12px] !px-2 !py-1 disabled:opacity-40"
              title={
                failedId
                  ? `Remove ${serviceNames[failedId] ?? failedId}`
                  : "Click a node first"
              }
            >
              Delete node
            </button>
            <button
              type="button"
              onClick={onReset}
              disabled={loading}
              className="btn-ghost text-[12px] !px-2 !py-1"
            >
              Reset
            </button>
          </div>
        </div>

        {addFormOpen && (
          <AddServiceForm
            existingIds={graphData.nodes.map((n) => n.id)}
            onAdded={async (serviceName) => {
              await syncFromServer();
              setAddedMessage(`${serviceName} added — check the right side of the graph`);
              setAddFormOpen(false);
              window.setTimeout(() => setAddedMessage(null), 5000);
            }}
            onClose={() => setAddFormOpen(false)}
          />
        )}

        {addedMessage && (
          <p
            className="shrink-0 border-b px-3 py-2 text-[12px] sm:px-4"
            style={{
              borderColor: "var(--border)",
              color: "#1d6b3a",
              background: "#e8f5ec",
            }}
          >
            {addedMessage}
          </p>
        )}

        {error && (
          <p
            className="shrink-0 border-b px-3 py-2 text-[12px] sm:px-4"
            style={{ borderColor: "var(--border)", color: "var(--danger)" }}
          >
            {error}
          </p>
        )}

        <div className="min-h-0 flex-1 overflow-hidden">
          <GraphCanvas
            nodes={flowNodes}
            edges={flowEdges}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            showMinimap={isDesktop}
            isDesktop={isDesktop}
          />
        </div>
      </div>

      {/* Results panel */}
      {showPanel && (
        <div
          className="motion-panel-enter flex w-full shrink-0 flex-col overflow-hidden border-t lg:h-full lg:w-[min(380px,34vw)] lg:min-w-[300px] lg:border-l lg:border-t-0"
          style={{
            borderColor: "var(--border)",
            maxHeight: isDesktop ? undefined : "42dvh",
          }}
        >
          {!isDesktop && (
            <button
              type="button"
              className="flex w-full shrink-0 items-center justify-center py-1.5 lg:hidden"
              style={{ color: "var(--fg-muted)" }}
              onClick={() => setPanelOpen(false)}
              aria-label="Collapse results panel"
            >
              <span
                className="h-1 w-10 rounded-full"
                style={{ background: "var(--border-strong)" }}
              />
            </button>
          )}
          <SimulationPanel
            simulation={simulation}
            failedId={failedId}
            loading={loading}
            spof={spof}
            tab={tab}
            onTabChange={setTab}
            serviceNames={serviceNames}
            compact={!isDesktop}
          />
        </div>
      )}
    </div>
  );
}
