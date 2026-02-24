'use client';

import { useState } from 'react';
import PointsChart from './PointsChart';
import RankChart from './RankChart';
import { BestWorstGW, BenchPointsWasted, TransferCosts, ChipTimeline } from './StatsWidgets';
import { cn } from '@/lib/utils';
import type { GameweekHistory, ChipUsage } from '@/lib/types';

interface ManagerData {
  name: string;
  teamId: number;
  history: GameweekHistory[];
  chips: ChipUsage[];
}

export default function StatsClient({ managers }: { managers: ManagerData[] }) {
  const [chartMode, setChartMode] = useState<'cumulative' | 'weekly'>('cumulative');
  const [activeChart, setActiveChart] = useState<'points' | 'rank'>('points');

  return (
    <div className="space-y-6">
      {/* Chart section */}
      <div className="rounded-xl border border-fpl-border bg-fpl-surface p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex rounded-lg border border-fpl-border">
            <button
              onClick={() => setActiveChart('points')}
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors rounded-l-lg',
                activeChart === 'points' ? 'bg-fpl-purple text-white' : 'text-fpl-muted hover:text-foreground'
              )}
            >
              Poengutvikling
            </button>
            <button
              onClick={() => setActiveChart('rank')}
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors rounded-r-lg',
                activeChart === 'rank' ? 'bg-fpl-purple text-white' : 'text-fpl-muted hover:text-foreground'
              )}
            >
              Liga-rank
            </button>
          </div>

          {activeChart === 'points' && (
            <div className="flex rounded-lg border border-fpl-border">
              <button
                onClick={() => setChartMode('cumulative')}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium transition-colors rounded-l-lg',
                  chartMode === 'cumulative' ? 'bg-fpl-green/20 text-fpl-green' : 'text-fpl-muted hover:text-foreground'
                )}
              >
                Kumulativt
              </button>
              <button
                onClick={() => setChartMode('weekly')}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium transition-colors rounded-r-lg',
                  chartMode === 'weekly' ? 'bg-fpl-green/20 text-fpl-green' : 'text-fpl-muted hover:text-foreground'
                )}
              >
                Per GW
              </button>
            </div>
          )}
        </div>

        {activeChart === 'points' ? (
          <PointsChart
            managers={managers.map(m => ({
              name: m.name,
              teamId: m.teamId,
              history: m.history.map(h => ({
                event: h.event,
                points: h.points,
                total_points: h.total_points,
              })),
            }))}
            mode={chartMode}
          />
        ) : (
          <RankChart
            managers={managers.map(m => ({
              name: m.name,
              teamId: m.teamId,
              history: m.history.map(h => ({
                event: h.event,
                total_points: h.total_points,
              })),
            }))}
          />
        )}
      </div>

      {/* Stats widgets */}
      <div className="grid gap-4 sm:grid-cols-2">
        <BestWorstGW managers={managers} />
        <BenchPointsWasted managers={managers} />
        <TransferCosts managers={managers} />
        <ChipTimeline managers={managers} />
      </div>
    </div>
  );
}
