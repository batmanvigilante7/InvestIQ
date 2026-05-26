import { cn } from "@/lib/utils";

type Level = "exploratory" | "low" | "moderate" | "high" | "extreme";

const levelConfig: Record<Level, { label: string; color: string; bg: string }> = {
  exploratory: { label: "Exploratory", color: "text-text-2", bg: "bg-bg-4" },
  low: { label: "Low", color: "text-warning", bg: "bg-warning-dim" },
  moderate: { label: "Moderate", color: "text-info", bg: "bg-info-dim" },
  high: { label: "High", color: "text-success", bg: "bg-success-dim" },
  extreme: { label: "Extreme", color: "text-accent", bg: "bg-accent-dim" },
};

function getLevel(score: number): Level {
  if (score >= 90) return "extreme";
  if (score >= 70) return "high";
  if (score >= 45) return "moderate";
  if (score >= 25) return "low";
  return "exploratory";
}

interface ConvictionBadgeProps {
  score: number;
  size?: "sm" | "md";
  className?: string;
}

export default function ConvictionBadge({ score, size = "sm", className }: ConvictionBadgeProps) {
  const level = getLevel(score);
  const config = levelConfig[level];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        config.bg,
        config.color,
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        className
      )}
    >
      {score}% {config.label}
    </span>
  );
}

export { getLevel, levelConfig };
export type { Level };
