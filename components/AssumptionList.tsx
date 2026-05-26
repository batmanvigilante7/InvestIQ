"use client";

import { Assumption, AssumptionStatus, AssumptionImpact } from "@/types";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const statusStyles: Record<AssumptionStatus, string> = {
  validated: "bg-success-dim text-success border-success/20",
  holding: "bg-warning-dim text-warning border-warning/20",
  weakening: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  invalidated: "bg-destructive-dim text-destructive border-destructive/20",
};

const statusLabels: Record<AssumptionStatus, string> = {
  validated: "Validated",
  holding: "Holding",
  weakening: "Weakening",
  invalidated: "Invalidated",
};

const impactStyles: Record<AssumptionImpact, string> = {
  high: "text-destructive",
  medium: "text-warning",
  low: "text-text-2",
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
  if (assumptions.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-text-2">
        No assumptions yet. Add one to start tracking.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {assumptions.map((assumption) => (
        <div
          key={assumption.id}
          className="flex items-start gap-3 rounded-lg border border-border bg-bg-1 p-4 transition-colors hover:border-border-hover"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm text-text-0">{assumption.text}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {onStatusChange ? (
                <select
                  value={assumption.status}
                  onChange={(e) =>
                    onStatusChange(
                      assumption.id,
                      e.target.value as AssumptionStatus
                    )
                  }
                  className="rounded-full border bg-bg-2 px-2 py-0.5 text-xs font-medium outline-none focus:border-accent transition-colors"
                  style={{
                    color:
                      assumption.status === "validated" ? "#22c55e" :
                      assumption.status === "holding" ? "#f59e0b" :
                      assumption.status === "weakening" ? "#f97316" :
                      "#ef4444",
                    borderColor:
                      assumption.status === "validated" ? "rgba(34,197,94,0.2)" :
                      assumption.status === "holding" ? "rgba(245,158,11,0.2)" :
                      assumption.status === "weakening" ? "rgba(249,115,22,0.2)" :
                      "rgba(239,68,68,0.2)",
                  }}
                >
                  <option value="holding">Holding</option>
                  <option value="validated">Validated</option>
                  <option value="weakening">Weakening</option>
                  <option value="invalidated">Invalidated</option>
                </select>
              ) : (
                <span
                  className={cn(
                    "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                    statusStyles[assumption.status]
                  )}
                >
                  {statusLabels[assumption.status]}
                </span>
              )}
              <span className={cn("text-xs font-medium", impactStyles[assumption.impact])}>
                {assumption.impact} impact
              </span>
              {assumption.category && (
                <span className="text-xs text-text-2">{assumption.category}</span>
              )}
            </div>
          </div>
          {onDelete && (
            <button
              onClick={() => onDelete(assumption.id)}
              className="shrink-0 text-text-2 transition-colors hover:text-destructive"
              title="Remove assumption"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
