"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import Panel from "@/components/ui/Panel";
import FilterBar from "@/components/ui/FilterBar";
import ConvictionChart from "@/components/ConvictionChart";
import { cn } from "@/lib/utils";
import { BookOpen, TrendingUp, TrendingDown, Minus } from "lucide-react";

type MemoryFilter = "all" | "wins" | "losses" | "lessons";

export default function MemoryPage() {
  const behavioralLessons = useStore((s) => s.behavioralLessons);
  const theses = useStore((s) => s.theses);
  const convictions = useStore((s) => s.convictions);
  const [filter, setFilter] = useState<MemoryFilter>("all");

  const closedTheses = theses.filter(
    (t) => t.status === "abandoned"
  );

  const filteredLessons =
    filter === "all"
      ? behavioralLessons
      : behavioralLessons.filter((l) => l.category === filter.slice(0, -1));

  const filterOptions = [
    { label: "All", value: "all" as MemoryFilter },
    { label: "Wins", value: "wins" as MemoryFilter, count: behavioralLessons.filter((l) => l.category === "win").length },
    { label: "Losses", value: "losses" as MemoryFilter, count: behavioralLessons.filter((l) => l.category === "loss").length },
    { label: "Lessons", value: "lessons" as MemoryFilter, count: behavioralLessons.filter((l) => l.category === "lesson").length },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-0">Your Journey</h1>
        <p className="mt-1 text-sm text-text-2">
          Closed theses, behavioral lessons, and conviction evolution
        </p>
      </div>

      {/* Summary */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-bg-2 p-5 text-center">
          <p className="text-2xl font-bold text-text-0">{closedTheses.length}</p>
          <p className="text-xs text-text-2">Closed Theses</p>
        </div>
        <div className="rounded-xl border border-border bg-bg-2 p-5 text-center">
          <p className="text-2xl font-bold text-success">
            {behavioralLessons.filter((l) => l.category === "win").length}
          </p>
          <p className="text-xs text-text-2">Wins</p>
        </div>
        <div className="rounded-xl border border-border bg-bg-2 p-5 text-center">
          <p className="text-2xl font-bold text-destructive">
            {behavioralLessons.filter((l) => l.category === "loss").length}
          </p>
          <p className="text-xs text-text-2">Losses</p>
        </div>
      </div>

      {/* Closed Theses */}
      {closedTheses.length > 0 && (
        <section className="mb-8">
          <Panel title="Closed Theses">
            <div className="space-y-3">
              {closedTheses.map((thesis) => {
                const thesisConvictions = convictions.filter(
                  (c) => c.thesisId === thesis.id
                );
                const finalConviction =
                  thesisConvictions.length > 0
                    ? thesisConvictions[thesisConvictions.length - 1]
                    : null;

                return (
                  <div
                    key={thesis.id}
                    className="rounded-lg border border-border bg-bg-1 p-4"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h4 className="text-sm font-medium text-text-0">
                          {thesis.title}
                        </h4>
                        <p className="mt-0.5 text-xs text-text-2">
                          {thesis.ticker} · {thesis.sector}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {(thesis.pnl ?? 0) >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-success" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        )}
                        <span
                          className={cn(
                            "text-sm font-mono font-bold",
                            (thesis.pnl ?? 0) >= 0
                              ? "text-success"
                              : "text-destructive"
                          )}
                        >
                          {(thesis.pnl ?? 0) >= 0 ? "+" : ""}
                          {(thesis.pnl ?? 0).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-text-1 leading-relaxed">
                      {thesis.description}
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-text-2">
                      <span>Confidence: {thesis.confidence}%</span>
                      <span>·</span>
                      <span>{thesis.assumptions.length} assumptions</span>
                      <span>·</span>
                      <span>
                        {thesis.assumptions.filter((a) => a.status === "invalidated").length}{" "}
                        invalidated
                      </span>
                      <span>·</span>
                      <span>Updated {thesis.updatedAt}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </section>
      )}

      {/* Behavioral Lessons */}
      <section className="mb-8">
        <Panel title="Behavioral Lessons">
          <FilterBar
            options={filterOptions}
            value={filter}
            onChange={setFilter}
            className="mb-4"
          />
          <div className="space-y-3">
            {filteredLessons.length > 0 ? (
              filteredLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-4 transition-all",
                    lesson.category === "win"
                      ? "border-success/20 bg-success-dim"
                      : lesson.category === "loss"
                        ? "border-destructive/20 bg-destructive-dim"
                        : "border-accent/20 bg-accent-dim"
                  )}
                >
                  <span className="text-xl shrink-0">{lesson.icon}</span>
                  <p className="text-sm text-text-1 leading-relaxed">
                    {lesson.text}
                  </p>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-sm text-text-2">
                No {filter === "all" ? "" : filter} lessons recorded yet.
              </div>
            )}
          </div>
        </Panel>
      </section>

      {/* Conviction Evolution */}
      <section>
        <Panel title="Conviction Evolution">
          <div className="space-y-4">
            {theses.filter(t => t.status !== "abandoned").map((thesis) => {
              const thesisConvictions = convictions.filter(
                (c) => c.thesisId === thesis.id
              );
              return (
                <div key={thesis.id}>
                  <h4 className="mb-2 text-sm font-medium text-text-0">
                    {thesis.title}
                  </h4>
                  <ConvictionChart
                    convictions={thesisConvictions}
                    currentConfidence={thesis.confidence}
                  />
                </div>
              );
            })}
          </div>
        </Panel>
      </section>
    </div>
  );
}
