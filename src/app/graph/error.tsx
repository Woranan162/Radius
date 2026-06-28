"use client";

export default function GraphError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-[14px] font-medium" style={{ color: "var(--fg)" }}>
        Something went wrong
      </p>
      <p className="mt-2 max-w-sm text-[13px]" style={{ color: "var(--fg-muted)" }}>
        {error.message || "Try restarting the dev server."}
      </p>
      <button type="button" onClick={reset} className="btn-primary mt-6">
        Try again
      </button>
    </div>
  );
}
