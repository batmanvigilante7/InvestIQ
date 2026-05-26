"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import Panel from "@/components/ui/Panel";
import ProgressBar from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";
import { Brain, AlertTriangle, Info, ChevronDown, ChevronUp } from "lucide-react";

const severityConfig = {
  info: { icon: Info, color: "text-info", bg: "bg-info-dim", border: "border-info/20" },
  warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning-dim", border: "border-warning/20" },
  alert: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive-dim", border: "border-destructive/20" },
};

const biasColor = (level: number) => {
  if (level >= 70) return "destructive";
  if (level >= 50) return "warning";
  return "success";
};

export default function BehaviorPage() {
  const behaviorPatterns = useStore((s) => s.behaviorPatterns);
  const cognitiveBiases = useStore((s) => s.cognitiveBiases);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-0">Behavioral Intelligence</h1>
        <p className="mt-1 text-sm text-text-2">
          Pattern detection, cognitive bias assessment, and behavioral improvement
        </p>
      </div>

      {/* Behavior Patterns */}
      <section className="mb-8">
        <Panel title="Detected Patterns">
          <div className="space-y-3">
            {behaviorPatterns.map((pattern) => {
              const config = severityConfig[pattern.severity];
              const Icon = config.icon;
              const isExpanded = expanded[pattern.id];
              const shouldTruncate = pattern.description.length > 120;
              const displayText = !isExpanded && shouldTruncate
                ? pattern.description.slice(0, 100) + "..."
                : pattern.description;

              return (
                <div
                  key={pattern.id}
                  className={cn(
                    "rounded-lg border p-4 transition-all",
                    config.border,
                    config.bg
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={cn("h-4 w-4 shrink-0 mt-0.5", config.color)} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={cn("text-sm font-medium", config.color)}>
                          {pattern.title}
                        </h4>
                        <span className="text-xs text-text-2 shrink-0">{pattern.time}</span>
                      </div>
                      <p className="mt-1 text-xs text-text-1 leading-relaxed">
                        {displayText}
                      </p>
                      {shouldTruncate && (
                        <button
                          onClick={() => toggleExpand(pattern.id)}
                          className="mt-1 flex items-center gap-1 text-xs text-accent hover:underline"
                        >
                          {isExpanded ? (
                            <>Show less <ChevronUp className="h-3 w-3" /></>
                          ) : (
                            <>Read more <ChevronDown className="h-3 w-3" /></>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </section>

      {/* Cognitive Biases */}
      <section className="mb-8">
        <Panel title="Cognitive Bias Assessment">
          <div className="grid gap-4 sm:grid-cols-2">
            {cognitiveBiases.map((bias) => (
              <div
                key={bias.name}
                className="rounded-lg border border-border bg-bg-1 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-0">{bias.name}</span>
                  <span
                    className={cn(
                      "text-sm font-bold",
                      bias.level >= 70
                        ? "text-destructive"
                        : bias.level >= 50
                          ? "text-warning"
                          : "text-success"
                    )}
                  >
                    {bias.level}%
                  </span>
                </div>
                <ProgressBar
                  value={bias.level}
                  color={biasColor(bias.level)}
                  size="md"
                />
                <p className="mt-2 text-xs text-text-2">
                  {bias.level >= 70
                    ? "High risk — actively monitor this bias in your decisions"
                    : bias.level >= 50
                      ? "Moderate — be aware of this tendency"
                      : "Low risk — well managed"}
                </p>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      {/* AI Summary */}
      <section>
        <Panel title="AI Behavioral Summary">
          <div className="rounded-lg border border-border bg-bg-1 p-4">
            <div className="flex items-start gap-3">
              <Brain className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-text-1 leading-relaxed">
                  Your behavioral profile shows strong risk discipline (90%) but elevated loss aversion (72%) and confirmation bias (62%). The pattern of holding losing positions too long while selling winners prematurely is consistent with prospect theory. Consider implementing automated stop-losses and conviction-driven rebalancing rules.
                </p>
                <p className="mt-3 text-xs text-text-2">
                  Based on analysis of 12 closed positions and 23 conviction updates over 8 months.
                </p>
              </div>
            </div>
          </div>
        </Panel>
      </section>
    </div>
  );
}
