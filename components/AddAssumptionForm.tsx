"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import type { Assumption, AssumptionImpact, AssumptionCategory } from "@/types";
import { Plus } from "lucide-react";

interface AddAssumptionFormProps {
  thesisId: string;
  onComplete: () => void;
}

export default function AddAssumptionForm({
  thesisId,
  onComplete,
}: AddAssumptionFormProps) {
  const addAssumption = useStore((s) => s.addAssumption);
  const [text, setText] = useState("");
  const [impact, setImpact] = useState<AssumptionImpact>("high");
  const [category, setCategory] = useState<AssumptionCategory>("demand");

  const handleSubmit = () => {
    if (!text.trim()) return;

    const assumption: Assumption = {
      id: `a-${Date.now()}`,
      text: text.trim(),
      status: "holding",
      impact,
      category,
    };

    addAssumption(thesisId, assumption);
    onComplete();
  };

  return (
    <div className="rounded-xl border border-border bg-bg-1 p-5">
      <div className="space-y-3">
        <div>
          <label className="mb-1.5 block text-sm text-text-2">What needs to be true?</label>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="e.g., AI training compute demand grows >40% YoY"
            className="w-full rounded-lg border border-border bg-bg-2 px-4 py-2 text-sm text-text-0 placeholder-text-2 outline-none focus:border-accent transition-colors"
            autoFocus
          />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1.5 block text-sm text-text-2">Impact</label>
            <select value={impact} onChange={(e) => setImpact(e.target.value as AssumptionImpact)} className="w-full rounded-lg border border-border bg-bg-2 px-3 py-2 text-sm text-text-0 outline-none focus:border-accent">
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="mb-1.5 block text-sm text-text-2">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as AssumptionCategory)} className="w-full rounded-lg border border-border bg-bg-2 px-3 py-2 text-sm text-text-0 outline-none focus:border-accent">
              <option value="demand">Demand</option>
              <option value="supply">Supply</option>
              <option value="macro">Macro</option>
              <option value="regulatory">Regulatory</option>
              <option value="competitive">Competitive</option>
              <option value="technical">Technical</option>
              <option value="management">Management</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <button onClick={handleSubmit} disabled={!text.trim()} className="inline-flex items-center gap-1 rounded-lg bg-accent px-4 py-1.5 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-40 transition-colors">
            <Plus className="h-3.5 w-3.5" /> Add Assumption
          </button>
          <button onClick={onComplete} className="rounded-lg border border-border px-4 py-1.5 text-sm text-text-2 hover:text-text-0 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
