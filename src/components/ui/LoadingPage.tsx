type Props = {
  message?: string;
  fullScreen?: boolean;
};

export function LoadingPage({
  message = "Loading…",
  fullScreen = false,
}: Props) {
  return (
    <div
      className={`flex items-center justify-center bg-white ${
        fullScreen ? "min-h-screen" : "min-h-[50vh]"
      }`}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="h-5 w-5 animate-spin rounded-full border-2"
          style={{
            borderColor: "var(--border)",
            borderTopColor: "var(--fg)",
          }}
        />
        <p className="text-[13px]" style={{ color: "var(--fg-muted)" }}>
          {message}
        </p>
      </div>
    </div>
  );
}
