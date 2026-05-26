"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import type { ThesisStatus, AssumptionStatus } from "@/types";
import { formatPercent } from "@/lib/utils";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

const statusStyles: Record<ThesisStatus, string> = {
  active: "bg-info-dim text-info border-info/20",
  conviction: "bg-accent-dim text-accent border-accent/20",
  reviewing: "bg-warning-dim text-warning border-warning/20",
  paused: "bg-bg-4 text-text-2 border-border",
  abandoned: "bg-bg-3 text-text-2 border-border",
};

export default function ThesisDetailPage() {
  const params = useParams();
  const router = useRouter();
  const theses = useStore((s) => s.theses);
  const convictions = useStore((s) => s.convictions);
  const signals = useStore((s) => s.signals);
  const events = useStore((s) => s.events);
  const updateThesis = useStore((s) => s.updateThesis);
  const deleteThesis = useStore((s) => s.deleteThesis);
  const updateAssumption = useStore((s) => s.updateAssumption);
  const deleteAssumption = useStore((s) => s.deleteAssumption);
  const addAssumption = useStore((s) => s.addAssumption);
  const addConviction = useStore((s) => s.addConviction);

  const thesis = theses.find((t) => t.id === params.id);
  const thesisConvictions = convictions.filter((c) => c.thesisId === params.id);
  const thesisSignals = signals.filter((s) => s.thesisId === params.id);
  const thesisEvents = events
    .filter((e) => e.relatedThesisIds.includes(params.id as string))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const [showAddAssumption, setShowAddAssumption] = useState(false);
  const [newAssumptionText, setNewAssumptionText] = useState("");
  const [newAssumptionImpact, setNewAssumptionImpact] = useState<"high" | "medium" | "low">("high");
  const [newAssumptionCategory, setNewAssumptionCategory] = useState<"demand" | "supply" | "macro" | "regulatory" | "competitive" | "technical" | "management">("demand");

  const [showConvictionUpdate, setShowConvictionUpdate] = useState(false);
  const [newConviction, setNewConviction] = useState(thesis?.confidence ?? 50);
  const [convictionReasoning, setConvictionReasoning] = useState("");
  const [convictionEmotion, setConvictionEmotion] = useState<string>("");

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  if (!thesis) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-lg text-text-1">Thesis not found</p>
        <Link
          href="/theses"
          className="mt-4 text-sm text-accent hover:underline"
        >
          Back to Theses
        </Link>
      </div>
    );
  }

  const validated = thesis.assumptions.filter((a) => a.status === "validated").length;
  const holding = thesis.assumptions.filter((a) => a.status === "holding").length;
  const weakening = thesis.assumptions.filter((a) => a.status === "weakening").length;
  const invalidated = thesis.assumptions.filter((a) => a.status === "invalidated").length;

  const handleDelete = () => {
    deleteThesis(thesis.id);
    router.push("/theses");
  };

  const handleStatusToggle = () => {
    const statusCycle: ThesisStatus[] = ["active", "reviewing", "conviction", "paused", "abandoned"];
    const currentIdx = statusCycle.indexOf(thesis.status);
    const nextStatus = statusCycle[(currentIdx + 1) % statusCycle.length];
    updateThesis(thesis.id, { status: nextStatus });
  };

  const handleConvictionUpdate = () => {
    addConviction({
      thesisId: thesis.id,
      value: newConviction,
      reasoning: convictionReasoning || "Manual confidence update",
      emotionalState: convictionEmotion ? (convictionEmotion as any) : undefined,
    });
    setShowConvictionUpdate(false);
    setConvictionReasoning("");
    setConvictionEmotion("");
  };

  const handleAddAssumption = () => {
    if (!newAssumptionText.trim()) return;
    const assumption = {
      id: `a-${Date.now()}`,
      text: newAssumptionText,
      status: "holding" as AssumptionStatus,
      impact: newAssumptionImpact,
      category: newAssumptionCategory,
    };
    addAssumption(thesis.id, assumption);
    setNewAssumptionText("");
    setShowAddAssumption(false);
  };

  const handleStartEdit = () => {
    setEditTitle(thesis.title);
    setEditDescription(thesis.description);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    updateThesis(thesis.id, { title: editTitle, description: editDescription });
    setIsEditing(false);
  };

  const impactIcon = (status: AssumptionStatus) => {
    switch (status) {
      case "validated":
        return <CheckCircle size={14} className="text-success" />;
      case "holding":
        return <Clock size={14} className="text-warning" />;
      case "weakening":
        return <AlertTriangle size={14} className="text-warning" />;
      case "invalidated":
        return <XCircle size={14} className="text-destructive" />;
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back */}
      <Link
        href="/theses"
        className="mb-6 inline-flex items-center gap-2 text-sm text-text-2 transition-colors hover:text-text-0"
      >
        <ArrowLeft size={14} />
        Back to Theses
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <button
            onClick={handleStatusToggle}
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-opacity hover:opacity-80 ${statusStyles[thesis.status]}`}
            title="Click to cycle status"
          >
            {thesis.status.charAt(0).toUpperCase() + thesis.status.slice(1)}
          </button>
          {thesis.ticker && (
            <span className="rounded bg-bg-4 px-2 py-0.5 text-xs font-mono text-text-1">
              {thesis.ticker}
            </span>
          )}
          {thesis.sector && (
            <span className="text-xs text-text-2">{thesis.sector}</span>
          )}
          <div className="ml-auto flex gap-2">
            <button
              onClick={handleStartEdit}
              className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1 text-xs text-text-2 transition-colors hover:border-border-hover hover:text-text-0"
            >
              <Edit3 size={12} />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-1 rounded-lg border border-destructive/30 px-3 py-1 text-xs text-destructive transition-colors hover:bg-destructive-dim"
            >
              <Trash2 size={12} />
              Delete
            </button>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg-3 px-4 py-2 text-lg font-bold text-text-0 outline-none focus:border-accent"
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-border bg-bg-3 px-4 py-2 text-sm text-text-1 outline-none focus:border-accent"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                className="rounded-lg bg-accent px-4 py-1.5 text-xs font-semibold text-white hover:bg-accent/90"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="rounded-lg border border-border px-4 py-1.5 text-xs text-text-2 hover:text-text-0"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-text-0 sm:text-3xl">
              {thesis.title}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-text-1">
              {thesis.description}
            </p>
          </>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-text-2">
          <span>Created {thesis.createdAt}</span>
          <span>Updated {thesis.updatedAt}</span>
          {thesis.allocation !== undefined && thesis.allocation > 0 && (
            <span>Allocation: {thesis.allocation}%</span>
          )}
          {thesis.pnl !== undefined && (
            <span className={thesis.pnl >= 0 ? "text-success" : "text-destructive"}>
              P&L: {formatPercent(thesis.pnl)}
            </span>
          )}
        </div>

        {thesis.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {thesis.tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-accent-dim px-2 py-0.5 text-[10px] text-accent"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        <StatCard label="Confidence" value={`${thesis.confidence}%`} accent />
        <StatCard label="Validated" value={String(validated)} positive />
        <StatCard label="Pending" value={String(holding + weakening)} warning />
        <StatCard label="Invalidated" value={String(invalidated)} negative />
      </div>

      {/* Assumptions */}
      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-0">Assumptions</h2>
          <button
            onClick={() => setShowAddAssumption(!showAddAssumption)}
            className="inline-flex items-center gap-1 rounded-lg border border-accent/30 px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent-dim"
          >
            <Plus size={12} />
            {showAddAssumption ? "Cancel" : "Add Assumption"}
          </button>
        </div>

        {showAddAssumption && (
          <div className="mb-4 rounded-xl border border-border bg-bg-2 p-4">
            <textarea
              value={newAssumptionText}
              onChange={(e) => setNewAssumptionText(e.target.value)}
              placeholder="What needs to be true for this thesis to succeed?"
              rows={2}
              className="mb-3 w-full rounded-lg border border-border bg-bg-3 px-3 py-2 text-sm text-text-0 outline-none focus:border-accent"
            />
            <div className="flex flex-wrap gap-3">
              <div>
                <label className="mb-1 block text-[10px] uppercase text-text-2">Impact</label>
                <div className="flex gap-1">
                  {(["high", "medium", "low"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setNewAssumptionImpact(v)}
                      className={`rounded px-2 py-1 text-[10px] ${
                        newAssumptionImpact === v
                          ? "bg-accent-dim text-accent"
                          : "bg-bg-4 text-text-2"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase text-text-2">Category</label>
                <div className="flex flex-wrap gap-1">
                  {(["demand", "supply", "macro", "regulatory", "competitive", "technical", "management"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setNewAssumptionCategory(v)}
                      className={`rounded px-2 py-1 text-[10px] ${
                        newAssumptionCategory === v
                          ? "bg-accent-dim text-accent"
                          : "bg-bg-4 text-text-2"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleAddAssumption}
                disabled={!newAssumptionText.trim()}
                className="rounded-lg bg-accent px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddAssumption(false)}
                className="rounded-lg border border-border px-4 py-1.5 text-xs text-text-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {thesis.assumptions.map((assumption) => (
            <div
              key={assumption.id}
              className="flex items-start gap-3 rounded-lg border border-border bg-bg-2 p-3 transition-colors hover:border-border-hover"
            >
              <div className="mt-0.5">{impactIcon(assumption.status)}</div>
              <div className="flex-1">
                <p className="text-sm text-text-0">{assumption.text}</p>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-text-2">
                  <span className="rounded bg-bg-4 px-1.5 py-0.5">
                    {assumption.impact}
                  </span>
                  <span className="rounded bg-bg-4 px-1.5 py-0.5">
                    {assumption.category}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 ${
                      assumption.status === "validated"
                        ? "bg-success-dim text-success"
                        : assumption.status === "invalidated"
                          ? "bg-destructive-dim text-destructive"
                          : assumption.status === "weakening"
                            ? "bg-warning-dim text-warning"
                            : "bg-bg-4 text-text-2"
                    }`}
                  >
                    {assumption.status}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <select
                  value={assumption.status}
                  onChange={(e) =>
                    updateAssumption(thesis.id, assumption.id, {
                      status: e.target.value as AssumptionStatus,
                    })
                  }
                  className="rounded border border-border bg-bg-3 px-1.5 py-0.5 text-[10px] text-text-1 outline-none"
                >
                  <option value="holding">Holding</option>
                  <option value="validated">Validated</option>
                  <option value="weakening">Weakening</option>
                  <option value="invalidated">Invalidated</option>
                </select>
                <button
                  onClick={() => deleteAssumption(thesis.id, assumption.id)}
                  className="rounded p-1 text-text-2 hover:text-destructive"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Conviction History */}
      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-0">
            Conviction History
          </h2>
          <button
            onClick={() => {
              setNewConviction(thesis.confidence);
              setShowConvictionUpdate(!showConvictionUpdate);
            }}
            className="inline-flex items-center gap-1 rounded-lg border border-accent/30 px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent-dim"
          >
            {showConvictionUpdate ? "Cancel" : "Update Confidence"}
          </button>
        </div>

        {showConvictionUpdate && (
          <div className="mb-4 rounded-xl border border-border bg-bg-2 p-5">
            <div className="mb-4">
              <label className="mb-2 block text-sm text-text-1">
                Confidence:{" "}
                <span className="font-semibold text-text-0">
                  {newConviction}%
                </span>
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={newConviction}
                onChange={(e) => setNewConviction(Number(e.target.value))}
                className="w-full accent-accent"
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-sm text-text-1">
                Why did it change?
              </label>
              <textarea
                value={convictionReasoning}
                onChange={(e) => setConvictionReasoning(e.target.value)}
                placeholder="e.g., Q1 earnings confirmed margin expansion thesis..."
                rows={2}
                className="w-full rounded-lg border border-border bg-bg-3 px-4 py-2 text-sm text-text-0 placeholder:text-text-2 outline-none focus:border-accent"
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-sm text-text-1">
                How are you feeling?
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "calm",
                  "confident",
                  "anxious",
                  "euphoric",
                  "fearful",
                  "neutral",
                ].map((emotion) => (
                  <button
                    key={emotion}
                    onClick={() =>
                      setConvictionEmotion(
                        convictionEmotion === emotion ? "" : emotion
                      )
                    }
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      convictionEmotion === emotion
                        ? "bg-accent-dim text-accent border border-accent/30"
                        : "bg-bg-3 text-text-2 border border-border hover:border-border-hover"
                    }`}
                  >
                    {emotion}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleConvictionUpdate}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90"
            >
              Save Update
            </button>
          </div>
        )}

        {/* Conviction chart - simple bar visualization */}
        <div className="rounded-xl border border-border bg-bg-2 p-4">
          {thesisConvictions.length > 0 ? (
            <div className="space-y-2">
              {thesisConvictions.map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <span className="w-20 text-[10px] text-text-2">
                    {c.recordedAt}
                  </span>
                  <div className="flex-1">
                    <div className="h-4 w-full overflow-hidden rounded bg-bg-4">
                      <div
                        className={`h-full rounded ${
                          c.value >= 70
                            ? "bg-success"
                            : c.value >= 40
                              ? "bg-warning"
                              : "bg-destructive"
                        }`}
                        style={{ width: `${c.value}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-10 text-right text-xs font-medium text-text-0">
                    {c.value}%
                  </span>
                  {c.delta !== undefined && (
                    <span
                      className={`w-12 text-right text-[10px] ${
                        c.delta > 0
                          ? "text-success"
                          : c.delta < 0
                            ? "text-destructive"
                            : "text-text-2"
                      }`}
                    >
                      {c.delta > 0 ? "+" : ""}
                      {c.delta}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-2 text-center py-4">
              No conviction history yet. Update confidence to start tracking.
            </p>
          )}
        </div>
      </section>

      {/* Signals */}
      {thesisSignals.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-text-0">
            Related Signals
          </h2>
          <div className="space-y-2">
            {thesisSignals.map((signal) => (
              <div
                key={signal.id}
                className="flex items-start gap-3 rounded-lg border border-border bg-bg-2 p-4"
              >
                <div
                  className={`mt-1 h-2 w-2 rounded-full ${
                    signal.direction === "supportive"
                      ? "bg-success"
                      : signal.direction === "contradicting"
                        ? "bg-destructive"
                        : "bg-text-2"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm text-text-0">{signal.content}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-text-2">
                    <span>{signal.source}</span>
                    <span>{signal.strength} strength</span>
                    <span>{signal.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Events Feed */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-text-0">
          Living Updates
        </h2>
        {thesisEvents.length > 0 ? (
          <div className="space-y-3">
            {thesisEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-xl border border-border bg-bg-2 p-4 transition-colors hover:border-border-hover"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <span
                      className={`mt-0.5 inline-flex h-2 w-2 rounded-full ${
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
                          : "text-text-1"
                    }`}
                  >
                    {event.impactScore > 0 ? "+" : ""}
                    {event.impactScore}
                  </span>
                </div>
                <p className="text-sm text-text-1">{event.reasoning}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-bg-2 p-6 text-center">
            <p className="text-sm text-text-1">No events yet for this thesis.</p>
            <p className="mt-1 text-xs text-text-2">
              Log market events to make this thesis come alive.
            </p>
          </div>
        )}
      </section>

      {/* Thesis Health */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-text-0">
          Thesis Health
        </h2>
        <div className="rounded-xl border border-border bg-bg-2 p-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="text-center">
              <p className="mb-1 text-xs text-text-2">Event Impact</p>
              <p
                className={`text-xl font-bold ${
                  thesisEvents.length === 0
                    ? "text-text-2"
                    : thesisEvents.reduce((sum, e) => sum + e.impactScore, 0) >
                        0
                      ? "text-success"
                      : thesisEvents.reduce(
                            (sum, e) => sum + e.impactScore,
                            0
                          ) < 0
                        ? "text-destructive"
                        : "text-warning"
                }`}
              >
                {thesisEvents.length === 0
                  ? "—"
                  : thesisEvents.reduce((sum, e) => sum + e.impactScore, 0) > 0
                    ? "Strengthening"
                    : thesisEvents.reduce(
                          (sum, e) => sum + e.impactScore,
                          0
                        ) < 0
                      ? "Weakening"
                      : "Stable"}
              </p>
              <p className="mt-1 text-xs text-text-2">
                {thesisEvents.length} events tracked
              </p>
            </div>
            <div className="text-center">
              <p className="mb-1 text-xs text-text-2">Assumption Health</p>
              <p
                className={`text-xl font-bold ${
                  invalidated > validated
                    ? "text-destructive"
                    : weakening > holding
                      ? "text-warning"
                      : "text-success"
                }`}
              >
                {invalidated > validated
                  ? "Fragile"
                  : weakening > holding
                    ? "Caution"
                    : "Healthy"}
              </p>
              <p className="mt-1 text-xs text-text-2">
                {validated} validated, {invalidated} invalidated
              </p>
            </div>
            <div className="text-center">
              <p className="mb-1 text-xs text-text-2">Conviction Trend</p>
              <p
                className={`text-xl font-bold ${
                  thesisConvictions.length < 2
                    ? "text-text-2"
                    : thesisConvictions[thesisConvictions.length - 1].value >
                        thesisConvictions[0].value
                      ? "text-success"
                      : thesisConvictions[thesisConvictions.length - 1].value <
                          thesisConvictions[0].value
                        ? "text-destructive"
                        : "text-warning"
                }`}
              >
                {thesisConvictions.length < 2
                  ? "—"
                  : thesisConvictions[thesisConvictions.length - 1].value >
                      thesisConvictions[0].value
                    ? "Rising"
                    : thesisConvictions[thesisConvictions.length - 1].value <
                        thesisConvictions[0].value
                      ? "Falling"
                      : "Stable"}
              </p>
              <p className="mt-1 text-xs text-text-2">
                {thesis.confidence}% current
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Risks */}
      {thesis.risks.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-text-0">
            Risk Factors
          </h2>
          <div className="space-y-2">
            {thesis.risks.map((risk) => (
              <div
                key={risk.id}
                className="flex items-start gap-3 rounded-lg border border-border bg-bg-2 p-3"
              >
                <AlertTriangle
                  size={14}
                  className={
                    risk.severity === "critical" || risk.severity === "high"
                      ? "text-destructive mt-0.5"
                      : "text-warning mt-0.5"
                  }
                />
                <div className="flex-1">
                  <p className="text-sm text-text-0">{risk.text}</p>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-text-2">
                    <span
                      className={`rounded px-1.5 py-0.5 ${
                        risk.severity === "critical"
                          ? "bg-destructive-dim text-destructive"
                          : risk.severity === "high"
                            ? "bg-destructive-dim text-destructive"
                            : risk.severity === "medium"
                              ? "bg-warning-dim text-warning"
                              : "bg-bg-4 text-text-2"
                      }`}
                    >
                      {risk.severity}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 ${
                        risk.status === "materialized"
                          ? "bg-destructive-dim text-destructive"
                          : risk.status === "mitigated"
                            ? "bg-success-dim text-success"
                            : "bg-bg-4 text-text-2"
                      }`}
                    >
                      {risk.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
  positive,
  warning,
  negative,
}: {
  label: string;
  value: string;
  accent?: boolean;
  positive?: boolean;
  warning?: boolean;
  negative?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-bg-2 p-4 text-center">
      <p
        className={`text-2xl font-bold ${
          accent
            ? "text-accent"
            : positive
              ? "text-success"
              : warning
                ? "text-warning"
                : negative
                  ? "text-destructive"
                  : "text-text-0"
        }`}
      >
        {value}
      </p>
      <p className="text-xs text-text-2">{label}</p>
    </div>
  );
}
