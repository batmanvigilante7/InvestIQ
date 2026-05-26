"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import type { ThesisStatus } from "@/types";
import { Plus, Filter } from "lucide-react";

const filters: { label: string; value: ThesisStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Conviction", value: "conviction" },
  { label: "Reviewing", value: "reviewing" },
  { label: "Paused", value: "paused" },
  { label: "Abandoned", value: "abandoned" },
];

function ThesesContent() {
  const theses = useStore((s) => s.theses);
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") as ThesisStatus | null;
  const [statusFilter, setStatusFilter] = useState<ThesisStatus | "all">(
    initialStatus &&
      ["active", "conviction", "reviewing", "paused", "abandoned"].includes(
        initialStatus
      )
      ? initialStatus
      : "all"
  );

  const filtered =
    statusFilter === "all"
      ? theses
      : theses.filter((t) => t.status === statusFilter);

  const getCount = (status: ThesisStatus | "all") => {
    if (status === "all") return theses.length;
    return theses.filter((t) => t.status === status).length;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-0 sm:text-3xl">
            Investment Theses
          </h1>
          <p className="mt-1 text-sm text-text-2">
            {theses.length} theses · {theses.filter((t) => t.status === "active" || t.status === "conviction").length} active
          </p>
        </div>
        <Link
          href="/new-thesis"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
        >
          <Plus size={16} />
          New Thesis
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => {
          const isActive = statusFilter === f.value;
          const count = getCount(f.value);
          return (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-accent-dim text-accent"
                  : "border border-border text-text-2 hover:border-border-hover hover:text-text-1"
              }`}
            >
              {f.label}
              {count > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    isActive ? "bg-accent/20" : "bg-bg-4"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Thesis Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((thesis) => {
          const statusColors: Record<string, string> = {
            active: "bg-info-dim text-info border-info/20",
            conviction: "bg-accent-dim text-accent border-accent/20",
            reviewing: "bg-warning-dim text-warning border-warning/20",
            paused: "bg-bg-4 text-text-2 border-border",
            abandoned: "bg-bg-3 text-text-2 border-border",
          };
          const barColor: Record<string, string> = {
            active: "bg-info",
            conviction: "bg-accent",
            reviewing: "bg-warning",
            paused: "bg-text-2",
            abandoned: "bg-text-2",
          };

          return (
            <Link
              key={thesis.id}
              href={`/thesis/${thesis.id}`}
              className="group relative overflow-hidden rounded-xl border border-border bg-bg-2 p-5 transition-all hover:border-border-hover hover:bg-bg-3 hover:shadow-lg"
            >
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${barColor[thesis.status] ?? "bg-text-2"}`}
              />
              <div className="mb-3 flex items-start justify-between">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusColors[thesis.status] ?? statusColors.active}`}
                >
                  {thesis.status.charAt(0).toUpperCase() +
                    thesis.status.slice(1)}
                </span>
                <span className="text-xs font-medium text-text-1">
                  {thesis.confidence}%
                </span>
              </div>

              <h3 className="mb-1 text-sm font-semibold text-text-0 transition-colors group-hover:text-accent">
                {thesis.title}
              </h3>
              <p className="mb-3 text-xs leading-relaxed text-text-2 line-clamp-2">
                {thesis.description}
              </p>

              {/* Confidence bar */}
              <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-bg-4">
                <div
                  className={`h-full rounded-full transition-all ${
                    thesis.confidence >= 70
                      ? "bg-success"
                      : thesis.confidence >= 40
                        ? "bg-warning"
                        : "bg-destructive"
                  }`}
                  style={{ width: `${thesis.confidence}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-text-2">
                <span>
                  {thesis.assumptions.length} assumptions ·{" "}
                  {thesis.risks.length} risks
                </span>
                <span>{thesis.updatedAt}</span>
              </div>

              {thesis.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {thesis.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-bg-4 px-1.5 py-0.5 text-[10px] text-text-2"
                    >
                      {tag}
                    </span>
                  ))}
                  {thesis.tags.length > 3 && (
                    <span className="text-[10px] text-text-2">
                      +{thesis.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="rounded-xl border border-border bg-bg-2 py-16 text-center">
          <p className="text-lg text-text-1">No theses found</p>
          <p className="mt-1 text-sm text-text-2">
            Try a different filter or create a new thesis.
          </p>
          <Link
            href="/new-thesis"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
          >
            <Plus size={14} />
            Create Thesis
          </Link>
        </div>
      )}
    </div>
  );
}

export default function ThesesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-text-2">Loading...</div>
        </div>
      }
    >
      <ThesesContent />
    </Suspense>
  );
}
