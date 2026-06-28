import Link from "next/link";

export function AppLogo({ showText = true }: { showText?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span
        className="flex h-7 w-7 items-center justify-center rounded text-xs font-semibold text-white"
        style={{ background: "var(--fg)" }}
      >
        R
      </span>
      {showText && (
        <span className="text-sm font-medium" style={{ color: "var(--fg)" }}>
          Radius
        </span>
      )}
    </Link>
  );
}
