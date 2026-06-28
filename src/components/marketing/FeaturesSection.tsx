const features = [
  {
    title: "Blast radius",
    desc: "Trace failure cascades through your dependency graph with BFS — see exactly which services break.",
    tag: "Cascade",
    Icon: BlastIcon,
  },
  {
    title: "Weighted impact",
    desc: "Critical services count more. Get a single impact score that reflects real business weight.",
    tag: "Scoring",
    Icon: ImpactIcon,
  },
  {
    title: "Recovery waves",
    desc: "Ordered restore plan with estimated time and cost — know what to fix first.",
    tag: "Restore",
    Icon: RecoveryIcon,
  },
  {
    title: "SPOF ranking",
    desc: "Simulate each service failing alone and rank your biggest single points of failure.",
    tag: "Rank",
    Icon: SpofIcon,
  },
];

export function FeaturesSection() {
  return (
    <section className="mb-14 sm:mb-20">
      <header className="mb-8 text-center sm:mb-10">
        <p
          className="mb-3 text-[11px] font-medium uppercase tracking-wide"
          style={{ color: "var(--fg-muted)" }}
        >
          Capabilities
        </p>
        <h2
          className="text-[24px] font-bold tracking-tight sm:text-[28px] md:text-[32px]"
          style={{ color: "var(--fg)" }}
        >
          Everything you need to plan for failure
        </h2>
        <p
          className="mx-auto mt-3 max-w-lg text-sm leading-relaxed sm:text-[15px]"
          style={{ color: "var(--fg-muted)" }}
        >
          From interactive simulation to recovery planning — built for platform
          and SRE teams.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        {features.map((f) => (
          <article
            key={f.title}
            className="group rounded-xl border p-5 transition-shadow sm:p-6"
            style={{
              borderColor: "var(--border)",
              background: "#fff",
            }}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{ background: "var(--bg-secondary)" }}
              >
                <f.Icon />
              </div>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                style={{
                  background: "var(--hover)",
                  color: "var(--fg-muted)",
                }}
              >
                {f.tag}
              </span>
            </div>
            <h3
              className="mb-2 text-[15px] font-semibold"
              style={{ color: "var(--fg)" }}
            >
              {f.title}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
              {f.desc}
            </p>
          </article>
        ))}
      </div>

      {/* Example output card */}
      <div
        className="mt-5 rounded-xl border p-5 sm:mt-6 sm:p-6"
        style={{
          borderColor: "var(--border-strong)",
          background:
            "linear-gradient(135deg, var(--bg-secondary) 0%, #fff 55%)",
        }}
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <p
            className="text-[11px] font-medium uppercase tracking-wide"
            style={{ color: "var(--fg-muted)" }}
          >
            Example output
          </p>
          <span
            className="rounded-md border px-2 py-0.5 text-[11px] font-medium"
            style={{ borderColor: "var(--border)", color: "var(--fg-muted)" }}
          >
            auth-service fails
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="space-y-0 rounded-lg border bg-white" style={{ borderColor: "var(--border)" }}>
            {[
              { name: "Auth Service", status: "root", indent: 0, variant: "failed" as const },
              { name: "Orders API", status: "affected", indent: 1, variant: "affected" as const },
              { name: "API Gateway", status: "affected", indent: 2, variant: "affected" as const },
            ].map((row) => (
              <div
                key={row.name}
                className="flex items-center justify-between border-b px-4 py-2.5 text-sm last:border-0"
                style={{
                  borderColor: "var(--border)",
                  paddingLeft: `${16 + row.indent * 16}px`,
                }}
              >
                <span style={{ color: "var(--fg)" }}>{row.name}</span>
                <StatusPill label={row.status} variant={row.variant} />
              </div>
            ))}
          </div>

          <div
            className="rounded-lg border px-5 py-4 text-center sm:min-w-[140px]"
            style={{ borderColor: "var(--border)", background: "var(--fg)", color: "#fff" }}
          >
            <p className="text-[10px] font-medium uppercase tracking-wide opacity-70">
              Weighted impact
            </p>
            <p className="mt-1 text-[36px] font-bold leading-none tabular-nums">100%</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatusPill({
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
      className="rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
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

function BlastIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="6" r="2.5" stroke="#37352f" strokeWidth="1.5" />
      <circle cx="5" cy="14" r="2" stroke="#d9730d" strokeWidth="1.5" />
      <circle cx="15" cy="14" r="2" stroke="#d9730d" strokeWidth="1.5" />
      <path d="M10 8.5 L5 12 M10 8.5 L15 12" stroke="rgba(55,53,47,0.25)" strokeWidth="1.5" />
    </svg>
  );
}

function ImpactIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M4 14 L8 10 L11 12 L16 6" stroke="#37352f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="6" r="1.5" fill="#37352f" />
    </svg>
  );
}

function RecoveryIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="4" y="5" width="12" height="3" rx="1" stroke="#37352f" strokeWidth="1.5" />
      <rect x="4" y="10" width="9" height="3" rx="1" stroke="rgba(55,53,47,0.35)" strokeWidth="1.5" />
      <rect x="4" y="15" width="6" height="2" rx="1" fill="rgba(55,53,47,0.12)" />
    </svg>
  );
}

function SpofIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M6 5h8M6 10h6M6 15h4" stroke="rgba(55,53,47,0.35)" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="12" y="12" width="6" height="6" rx="1.5" stroke="#37352f" strokeWidth="1.5" />
      <path d="M14.5 14.5 L14.5 16.5 M14.5 14.5 L15.5 14.5" stroke="#37352f" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
