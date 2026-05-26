"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import Panel from "@/components/ui/Panel";
import EmptyState from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Plus,
  Trash2,
  ArrowUpDown,
} from "lucide-react";

type TabId = "overview" | "allocation" | "positions";

export default function PortfolioPage() {
  const theses = useStore((s) => s.theses);
  const positions = useStore((s) => s.positions);
  const convictions = useStore((s) => s.convictions);
  const addPosition = useStore((s) => s.addPosition);
  const deletePosition = useStore((s) => s.deletePosition);

  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [showAddForm, setShowAddForm] = useState(false);
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const [newAsset, setNewAsset] = useState("");
  const [newTicker, setNewTicker] = useState("");
  const [newQty, setNewQty] = useState("");
  const [newCost, setNewCost] = useState("");
  const [newSector, setNewSector] = useState("");
  const [newThesisId, setNewThesisId] = useState("");

  const positionData = positions.map((pos) => {
    const price = pos.currentPrice ?? pos.avgCost;
    const pnl = (price - pos.avgCost) * pos.quantity;
    const pnlPercent = pos.avgCost > 0 ? ((price - pos.avgCost) / pos.avgCost) * 100 : 0;
    const value = price * pos.quantity;
    const thesis = pos.thesisId ? theses.find((t) => t.id === pos.thesisId) : null;
    return { ...pos, price, pnl, pnlPercent, value, thesis };
  });

  const totalValue = positionData.reduce((sum, p) => sum + p.value, 0);
  const totalPnL = positionData.reduce((sum, p) => sum + p.pnl, 0);
  const totalCost = positions.reduce((sum, p) => sum + p.avgCost * p.quantity, 0);

  const sectorMap: Record<string, { value: number; count: number }> = {};
  positionData.forEach((p) => {
    const sector = p.sector ?? "Other";
    if (!sectorMap[sector]) sectorMap[sector] = { value: 0, count: 0 };
    sectorMap[sector].value += p.value;
    sectorMap[sector].count += 1;
  });
  const sectors = Object.entries(sectorMap)
    .map(([name, data]) => ({
      name,
      value: data.value,
      count: data.count,
      pct: totalValue > 0 ? (data.value / totalValue) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);

  const tagCounts: Record<string, number> = {};
  theses
    .filter((t) => t.status === "active" || t.status === "conviction")
    .forEach((t) => t.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
    }));
  const overlappingTags = Object.entries(tagCounts).filter(([, c]) => c >= 2);

  const sortedPositions = sortCol
    ? [...positionData].sort((a, b) => {
        let va: number | string, vb: number | string;
        switch (sortCol) {
          case "ticker": va = a.ticker; vb = b.ticker; break;
          case "qty": va = a.quantity; vb = b.quantity; break;
          case "cost": va = a.avgCost; vb = b.avgCost; break;
          case "price": va = a.price; vb = b.price; break;
          case "pnl": va = a.pnl; vb = b.pnl; break;
          case "value": va = a.value; vb = b.value; break;
          default: return 0;
        }
        if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb as string) : (vb as string).localeCompare(va);
        return sortDir === "asc" ? (va as number) - (vb as number) : (vb as number) - (va as number);
      })
    : positionData;

  const handleSort = (col: string) => {
    if (sortCol === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  const handleAddPosition = () => {
    if (!newAsset.trim() || !newTicker.trim() || !newQty || !newCost) return;
    addPosition({
      id: `p-${Date.now()}`,
      asset: newAsset.trim(),
      ticker: newTicker.trim().toUpperCase(),
      quantity: Number(newQty),
      avgCost: Number(newCost),
      sector: newSector.trim() || undefined,
      thesisId: newThesisId || undefined,
      addedAt: new Date().toISOString().split("T")[0],
    });
    setNewAsset("");
    setNewTicker("");
    setNewQty("");
    setNewCost("");
    setNewSector("");
    setNewThesisId("");
    setShowAddForm(false);
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "allocation", label: "Allocation" },
    { id: "positions", label: "Positions" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-0">Portfolio</h1>
          <p className="mt-1 text-sm text-text-2">
            Position tracking, sector allocation, and thematic analysis
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent/90"
        >
          <Plus size={16} />
          Add Position
        </button>
      </div>

      {showAddForm && (
        <Panel className="mb-6">
          <h3 className="mb-4 text-sm font-semibold text-text-0">New Position</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <input value={newAsset} onChange={(e) => setNewAsset(e.target.value)} placeholder="Asset name" className="rounded-lg border border-border bg-bg-3 px-3 py-2 text-sm text-text-0 placeholder:text-text-2 outline-none focus:border-accent" />
            <input value={newTicker} onChange={(e) => setNewTicker(e.target.value)} placeholder="Ticker" className="rounded-lg border border-border bg-bg-3 px-3 py-2 text-sm text-text-0 placeholder:text-text-2 outline-none focus:border-accent" />
            <input value={newQty} onChange={(e) => setNewQty(e.target.value)} type="number" placeholder="Quantity" className="rounded-lg border border-border bg-bg-3 px-3 py-2 text-sm text-text-0 placeholder:text-text-2 outline-none focus:border-accent" />
            <input value={newCost} onChange={(e) => setNewCost(e.target.value)} type="number" placeholder="Avg Cost" className="rounded-lg border border-border bg-bg-3 px-3 py-2 text-sm text-text-0 placeholder:text-text-2 outline-none focus:border-accent" />
            <input value={newSector} onChange={(e) => setNewSector(e.target.value)} placeholder="Sector" className="rounded-lg border border-border bg-bg-3 px-3 py-2 text-sm text-text-0 placeholder:text-text-2 outline-none focus:border-accent" />
            <select value={newThesisId} onChange={(e) => setNewThesisId(e.target.value)} className="rounded-lg border border-border bg-bg-3 px-3 py-2 text-sm text-text-0 outline-none focus:border-accent">
              <option value="">Link to thesis (optional)</option>
              {theses.map((t) => (<option key={t.id} value={t.id}>{t.title}</option>))}
            </select>
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={handleAddPosition} disabled={!newAsset.trim() || !newTicker.trim() || !newQty || !newCost} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-40">Add Position</button>
            <button onClick={() => setShowAddForm(false)} className="rounded-lg border border-border px-4 py-2 text-sm text-text-2 hover:text-text-0">Cancel</button>
          </div>
        </Panel>
      )}

      {/* Tab bar */}
      <div className="mb-6 flex gap-1 rounded-lg border border-border bg-bg-2 p-1">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={cn("flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all", activeTab === tab.id ? "bg-accent-dim text-accent" : "text-text-2 hover:text-text-0")}
          >{tab.label}</button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-bg-2 p-5">
              <p className="mb-1 text-xs text-text-2">Total Value</p>
              <p className="text-2xl font-bold text-text-0">${totalValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}</p>
              <p className="text-xs text-text-2">{positions.length} positions</p>
            </div>
            <div className="rounded-xl border border-border bg-bg-2 p-5">
              <p className="mb-1 text-xs text-text-2">Total P&L</p>
              <p className={cn("text-2xl font-bold", totalPnL >= 0 ? "text-success" : "text-destructive")}>
                {totalPnL >= 0 ? "+" : ""}${totalPnL.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </p>
              <p className="text-xs text-text-2">{totalCost > 0 ? `${((totalPnL / totalCost) * 100).toFixed(1)}%` : "—"} return</p>
            </div>
            <div className="rounded-xl border border-border bg-bg-2 p-5">
              <p className="mb-1 text-xs text-text-2">Sectors</p>
              <p className="text-2xl font-bold text-accent">{sectors.length}</p>
              <p className="text-xs text-text-2">diversified</p>
            </div>
            <div className="rounded-xl border border-border bg-bg-2 p-5">
              <p className="mb-1 text-xs text-text-2">Thesis Coverage</p>
              <p className="text-2xl font-bold text-info">{positions.filter((p) => p.thesisId).length}/{positions.length}</p>
              <p className="text-xs text-text-2">positions linked</p>
            </div>
          </div>

          <Panel title="Sector Allocation">
            {sectors.length > 0 ? (
              <div className="space-y-3">
                {sectors.map((sector) => (
                  <div key={sector.name} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-1">{sector.name}</span>
                      <span className="text-text-2">{sector.pct.toFixed(1)}% · ${sector.value.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-bg-4">
                      <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${sector.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No positions yet" description="Add a position to see sector allocation." />
            )}
          </Panel>

          {(sectors.some((s) => s.pct > 40) || overlappingTags.length > 0) && (
            <Panel title="Risk Alerts">
              <div className="space-y-2">
                {sectors.filter((s) => s.pct > 40).map((sector) => (
                  <div key={sector.name} className="flex items-start gap-2 rounded-lg bg-warning-dim p-3">
                    <AlertTriangle size={14} className="mt-0.5 shrink-0 text-warning" />
                    <div>
                      <p className="text-xs font-medium text-warning">Concentration Risk</p>
                      <p className="text-xs text-text-2">{sector.name} represents {sector.pct.toFixed(1)}% of portfolio</p>
                    </div>
                  </div>
                ))}
                {overlappingTags.length > 0 && (
                  <div className="flex items-start gap-2 rounded-lg bg-info-dim p-3">
                    <AlertTriangle size={14} className="mt-0.5 shrink-0 text-info" />
                    <div>
                      <p className="text-xs font-medium text-info">Thematic Overlap</p>
                      <p className="text-xs text-text-2">Shared tags: {overlappingTags.map(([tag]) => tag).join(", ")}</p>
                    </div>
                  </div>
                )}
              </div>
            </Panel>
          )}
        </div>
      )}

      {/* Allocation */}
      {activeTab === "allocation" && (
        <div className="space-y-6">
          <Panel title="Thesis-Position Alignment">
            {positionData.length > 0 ? (
              <div className="space-y-3">
                {positionData.map((pos) => {
                  const thesisConviction = pos.thesis
                    ? convictions.filter((c) => c.thesisId === pos.thesis!.id).slice(-1)[0]?.value ?? pos.thesis.confidence
                    : null;
                  const allocationPct = totalValue > 0 ? (pos.value / totalValue) * 100 : 0;
                  const mismatch = thesisConviction !== null && Math.abs(allocationPct - thesisConviction) > 30;

                  return (
                    <div key={pos.id} className={cn("rounded-lg border p-4 transition-all", mismatch ? "border-warning/30 bg-warning-dim" : "border-border bg-bg-1")}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium text-text-0">{pos.ticker}</h4>
                            {pos.thesis && (
                              <Link href={`/thesis/${pos.thesis.id}`} className="text-xs text-accent hover:underline">
                                {pos.thesis.title.split(" ")[0]}
                              </Link>
                            )}
                          </div>
                          <p className="text-xs text-text-2">{pos.asset}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-sm text-text-0">${pos.value.toLocaleString("en-US", { maximumFractionDigits: 0 })}</p>
                          <p className={cn("font-mono text-xs", pos.pnl >= 0 ? "text-success" : "text-destructive")}>
                            {pos.pnl >= 0 ? "+" : ""}{pos.pnlPercent.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      {mismatch && (
                        <p className="mt-2 text-xs text-warning">
                          Conviction-allocation mismatch: conviction at {thesisConviction}% but allocation significantly differs
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState title="No positions" description="Add positions to see allocation analysis." />
            )}
          </Panel>
        </div>
      )}

      {/* Positions */}
      {activeTab === "positions" && (
        <Panel title="All Positions">
          {sortedPositions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-text-2">
                    {[
                      { key: "ticker", label: "Ticker" },
                      { key: "qty", label: "Qty" },
                      { key: "cost", label: "Avg Cost" },
                      { key: "price", label: "Price" },
                      { key: "pnl", label: "P&L" },
                      { key: "value", label: "Value" },
                    ].map((col) => (
                      <th key={col.key} className="cursor-pointer px-3 py-2 text-left font-medium transition-colors hover:text-text-0" onClick={() => handleSort(col.key)}>
                        <span className="inline-flex items-center gap-1">
                          {col.label}
                          {sortCol === col.key && (
                            <ArrowUpDown size={10} className={sortDir === "asc" ? "rotate-0" : "rotate-180"} />
                          )}
                        </span>
                      </th>
                    ))}
                    <th className="px-3 py-2 text-left font-medium">Thesis</th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {sortedPositions.map((pos) => (
                    <tr key={pos.id} className="border-b border-border/50 transition-colors hover:bg-bg-3">
                      <td className="px-3 py-3">
                        <div>
                          <span className="font-medium text-text-0">{pos.ticker}</span>
                          <p className="text-xs text-text-2">{pos.sector}</p>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-text-1">{pos.quantity}</td>
                      <td className="px-3 py-3 font-mono text-text-1">${pos.avgCost.toFixed(2)}</td>
                      <td className="px-3 py-3 font-mono text-text-0">${pos.price.toFixed(2)}</td>
                      <td className="px-3 py-3">
                        <p className={cn("font-mono font-medium", pos.pnl >= 0 ? "text-success" : "text-destructive")}>
                          {pos.pnl >= 0 ? "+" : ""}${pos.pnl.toFixed(0)} ({pos.pnlPercent >= 0 ? "+" : ""}{pos.pnlPercent.toFixed(1)}%)
                        </p>
                      </td>
                      <td className="px-3 py-3 font-mono text-text-0">${pos.value.toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
                      <td className="px-3 py-3">
                        {pos.thesis ? (
                          <Link href={`/thesis/${pos.thesis.id}`} className="rounded bg-accent-dim px-2 py-0.5 text-xs text-accent">{pos.thesis.title.split(" ")[0]}</Link>
                        ) : (
                          <span className="rounded bg-bg-4 px-2 py-0.5 text-xs text-text-2">Unlinked</span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <button onClick={() => deletePosition(pos.id)} className="text-text-2 transition-colors hover:text-destructive">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="No positions" description="Add your first position to start tracking."
              action={
                <button onClick={() => setShowAddForm(true)} className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90">
                  Add Position
                </button>
              }
            />
          )}
        </Panel>
      )}
    </div>
  );
}
