export default function StatsLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-4 w-40 animate-pulse rounded bg-fpl-surface" />
        <div className="h-8 w-32 animate-pulse rounded bg-fpl-surface" />
        <div className="h-4 w-48 animate-pulse rounded bg-fpl-surface" />
      </div>

      {/* Chart skeleton */}
      <div className="h-[480px] animate-pulse rounded-xl border border-fpl-border bg-fpl-surface" />

      {/* Widgets skeleton */}
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[250px] animate-pulse rounded-xl border border-fpl-border bg-fpl-surface" />
        ))}
      </div>
    </div>
  );
}
