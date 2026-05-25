"use client";

import { Assumption, AssumptionStatus, AssumptionImpact } from "@/types";

const statusStyles: Record<AssumptionStatus, string> = {
  validated: "bg-brand-green/10 text-brand-green border-brand-green/20",
  holding: "bg-brand-yellow/10 text-brand-yellow border-brand-yellow/20",
  weakening: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  invalidated: "bg-brand-red/10 text-brand-red border-brand-red/20",
};

const statusLabels: Record<AssumptionStatus, string> = {
  validated: "Validated",
  holding: "Holding",
  weakening: "Weakening",
  invalidated: "Invalidated",
};

const impactStyles: Record<AssumptionImpact, string> = {
  high: "text-brand-red",
  medium: "text-brand-yellow",
  low: "text-slate-400",
};

interface AssumptionListProps {
  assumptions: Assumption[];
  onStatusChange?: (assumptionId: string, newStatus: AssumptionStatus) => void;
  onDelete?: (assumptionId: string) => void;
}

export default function AssumptionList({
  assumptions,
  onStatusChange,
  onDelete,
}: AssumptionListProps) {
  return (
    <div className="space-y-3">
      {assumptions.map((assumption) => (
        <div
          key={assumption.id}
          className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-900/30 p-4"
        >
          <div className="flex-1">
            <p className="text-sm text-slate-200">{assumption.text}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              {onStatusChange ? (
                <select
                  value={assumption.status}
                  onChange={(e) =>
                    onStatusChange(
                      assumption.id,
                      e.target.value as AssumptionStatus
                    )
                  }
                  className="rounded-full border bg-slate-800 px-2 py-0.5 text-xs font-medium outline-none focus:ring-1 focus:ring-brand-green/30"
                  style={{
                    color:
                      assumption.status === "validated"
                        ? "#10B981"
                        : assumption.status === "holding"
                          ? "#F59E0B"
                          : assumption.status === "weakening"
                            ? "#F97316"
                            : "#EF4444",
                    borderColor:
                      assumption.status === "validated"
                        ? "rgba(16,185,129,0.2)"
                        : assumption.status === "holding"
                          ? "rgba(245,158,11,0.2)"
                          : assumption.status === "weakening"
                            ? "rgba(249,115,22,0.2)"
                            : "rgba(239,68,68,0.2)",
                  }}
                >
                  <option value="holding">Holding</option>
                  <option value="validated">Validated</option>
                  <option value="weakening">Weakening</option>
                  <option value="invalidated">Invalidated</option>
                </select>
              ) : (
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${statusStyles[assumption.status]}`}
                >
                  {statusLabels[assumption.status]}
                </span>
              )}
              <span
                className={`text-xs font-medium ${impactStyles[assumption.impact]}`}
              >
                {assumption.impact} impact
              </span>
              {assumption.category && (
                <span className="text-xs text-slate-500">
                  {assumption.category}
                </span>
              )}
            </div>
          </div>
          {onDelete && (
            <button
              onClick={() => onDelete(assumption.id)}
              className="text-slate-600 transition-colors hover:text-brand-red"
              title="Remove assumption"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
