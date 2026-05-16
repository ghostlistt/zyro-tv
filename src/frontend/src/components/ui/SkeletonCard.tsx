export function SkeletonCard() {
  return (
    <div
      className="rounded-lg overflow-hidden bg-card animate-pulse"
      data-ocid="skeleton-card"
    >
      <div className="aspect-[2/3] bg-muted/50" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-muted/50 rounded w-3/4" />
        <div className="h-3 bg-muted/50 rounded w-1/2" />
        <div className="h-3 bg-muted/50 rounded w-1/3" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex gap-4 animate-pulse">
      {(["a", "b", "c", "d"] as const).map((k) => (
        <SkeletonCard key={k} />
      ))}
    </div>
  );
}
