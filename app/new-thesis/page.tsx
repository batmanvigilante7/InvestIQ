"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { ArrowLeft, Plus, X, AlertTriangle, Zap, TrendingUp } from "lucide-react";

const convictionOptions = [
  { label: "Exploratory", value: 15 },
  { label: "Low", value: 30 },
  { label: "Moderate", value: 55 },
  { label: "High", value: 75 },
  { label: "Extreme", value: 95 },
];

interface FormSignal {
  id: string;
  text: string;
  type: "bullish" | "bearish" | "neutral";
}

interface FormRisk {
  id: string;
  text: string;
  severity: "high" | "medium" | "low";
}

interface FormGrowthCase {
  id: string;
  text: string;
  potential: "moderate" | "significant" | "transformative";
}

export default function NewThesisPage() {
  const router = useRouter();
  const addThesis = useStore((s) => s.addThesis);

  const [ticker, setTicker] = useState("");
  const [name, setName] = useState("");
  const [sector, setSector] = useState("");
  const [description, setDescription] = useState("");
  const [conviction, setConviction] = useState(55);
  const [tags, setTags] = useState("");
  const [allocation, setAllocation] = useState("");
  const [entryPrice, setEntryPrice] = useState("");

  const [signals, setSignals] = useState<FormSignal[]>([]);
  const [risks, setRisks] = useState<FormRisk[]>([]);
  const [growthCases, setGrowthCases] = useState<FormGrowthCase[]>([]);

  const [newSignalText, setNewSignalText] = useState("");
  const [newSignalType, setNewSignalType] = useState<"bullish" | "bearish" | "neutral">("bullish");
  const [newRiskText, setNewRiskText] = useState("");
  const [newRiskSeverity, setNewRiskSeverity] = useState<"high" | "medium" | "low">("medium");
  const [newGrowthText, setNewGrowthText] = useState("");
  const [newGrowthPotential, setNewGrowthPotential] = useState<"moderate" | "significant" | "transformative">("significant");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isValid = ticker.trim().length > 0 && name.trim().length > 0;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!ticker.trim()) newErrors.ticker = "Ticker is required";
    if (!name.trim()) newErrors.name = "Name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    addThesis({
      title: `${ticker.toUpperCase()} — ${name}`,
      ticker: ticker.toUpperCase(),
      sector: sector || undefined,
      description: description || `${name} investment thesis`,
      confidence: conviction,
      status: conviction >= 70 ? "conviction" : conviction >= 40 ? "active" : "reviewing",
      assumptions: [],
      risks: risks.map((r) => ({
        id: `r-${Date.now()}-${Math.random()}`,
        text: r.text,
        severity: r.severity,
        status: "active" as const,
        createdAt: new Date().toISOString().split("T")[0],
      })),
      tags: tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
      allocation: allocation ? parseFloat(allocation) : undefined,
      pnl: 0,
    });

    router.push("/theses");
  };

  const addSignal = () => {
    if (!newSignalText.trim()) return;
    setSignals([
      ...signals,
      { id: `sig-${Date.now()}`, text: newSignalText, type: newSignalType },
    ]);
    setNewSignalText("");
  };

  const addRisk = () => {
    if (!newRiskText.trim()) return;
    setRisks([
      ...risks,
      { id: `risk-${Date.now()}`, text: newRiskText, severity: newRiskSeverity },
    ]);
    setNewRiskText("");
  };

  const addGrowthCase = () => {
    if (!newGrowthText.trim()) return;
    setGrowthCases([
      ...growthCases,
      { id: `gc-${Date.now()}`, text: newGrowthText, potential: newGrowthPotential },
    ]);
    setNewGrowthText("");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/theses"
        className="mb-6 inline-flex items-center gap-2 text-sm text-text-2 transition-colors hover:text-text-0"
      >
        <ArrowLeft size={14} />
        Back
      </Link>

      <h1 className="mb-8 text-2xl font-bold text-text-0">
        Create Investment Thesis
      </h1>

      <div className="space-y-6">
        {/* Basic Info */}
        <section className="rounded-xl border border-border bg-bg-2 p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-2">
            Basic Info
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-text-1">
                Ticker <span className="text-destructive">*</span>
              </label>
              <input
                value={ticker}
                onChange={(e) => {
                  setTicker(e.target.value);
                  if (errors.ticker) setErrors({ ...errors, ticker: "" });
                }}
                placeholder="NVDA"
                className={`w-full rounded-lg border bg-bg-3 px-3 py-2 text-sm text-text-0 outline-none focus:border-accent ${
                  errors.ticker ? "border-destructive" : "border-border"
                }`}
              />
              {errors.ticker && (
                <p className="mt-1 text-xs text-destructive">{errors.ticker}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-1">
                Company Name <span className="text-destructive">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
                placeholder="NVIDIA Corporation"
                className={`w-full rounded-lg border bg-bg-3 px-3 py-2 text-sm text-text-0 outline-none focus:border-accent ${
                  errors.name ? "border-destructive" : "border-border"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-destructive">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-1">Sector</label>
              <input
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                placeholder="Semiconductors/AI"
                className="w-full rounded-lg border border-border bg-bg-3 px-3 py-2 text-sm text-text-0 outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-1">
                Tags (comma separated)
              </label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="ai, semiconductors, growth"
                className="w-full rounded-lg border border-border bg-bg-3 px-3 py-2 text-sm text-text-0 outline-none focus:border-accent"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-1 block text-xs text-text-1">
              Thesis Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why does this investment thesis exist? What's the core insight?"
              rows={4}
              className="w-full rounded-lg border border-border bg-bg-3 px-3 py-2 text-sm text-text-0 outline-none focus:border-accent"
            />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-text-1">
                Allocation %
              </label>
              <input
                type="number"
                value={allocation}
                onChange={(e) => setAllocation(e.target.value)}
                placeholder="5.0"
                min={0}
                max={100}
                step={0.1}
                className="w-full rounded-lg border border-border bg-bg-3 px-3 py-2 text-sm text-text-0 outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-1">
                Entry Price
              </label>
              <input
                type="number"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                placeholder="420.50"
                min={0}
                step={0.01}
                className="w-full rounded-lg border border-border bg-bg-3 px-3 py-2 text-sm text-text-0 outline-none focus:border-accent"
              />
            </div>
          </div>
        </section>

        {/* Conviction */}
        <section className="rounded-xl border border-border bg-bg-2 p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-2">
            Conviction Level
          </h2>
          <div className="flex flex-wrap gap-2">
            {convictionOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setConviction(opt.value)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  conviction === opt.value
                    ? "bg-accent-dim text-accent border border-accent/30"
                    : "border border-border text-text-2 hover:border-border-hover hover:text-text-1"
                }`}
              >
                {opt.label} ({opt.value}%)
              </button>
            ))}
          </div>
          <div className="mt-3">
            <div className="h-2 w-full overflow-hidden rounded-full bg-bg-4">
              <div
                className={`h-full rounded-full transition-all ${
                  conviction >= 70
                    ? "bg-success"
                    : conviction >= 40
                      ? "bg-warning"
                      : "bg-destructive"
                }`}
                style={{ width: `${conviction}%` }}
              />
            </div>
          </div>
        </section>

        {/* Signals to Watch */}
        <section className="rounded-xl border border-border bg-bg-2 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-text-2">
            <Zap size={14} />
            Signals to Watch
          </h2>
          {signals.length > 0 && (
            <div className="mb-3 space-y-2">
              {signals.map((sig) => (
                <div
                  key={sig.id}
                  className="flex items-center justify-between rounded-lg bg-bg-3 px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        sig.type === "bullish"
                          ? "bg-success"
                          : sig.type === "bearish"
                            ? "bg-destructive"
                            : "bg-text-2"
                      }`}
                    />
                    <span className="text-sm text-text-0">{sig.text}</span>
                  </div>
                  <button
                    onClick={() => setSignals(signals.filter((s) => s.id !== sig.id))}
                    className="text-text-2 hover:text-destructive"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <select
              value={newSignalType}
              onChange={(e) => setNewSignalType(e.target.value as any)}
              className="rounded-lg border border-border bg-bg-3 px-2 py-2 text-xs text-text-1 outline-none"
            >
              <option value="bullish">Bullish</option>
              <option value="bearish">Bearish</option>
              <option value="neutral">Neutral</option>
            </select>
            <input
              value={newSignalText}
              onChange={(e) => setNewSignalText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSignal()}
              placeholder="e.g., Q2 earnings beat expectations"
              className="flex-1 rounded-lg border border-border bg-bg-3 px-3 py-2 text-sm text-text-0 outline-none focus:border-accent"
            />
            <button
              onClick={addSignal}
              disabled={!newSignalText.trim()}
              className="inline-flex items-center gap-1 rounded-lg bg-accent-dim px-3 py-2 text-xs text-accent disabled:opacity-50"
            >
              <Plus size={12} />
              Add
            </button>
          </div>
        </section>

        {/* Risk Factors */}
        <section className="rounded-xl border border-border bg-bg-2 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-text-2">
            <AlertTriangle size={14} />
            Risk Factors
          </h2>
          {risks.length > 0 && (
            <div className="mb-3 space-y-2">
              {risks.map((risk) => (
                <div
                  key={risk.id}
                  className="flex items-center justify-between rounded-lg bg-bg-3 px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] ${
                        risk.severity === "high"
                          ? "bg-destructive-dim text-destructive"
                          : risk.severity === "medium"
                            ? "bg-warning-dim text-warning"
                            : "bg-bg-4 text-text-2"
                      }`}
                    >
                      {risk.severity}
                    </span>
                    <span className="text-sm text-text-0">{risk.text}</span>
                  </div>
                  <button
                    onClick={() => setRisks(risks.filter((r) => r.id !== risk.id))}
                    className="text-text-2 hover:text-destructive"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <select
              value={newRiskSeverity}
              onChange={(e) => setNewRiskSeverity(e.target.value as any)}
              className="rounded-lg border border-border bg-bg-3 px-2 py-2 text-xs text-text-1 outline-none"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <input
              value={newRiskText}
              onChange={(e) => setNewRiskText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addRisk()}
              placeholder="e.g., Regulatory crackdown on AI chips"
              className="flex-1 rounded-lg border border-border bg-bg-3 px-3 py-2 text-sm text-text-0 outline-none focus:border-accent"
            />
            <button
              onClick={addRisk}
              disabled={!newRiskText.trim()}
              className="inline-flex items-center gap-1 rounded-lg bg-accent-dim px-3 py-2 text-xs text-accent disabled:opacity-50"
            >
              <Plus size={12} />
              Add
            </button>
          </div>
        </section>

        {/* Growth Cases */}
        <section className="rounded-xl border border-border bg-bg-2 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-text-2">
            <TrendingUp size={14} />
            Growth Cases
          </h2>
          {growthCases.length > 0 && (
            <div className="mb-3 space-y-2">
              {growthCases.map((gc) => (
                <div
                  key={gc.id}
                  className="flex items-center justify-between rounded-lg bg-bg-3 px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] ${
                        gc.potential === "transformative"
                          ? "bg-accent-dim text-accent"
                          : gc.potential === "significant"
                            ? "bg-success-dim text-success"
                            : "bg-bg-4 text-text-2"
                      }`}
                    >
                      {gc.potential}
                    </span>
                    <span className="text-sm text-text-0">{gc.text}</span>
                  </div>
                  <button
                    onClick={() => setGrowthCases(growthCases.filter((g) => g.id !== gc.id))}
                    className="text-text-2 hover:text-destructive"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <select
              value={newGrowthPotential}
              onChange={(e) => setNewGrowthPotential(e.target.value as any)}
              className="rounded-lg border border-border bg-bg-3 px-2 py-2 text-xs text-text-1 outline-none"
            >
              <option value="moderate">Moderate</option>
              <option value="significant">Significant</option>
              <option value="transformative">Transformative</option>
            </select>
            <input
              value={newGrowthText}
              onChange={(e) => setNewGrowthText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addGrowthCase()}
              placeholder="e.g., AI inference market 10x by 2028"
              className="flex-1 rounded-lg border border-border bg-bg-3 px-3 py-2 text-sm text-text-0 outline-none focus:border-accent"
            />
            <button
              onClick={addGrowthCase}
              disabled={!newGrowthText.trim()}
              className="inline-flex items-center gap-1 rounded-lg bg-accent-dim px-3 py-2 text-xs text-accent disabled:opacity-50"
            >
              <Plus size={12} />
              Add
            </button>
          </div>
        </section>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="flex-1 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Thesis
          </button>
          <Link
            href="/theses"
            className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-text-2 transition-colors hover:text-text-0"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
