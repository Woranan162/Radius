"use client";

import { useState, type FormEvent } from "react";
import type { ServiceTier } from "@/lib/simulation/types";

type Props = {
  existingIds: string[];
  onAdded: () => Promise<void>;
  onClose: () => void;
};

const TIERS: ServiceTier[] = ["critical", "customer-facing", "internal"];

export function AddServiceForm({ existingIds, onAdded, onClose }: Props) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [tier, setTier] = useState<ServiceTier>("internal");
  const [weight, setWeight] = useState(5);
  const [dependsOn, setDependsOn] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: id.trim(),
          name: name.trim(),
          tier,
          weight,
          restoreTimeMin: 10,
          restoreCost: 1500,
          dependsOn,
        }),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to add service");
      }

      await onAdded();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add service");
    } finally {
      setSubmitting(false);
    }
  }

  function toggleDependency(serviceId: string) {
    setDependsOn((prev) =>
      prev.includes(serviceId)
        ? prev.filter((d) => d !== serviceId)
        : [...prev, serviceId],
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="motion-menu-enter shrink-0 border-b px-3 py-3 sm:px-4"
      style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-[12px] font-semibold" style={{ color: "var(--fg)" }}>
          Add service to Aurora
        </p>
        <button
          type="button"
          onClick={onClose}
          className="btn-ghost text-[11px] !px-2 !py-1"
        >
          Close
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-[11px]" style={{ color: "var(--fg-muted)" }}>
          Service ID
          <input
            required
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="notification-service"
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            className="mt-1 w-full rounded-lg border px-2.5 py-1.5 text-[13px]"
            style={{ borderColor: "var(--border)", background: "#fff", color: "var(--fg)" }}
          />
        </label>

        <label className="block text-[11px]" style={{ color: "var(--fg-muted)" }}>
          Display name
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Notification Service"
            className="mt-1 w-full rounded-lg border px-2.5 py-1.5 text-[13px]"
            style={{ borderColor: "var(--border)", background: "#fff", color: "var(--fg)" }}
          />
        </label>

        <label className="block text-[11px]" style={{ color: "var(--fg-muted)" }}>
          Tier
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value as ServiceTier)}
            className="mt-1 w-full rounded-lg border px-2.5 py-1.5 text-[13px]"
            style={{ borderColor: "var(--border)", background: "#fff", color: "var(--fg)" }}
          >
            {TIERS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-[11px]" style={{ color: "var(--fg-muted)" }}>
          Weight (1–10)
          <input
            type="number"
            min={1}
            max={10}
            required
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border px-2.5 py-1.5 text-[13px]"
            style={{ borderColor: "var(--border)", background: "#fff", color: "var(--fg)" }}
          />
        </label>
      </div>

      {existingIds.length > 0 && (
        <fieldset className="mt-3">
          <legend
            className="mb-2 text-[11px] font-medium"
            style={{ color: "var(--fg-muted)" }}
          >
            Depends on (optional)
          </legend>
          <div className="flex flex-wrap gap-2">
            {existingIds.map((serviceId) => {
              const active = dependsOn.includes(serviceId);
              return (
                <button
                  key={serviceId}
                  type="button"
                  onClick={() => toggleDependency(serviceId)}
                  className="rounded-md border px-2 py-1 text-[11px] font-medium transition-colors"
                  style={{
                    borderColor: active ? "var(--fg)" : "var(--border)",
                    background: active ? "var(--fg)" : "#fff",
                    color: active ? "#fff" : "var(--fg)",
                  }}
                >
                  {serviceId}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {error && (
        <p className="mt-2 text-[11px]" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}

      <div className="mt-3 flex justify-end gap-2">
        <button type="button" onClick={onClose} className="btn-ghost text-[12px]">
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary text-[12px] !px-3 !py-1.5"
        >
          {submitting ? "Saving…" : "Save to database"}
        </button>
      </div>
    </form>
  );
}
