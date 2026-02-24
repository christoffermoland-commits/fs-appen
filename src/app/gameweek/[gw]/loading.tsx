export default function GameweekLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-fpl-surface" />
          <div className="h-8 w-40 animate-pulse rounded bg-fpl-surface" />
          <div className="h-4 w-56 animate-pulse rounded bg-fpl-surface" />
        </div>
        <div className="h-10 w-40 animate-pulse rounded-lg bg-fpl-surface" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border border-fpl-border overflow-hidden">
        <div className="h-10 bg-fpl-dark" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-fpl-border/50 px-4 py-3">
            <div className="h-4 w-6 animate-pulse rounded bg-fpl-surface" />
            <div className="h-4 w-32 animate-pulse rounded bg-fpl-surface" />
            <div className="ml-auto h-4 w-12 animate-pulse rounded bg-fpl-surface" />
          </div>
        ))}
      </div>

      {/* Squad grid skeleton */}
      <div className="h-6 w-36 animate-pulse rounded bg-fpl-surface" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-[350px] animate-pulse rounded-xl border border-fpl-border bg-fpl-surface" />
        ))}
      </div>
    </div>
  );
}
