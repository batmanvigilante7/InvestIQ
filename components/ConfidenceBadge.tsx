import { cn } from "@/lib/utils";

interface ConfidenceBadgeProps {
  value: number;
  size?: "sm" | "md";
}

export default function ConfidenceBadge({
  value,
  size = "md",
}: ConfidenceBadgeProps) {
  const color =
    value >= 70
      ? "text-success bg-success-dim border-success/20"
      : value >= 40
        ? "text-warning bg-warning-dim border-warning/20"
        : "text-destructive bg-destructive-dim border-destructive/20";

  const sizeClasses = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-semibold",
        color,
        sizeClasses
      )}
    >
      {value}%
    </span>
  );
}
