"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import type { AssumptionCategory, AssumptionImpact, Risk } from "@/types";
import { useToast } from "@/components/ui/Toast";
import { X, Plus, Trash2 } from "lucide-react";

interface CreateThesisModalProps {
  onClose: () => void;
}

export default function CreateThesisModal({ onClose }: CreateThesisModalProps) {
  const addThesis = useStore((s) => s.addThesis);
  const { showToast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [confidence, setConfidence] = useState(50);
  const [tags, setTags] = useState("");

  // Assumptions
  const [assumptions, setAssumptions] = useState<
    { text: string; impact: AssumptionImpact; category: AssumptionCategory }[]
  >([]);
  const [newAssumption, setNewAssumption] = useState("");
  const [newImpact, setNewImpact] = useState<AssumptionImpact>("medium");
  const [newCategory, setNewCategory] = useState<AssumptionCategory>("demand");

  // Risks
  const [risks, setRisks] = useState<{ text: string; severity: Risk["severity"] }[]>([]);
  const [newRisk, setNewRisk] = useState("");
  const [newSeverity, setNewSeverity] = useState<Risk["severity"]>("medium");

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

  const addRisk = () => {
    if (!newRisk.trim()) return;
    setRisks([...risks, { text: newRisk, severity: newSeverity }]);
    setNewRisk("");
  };

  const removeRisk = (index: number) => {
    setRisks(risks.filter((_, i) => i !== index));
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
      risks: risks.map((r, i) => ({
        id: `r-${Date.now()}-${i}`,
        text: r.text,
        severity: r.severity,
        status: "active" as const,
        createdAt: now,
      })),
    });

    showToast("Thesis created successfully!", "success");
    onClose();
  };

  const isValid = title.trim().length > 0;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-bg-2 p-6 shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-text-0">New Thesis</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-text-2 transition-colors hover:text-text-0 hover:bg-bg-3"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-1">
              Thesis Title <span className="text-destructive">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., AI Infrastructure Demand Acceleration"
              className="w-full rounded-lg border border-border bg-bg-1 px-4 py-2.5 text-sm text-text-0 placeholder-text-2 outline-none focus:border-accent transition-colors"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-1">
              Why does this work?
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your investment thesis..."
              rows={3}
              className="w-full rounded-lg border border-border bg-bg-1 px-4 py-2.5 text-sm text-text-0 placeholder-text-2 outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Confidence */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-1">
              Starting Conviction:{" "}
              <span className="font-bold text-accent">{confidence}%</span>
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={confidence}
              onChange={(e) => setConfidence(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-text-2">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-1">
              Tags (comma-separated)
            </label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., semiconductor, AI, infrastructure"
              className="w-full rounded-lg border border-border bg-bg-1 px-4 py-2.5 text-sm text-text-0 placeholder-text-2 outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Assumptions */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-1">
              Assumptions
            </label>
            {assumptions.length > 0 && (
              <div className="mb-2 space-y-2">
                {assumptions.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-lg border border-border bg-bg-1 px-3 py-2"
                  >
                    <span className="flex-1 text-sm text-text-1">{a.text}</span>
                    <span className="text-[10px] text-text-2 bg-bg-3 px-1.5 py-0.5 rounded">
                      {a.impact}
                    </span>
                    <span className="text-[10px] text-text-2 bg-bg-3 px-1.5 py-0.5 rounded">
                      {a.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAssumption(i)}
                      className="text-text-2 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                value={newAssumption}
                onChange={(e) => setNewAssumption(e.target.value)}
                placeholder="Add an assumption..."
                className="flex-1 rounded-lg border border-border bg-bg-1 px-3 py-2 text-sm text-text-0 placeholder-text-2 outline-none focus:border-accent transition-colors"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addAssumption();
                  }
                }}
              />
              <select
                value={newImpact}
                onChange={(e) => setNewImpact(e.target.value as AssumptionImpact)}
                className="rounded-lg border border-border bg-bg-1 px-2 py-2 text-xs text-text-1 outline-none focus:border-accent"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as AssumptionCategory)}
                className="rounded-lg border border-border bg-bg-1 px-2 py-2 text-xs text-text-1 outline-none focus:border-accent"
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
                className="rounded-lg bg-bg-3 px-3 py-2 text-sm text-text-1 hover:bg-bg-4 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Risks */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-1">
              Risk Factors
            </label>
            {risks.length > 0 && (
              <div className="mb-2 space-y-2">
                {risks.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-lg border border-border bg-bg-1 px-3 py-2"
                  >
                    <span className="flex-1 text-sm text-text-1">{r.text}</span>
                    <span className="text-[10px] text-text-2 bg-bg-3 px-1.5 py-0.5 rounded">
                      {r.severity}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeRisk(i)}
                      className="text-text-2 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                value={newRisk}
                onChange={(e) => setNewRisk(e.target.value)}
                placeholder="Add a risk factor..."
                className="flex-1 rounded-lg border border-border bg-bg-1 px-3 py-2 text-sm text-text-0 placeholder-text-2 outline-none focus:border-accent transition-colors"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addRisk();
                  }
                }}
              />
              <select
                value={newSeverity}
                onChange={(e) => setNewSeverity(e.target.value as Risk["severity"])}
                className="rounded-lg border border-border bg-bg-1 px-2 py-2 text-xs text-text-1 outline-none focus:border-accent"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <button
                type="button"
                onClick={addRisk}
                className="rounded-lg bg-bg-3 px-3 py-2 text-sm text-text-1 hover:bg-bg-4 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-5 py-2.5 text-sm text-text-2 transition-colors hover:text-text-0 hover:border-border-hover"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Create Thesis
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
