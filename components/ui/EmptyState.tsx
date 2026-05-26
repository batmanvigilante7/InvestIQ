import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-border bg-bg-2 py-16 px-6 text-center",
        className
      )}
    >
      {icon && <div className="mb-3 text-3xl">{icon}</div>}
      <h3 className="text-sm font-medium text-text-1">{title}</h3>
      {description && (
        <p className="mt-1 text-xs text-text-2 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
