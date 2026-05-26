"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { formatPercent } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  FileText,
  Briefcase,
  Brain,
  AlertTriangle,
  ChevronRight,
  Zap,
} from "lucide-react";

export default function HomePage() {
  const theses = useStore((s) => s.theses);
  const signals = useStore((s) => s.signals);
  const events = useStore((s) => s.events);
  const positions = useStore((s) => s.positions);

  const activeTheses = theses.filter(
    (t) => t.status === "active" || t.status === "conviction"
  );
  const totalPnl = positions.reduce((acc, p) => {
    if (!p.currentPrice) return acc;
    return acc + (p.currentPrice - p.avgCost) * p.quantity;
  }, 0);
  const avgConfidence = Math.round(
    activeTheses.reduce((acc, t) => acc + t.confidence, 0) /
      (activeTheses.length || 1)
  );
  const recentEvents = [...events]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-0 sm:text-3xl">
          Portfolio Cognition
        </h1>
        <p className="mt-1 text-sm text-text-2">
          Your investment intelligence overview
        </p>
      </div>

      {/* Metrics */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Active Theses"
          value={String(activeTheses.length)}
          icon={<FileText size={16} />}
        />
        <MetricCard
          label="Avg Confidence"
          value={`${avgConfidence}%`}
          icon={<TrendingUp size={16} />}
          accent
        />
        <MetricCard
          label="Total P&L"
          value={formatPercent(totalPnl / 1000)}
          icon={
            totalPnl >= 0 ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )
          }
          positive={totalPnl >= 0}
          negative={totalPnl < 0}
        />
        <MetricCard
          label="Active Signals"
          value={String(signals.length)}
          icon={<Zap size={16} />}
        />
      </div>

      {/* Recent Intelligence */}
      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-0">
            Recent Intelligence
          </h2>
          <Link
            href="/theses"
            className="flex items-center gap-1 text-xs text-accent hover:text-accent/80"
          >
            View all <ChevronRight size={12} />
          </Link>
        </div>
        <div className="space-y-3">
          {recentEvents.map((event) => {
            const relatedThesis = theses.find(
              (t) => t.id === event.relatedThesisIds[0]
            );
            return (
              <div
                key={event.id}
                className="rounded-xl border border-border bg-bg-2 p-4 transition-colors hover:border-border-hover"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <span
                      className={`mt-1 inline-flex h-2 w-2 rounded-full ${
                        event.impactScore > 30
                          ? "bg-success"
                          : event.impactScore < -30
                            ? "bg-destructive"
                            : "bg-warning"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium text-text-0">
                        {event.title}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-text-2">
                        <span>{event.source}</span>
                        <span>·</span>
                        <span>{event.createdAt}</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`font-mono text-xs ${
                      event.impactScore > 0
                        ? "text-success"
                        : event.impactScore < 0
                          ? "text-destructive"
                          : "text-text-2"
                    }`}
                  >
                    {event.impactScore > 0 ? "+" : ""}
                    {event.impactScore}
                  </span>
                </div>
                {event.reasoning && (
                  <p className="ml-4 text-xs text-text-1">{event.reasoning}</p>
                )}
                {relatedThesis && (
                  <div className="mt-2 ml-4">
                    <span className="rounded bg-bg-4 px-1.5 py-0.5 text-[10px] text-text-2">
                      {relatedThesis.ticker ?? relatedThesis.title}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Thesis Cards */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-0">
            Active Theses
          </h2>
          <Link
            href="/theses"
            className="flex items-center gap-1 text-xs text-accent hover:text-accent/80"
          >
            View all <ChevronRight size={12} />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeTheses.map((thesis) => (
            <Link
              key={thesis.id}
              href={`/thesis/${thesis.id}`}
              className="group relative overflow-hidden rounded-xl border border-border bg-bg-2 p-5 transition-all hover:border-border-hover hover:bg-bg-3 hover:shadow-lg"
            >
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  thesis.status === "conviction"
                    ? "bg-accent"
                    : "bg-info"
                }`}
              />
              <div className="mb-3 flex items-start justify-between">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    thesis.status === "conviction"
                      ? "bg-accent-dim text-accent"
                      : "bg-info-dim text-info"
                  }`}
                >
                  {thesis.ticker ?? thesis.title.split(" ")[0]}
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
              <div className="h-1 w-full overflow-hidden rounded-full bg-bg-4">
                <div
                  className={`h-full rounded-full ${
                    thesis.confidence >= 70
                      ? "bg-success"
                      : thesis.confidence >= 40
                        ? "bg-warning"
                        : "bg-destructive"
                  }`}
                  style={{ width: `${thesis.confidence}%` }}
                />
              </div>
              {thesis.pnl !== undefined && (
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-text-2">
                    {thesis.sector}
                  </span>
                  <span
                    className={
                      thesis.pnl >= 0 ? "text-success" : "text-destructive"
                    }
                  >
                    {formatPercent(thesis.pnl)}
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
  accent,
  positive,
  negative,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent?: boolean;
  positive?: boolean;
  negative?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-bg-2 p-4">
      <div className="mb-2 flex items-center gap-2 text-text-2">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p
        className={`text-2xl font-bold ${
          accent
            ? "text-accent"
            : positive
              ? "text-success"
              : negative
                ? "text-destructive"
                : "text-text-0"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
