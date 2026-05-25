"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import type { ThesisStatus } from "@/types";
import ThesisCard from "@/components/ThesisCard";
import CreateThesisModal from "@/components/CreateThesisModal";

const filters: { label: string; value: ThesisStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Conviction", value: "conviction" },
  { label: "Reviewing", value: "reviewing" },
  { label: "Abandoned", value: "abandoned" },
];

function DashboardContent() {
  const theses = useStore((s) => s.theses);
  const signals = useStore((s) => s.signals);
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") as ThesisStatus | null;
  const [statusFilter, setStatusFilter] = useState<ThesisStatus | "all">(
    initialStatus && ["active", "conviction", "reviewing", "abandoned"].includes(initialStatus)
      ? initialStatus
      : "all"
  );
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filtered =
    statusFilter === "all"
      ? theses
      : theses.filter((t) => t.status === statusFilter);

  const avgConfidence = Math.round(
    theses.reduce((acc, t) => acc + t.confidence, 0) / theses.length
  );

  const recentSignals = signals
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">
            Track and manage your investment theses
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-green px-5 py-2.5 text-sm font-semibold text-slate-950 transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-brand-green/20"
        >
          <span className="text-lg leading-none">+</span>
          New Thesis
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => {
          const isActive = statusFilter === f.value;
          const colorMap: Record<string, string> = {
            all: isActive
              ? "bg-white text-slate-950 shadow-lg shadow-white/10"
              : "border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white",
            active: isActive
              ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
              : "border border-blue-500/30 text-blue-400 hover:bg-blue-500/10",
            conviction: isActive
              ? "bg-brand-green text-slate-950 shadow-lg shadow-brand-green/30"
              : "border border-brand-green/30 text-brand-green hover:bg-brand-green/10",
            reviewing: isActive
              ? "bg-brand-yellow text-slate-950 shadow-lg shadow-brand-yellow/30"
              : "border border-brand-yellow/30 text-brand-yellow hover:bg-brand-yellow/10",
            abandoned: isActive
              ? "bg-slate-500 text-white shadow-lg shadow-slate-500/30"
              : "border border-slate-600 text-slate-500 hover:border-slate-400 hover:text-slate-400",
          };

          return (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${colorMap[f.value]}`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-900/50 p-5">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-lg">📊</span>
            <p className="text-sm text-slate-400">Total Theses</p>
          </div>
          <p className="text-3xl font-bold text-white">{theses.length}</p>
        </div>
        <div className="rounded-xl border border-brand-green/20 bg-gradient-to-br from-brand-green/5 to-slate-900/50 p-5">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <p className="text-sm text-slate-400">Avg Confidence</p>
          </div>
          <p className="text-3xl font-bold text-brand-green">{avgConfidence}%</p>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-slate-900/50 p-5">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-lg">🔥</span>
            <p className="text-sm text-slate-400">Conviction Theses</p>
          </div>
          <p className="text-3xl font-bold text-emerald-400">
            {theses.filter((t) => t.status === "conviction").length}
          </p>
        </div>
      </div>

      {/* Recent Signals */}
      {recentSignals.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Things Worth Watching
          </h2>
          <div className="space-y-2">
            {recentSignals.map((signal) => {
              const thesis = theses.find((t) => t.id === signal.thesisId);
              return (
                <div
                  key={signal.id}
                  className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-900/30 p-4"
                >
                  <div
                    className={`mt-0.5 h-2 w-2 rounded-full ${
                      signal.direction === "supportive"
                        ? "bg-brand-green"
                        : signal.direction === "contradicting"
                          ? "bg-brand-red"
                          : "bg-slate-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-slate-200">{signal.content}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                      {thesis && <span>{thesis.title}</span>}
                      <span>{signal.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Thesis Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((thesis) => (
          <ThesisCard key={thesis.id} thesis={thesis} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 py-16 text-center">
          <p className="text-4xl">📭</p>
          <p className="mt-3 text-lg text-slate-400">No theses found</p>
          <p className="mt-1 text-sm text-slate-500">
            Try a different filter or create a new thesis.
          </p>
        </div>
      )}

      {/* Create Thesis Modal */}
      {showCreateModal && (
        <CreateThesisModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
