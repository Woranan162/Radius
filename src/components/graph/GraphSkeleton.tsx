"use client";

export function GraphSkeleton() {
  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      {/* Canvas area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div
          className="flex h-9 shrink-0 items-center border-b px-4"
          style={{ borderColor: "var(--border)" }}
        >
          <div
            className="h-3 w-36 animate-pulse rounded"
            style={{ background: "var(--hover)" }}
          />
        </div>
        <div className="relative min-h-[280px] flex-1 animate-pulse lg:min-h-0">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className="h-5 w-5 animate-spin rounded-full border-2"
                style={{
                  borderColor: "var(--border)",
                  borderTopColor: "var(--fg)",
                }}
              />
              <p className="text-[12px]" style={{ color: "var(--fg-muted)" }}>
                Loading graph…
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar skeleton */}
      <div
        className="h-[200px] w-full shrink-0 border-t p-4 lg:h-auto lg:w-[300px] lg:border-l lg:border-t-0"
        style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
      >
        <div
          className="mb-4 h-4 w-16 animate-pulse rounded"
          style={{ background: "var(--hover)" }}
        />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-8 animate-pulse rounded"
              style={{ background: "var(--hover)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
