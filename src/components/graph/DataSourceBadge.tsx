import type { GraphSource } from "@/lib/store/graph-store";

type Props = {
  source: GraphSource | null;
  syncing?: boolean;
  className?: string;
};

export function DataSourceBadge({ source, syncing = false, className = "" }: Props) {
  if (syncing) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${className}`}
        style={{
          borderColor: "var(--border)",
          color: "var(--fg-muted)",
          background: "var(--bg-secondary)",
        }}
      >
        Syncing…
      </span>
    );
  }

  if (source === "aurora") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${className}`}
        style={{
          borderColor: "#b8e0c8",
          color: "#1d6b3a",
          background: "#e8f5ec",
        }}
      >
        <span className="motion-pulse-dot h-1.5 w-1.5 rounded-full bg-[#1d6b3a]" aria-hidden />
        Live · Aurora
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${className}`}
      style={{
        borderColor: "var(--border-strong)",
        color: "var(--fg-muted)",
        background: "var(--bg-secondary)",
      }}
    >
      Sample data
    </span>
  );
}
