"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import type { ThesisStatus, AssumptionStatus } from "@/types";
import ConfidenceBadge from "@/components/ConfidenceBadge";
import AssumptionList from "@/components/AssumptionList";
import ConvictionChart from "@/components/ConvictionChart";
import AddAssumptionForm from "@/components/AddAssumptionForm";

const statusStyles: Record<ThesisStatus, string> = {
  active: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  conviction: "bg-brand-green/10 text-brand-green border-brand-green/20",
  reviewing: "bg-brand-yellow/10 text-brand-yellow border-brand-yellow/20",
  abandoned: "bg-slate-500/10 text-slate-500 border-slate-500/20",
};

export default function ThesisDetailPage() {
  const params = useParams();
  const router = useRouter();
  const theses = useStore((s) => s.theses);
  const convictions = useStore((s) => s.convictions);
  const signals = useStore((s) => s.signals);
  const updateThesis = useStore((s) => s.updateThesis);
  const deleteThesis = useStore((s) => s.deleteThesis);
  const updateAssumption = useStore((s) => s.updateAssumption);
  const deleteAssumption = useStore((s) => s.deleteAssumption);
  const addConviction = useStore((s) => s.addConviction);

  const thesis = theses.find((t) => t.id === params.id);
  const thesisConvictions = convictions.filter((c) => c.thesisId === params.id);
  const thesisSignals = signals.filter((s) => s.thesisId === params.id);

  const [showAddAssumption, setShowAddAssumption] = useState(false);
  const [showConvictionUpdate, setShowConvictionUpdate] = useState(false);
  const [newConviction, setNewConviction] = useState(thesis?.confidence ?? 50);
  const [convictionReasoning, setConvictionReasoning] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  if (!thesis) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-lg text-slate-400">Thesis not found</p>
        <Link
          href="/dashboard"
          className="mt-4 text-sm text-brand-green hover:underline"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const validated = thesis.assumptions.filter((a) => a.status === "validated").length;
  const holding = thesis.assumptions.filter((a) => a.status === "holding").length;
  const weakening = thesis.assumptions.filter((a) => a.status === "weakening").length;
  const invalidated = thesis.assumptions.filter((a) => a.status === "invalidated").length;

  const handleStatusChange = (assumptionId: string, newStatus: AssumptionStatus) => {
    updateAssumption(thesis.id, assumptionId, { status: newStatus });
  };

  const handleDeleteAssumption = (assumptionId: string) => {
    deleteAssumption(thesis.id, assumptionId);
  };

  const handleDelete = () => {
    deleteThesis(thesis.id);
    router.push("/dashboard");
  };

  const handleStatusToggle = () => {
    const statusCycle: ThesisStatus[] = ["active", "reviewing", "conviction", "abandoned"];
    const currentIdx = statusCycle.indexOf(thesis.status);
    const nextStatus = statusCycle[(currentIdx + 1) % statusCycle.length];
    updateThesis(thesis.id, { status: nextStatus });
  };

  const handleConvictionUpdate = () => {
    addConviction({
      thesisId: thesis.id,
      value: newConviction,
      reasoning: convictionReasoning || "Manual confidence update",
    });
    setShowConvictionUpdate(false);
    setConvictionReasoning("");
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

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/dashboard" className="mb-6 inline-flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-white">
        ← Back to Dashboard
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <button onClick={handleStatusToggle} className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-opacity hover:opacity-80 ${statusStyles[thesis.status]}`} title="Click to cycle status">
            {thesis.status.charAt(0).toUpperCase() + thesis.status.slice(1)}
          </button>
          <ConfidenceBadge value={thesis.confidence} />
          <div className="flex gap-2">
            <button onClick={handleStartEdit} className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-400 transition-colors hover:border-slate-500 hover:text-white">Edit</button>
            <button onClick={handleDelete} className="rounded-lg border border-brand-red/30 px-3 py-1 text-xs text-brand-red transition-colors hover:bg-brand-red/10">Delete</button>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-lg font-bold text-white outline-none focus:border-brand-green" />
            <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={3} className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-300 outline-none focus:border-brand-green" />
            <div className="flex gap-2">
              <button onClick={handleSaveEdit} className="rounded-lg bg-brand-green px-4 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400">Save</button>
              <button onClick={() => setIsEditing(false)} className="rounded-lg border border-slate-700 px-4 py-1.5 text-xs text-slate-400 hover:text-white">Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-white">{thesis.title}</h1>
            <p className="mt-3 text-base leading-relaxed text-slate-400">{thesis.description}</p>
          </>
        )}

        <div className="mt-4 flex gap-4 text-xs text-slate-500">
          <span>Created {thesis.createdAt}</span>
          <span>Updated {thesis.updatedAt}</span>
          {thesis.tags.length > 0 && (
            <div className="flex gap-1">
              {thesis.tags.map((tag) => (
                <span key={tag} className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-500">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 text-center">
          <p className="text-2xl font-bold text-white">{thesis.assumptions.length}</p>
          <p className="text-xs text-slate-400">Total Assumptions</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 text-center">
          <p className="text-2xl font-bold text-brand-green">{validated}</p>
          <p className="text-xs text-slate-400">Validated</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 text-center">
          <p className="text-2xl font-bold text-brand-yellow">{holding + weakening}</p>
          <p className="text-xs text-slate-400">Pending</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 text-center">
          <p className="text-2xl font-bold text-brand-red">{invalidated}</p>
          <p className="text-xs text-slate-400">Invalidated</p>
        </div>
      </div>

      {/* Assumptions */}
      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Assumptions</h2>
          <button onClick={() => setShowAddAssumption(!showAddAssumption)} className="rounded-lg border border-brand-green/30 px-3 py-1.5 text-xs font-medium text-brand-green transition-colors hover:bg-brand-green/10">
            {showAddAssumption ? "Cancel" : "+ Add Assumption"}
          </button>
        </div>
        {showAddAssumption && (
          <div className="mb-4">
            <AddAssumptionForm thesisId={thesis.id} onComplete={() => setShowAddAssumption(false)} />
          </div>
        )}
        <AssumptionList assumptions={thesis.assumptions} onStatusChange={handleStatusChange} onDelete={handleDeleteAssumption} />
      </section>

      {/* Conviction History */}
      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Conviction History</h2>
          <button
            onClick={() => { setNewConviction(thesis.confidence); setShowConvictionUpdate(!showConvictionUpdate); }}
            className="rounded-lg border border-brand-green/30 px-3 py-1.5 text-xs font-medium text-brand-green transition-colors hover:bg-brand-green/10"
          >
            {showConvictionUpdate ? "Cancel" : "Update Confidence"}
          </button>
        </div>
        {showConvictionUpdate && (
          <div className="mb-4 rounded-xl border border-slate-800 bg-slate-900/30 p-5">
            <div className="mb-4">
              <label className="mb-2 block text-sm text-slate-400">
                Confidence: <span className="font-semibold text-white">{newConviction}%</span>
              </label>
              <input type="range" min={0} max={100} value={newConviction} onChange={(e) => setNewConviction(Number(e.target.value))} className="w-full accent-brand-green" />
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-sm text-slate-400">Why did it change?</label>
              <textarea value={convictionReasoning} onChange={(e) => setConvictionReasoning(e.target.value)} placeholder="e.g., Q1 earnings confirmed margin expansion thesis..." rows={2} className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-green" />
            </div>
            <button onClick={handleConvictionUpdate} className="rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400">Save Update</button>
          </div>
        )}
        <ConvictionChart convictions={thesisConvictions} currentConfidence={thesis.confidence} />
      </section>

      {/* Signals */}
      {thesisSignals.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-white">Related Signals</h2>
          <div className="space-y-2">
            {thesisSignals.map((signal) => (
              <div key={signal.id} className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-900/30 p-4">
                <div className={`mt-1 h-2 w-2 rounded-full ${signal.direction === "supportive" ? "bg-brand-green" : signal.direction === "contradicting" ? "bg-brand-red" : "bg-slate-500"}`} />
                <div className="flex-1">
                  <p className="text-sm text-slate-200">{signal.content}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
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

      {/* AI Insights placeholder */}
      <section className="mb-8 rounded-xl border border-slate-800 bg-slate-900/30 p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">AI Insights</h2>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-3 text-3xl">🤖</div>
          <p className="text-sm text-slate-400">AI-powered analysis coming soon.</p>
          <p className="mt-1 text-xs text-slate-500">Connect your data sources to unlock intelligent thesis evaluation.</p>
        </div>
      </section>
    </div>
  );
}
