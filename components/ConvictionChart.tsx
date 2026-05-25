"use client";

import type { Conviction } from "@/types";

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
      <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 text-center">
        <p className="text-sm text-slate-400">No conviction history yet.</p>
        <p className="mt-1 text-xs text-slate-500">
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
    if (value >= 70) return "#10B981";
    if (value >= 40) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <span className="text-sm text-slate-400">Confidence trend: </span>
          {sorted.length >= 2 && (
            <span className={`text-sm font-semibold ${sorted[sorted.length - 1].value > sorted[0].value ? "text-brand-green" : sorted[sorted.length - 1].value < sorted[0].value ? "text-brand-red" : "text-slate-400"}`}>
              {sorted[sorted.length - 1].value > sorted[0].value ? "Rising" : sorted[sorted.length - 1].value < sorted[0].value ? "Falling" : "Stable"} ({sorted[0].value}% → {sorted[sorted.length - 1].value}%)
            </span>
          )}
        </div>
        <span className="text-xs text-slate-500">{sorted.length} updates</span>
      </div>

      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {[0, 25, 50, 75, 100].map((val) => {
          const y = padding.top + innerHeight - (val / maxVal) * innerHeight;
          return (
            <g key={val}>
              <line x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y} stroke="#1e293b" strokeWidth={1} />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" className="fill-slate-600 text-[10px]">{val}</text>
            </g>
          );
        })}
        <path d={areaPath} fill="url(#gradient)" opacity={0.3} />
        <path d={linePath} fill="none" stroke={getColor(currentConfidence)} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={4} fill={getColor(p.conviction.value)} stroke="#0f172a" strokeWidth={2} />
            {i % Math.max(1, Math.floor(points.length / 4)) === 0 && (
              <text x={p.x} y={chartHeight - 8} textAnchor="middle" className="fill-slate-600 text-[9px]">{p.conviction.recordedAt.slice(5)}</text>
            )}
          </g>
        ))}
        <defs>
          <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={getColor(currentConfidence)} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>

      {sorted[sorted.length - 1].reasoning && (
        <div className="mt-3 rounded-lg border border-slate-800 bg-slate-800/30 px-3 py-2">
          <p className="text-xs text-slate-500">Last update:</p>
          <p className="text-sm text-slate-300">{sorted[sorted.length - 1].reasoning}</p>
        </div>
      )}
    </div>
  );
}
