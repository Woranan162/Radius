const steps = [
  {
    step: 1,
    title: "Map your architecture",
    desc: "Import services and dependencies into an interactive graph — or start from the sample stack.",
    Illustration: MapIllustration,
  },
  {
    step: 2,
    title: "Pick a failure",
    desc: "Click any node to simulate an outage. Radius treats it as the root cause.",
    Illustration: FailIllustration,
  },
  {
    step: 3,
    title: "See blast radius",
    desc: "Watch the cascade highlight every downstream service affected by the failure.",
    Illustration: BlastIllustration,
  },
  {
    step: 4,
    title: "Plan recovery",
    desc: "Get ordered recovery waves, weighted impact scores, and SPOF rankings.",
    Illustration: RecoveryIllustration,
  },
];

export function HowItWorks() {
  return (
    <section className="mb-14 sm:mb-20">
      <h2
        className="mb-10 px-2 text-center text-[24px] font-bold leading-tight tracking-tight sm:mb-14 sm:text-[28px] md:text-[32px]"
        style={{ color: "var(--fg)" }}
      >
        Map dependencies. Radius does the rest.
      </h2>

      <div
        className="relative border-t border-dashed pt-10 sm:pt-12"
        style={{ borderColor: "var(--border-strong)" }}
      >
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4 lg:gap-0">
          {steps.map((item, index) => (
            <div
              key={item.step}
              className="relative rounded-lg border px-4 pb-6 pt-10 sm:rounded-none sm:border-0 sm:px-6 sm:pb-0 sm:pt-12 lg:border-l lg:px-8 first:lg:border-l-0"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="absolute left-4 top-0 -translate-y-1/2 sm:left-6 lg:left-8">
                <StepBadge step={item.step} active={index === 0} />
              </div>

              <h3
                className="mb-2 text-[15px] font-semibold"
                style={{ color: "var(--fg)" }}
              >
                {item.title}
              </h3>
              <p
                className="mb-5 text-sm leading-relaxed sm:mb-6 lg:min-h-[72px]"
                style={{ color: "var(--fg-muted)" }}
              >
                {item.desc}
              </p>

              <div
                className="flex h-[140px] items-center justify-center rounded-lg border"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--bg-secondary)",
                }}
              >
                <item.Illustration />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepBadge({ step, active }: { step: number; active?: boolean }) {
  return (
    <div
      className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md text-xs font-semibold"
      style={
        active
          ? { background: "var(--fg)", color: "#fff" }
          : {
              background: "#fff",
              color: "var(--fg-muted)",
              border: "1px solid var(--border-strong)",
            }
      }
    >
      {step}
    </div>
  );
}

const stroke = "rgba(55, 53, 47, 0.35)";
const strokeLight = "rgba(55, 53, 47, 0.18)";

function MapIllustration() {
  return (
    <svg width="120" height="80" viewBox="0 0 120 80" fill="none" aria-hidden>
      <rect x="8" y="28" width="36" height="24" rx="4" stroke={stroke} strokeWidth="1.5" />
      <rect x="76" y="8" width="36" height="24" rx="4" stroke={stroke} strokeWidth="1.5" />
      <rect x="76" y="48" width="36" height="24" rx="4" stroke={stroke} strokeWidth="1.5" />
      <line x1="44" y1="40" x2="76" y2="20" stroke={strokeLight} strokeWidth="1.5" />
      <line x1="44" y1="40" x2="76" y2="60" stroke={strokeLight} strokeWidth="1.5" />
      <circle cx="26" cy="40" r="3" fill={stroke} />
      <circle cx="94" cy="20" r="3" fill={strokeLight} />
      <circle cx="94" cy="60" r="3" fill={strokeLight} />
    </svg>
  );
}

function FailIllustration() {
  return (
    <svg width="120" height="80" viewBox="0 0 120 80" fill="none" aria-hidden>
      <rect x="42" y="24" width="36" height="32" rx="4" stroke="#eb5757" strokeWidth="2" />
      <rect x="8" y="8" width="28" height="20" rx="3" stroke={strokeLight} strokeWidth="1.5" />
      <rect x="8" y="52" width="28" height="20" rx="3" stroke={strokeLight} strokeWidth="1.5" />
      <rect x="84" y="30" width="28" height="20" rx="3" stroke={strokeLight} strokeWidth="1.5" />
      <line x1="36" y1="18" x2="42" y2="32" stroke={strokeLight} strokeWidth="1.5" />
      <line x1="36" y1="62" x2="42" y2="48" stroke={strokeLight} strokeWidth="1.5" />
      <line x1="78" y1="40" x2="84" y2="40" stroke={strokeLight} strokeWidth="1.5" />
      <circle cx="60" cy="40" r="5" fill="#eb5757" fillOpacity="0.2" />
    </svg>
  );
}

function BlastIllustration() {
  return (
    <svg width="120" height="80" viewBox="0 0 120 80" fill="none" aria-hidden>
      <rect x="48" y="30" width="24" height="20" rx="3" stroke="#eb5757" strokeWidth="1.5" fill="#eb5757" fillOpacity="0.12" />
      <rect x="8" y="10" width="24" height="18" rx="3" stroke="#d9730d" strokeWidth="1.5" fill="#d9730d" fillOpacity="0.1" />
      <rect x="8" y="52" width="24" height="18" rx="3" stroke="#d9730d" strokeWidth="1.5" fill="#d9730d" fillOpacity="0.1" />
      <rect x="88" y="30" width="24" height="20" rx="3" stroke="#d9730d" strokeWidth="1.5" fill="#d9730d" fillOpacity="0.1" />
      <line x1="32" y1="19" x2="48" y2="38" stroke="#d9730d" strokeWidth="1.5" strokeOpacity="0.5" />
      <line x1="32" y1="61" x2="48" y2="42" stroke="#d9730d" strokeWidth="1.5" strokeOpacity="0.5" />
      <line x1="72" y1="40" x2="88" y2="40" stroke="#d9730d" strokeWidth="1.5" strokeOpacity="0.5" />
    </svg>
  );
}

function RecoveryIllustration() {
  return (
    <svg width="120" height="80" viewBox="0 0 120 80" fill="none" aria-hidden>
      <rect x="12" y="12" width="96" height="56" rx="4" stroke={stroke} strokeWidth="1.5" />
      <line x1="12" y1="28" x2="108" y2="28" stroke={strokeLight} strokeWidth="1" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(20, ${36 + i * 14})`}>
          <rect x="0" y="0" width="10" height="10" rx="2" stroke={i === 0 ? stroke : strokeLight} strokeWidth="1.5" fill={i === 0 ? "rgba(55,53,47,0.08)" : "none"} />
          {i === 0 && (
            <path d="M2.5 5 L4.5 7 L7.5 3" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          )}
          <line x1="16" y1="5" x2="72" y2="5" stroke={strokeLight} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}
