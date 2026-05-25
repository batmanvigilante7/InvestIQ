import Link from "next/link";
import { Thesis, ThesisStatus } from "@/types";
import ConfidenceBadge from "./ConfidenceBadge";

const statusConfig: Record<
  ThesisStatus,
  { label: string; style: string; glow: string }
> = {
  active: {
    label: "Active",
    style: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    glow: "group-hover:shadow-blue-500/10",
  },
  conviction: {
    label: "Conviction",
    style: "bg-brand-green/10 text-brand-green border border-brand-green/20",
    glow: "group-hover:shadow-brand-green/10",
  },
  reviewing: {
    label: "Reviewing",
    style:
      "bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20",
    glow: "group-hover:shadow-brand-yellow/10",
  },
  abandoned: {
    label: "Abandoned",
    style: "bg-slate-500/10 text-slate-500 border border-slate-500/20",
    glow: "",
  },
};

const accentBar: Record<ThesisStatus, string> = {
  active: "bg-blue-500",
  conviction: "bg-brand-green",
  reviewing: "bg-brand-yellow",
  abandoned: "bg-slate-600",
};

interface ThesisCardProps {
  thesis: Thesis;
}

export default function ThesisCard({ thesis }: ThesisCardProps) {
  const status = statusConfig[thesis.status];

  return (
    <Link
      href={`/thesis/${thesis.id}`}
      className={`group relative block overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 p-5 transition-all hover:border-slate-700 hover:bg-slate-900 hover:shadow-xl ${status.glow}`}
    >
      {/* Accent top bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${accentBar[thesis.status]}`}
      />

      <div className="mb-3 flex items-start justify-between">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.style}`}
        >
          {status.label}
        </span>
        <ConfidenceBadge value={thesis.confidence} size="sm" />
      </div>

      <h3 className="mb-2 text-base font-semibold text-white transition-colors group-hover:text-brand-green">
        {thesis.title}
      </h3>

      <p className="mb-4 text-sm leading-relaxed text-slate-400 line-clamp-2">
        {thesis.description}
      </p>

      {/* Confidence bar */}
      <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full transition-all ${
            thesis.confidence >= 70
              ? "bg-brand-green"
              : thesis.confidence >= 40
                ? "bg-brand-yellow"
                : "bg-brand-red"
          }`}
          style={{ width: `${thesis.confidence}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <span className="text-slate-400">{thesis.assumptions.length}</span>{" "}
          assumptions
        </span>
        <span>Updated {thesis.updatedAt}</span>
      </div>
    </Link>
  );
}
