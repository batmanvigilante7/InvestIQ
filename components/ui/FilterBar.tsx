"use client";

import { cn } from "@/lib/utils";

interface FilterOption<T extends string> {
  label: string;
  value: T;
  count?: number;
}

interface FilterBarProps<T extends string> {
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export default function FilterBar<T extends string>({
  options,
  value,
  onChange,
  className,
}: FilterBarProps<T>) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
            value === opt.value
              ? "bg-accent text-white"
              : "border border-border text-text-2 hover:border-border-hover hover:text-text-1"
          )}
        >
          {opt.label}
          {opt.count !== undefined && opt.count > 0 && (
            <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-bg-4 px-1 text-[10px]">
              {opt.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
