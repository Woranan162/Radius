import Link from "next/link";

const highlights = [
  "Blast radius cascade",
  "Weighted impact",
  "Recovery waves",
];

export function HeroSection() {
  return (
    <section className="relative mb-14 overflow-hidden sm:mb-20">
      {/* Soft background band */}
      <div
        className="absolute inset-0 -mx-6 sm:-mx-8"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(247, 246, 243, 0.9) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative grid items-center gap-8 sm:gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        {/* Copy */}
        <div className="max-w-xl text-center lg:text-left">
          <p
            className="mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
            style={{
              borderColor: "var(--border-strong)",
              color: "var(--fg-muted)",
              background: "rgba(255,255,255,0.7)",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--accent)" }}
            />
            For platform &amp; SRE teams
          </p>

          <h1
            className="mb-4 text-[32px] font-bold leading-[1.12] tracking-tight sm:mb-5 sm:text-[40px] md:text-[48px] lg:text-[52px]"
            style={{ color: "var(--fg)" }}
          >
            Know your blast radius{" "}
            <span style={{ color: "var(--fg-muted)" }}>before production does.</span>
          </h1>

          <p
            className="mx-auto mb-6 max-w-md text-base leading-relaxed sm:mb-8 sm:text-[17px] md:text-lg lg:mx-0"
            style={{ color: "var(--fg-muted)" }}
          >
            Model service dependencies, simulate failures on an interactive graph,
            and get recovery plans with weighted impact scores.
          </p>

          <div className="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-3 lg:justify-start">
            <Link href="/graph" className="btn-primary w-full gap-2 px-5 py-2.5 sm:w-auto">
              Open simulator
              <ArrowIcon />
            </Link>
            <Link href="/demo?fail=auth-service" className="btn-ghost w-full px-5 py-2.5 sm:w-auto">
              View demo
            </Link>
          </div>

          <ul className="flex flex-wrap justify-center gap-2 lg:justify-start">
            {highlights.map((item) => (
              <li
                key={item}
                className="rounded-md border px-2.5 py-1 text-xs font-medium"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--fg-muted)",
                  background: "rgba(255,255,255,0.6)",
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Preview card */}
        <HeroPreview />
      </div>
    </section>
  );
}

function HeroPreview() {
  return (
    <div
      className="relative rounded-xl border shadow-[0_20px_50px_-12px_rgba(55,53,47,0.12)]"
      style={{
        borderColor: "var(--border-strong)",
        background: "#fff",
      }}
    >
      {/* Window chrome */}
      <div
        className="flex items-center gap-2 border-b px-4 py-3"
        style={{ borderColor: "var(--border)" }}
      >
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#ff5f57" }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#febc2e" }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#28c840" }} />
        <span
          className="ml-2 text-xs font-medium"
          style={{ color: "var(--fg-muted)" }}
        >
          Radius · Simulator
        </span>
      </div>

      {/* Graph area */}
      <div
        className="relative aspect-[4/3] overflow-hidden p-4 sm:p-6"
        style={{ background: "var(--bg-secondary)" }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(rgba(55,53,47,0.08) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
          aria-hidden
        />
        <HeroGraphSvg />
      </div>

      {/* Status bar */}
      <div
        className="flex flex-col gap-3 border-t px-3 py-3 text-[10px] sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:text-xs"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <StatusDot color="var(--danger)" label="Failed" />
          <StatusDot color="var(--warning)" label="Affected" />
          <StatusDot color="#c4c4c2" label="Healthy" />
        </div>
        <div className="text-right">
          <span style={{ color: "var(--fg-muted)" }}>Weighted impact </span>
          <span className="font-semibold" style={{ color: "var(--fg)" }}>
            73%
          </span>
        </div>
      </div>
    </div>
  );
}

function StatusDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5" style={{ color: "var(--fg-muted)" }}>
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
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

function HeroGraphSvg() {
  const stroke = "rgba(55, 53, 47, 0.2)";

  return (
    <svg
      className="relative mx-auto h-full w-full max-w-[340px]"
      viewBox="0 0 340 240"
      fill="none"
      aria-hidden
    >
      {/* edges */}
      <path d="M170 52 L95 118" stroke={stroke} strokeWidth="1.5" />
      <path d="M170 52 L245 118" stroke={stroke} strokeWidth="1.5" />
      <path d="M95 118 L170 188" stroke={stroke} strokeWidth="1.5" />
      <path d="M245 118 L170 188" stroke={stroke} strokeWidth="1.5" />
      <path d="M245 118 L280 188" stroke={stroke} strokeWidth="1.5" />

      {/* API Gateway — healthy */}
      <GraphNode x={170} y={52} label="API Gateway" status="healthy" />

      {/* Auth — failed root */}
      <GraphNode x={95} y={118} label="Auth Service" status="failed" />

      {/* Orders — affected */}
      <GraphNode x={245} y={118} label="Orders API" status="affected" />

      {/* Payment — affected */}
      <GraphNode x={170} y={188} label="Payment" status="affected" />

      {/* Redis — healthy */}
      <GraphNode x={280} y={188} label="Redis" status="healthy" small />
    </svg>
  );
}

function GraphNode({
  x,
  y,
  label,
  status,
  small,
}: {
  x: number;
  y: number;
  label: string;
  status: "failed" | "affected" | "healthy";
  small?: boolean;
}) {
  const w = small ? 72 : 88;
  const h = small ? 32 : 36;
  const colors = {
    failed: { border: "#eb5757", bg: "rgba(235,87,87,0.1)", text: "#eb5757" },
    affected: { border: "#d9730d", bg: "rgba(217,115,13,0.1)", text: "#d9730d" },
    healthy: { border: "rgba(55,53,47,0.16)", bg: "#fff", text: "var(--fg)" },
  };
  const c = colors[status];

  return (
    <g transform={`translate(${x - w / 2}, ${y - h / 2})`}>
      <rect
        width={w}
        height={h}
        rx="6"
        fill={c.bg}
        stroke={c.border}
        strokeWidth={status === "failed" ? 2 : 1.5}
      />
      <text
        x={w / 2}
        y={h / 2 + 4}
        textAnchor="middle"
        fontSize={small ? 10 : 11}
        fontWeight="500"
        fill={c.text}
        style={{ fontFamily: "system-ui, sans-serif" }}
      >
        {label}
      </text>
    </g>
  );
}
