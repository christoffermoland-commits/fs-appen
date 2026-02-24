'use client';

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function GameweekPicker({
  currentGw,
  maxGw,
}: {
  currentGw: number;
  maxGw: number;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => router.push(`/gameweek/${currentGw - 1}`)}
        disabled={currentGw <= 1}
        className={cn(
          'rounded-lg border border-fpl-border p-2 transition-colors',
          currentGw <= 1
            ? 'opacity-30 cursor-not-allowed'
            : 'hover:bg-fpl-surface-light hover:border-fpl-purple'
        )}
      >
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </button>

      <select
        value={currentGw}
        onChange={(e) => router.push(`/gameweek/${e.target.value}`)}
        className="rounded-lg border border-fpl-border bg-fpl-surface px-3 py-2 text-sm font-medium focus:border-fpl-green focus:outline-none"
      >
        {Array.from({ length: maxGw }, (_, i) => i + 1).map((gw) => (
          <option key={gw} value={gw}>
            Gameweek {gw}
          </option>
        ))}
      </select>

      <button
        onClick={() => router.push(`/gameweek/${currentGw + 1}`)}
        disabled={currentGw >= maxGw}
        className={cn(
          'rounded-lg border border-fpl-border p-2 transition-colors',
          currentGw >= maxGw
            ? 'opacity-30 cursor-not-allowed'
            : 'hover:bg-fpl-surface-light hover:border-fpl-purple'
        )}
      >
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </button>
    </div>
  );
}
