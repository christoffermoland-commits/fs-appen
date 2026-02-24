'use client';

import { useState } from 'react';
import PointsChart from './PointsChart';
import RankChart from './RankChart';
import { BestWorstGW, BenchPointsWasted, TransferCosts, ChipsByManager } from './StatsWidgets';
import H2HComparison from './H2HComparison';
import CaptainTable from './CaptainTable';
import TransferHistory from './TransferHistory';
import MiniLeague from './MiniLeague';
import { cn } from '@/lib/utils';
import type { GameweekHistory, ChipUsage, Pick, Transfer, Player } from '@/lib/types';

type Tab = 'overview' | 'h2h' | 'captain' | 'transfers' | 'miniLeague';

interface ManagerData {
  name: string;
  teamId: number;
  history: GameweekHistory[];
  chips: ChipUsage[];
  transfers: Transfer[];
  gwPicks: { gw: number; picks: Pick[] }[];
  currentSquad: number[];
}

const tabs: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Oversikt' },
  { id: 'h2h', label: 'Head-to-Head' },
  { id: 'captain', label: 'Kaptein' },
  { id: 'transfers', label: 'Transfers' },
  { id: 'miniLeague', label: 'Laganalyse' },
];

export default function StatsClient({
  managers,
  playerMap,
  currentGw,
}: {
  managers: ManagerData[];
  playerMap: Record<number, Player>;
  currentGw: number;
}) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [chartMode, setChartMode] = useState<'cumulative' | 'weekly'>('cumulative');
  const [activeChart, setActiveChart] = useState<'points' | 'rank'>('points');

  return (
    <div className="space-y-6">
      {/* Tab navigation */}
      <div className="flex gap-1 overflow-x-auto rounded-lg border border-fpl-border bg-fpl-surface p-1 scrollbar-thin">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'bg-fpl-purple text-white'
                : 'text-fpl-muted hover:text-foreground hover:bg-fpl-dark'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
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
            <ChipsByManager managers={managers} />
          </div>
        </div>
      )}

      {/* Head-to-Head tab */}
      {activeTab === 'h2h' && (
        <H2HComparison
          managers={managers.map(m => ({
            name: m.name,
            teamId: m.teamId,
            gwPicks: m.gwPicks,
          }))}
          playerMap={playerMap}
          currentGw={currentGw}
        />
      )}

      {/* Captain tab */}
      {activeTab === 'captain' && (
        <CaptainTable
          managers={managers.map(m => ({
            managerName: m.name,
            teamId: m.teamId,
            gwPicks: m.gwPicks,
          }))}
          playerMap={playerMap}
          maxGw={currentGw}
        />
      )}

      {/* Transfers tab */}
      {activeTab === 'transfers' && (
        <TransferHistory
          managers={managers.map(m => ({
            name: m.name,
            teamId: m.teamId,
            transfers: m.transfers,
          }))}
          playerMap={playerMap}
        />
      )}

      {/* Mini-league analysis tab */}
      {activeTab === 'miniLeague' && (
        <MiniLeague
          managers={managers.map(m => ({
            name: m.name,
            teamId: m.teamId,
            currentSquad: m.currentSquad,
          }))}
        />
      )}
    </div>
  );
}
