"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import type { Assumption, AssumptionImpact, AssumptionCategory } from "@/types";

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
    <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-5">
      <div className="space-y-3">
        <div>
          <label className="mb-1.5 block text-sm text-slate-400">What needs to be true?</label>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="e.g., AI training compute demand grows >40% YoY"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-green"
            autoFocus
          />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1.5 block text-sm text-slate-400">Impact</label>
            <select value={impact} onChange={(e) => setImpact(e.target.value as AssumptionImpact)} className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-brand-green">
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="mb-1.5 block text-sm text-slate-400">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as AssumptionCategory)} className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-brand-green">
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
          <button onClick={handleSubmit} disabled={!text.trim()} className="rounded-lg bg-brand-green px-4 py-1.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50">
            Add Assumption
          </button>
          <button onClick={onComplete} className="rounded-lg border border-slate-700 px-4 py-1.5 text-sm text-slate-400 hover:text-white">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
