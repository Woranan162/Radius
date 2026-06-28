import Link from "next/link";
import type { ReactNode } from "react";
import type { SimulationResult } from "@/lib/simulation/types";
import type { SpofRankingEntry } from "@/lib/simulation/types";
import type { ArchitectureGraph } from "@/lib/simulation/types";

type Props = {
  failId: string;
  graph: ArchitectureGraph;
  simulation: SimulationResult;
  spofRankings: SpofRankingEntry[];
  serviceNames: Record<string, string>;
};

export function DemoPageView({
  failId,
  graph,
  simulation,
  spofRankings,
  serviceNames,
}: Props) {
  const { blast, impact, recovery } = simulation;
  const failedName = serviceNames[failId] ?? failId;

  return (
    <main className="page-container py-8 pb-14 sm:py-12 sm:pb-16">
      {/* Header */}
      <header className="mb-8 sm:mb-10">
        <p
          className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
          style={{
            borderColor: "var(--border-strong)",
            color: "var(--fg-muted)",
            background: "rgba(255,255,255,0.8)",
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--danger)" }}
          />
          Live simulation
        </p>
        <h1
          className="max-w-2xl text-[26px] font-bold leading-tight tracking-tight sm:text-[34px]"
          style={{ color: "var(--fg)" }}
        >
          What happens when{" "}
          <span style={{ color: "var(--danger)" }}>{failedName}</span> fails?
        </h1>
        <p
          className="mt-3 max-w-xl text-sm leading-relaxed sm:text-[15px]"
          style={{ color: "var(--fg-muted)" }}
        >
          Pick any service below to see blast radius, weighted impact, recovery
          waves, and SPOF ranking — no database required.
        </p>
      </header>

      {/* Scenario picker */}
      <section
        className="mb-8 rounded-xl border p-4 sm:mb-10 sm:p-5"
        style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
      >
        <p
          className="mb-3 text-[11px] font-medium uppercase tracking-wide"
          style={{ color: "var(--fg-muted)" }}
        >
          Failure scenario
        </p>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap">
          {graph.services.map((s) => {
            const active = s.id === failId;
            return (
              <Link
                key={s.id}
                href={`/demo?fail=${s.id}`}
                className="shrink-0 rounded-lg border px-3 py-2 text-[12px] font-medium transition-colors sm:text-[13px]"
                style={{
                  borderColor: active ? "var(--fg)" : "var(--border)",
                  background: active ? "var(--fg)" : "#fff",
                  color: active ? "#fff" : "var(--fg)",
                  boxShadow: active ? "none" : "0 1px 2px rgba(55,53,47,0.04)",
                }}
              >
                {s.name}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Impact summary row */}
      <div className="mb-8 grid gap-3 sm:mb-10 sm:grid-cols-2 lg:grid-cols-4">
        <ImpactCard impactPct={impact.impactPct} />
        <StatCard
          label="Affected weight"
          value={`${impact.affectedWeight} / ${impact.totalWeight}`}
          sub="weighted score"
        />
        <StatCard
          label="Recovery time"
          value={`${recovery.totalMinutes}m`}
          sub="estimated restore"
        />
        <StatCard
          label="Recovery cost"
          value={`$${recovery.totalCost.toLocaleString()}`}
          sub="estimated spend"
        />
      </div>

      {/* Detail panels */}
      <div className="mb-8 grid gap-4 sm:mb-10 lg:grid-cols-2 lg:gap-6">
        <Panel title="Affected services" count={blast.affectedIds.length}>
          <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
            {blast.affectedIds.map((id) => {
              const depth = blast.depthByService[id];
              const isRoot = depth === 0;
              return (
                <li
                  key={id}
                  className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p
                      className="truncate text-[14px] font-medium"
                      style={{ color: "var(--fg)" }}
                    >
                      {serviceNames[id] ?? id}
                    </p>
                    <p className="text-[11px]" style={{ color: "var(--fg-muted)" }}>
                      {graph.services.find((s) => s.id === id)?.tier ?? "service"}
                    </p>
                  </div>
                  <StatusBadge
                    label={isRoot ? "root" : `depth ${depth}`}
                    variant={isRoot ? "failed" : "affected"}
                  />
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel title="Recovery waves" count={recovery.waves.length}>
          <ol className="space-y-3">
            {recovery.waves.map((wave) => (
              <li
                key={wave.wave}
                className="rounded-lg border p-3"
                style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span
                    className="text-[13px] font-semibold"
                    style={{ color: "var(--fg)" }}
                  >
                    Wave {wave.wave}
                  </span>
                  <span className="text-[11px]" style={{ color: "var(--fg-muted)" }}>
                    {wave.estMinutes}m · ${wave.estCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {wave.serviceIds.map((id) => (
                    <span
                      key={id}
                      className="rounded-md border px-2 py-0.5 text-[11px] font-medium"
                      style={{
                        borderColor: "var(--border)",
                        background: "#fff",
                        color: "var(--fg)",
                      }}
                    >
                      {serviceNames[id] ?? id}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </Panel>
      </div>

      {/* SPOF ranking */}
      <Panel title="SPOF ranking" count={spofRankings.length} className="mb-8 sm:mb-10">
        <ul className="space-y-3">
          {spofRankings.map((row) => {
            const isActive = row.serviceId === failId;
            const maxPct = spofRankings[0]?.impactPct ?? 100;
            const barWidth = maxPct > 0 ? (row.impactPct / maxPct) * 100 : 0;

            return (
              <li key={row.serviceId}>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-semibold"
                      style={{
                        background: isActive ? "var(--fg)" : "var(--hover)",
                        color: isActive ? "#fff" : "var(--fg-muted)",
                      }}
                    >
                      {row.rank}
                    </span>
                    <span
                      className="truncate text-[13px] font-medium"
                      style={{ color: "var(--fg)" }}
                    >
                      {serviceNames[row.serviceId] ?? row.serviceId}
                    </span>
                  </div>
                  <span
                    className="shrink-0 text-[13px] font-semibold tabular-nums"
                    style={{ color: isActive ? "var(--danger)" : "var(--fg)" }}
                  >
                    {row.impactPct}%
                  </span>
                </div>
                <div
                  className="h-1.5 overflow-hidden rounded-full"
                  style={{ background: "var(--hover)" }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${barWidth}%`,
                      background: isActive ? "var(--danger)" : "var(--fg-muted)",
                      opacity: isActive ? 1 : 0.45,
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </Panel>

      {/* CTA */}
      <section
        className="flex flex-col items-start justify-between gap-4 rounded-xl border p-5 sm:flex-row sm:items-center sm:p-6"
        style={{
          borderColor: "var(--border-strong)",
          background:
            "linear-gradient(135deg, var(--bg-secondary) 0%, #fff 60%)",
        }}
      >
        <div>
          <p className="text-[15px] font-semibold" style={{ color: "var(--fg)" }}>
            Explore the interactive graph
          </p>
          <p className="mt-1 text-[13px]" style={{ color: "var(--fg-muted)" }}>
            Click nodes, toggle tabs, and run simulations in real time.
          </p>
        </div>
        <Link href="/graph" className="btn-primary w-full shrink-0 gap-2 sm:w-auto">
          Open simulator
          <ArrowIcon />
        </Link>
      </section>
    </main>
  );
}

function ImpactCard({ impactPct }: { impactPct: number }) {
  return (
    <div
      className="rounded-xl border p-4 sm:col-span-2 sm:p-5 lg:col-span-1"
      style={{
        borderColor: "var(--border)",
        background: "var(--fg)",
        color: "#fff",
      }}
    >
      <p className="text-[11px] font-medium uppercase tracking-wide opacity-70">
        Weighted impact
      </p>
      <p className="mt-2 text-[44px] font-bold leading-none tabular-nums sm:text-[48px]">
        {impactPct}%
      </p>
      <p className="mt-2 text-[12px] opacity-70">of total architecture weight</p>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{ borderColor: "var(--border)", background: "#fff" }}
    >
      <p
        className="text-[11px] font-medium uppercase tracking-wide"
        style={{ color: "var(--fg-muted)" }}
      >
        {label}
      </p>
      <p
        className="mt-2 text-[22px] font-semibold tabular-nums leading-none sm:text-[24px]"
        style={{ color: "var(--fg)" }}
      >
        {value}
      </p>
      <p className="mt-1.5 text-[11px]" style={{ color: "var(--fg-muted)" }}>
        {sub}
      </p>
    </div>
  );
}

function Panel({
  title,
  count,
  children,
  className = "",
}: {
  title: string;
  count?: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border p-4 sm:p-5 ${className}`}
      style={{ borderColor: "var(--border)", background: "#fff" }}
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-[15px] font-semibold" style={{ color: "var(--fg)" }}>
          {title}
        </h2>
        {count != null && (
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={{ background: "var(--hover)", color: "var(--fg-muted)" }}
          >
            {count}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

function StatusBadge({
  label,
  variant,
}: {
  label: string;
  variant: "failed" | "affected";
}) {
  const styles =
    variant === "failed"
      ? { bg: "#fdebec", color: "var(--danger)", border: "#f5c4c4" }
      : { bg: "#fbf3db", color: "var(--warning)", border: "#f0ddb8" };

  return (
    <span
      className="shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
      style={{
        background: styles.bg,
        color: styles.color,
        borderColor: styles.border,
      }}
    >
      {label}
    </span>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M3 7h8M8 4l3 3-3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
