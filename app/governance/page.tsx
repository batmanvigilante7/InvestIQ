"use client";

import { useStore } from "@/lib/store";
import Panel from "@/components/ui/Panel";
import ProgressBar from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";
import { Shield, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default function GovernancePage() {
  const governanceRules = useStore((s) => s.governanceRules);
  const rationalityScores = useStore((s) => s.rationalityScores);
  const toggleRule = useStore((s) => s.toggleRule);

  const activeRules = governanceRules.filter((r) => r.active).length;
  const avgRationality = Math.round(
    rationalityScores.reduce((sum, s) => sum + s.value, 0) / rationalityScores.length
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-0">Governance & Rationality</h1>
        <p className="mt-1 text-sm text-text-2">
          Investment principles, rules, and rationality scoring
        </p>
      </div>

      {/* Summary */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-bg-2 p-5">
          <p className="text-xs text-text-2 mb-1">Active Rules</p>
          <p className="text-2xl font-bold text-accent">{activeRules}</p>
          <p className="text-xs text-text-2">of {governanceRules.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-bg-2 p-5">
          <p className="text-xs text-text-2 mb-1">Rationality Score</p>
          <p className={cn("text-2xl font-bold",
            avgRationality >= 75 ? "text-success" : avgRationality >= 50 ? "text-warning" : "text-destructive"
          )}>
            {avgRationality}%
          </p>
          <p className="text-xs text-text-2">weighted average</p>
        </div>
        <div className="rounded-xl border border-border bg-bg-2 p-5">
          <p className="text-xs text-text-2 mb-1">Violations</p>
          <p className="text-2xl font-bold text-warning">
            {governanceRules.filter((r) => r.triggeredAt).length}
          </p>
          <p className="text-xs text-text-2">rules triggered</p>
        </div>
        <div className="rounded-xl border border-border bg-bg-2 p-5">
          <p className="text-xs text-text-2 mb-1">Compliance</p>
          <p className={cn("text-2xl font-bold",
            governanceRules.filter((r) => r.triggeredAt).length <= 1 ? "text-success" : "text-warning"
          )}>
            {governanceRules.filter((r) => r.triggeredAt).length <= 1 ? "Good" : "Review"}
          </p>
          <p className="text-xs text-text-2">overall status</p>
        </div>
      </div>

      {/* Governance Rules */}
      <section className="mb-8">
        <Panel title="Governance Rules">
          <div className="space-y-3">
            {governanceRules.map((rule) => (
              <div
                key={rule.id}
                className={cn(
                  "flex items-start gap-4 rounded-lg border p-4 transition-all",
                  rule.active
                    ? rule.triggeredAt
                      ? "border-warning/30 bg-warning-dim"
                      : "border-border bg-bg-1 hover:border-border-hover"
                    : "border-border bg-bg-0 opacity-50"
                )}
              >
                {/* Toggle */}
                <button
                  onClick={() => toggleRule(rule.id)}
                  className={cn(
                    "relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors",
                    rule.active ? "bg-accent" : "bg-bg-4"
                  )}
                  role="switch"
                  aria-checked={rule.active}
                  aria-label={`Toggle ${rule.name}`}
                >
                  <div
                    className={cn(
                      "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform",
                      rule.active ? "left-[18px]" : "left-0.5"
                    )}
                  />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className={cn("text-sm font-medium",
                      rule.active ? "text-text-0" : "text-text-2 line-through"
                    )}>
                      {rule.name}
                    </h4>
                    {rule.triggeredAt && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-warning-dim px-2 py-0.5 text-[10px] font-medium text-warning">
                        <AlertTriangle className="h-2.5 w-2.5" />
                        Triggered {rule.triggeredAt}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-text-2 leading-relaxed">
                    {rule.description}
                  </p>
                </div>

                <div className="shrink-0">
                  {rule.active ? (
                    rule.triggeredAt ? (
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-success" />
                    )
                  ) : (
                    <XCircle className="h-4 w-4 text-text-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      {/* Rationality Scores */}
      <section className="mb-8">
        <Panel title="Rationality Scores">
          <div className="grid gap-4 sm:grid-cols-2">
            {rationalityScores.map((score) => (
              <div
                key={score.label}
                className="rounded-lg border border-border bg-bg-1 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-0">{score.label}</span>
                  <span
                    className={cn(
                      "text-sm font-bold",
                      score.value >= 75
                        ? "text-success"
                        : score.value >= 50
                          ? "text-warning"
                          : "text-destructive"
                    )}
                  >
                    {score.value}%
                  </span>
                </div>
                <ProgressBar
                  value={score.value}
                  size="md"
                />
              </div>
            ))}
          </div>
        </Panel>
      </section>

      {/* Principle */}
      <section>
        <Panel title="Investment Principles">
          <div className="space-y-3">
            {[
              { principle: "Process over outcome", description: "Good decisions can have bad outcomes. Judge your process, not individual results." },
              { principle: "Conviction is earned", description: "Never hold a position with low conviction. If you can't explain why in 30 seconds, you shouldn't own it." },
              { principle: "Risk is permanent", description: "Capital preservation trumps capital appreciation. You can always make more money, but you can't un-lose it." },
              { principle: "Emotions are signals", description: "Fear and greed are data points, not directives. When you feel strongly, slow down and write down your reasoning." },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-lg border border-accent/20 bg-accent-dim p-4"
              >
                <h4 className="text-sm font-medium text-accent">{item.principle}</h4>
                <p className="mt-1 text-xs text-text-1 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </div>
  );
}
