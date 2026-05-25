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
      ? "text-brand-green bg-brand-green/10 border-brand-green/20"
      : value >= 40
        ? "text-brand-yellow bg-brand-yellow/10 border-brand-yellow/20"
        : "text-brand-red bg-brand-red/10 border-brand-red/20";

  const sizeClasses = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold ${color} ${sizeClasses}`}
    >
      {value}%
    </span>
  );
}
