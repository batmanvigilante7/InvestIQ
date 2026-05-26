import Link from "next/link";
import { Thesis, ThesisStatus } from "@/types";
import ConvictionBadge from "@/components/thesis/ConvictionBadge";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  ThesisStatus,
  { label: string; style: string; bar: string }
> = {
  active: {
    label: "Active",
    style: "bg-info-dim text-info border border-info/20",
    bar: "bg-info",
  },
  conviction: {
    label: "Conviction",
    style: "bg-success-dim text-success border border-success/20",
    bar: "bg-success",
  },
  reviewing: {
    label: "Reviewing",
    style: "bg-warning-dim text-warning border border-warning/20",
    bar: "bg-warning",
  },
  paused: {
    label: "Paused",
    style: "bg-bg-4 text-text-2 border border-border",
    bar: "bg-text-2",
  },
  abandoned: {
    label: "Abandoned",
    style: "bg-bg-3 text-text-2 border border-border",
    bar: "bg-text-2",
  },
};

interface ThesisCardProps {
  thesis: Thesis;
}

export default function ThesisCard({ thesis }: ThesisCardProps) {
  const status = statusConfig[thesis.status];

  return (
    <Link
      href={`/thesis/${thesis.id}`}
      className="group relative block overflow-hidden rounded-xl border border-border bg-bg-2 p-5 transition-all hover:border-border-hover hover:bg-bg-3 hover:shadow-lg hover:shadow-accent/5 animate-fade-in"
    >
      {/* Accent top bar */}
      <div className={cn("absolute top-0 left-0 right-0 h-0.5", status.bar)} />

      <div className="mb-3 flex items-start justify-between">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
            status.style
          )}
        >
          {status.label}
        </span>
        <ConvictionBadge score={thesis.confidence} size="sm" />
      </div>

      <h3 className="mb-2 text-sm font-semibold text-text-0 transition-colors group-hover:text-accent">
        {thesis.title}
      </h3>

      <p className="mb-4 text-xs leading-relaxed text-text-2 line-clamp-2">
        {thesis.description}
      </p>

      {/* Confidence bar */}
      <div className="mb-3 h-1 w-full overflow-hidden rounded-full bg-bg-4">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            thesis.confidence >= 70
              ? "bg-success"
              : thesis.confidence >= 40
                ? "bg-warning"
                : "bg-destructive"
          )}
          style={{ width: `${thesis.confidence}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-text-2">
        <span>
          <span className="text-text-1">{thesis.assumptions.length}</span>{" "}
          assumptions ·{" "}
          <span className="text-text-1">{thesis.risks.length}</span> risks
        </span>
        <span>Updated {thesis.updatedAt}</span>
      </div>
    </Link>
  );
}
