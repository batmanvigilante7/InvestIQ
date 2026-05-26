"use client";

import type { Conviction } from "@/types";
import { cn } from "@/lib/utils";

interface ConvictionChartProps {
  convictions: Conviction[];
  currentConfidence: number;
}

export default function ConvictionChart({
  convictions,
  currentConfidence,
}: ConvictionChartProps) {
  const sorted = [...convictions].sort(
    (a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
  );

  if (sorted.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-bg-1 p-6 text-center">
        <p className="text-sm text-text-1">No conviction history yet.</p>
        <p className="mt-1 text-xs text-text-2">
          Update your confidence to start tracking how your conviction evolves.
        </p>
      </div>
    );
  }

  const maxVal = 100;
  const chartHeight = 160;
  const chartWidth = 600;
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const points = sorted.map((c, i) => ({
    x: padding.left + (i / Math.max(sorted.length - 1, 1)) * innerWidth,
    y: padding.top + innerHeight - (c.value / maxVal) * innerHeight,
    conviction: c,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + innerHeight} L ${points[0].x} ${padding.top + innerHeight} Z`;

  const getColor = (value: number) => {
    if (value >= 70) return "#22c55e";
    if (value >= 40) return "#f59e0b";
    return "#ef4444";
  };

  // Stability analysis
  const deltas = sorted.slice(1).map((c, i) => c.value - sorted[i].value);
  const avgDelta = deltas.length > 0 ? deltas.reduce((s, d) => s + Math.abs(d), 0) / deltas.length : 0;
  const stability = avgDelta > 10 ? "volatile" : avgDelta > 5 ? "active" : "stable";

  return (
    <div className="rounded-xl border border-border bg-bg-1 p-5">
      {/* Summary */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <span className="text-sm text-text-2">Confidence trend: </span>
          {sorted.length >= 2 && (
            <span className={cn("text-sm font-semibold",
              sorted[sorted.length - 1].value > sorted[0].value ? "text-success" :
              sorted[sorted.length - 1].value < sorted[0].value ? "text-destructive" : "text-text-2"
            )}>
              {sorted[sorted.length - 1].value > sorted[0].value ? "Rising" :
               sorted[sorted.length - 1].value < sorted[0].value ? "Falling" : "Stable"}{" "}
              ({sorted[0].value}% → {sorted[sorted.length - 1].value}%)
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className={cn("text-xs font-medium",
            stability === "volatile" ? "text-destructive" :
            stability === "active" ? "text-warning" : "text-success"
          )}>
            {stability === "volatile" ? "Volatile" :
             stability === "active" ? "Active" : "Stable"}
          </span>
          <span className="text-xs text-text-2">{sorted.length} updates</span>
        </div>
      </div>

      {/* SVG Chart */}
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((val) => {
          const y = padding.top + innerHeight - (val / maxVal) * innerHeight;
          return (
            <g key={val}>
              <line x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" fill="rgba(240,240,245,0.3)" fontSize={10}>{val}</text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#conviction-gradient)" opacity={0.2} />

        {/* Line */}
        <path d={linePath} fill="none" stroke={getColor(currentConfidence)} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={4} fill={getColor(p.conviction.value)} stroke="#050508" strokeWidth={2} />
            {p.conviction.delta !== undefined && p.conviction.delta !== 0 && (
              <text
                x={p.x}
                y={p.y - 10}
                textAnchor="middle"
                fill={p.conviction.delta > 0 ? "#22c55e" : "#ef4444"}
                fontSize={9}
                fontWeight="600"
              >
                {p.conviction.delta > 0 ? "+" : ""}{p.conviction.delta}
              </text>
            )}
            {i % Math.max(1, Math.floor(points.length / 4)) === 0 && (
              <text x={p.x} y={chartHeight - 8} textAnchor="middle" fill="rgba(240,240,245,0.3)" fontSize={9}>
                {p.conviction.recordedAt.slice(5)}
              </text>
            )}
          </g>
        ))}

        <defs>
          <linearGradient id="conviction-gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={getColor(currentConfidence)} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>

      {/* Last update reasoning */}
      {sorted[sorted.length - 1].reasoning && (
        <div className="mt-3 rounded-lg border border-border bg-bg-0 px-3 py-2">
          <p className="text-xs text-text-2">Last update:</p>
          <p className="text-sm text-text-1">{sorted[sorted.length - 1].reasoning}</p>
          {sorted[sorted.length - 1].emotionalState && (
            <p className="mt-1 text-xs text-text-2">
              Emotional state: <span className="capitalize">{sorted[sorted.length - 1].emotionalState}</span>
            </p>
          )}
        </div>
      )}

      {/* Timeline */}
      {sorted.length > 1 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-medium text-text-2">Timeline</p>
          {sorted.slice().reverse().slice(0, 5).map((c) => (
            <div key={c.id} className="flex items-center gap-3 text-xs">
              <span className="w-16 text-text-2">{c.recordedAt.slice(5)}</span>
              <span className={cn("w-10 font-mono",
                getColor(c.value) === "#22c55e" ? "text-success" :
                getColor(c.value) === "#f59e0b" ? "text-warning" : "text-destructive"
              )}>
                {c.value}%
              </span>
              {c.delta !== undefined && (
                <span className={cn("w-10 font-mono",
                  c.delta > 0 ? "text-success" : c.delta < 0 ? "text-destructive" : "text-text-2"
                )}>
                  {c.delta > 0 ? "+" : ""}{c.delta}
                </span>
              )}
              {c.reasoning && (
                <span className="flex-1 truncate text-text-1">{c.reasoning}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
