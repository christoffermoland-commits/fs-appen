export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-fpl-surface" />
          <div className="h-4 w-64 animate-pulse rounded-lg bg-fpl-surface" />
        </div>
        <div className="flex gap-3">
          <div className="h-16 w-20 animate-pulse rounded-lg bg-fpl-surface" />
          <div className="h-16 w-20 animate-pulse rounded-lg bg-fpl-surface" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border border-fpl-border overflow-hidden">
        <div className="h-10 bg-fpl-dark" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-fpl-border/50 px-4 py-3">
            <div className="h-4 w-6 animate-pulse rounded bg-fpl-surface" />
            <div className="h-4 w-6 animate-pulse rounded bg-fpl-surface" />
            <div className="h-4 w-32 animate-pulse rounded bg-fpl-surface" />
            <div className="ml-auto h-4 w-10 animate-pulse rounded bg-fpl-surface" />
            <div className="h-4 w-12 animate-pulse rounded bg-fpl-surface" />
          </div>
        ))}
      </div>
    </div>
  );
}
