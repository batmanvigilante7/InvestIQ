"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import type { MarketEvent, EventCategory, EventSentiment } from "@/types";

export default function EventsPage() {
  const theses = useStore((s) => s.theses);
  const events = useStore((s) => s.events);
  const addEvent = useStore((s) => s.addEvent);
  const linkEventToThesis = useStore((s) => s.linkEventToThesis);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState<EventCategory>("news");
  const [sentiment, setSentiment] = useState<EventSentiment>("neutral");
  const [entities, setEntities] = useState("");
  const [impactScore, setImpactScore] = useState(0);
  const [reasoning, setReasoning] = useState("");
  const [selectedThesisIds, setSelectedThesisIds] = useState<string[]>([]);

  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleAddEvent = () => {
    if (!title.trim() || !summary.trim()) return;

    addEvent({
      title: title.trim(),
      summary: summary.trim(),
      source: source.trim() || "Manual entry",
      category,
      sentiment,
      entities: entities
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean),
      relatedThesisIds: selectedThesisIds,
      relatedAssumptionIds: [],
      impactScore,
      reasoning: reasoning.trim(),
    });

    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setSummary("");
    setSource("");
    setCategory("news");
    setSentiment("neutral");
    setEntities("");
    setImpactScore(0);
    setReasoning("");
    setSelectedThesisIds([]);
  };

  const toggleThesis = (id: string) => {
    setSelectedThesisIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const getSentimentColor = (s: EventSentiment) => {
    if (s === "positive") return "text-brand-green bg-brand-green/10 border-brand-green/20";
    if (s === "negative") return "text-brand-red bg-brand-red/10 border-brand-red/20";
    if (s === "mixed") return "text-brand-yellow bg-brand-yellow/10 border-brand-yellow/20";
    return "text-slate-400 bg-slate-800 border-slate-700";
  };

  const getCategoryIcon = (c: EventCategory) => {
    const icons: Record<EventCategory, string> = {
      earnings: "📈",
      news: "📰",
      macro: "🌐",
      regulatory: "⚖️",
      geopolitical: "🌍",
      sector: "🏭",
      company: "🏢",
    };
    return icons[c] || "📌";
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Events</h1>
          <p className="mt-1 text-sm text-slate-400">
            Market events mapped to your theses — the thesis comes alive
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-green px-5 py-2.5 text-sm font-semibold text-slate-950 transition-all hover:bg-emerald-400"
        >
          {showForm ? "Cancel" : "+ Log Event"}
        </button>
      </div>

      {/* Add Event Form */}
      {showForm && (
        <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Log Market Event</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-slate-400">What happened?</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Microsoft Azure AI revenue grows 48% YoY"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-green"
                autoFocus
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-slate-400">Summary</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Describe what happened and why it matters..."
                rows={3}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-green"
              />
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="mb-1.5 block text-sm text-slate-400">Source</label>
                <input
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g., Microsoft Q1 Earnings"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-green"
                />
              </div>
              <div className="flex-1">
                <label className="mb-1.5 block text-sm text-slate-400">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EventCategory)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-brand-green"
                >
                  <option value="earnings">Earnings</option>
                  <option value="news">News</option>
                  <option value="macro">Macro</option>
                  <option value="regulatory">Regulatory</option>
                  <option value="geopolitical">Geopolitical</option>
                  <option value="sector">Sector</option>
                  <option value="company">Company</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="mb-1.5 block text-sm text-slate-400">Sentiment</label>
                <select
                  value={sentiment}
                  onChange={(e) => setSentiment(e.target.value as EventSentiment)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-brand-green"
                >
                  <option value="positive">Positive</option>
                  <option value="negative">Negative</option>
                  <option value="neutral">Neutral</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="mb-1.5 block text-sm text-slate-400">
                  Impact Score: <span className="font-semibold text-white">{impactScore}</span>
                </label>
                <input
                  type="range"
                  min={-100}
                  max={100}
                  value={impactScore}
                  onChange={(e) => setImpactScore(Number(e.target.value))}
                  className="w-full accent-brand-green"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>-100</span>
                  <span>0</span>
                  <span>+100</span>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-slate-400">Entities (comma-separated)</label>
              <input
                value={entities}
                onChange={(e) => setEntities(e.target.value)}
                placeholder="e.g., Microsoft, Azure, AI"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-green"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-slate-400">Why does this matter?</label>
              <textarea
                value={reasoning}
                onChange={(e) => setReasoning(e.target.value)}
                placeholder="Explain the impact on your theses..."
                rows={2}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-green"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-slate-400">Related Theses</label>
              <div className="flex flex-wrap gap-2">
                {theses.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => toggleThesis(t.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      selectedThesisIds.includes(t.id)
                        ? "bg-brand-green/20 text-brand-green border border-brand-green/30"
                        : "bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-500"
                    }`}
                  >
                    {t.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAddEvent}
                disabled={!title.trim() || !summary.trim()}
                className="rounded-lg bg-brand-green px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
              >
                Log Event
              </button>
              <button
                onClick={() => { setShowForm(false); resetForm(); }}
                className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Feed */}
      <div className="space-y-4">
        {sortedEvents.map((event) => {
          const relatedTheses = theses.filter((t) => event.relatedThesisIds.includes(t.id));
          return (
            <div
              key={event.id}
              className="rounded-xl border border-slate-800 bg-slate-900/30 p-5 transition-colors hover:border-slate-700"
            >
              {/* Header */}
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-lg">{getCategoryIcon(event.category)}</span>
                  <div>
                    <h3 className="text-base font-semibold text-white">{event.title}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>{event.source}</span>
                      <span>·</span>
                      <span>{event.createdAt}</span>
                      <span>·</span>
                      <span className="capitalize">{event.category}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${getSentimentColor(event.sentiment)}`}>
                    {event.sentiment}
                  </span>
                  <span className={`text-xs font-mono ${event.impactScore > 0 ? "text-brand-green" : event.impactScore < 0 ? "text-brand-red" : "text-slate-400"}`}>
                    {event.impactScore > 0 ? "+" : ""}{event.impactScore}
                  </span>
                </div>
              </div>

              {/* Summary */}
              <p className="mb-3 text-sm leading-relaxed text-slate-300">{event.summary}</p>

              {/* Reasoning */}
              {event.reasoning && (
                <div className="mb-3 rounded-lg border border-slate-800 bg-slate-800/30 px-3 py-2">
                  <p className="text-xs font-medium text-slate-500">Why this matters:</p>
                  <p className="mt-1 text-sm text-slate-300">{event.reasoning}</p>
                </div>
              )}

              {/* Entities & Related Theses */}
              <div className="flex flex-wrap items-center gap-2">
                {event.entities.map((entity) => (
                  <span
                    key={entity}
                    className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-400"
                  >
                    {entity}
                  </span>
                ))}
                {relatedTheses.length > 0 && (
                  <>
                    <span className="text-xs text-slate-600">→</span>
                    {relatedTheses.map((t) => (
                      <span
                        key={t.id}
                        className="rounded bg-brand-green/10 px-2 py-0.5 text-xs text-brand-green"
                      >
                        {t.title}
                      </span>
                    ))}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {sortedEvents.length === 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 py-16 text-center">
          <p className="text-4xl">⚡</p>
          <p className="mt-3 text-lg text-slate-400">No events yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Log market events that relate to your theses. This is where your theses come alive.
          </p>
        </div>
      )}
    </div>
  );
}
