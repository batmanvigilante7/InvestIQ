import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: "default" | "success" | "warning" | "destructive" | "accent";
  size?: "sm" | "md";
  showLabel?: boolean;
  className?: string;
}

const colorMap = {
  default: "bg-text-2",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  accent: "bg-accent",
};

export default function ProgressBar({
  value,
  max = 100,
  color,
  size = "sm",
  showLabel = false,
  className,
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const autoColor =
    color ?? (percent >= 70 ? "success" : percent >= 40 ? "warning" : "destructive");

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-bg-4",
          size === "sm" ? "h-1.5" : "h-2.5"
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            colorMap[autoColor]
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-text-2 shrink-0">{Math.round(percent)}%</span>
      )}
    </div>
  );
}
