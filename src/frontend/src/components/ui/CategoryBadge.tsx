import { cn } from "../../lib/utils";

// Accepts both local Category enum values and backend Category enum values
// Both use the same string literals: "Reality TV"/"RealityTV", "Drama", "Comedy", "Exclusive"
const categoryStyles: Record<string, string> = {
  "Reality TV": "bg-rose-500/15 text-rose-400 border border-rose-500/30",
  RealityTV: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
  Drama: "bg-primary/15 text-primary border border-primary/30",
  Comedy: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  Exclusive: "bg-primary/15 text-primary border border-primary/30",
};

const categoryLabels: Record<string, string> = {
  RealityTV: "Reality TV",
};

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const style =
    categoryStyles[category] ??
    "bg-muted/30 text-muted-foreground border border-border/40";
  const label = categoryLabels[category] ?? category;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-display font-semibold tracking-wide",
        style,
        className,
      )}
    >
      {label}
    </span>
  );
}
