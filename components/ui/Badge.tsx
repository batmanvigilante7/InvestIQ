import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type BadgeVariant = "default" | "success" | "warning" | "destructive" | "info" | "accent";

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-bg-4 text-text-1",
  success: "bg-success-dim text-success",
  warning: "bg-warning-dim text-warning",
  destructive: "bg-destructive-dim text-destructive",
  info: "bg-info-dim text-info",
  accent: "bg-accent-dim text-accent",
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

export default function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
