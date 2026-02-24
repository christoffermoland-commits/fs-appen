export default function ManagerLoading() {
  return (
    <div className="space-y-6">
      <div className="h-4 w-40 animate-pulse rounded bg-fpl-surface" />

      {/* Manager card skeleton */}
      <div className="rounded-xl border border-fpl-border bg-fpl-surface p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="h-7 w-48 animate-pulse rounded bg-fpl-dark" />
            <div className="h-4 w-32 animate-pulse rounded bg-fpl-dark" />
          </div>
          <div className="flex gap-4">
            <div className="h-16 w-20 animate-pulse rounded bg-fpl-dark" />
            <div className="h-16 w-20 animate-pulse rounded bg-fpl-dark" />
            <div className="h-16 w-20 animate-pulse rounded bg-fpl-dark" />
          </div>
        </div>
      </div>

      {/* Charts skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-[380px] animate-pulse rounded-xl border border-fpl-border bg-fpl-surface" />
        <div className="h-[380px] animate-pulse rounded-xl border border-fpl-border bg-fpl-surface" />
      </div>
    </div>
  );
}
