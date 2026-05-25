"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import type { Signal, SignalDirection, SignalSource } from "@/types";

export default function SignalsPage() {
  const theses = useStore((s) => s.theses);
  const signals = useStore((s) => s.signals);
  const addSignal = useStore((s) => s.addSignal);

  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState("");
  const [thesisId, setThesisId] = useState("");
  const [assumptionId, setAssumptionId] = useState("");
  const [direction, setDirection] = useState<SignalDirection>("neutral");
  const [strength, setStrength] = useState<"weak" | "moderate" | "strong">("moderate");
  const [source, setSource] = useState<SignalSource>("user_input");

  const selectedThesis = theses.find((t) => t.id === thesisId);

  const sortedSignals = [...signals].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const handleAddSignal = () => {
    if (!content.trim() || !thesisId || !assumptionId) return;
    addSignal({
      thesisId,
      assumptionId,
      source,
      content: content.trim(),
      direction,
      strength,
    });
    setShowForm(false);
    setContent("");
  };

  const getDirectionColor = (d: SignalDirection) => {
    if (d === "supportive") return "bg-brand-green";
    if (d === "contradicting") return "bg-brand-red";
    return "bg-slate-500";
  };

  const getDirectionLabel = (d: SignalDirection) => {
    if (d === "supportive") return "Supportive";
    if (d === "contradicting") return "Contradicting";
    return "Neutral";
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Signals</h1>
          <p className="mt-1 text-sm text-slate-400">
            Events and observations mapped to your theses
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-green px-5 py-2.5 text-sm font-semibold text-slate-950 transition-all hover:bg-emerald-400"
        >
          {showForm ? "Cancel" : "+ Log Signal"}
        </button>
      </div>

      {/* Add Signal Form */}
      {showForm && (
        <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900/30 p-5">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-slate-400">
                What happened?
              </label>
              <input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="e.g., Microsoft Azure AI revenue grew 48% YoY"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-green"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="mb-1.5 block text-sm text-slate-400">
                  Related Thesis
                </label>
                <select
                  value={thesisId}
                  onChange={(e) => {
                    setThesisId(e.target.value);
                    setAssumptionId("");
                  }}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none focus:border-brand-green"
                >
                  <option value="">Select a thesis...</option>
                  {theses
                    .filter((t) => t.status !== "abandoned")
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="mb-1.5 block text-sm text-slate-400">
                  Assumption
                </label>
                <select
                  value={assumptionId}
                  onChange={(e) => setAssumptionId(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none focus:border-brand-green"
                  disabled={!thesisId}
                >
                  <option value="">Select assumption...</option>
                  {selectedThesis?.assumptions.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.text.slice(0, 60)}...
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="mb-1.5 block text-sm text-slate-400">
                  Direction
                </label>
                <select
                  value={direction}
                  onChange={(e) =>
                    setDirection(e.target.value as SignalDirection)
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-brand-green"
                >
                  <option value="supportive">Supportive</option>
                  <option value="contradicting">Contradicting</option>
                  <option value="neutral">Neutral</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="mb-1.5 block text-sm text-slate-400">
                  Strength
                </label>
                <select
                  value={strength}
                  onChange={(e) =>
                    setStrength(e.target.value as "weak" | "moderate" | "strong")
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-brand-green"
                >
                  <option value="strong">Strong</option>
                  <option value="moderate">Moderate</option>
                  <option value="weak">Weak</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="mb-1.5 block text-sm text-slate-400">
                  Source
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as SignalSource)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-brand-green"
                >
                  <option value="user_input">My Observation</option>
                  <option value="news">News</option>
                  <option value="earnings">Earnings</option>
                  <option value="data_feed">Data Feed</option>
                  <option value="analyst">Analyst</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddSignal}
                disabled={!content.trim() || !thesisId || !assumptionId}
                className="rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
              >
                Log Signal
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Signal List */}
      <div className="space-y-3">
        {sortedSignals.map((signal) => {
          const thesis = theses.find((t) => t.id === signal.thesisId);
          return (
            <div
              key={signal.id}
              className="flex items-start gap-4 rounded-xl border border-slate-800 bg-slate-900/30 p-5 transition-colors hover:border-slate-700"
            >
              <div
                className={`mt-1.5 h-3 w-3 rounded-full ${getDirectionColor(signal.direction)}`}
              />
              <div className="flex-1">
                <p className="text-sm leading-relaxed text-slate-200">
                  {signal.content}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  {thesis && (
                    <span className="text-slate-400">{thesis.title}</span>
                  )}
                  <span
                    className={`${
                      signal.direction === "supportive"
                        ? "text-brand-green"
                        : signal.direction === "contradicting"
                          ? "text-brand-red"
                          : "text-slate-400"
                    }`}
                  >
                    {getDirectionLabel(signal.direction)}
                  </span>
                  <span>{signal.strength}</span>
                  <span>{signal.source.replace("_", " ")}</span>
                  <span>{signal.timestamp}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {sortedSignals.length === 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 py-16 text-center">
          <p className="text-4xl">📡</p>
          <p className="mt-3 text-lg text-slate-400">No signals yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Log observations and events that relate to your theses.
          </p>
        </div>
      )}
    </div>
  );
}
