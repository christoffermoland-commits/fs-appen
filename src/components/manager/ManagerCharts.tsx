'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';
import type { GameweekHistory } from '@/lib/types';
import Card from '@/components/ui/Card';

export default function ManagerCharts({
  history,
  managerName,
}: {
  history: GameweekHistory[];
  managerName: string;
}) {
  const [view, setView] = useState<'points' | 'rank'>('points');

  const data = history.map((gw) => ({
    gw: gw.event,
    points: gw.points,
    total: gw.total_points,
    rank: gw.overall_rank,
    bench: gw.points_on_bench,
  }));

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Utvikling</h2>
        <div className="flex rounded-lg border border-fpl-border">
          <button
            onClick={() => setView('points')}
            className={cn(
              'px-3 py-1 text-xs font-medium transition-colors rounded-l-lg',
              view === 'points' ? 'bg-fpl-purple text-white' : 'text-fpl-muted hover:text-foreground'
            )}
          >
            Poeng
          </button>
          <button
            onClick={() => setView('rank')}
            className={cn(
              'px-3 py-1 text-xs font-medium transition-colors rounded-r-lg',
              view === 'rank' ? 'bg-fpl-purple text-white' : 'text-fpl-muted hover:text-foreground'
            )}
          >
            Rank
          </button>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {view === 'points' ? (
            <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d1650" />
              <XAxis dataKey="gw" stroke="#9ca3af" fontSize={11} tickFormatter={(v) => `${v}`} />
              <YAxis stroke="#9ca3af" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#16082a',
                  border: '1px solid #2d1650',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelFormatter={(v) => `Gameweek ${v}`}
              />
              <Bar dataKey="points" fill="#00FF87" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d1650" />
              <XAxis dataKey="gw" stroke="#9ca3af" fontSize={11} tickFormatter={(v) => `${v}`} />
              <YAxis
                stroke="#9ca3af"
                fontSize={11}
                reversed
                tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#16082a',
                  border: '1px solid #2d1650',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelFormatter={(v) => `Gameweek ${v}`}
                formatter={(value: number) => [value.toLocaleString('nb-NO'), 'Overall rank']}
              />
              <Line
                type="monotone"
                dataKey="rank"
                stroke="#04F5FF"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
