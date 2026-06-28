export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-white">
      <div
        className="flex h-12 items-center border-b sm:h-[45px]"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="page-container flex w-full items-center justify-between">
          <div className="h-4 w-24 rounded" style={{ background: "var(--hover)" }} />
          <div className="hidden h-8 w-28 rounded-md sm:block" style={{ background: "var(--hover)" }} />
        </div>
      </div>
      {/* Content */}
      <div className="page-container py-16">
        <div className="mb-4 h-10 w-2/3 max-w-md rounded" style={{ background: "var(--hover)" }} />
        <div className="mb-2 h-4 w-full max-w-lg rounded" style={{ background: "var(--hover)" }} />
        <div className="mb-8 h-4 w-4/5 max-w-sm rounded" style={{ background: "var(--hover)" }} />
        <div className="flex gap-2">
          <div className="h-9 w-28 rounded-md" style={{ background: "var(--hover)" }} />
          <div className="h-9 w-24 rounded-md" style={{ background: "var(--hover)" }} />
        </div>
      </div>
    </div>
  );
}
