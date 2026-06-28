"use client";

type Tab = "impact" | "recovery" | "spof";

type SimulatorGuideProps = {
  compact?: boolean;
  open: boolean;
  onToggle: () => void;
};

export function SimulatorGuide({ compact = false, open, onToggle }: SimulatorGuideProps) {
  const pad = compact ? "px-3" : "px-4";

  if (!open) {
    return (
      <div className={`shrink-0 border-b ${pad} py-2`} style={{ borderColor: "var(--border)" }}>
        <button
          type="button"
          onClick={onToggle}
          className="text-[12px] font-medium"
          style={{ color: "var(--accent)" }}
        >
          Show guide
        </button>
      </div>
    );
  }

  return (
    <div className={`shrink-0 border-b ${pad} py-3`} style={{ borderColor: "var(--border)" }}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <p
          className="text-[11px] font-medium uppercase tracking-wide"
          style={{ color: "var(--fg-muted)" }}
        >
          Guide
        </p>
        <button
          type="button"
          onClick={onToggle}
          className="rounded-md px-2 py-0.5 text-[11px] font-medium"
          style={{ color: "var(--fg-muted)" }}
          aria-label="Close guide"
        >
          Close
        </button>
      </div>

      <p
        className="mb-2 text-[11px] font-medium uppercase tracking-wide"
        style={{ color: "var(--fg-muted)" }}
      >
        How to use
      </p>
      <ol
        className="mb-4 list-decimal space-y-1.5 pl-4 text-[12px] leading-relaxed"
        style={{ color: "var(--fg-muted)" }}
      >
        <li>Click any service node on the graph to simulate an outage.</li>
        <li>
          Radius treats that node as the{" "}
          <strong style={{ color: "var(--fg)" }}>root failure</strong>.
        </li>
        <li>
          Downstream dependents highlight in orange — that is your blast radius.
        </li>
        <li>Review Impact, Recovery, and SPOF tabs below.</li>
      </ol>

      <p
        className="mb-2 text-[11px] font-medium uppercase tracking-wide"
        style={{ color: "var(--fg-muted)" }}
      >
        Graph legend
      </p>
      <ul className="mb-4 space-y-1.5">
        <LegendItem color="#eb5757" bg="#fdebec" label="Failed" desc="Root cause you selected" />
        <LegendItem color="#d9730d" bg="#fbf3db" label="Affected" desc="Downstream services that break" />
        <LegendItem color="#c4c4c2" bg="#fff" label="Healthy" desc="Not impacted by this failure" />
      </ul>

      <p
        className="mb-2 text-[11px] font-medium uppercase tracking-wide"
        style={{ color: "var(--fg-muted)" }}
      >
        Dependency model
      </p>
      <p className="text-[12px] leading-relaxed" style={{ color: "var(--fg-muted)" }}>
        Arrows mean <strong style={{ color: "var(--fg)" }}>depends on</strong>. If Auth
        Service fails, every service that depends on it (directly or indirectly) is
        marked affected.
      </p>
    </div>
  );
}

type TabExplanationProps = {
  tab: Tab;
  open: boolean;
  onClose: () => void;
};

export function TabExplanation({ tab, open, onClose }: TabExplanationProps) {
  const copy: Record<Tab, { title: string; body: string }> = {
    impact: {
      title: "Blast radius & impact",
      body: "Shows which services fail and how far the cascade spreads. Weighted impact counts critical services more — higher weight means a bigger score when that service is down.",
    },
    recovery: {
      title: "Recovery waves",
      body: "An ordered restore plan: fix dependencies before dependents. Each wave lists services to bring back together, with estimated minutes and cost.",
    },
    spof: {
      title: "SPOF ranking",
      body: "Single Point of Failure score — each service is simulated failing alone. Ranked by weighted impact % so you know which outage hurts most.",
    },
  };

  const { title, body } = copy[tab];

  if (!open) {
    return (
      <button
        type="button"
        onClick={onClose}
        className="mb-4 text-[11px] font-medium"
        style={{ color: "var(--accent)" }}
      >
        What is {title.toLowerCase()}?
      </button>
    );
  }

  return (
    <div
      className="mb-4 rounded-lg border p-3"
      style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.7)" }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[12px] font-medium" style={{ color: "var(--fg)" }}>
          {title}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium"
          style={{ color: "var(--fg-muted)" }}
          aria-label="Close explanation"
        >
          Close
        </button>
      </div>
      <p className="mt-1 text-[11px] leading-relaxed" style={{ color: "var(--fg-muted)" }}>
        {body}
      </p>
    </div>
  );
}

function LegendItem({
  color,
  bg,
  label,
  desc,
}: {
  color: string;
  bg: string;
  label: string;
  desc: string;
}) {
  return (
    <li className="flex items-start gap-2 text-[12px]">
      <span
        className="mt-0.5 h-3 w-3 shrink-0 rounded border"
        style={{ background: bg, borderColor: color }}
      />
      <span style={{ color: "var(--fg-muted)" }}>
        <span className="font-medium" style={{ color: "var(--fg)" }}>
          {label}
        </span>
        {" — "}
        {desc}
      </span>
    </li>
  );
}
