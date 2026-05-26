import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PanelProps {
  title?: string;
  header?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function Panel({ title, header, children, className }: PanelProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-bg-2 p-5",
        className
      )}
    >
      {(title || header) && (
        <div className="mb-4 flex items-center justify-between">
          {title && (
            <h3 className="text-sm font-semibold text-text-0">{title}</h3>
          )}
          {header}
        </div>
      )}
      {children}
    </div>
  );
}
