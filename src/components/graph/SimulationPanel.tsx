"use client";

import { useCallback, useState } from "react";
import type { SimulationResult } from "@/lib/simulation/types";
import { SimulatorGuide, TabExplanation } from "./SimulatorGuide";

type SpofRow = {
  rank: number;
  serviceId: string;
  name: string;
  impactPct: number;
  affectedCount: number;
};

type Tab = "impact" | "recovery" | "spof";

type Props = {
  simulation: SimulationResult | null;
  failedId: string | null;
  loading: boolean;
  spof: SpofRow[];
  tab: Tab;
  onTabChange: (tab: Tab) => void;
  serviceNames: Record<string, string>;
  compact?: boolean;
};

export function SimulationPanel({
  simulation,
  failedId,
  loading,
  spof,
  tab,
  onTabChange,
  serviceNames,
  compact = false,
}: Props) {
  const [guideOpen, setGuideOpen] = useState(true);
  const [tabHelpOpen, setTabHelpOpen] = useState<Record<Tab, boolean>>({
    impact: true,
    recovery: true,
    spof: true,
  });

  const toggleTabHelp = useCallback((currentTab: Tab) => {
    setTabHelpOpen((prev) => ({ ...prev, [currentTab]: !prev[currentTab] }));
  }, []);

  const tabs: { id: Tab; label: string }[] = [
    { id: "impact", label: "Impact" },
    { id: "recovery", label: "Recovery" },
    { id: "spof", label: "SPOF" },
  ];

  const pad = compact ? "px-3" : "px-4";

  return (
    <aside
      className="flex h-full min-h-0 w-full flex-col"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className={`shrink-0 ${compact ? "px-3 py-2" : "px-4 py-3"}`}>
        <p className="text-[13px] font-medium" style={{ color: "var(--fg)" }}>
          Simulator
        </p>
        <p className="text-[11px] sm:text-[12px]" style={{ color: "var(--fg-muted)" }}>
          Failure simulation &amp; recovery planning
        </p>
      </div>

      <SimulatorGuide
        compact={compact}
        open={guideOpen}
        onToggle={() => setGuideOpen((v) => !v)}
      />

      <div
        className="flex shrink-0 gap-0 border-y px-1.5 py-1 sm:px-2 sm:py-1.5"
        style={{ borderColor: "var(--border)" }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onTabChange(t.id)}
            className="min-h-[36px] flex-1 rounded-md px-1.5 py-2 text-[11px] font-medium transition-all duration-200 sm:px-2 sm:text-[12px]"
            style={{
              background: tab === t.id ? "white" : "transparent",
              color: tab === t.id ? "var(--fg)" : "var(--fg-muted)",
              boxShadow: tab === t.id ? "0 0 0 1px var(--border)" : "none",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div key={tab} className={`motion-tab-content min-h-0 flex-1 overflow-y-auto ${pad} py-4`}>
        <TabExplanation
          tab={tab}
          open={tabHelpOpen[tab]}
          onClose={() => toggleTabHelp(tab)}
        />

        {loading && (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 animate-pulse rounded-md"
                style={{ background: "var(--hover)" }}
              />
            ))}
          </div>
        )}

        {!loading && !simulation && tab !== "spof" && (
          <div
            className="rounded-lg border border-dashed p-4 text-center"
            style={{ borderColor: "var(--border-strong)" }}
          >
            <p className="text-[13px] font-medium" style={{ color: "var(--fg)" }}>
              No simulation yet
            </p>
            <p className="mt-1 text-[12px] leading-relaxed" style={{ color: "var(--fg-muted)" }}>
              Click a node on the graph — try{" "}
              <strong style={{ color: "var(--fg)" }}>Auth Service</strong> for the
              largest blast radius in the sample stack.
            </p>
          </div>
        )}

        {!loading && simulation && tab === "impact" && (
          <div className="space-y-4">
            <div>
              <p
                className="text-[11px] font-medium uppercase tracking-wide"
                style={{ color: "var(--fg-muted)" }}
              >
                Failed (root)
              </p>
              <p className="mt-0.5 text-[14px] font-medium" style={{ color: "var(--danger)" }}>
                {serviceNames[failedId ?? ""] ?? failedId}
              </p>
              <p className="mt-1 text-[11px]" style={{ color: "var(--fg-muted)" }}>
                Depth 0 — the service you chose to fail
              </p>
            </div>

            <div className="border-t pt-4" style={{ borderColor: "var(--border)" }}>
              <p
                className="text-[11px] font-medium uppercase tracking-wide"
                style={{ color: "var(--fg-muted)" }}
              >
                Weighted impact
              </p>
              <p
                className={`mt-1 font-semibold tabular-nums leading-none ${compact ? "text-[26px]" : "text-[32px]"}`}
                style={{ color: "var(--fg)" }}
              >
                {simulation.impact.impactPct}%
              </p>
              <p className="mt-1 text-[12px]" style={{ color: "var(--fg-muted)" }}>
                {simulation.impact.affectedWeight} / {simulation.impact.totalWeight} total
                weight affected
              </p>
            </div>

            <div className="border-t pt-4" style={{ borderColor: "var(--border)" }}>
              <p
                className="mb-2 text-[11px] font-medium uppercase tracking-wide"
                style={{ color: "var(--fg-muted)" }}
              >
                Affected services ({simulation.blast.affectedIds.length})
              </p>
              <p className="mb-3 text-[11px] leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                d1 = direct dependent, d2 = two hops away, etc.
              </p>
              <ul className="space-y-0">
                {simulation.blast.affectedIds.map((id) => {
                  const depth = simulation.blast.depthByService[id];
                  return (
                    <li
                      key={id}
                      className="flex items-center justify-between border-b py-2 text-[13px] last:border-0"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <span style={{ color: "var(--fg)" }}>{serviceNames[id] ?? id}</span>
                      <span className="text-[11px]" style={{ color: "var(--fg-muted)" }}>
                        {depth === 0 ? "root" : `depth ${depth}`}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        {!loading && tab === "recovery" && simulation && (
          <div className="space-y-4">
            <div className="flex gap-6 text-[13px]">
              <div>
                <p style={{ color: "var(--fg-muted)" }}>Total time</p>
                <p className="font-medium" style={{ color: "var(--fg)" }}>
                  {simulation.recovery.totalMinutes}m
                </p>
              </div>
              <div>
                <p style={{ color: "var(--fg-muted)" }}>Total cost</p>
                <p className="font-medium" style={{ color: "var(--fg)" }}>
                  ${simulation.recovery.totalCost.toLocaleString()}
                </p>
              </div>
            </div>
            <ul className="space-y-0">
              {simulation.recovery.waves.map((wave) => (
                <li
                  key={wave.wave}
                  className="border-b py-3 last:border-0"
                  style={{ borderColor: "var(--border)" }}
                >
                  <p className="text-[13px] font-medium" style={{ color: "var(--fg)" }}>
                    Wave {wave.wave}
                    <span className="ml-2 font-normal" style={{ color: "var(--fg-muted)" }}>
                      {wave.estMinutes}m · ${wave.estCost.toLocaleString()}
                    </span>
                  </p>
                  <p className="mt-1 text-[12px]" style={{ color: "var(--fg-muted)" }}>
                    Restore:{" "}
                    {wave.serviceIds.map((id) => serviceNames[id] ?? id).join(", ")}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!loading && tab === "recovery" && !simulation && (
          <p className="text-center text-[13px]" style={{ color: "var(--fg-muted)" }}>
            Run a simulation first to see recovery waves.
          </p>
        )}

        {!loading && tab === "spof" && (
          <>
            <p className="mb-3 text-[11px] leading-relaxed" style={{ color: "var(--fg-muted)" }}>
              Pre-computed for the full architecture — no click required.
            </p>
            <ul className="space-y-0">
              {spof.map((row) => (
                <li
                  key={row.serviceId}
                  className="flex items-center justify-between border-b py-2.5 text-[13px] last:border-0"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span style={{ color: "var(--fg)" }}>
                    <span className="mr-2 tabular-nums" style={{ color: "var(--fg-muted)" }}>
                      {row.rank}.
                    </span>
                    {row.name}
                  </span>
                  <span className="tabular-nums font-medium" style={{ color: "var(--fg)" }}>
                    {row.impactPct}%
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </aside>
  );
}
