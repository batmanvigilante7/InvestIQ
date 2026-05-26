import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export default function MetricCard({
  label,
  value,
  sublabel,
  trend,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-bg-2 p-5 transition-all hover:border-border-hover hover:bg-bg-3",
        className
      )}
    >
      <p className="text-xs font-medium text-text-2 mb-2">{label}</p>
      <p
        className={cn(
          "text-2xl font-bold",
          trend === "up"
            ? "text-success"
            : trend === "down"
              ? "text-destructive"
              : "text-text-0"
        )}
      >
        {value}
      </p>
      {sublabel && <p className="mt-1 text-xs text-text-2">{sublabel}</p>}
    </div>
  );
}
