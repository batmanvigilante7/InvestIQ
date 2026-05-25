"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import type { AssumptionCategory, AssumptionImpact } from "@/types";

interface CreateThesisModalProps {
  onClose: () => void;
}

export default function CreateThesisModal({ onClose }: CreateThesisModalProps) {
  const addThesis = useStore((s) => s.addThesis);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [confidence, setConfidence] = useState(50);
  const [tags, setTags] = useState("");

  // Assumptions state
  const [assumptions, setAssumptions] = useState<
    { text: string; impact: AssumptionImpact; category: AssumptionCategory }[]
  >([]);
  const [newAssumption, setNewAssumption] = useState("");
  const [newImpact, setNewImpact] = useState<AssumptionImpact>("medium");
  const [newCategory, setNewCategory] = useState<AssumptionCategory>("demand");

  const addAssumption = () => {
    if (!newAssumption.trim()) return;
    setAssumptions([
      ...assumptions,
      { text: newAssumption, impact: newImpact, category: newCategory },
    ]);
    setNewAssumption("");
  };

  const removeAssumption = (index: number) => {
    setAssumptions(assumptions.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const now = new Date().toISOString().split("T")[0];
    addThesis({
      title: title.trim(),
      description: description.trim(),
      confidence,
      status: "active",
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      assumptions: assumptions.map((a, i) => ({
        id: `a-${Date.now()}-${i}`,
        text: a.text,
        status: "holding" as const,
        impact: a.impact,
        category: a.category,
      })),
      risks: [],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">New Thesis</h2>
          <button
            onClick={onClose}
            className="text-slate-500 transition-colors hover:text-white"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Thesis Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., AI Infrastructure Demand Acceleration"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-green"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Why does this work?
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your investment thesis..."
              rows={3}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-green"
            />
          </div>

          {/* Confidence */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Starting Conviction:{" "}
              <span className="font-bold text-brand-green">{confidence}%</span>
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={confidence}
              onChange={(e) => setConfidence(Number(e.target.value))}
              className="w-full accent-brand-green"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Tags (comma-separated)
            </label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., semiconductor, AI, infrastructure"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-green"
            />
          </div>

          {/* Assumptions */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              What needs to happen?
            </label>
            <div className="mb-2 space-y-2">
              {assumptions.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-800/50 px-3 py-2"
                >
                  <span className="flex-1 text-sm text-slate-300">
                    {a.text}
                  </span>
                  <span className="text-xs text-slate-500">{a.impact}</span>
                  <button
                    type="button"
                    onClick={() => removeAssumption(i)}
                    className="text-slate-600 hover:text-brand-red"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newAssumption}
                onChange={(e) => setNewAssumption(e.target.value)}
                placeholder="Add an assumption..."
                className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-green"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addAssumption();
                  }
                }}
              />
              <select
                value={newImpact}
                onChange={(e) =>
                  setNewImpact(e.target.value as AssumptionImpact)
                }
                className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-2 text-xs text-slate-300 outline-none"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select
                value={newCategory}
                onChange={(e) =>
                  setNewCategory(e.target.value as AssumptionCategory)
                }
                className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-2 text-xs text-slate-300 outline-none"
              >
                <option value="demand">Demand</option>
                <option value="supply">Supply</option>
                <option value="macro">Macro</option>
                <option value="regulatory">Regulatory</option>
                <option value="competitive">Competitive</option>
                <option value="technical">Technical</option>
                <option value="management">Management</option>
              </select>
              <button
                type="button"
                onClick={addAssumption}
                className="rounded-lg bg-slate-700 px-3 py-2 text-sm text-white hover:bg-slate-600"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm text-slate-400 transition-colors hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-brand-green px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
            >
              Create Thesis
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
