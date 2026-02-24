'use client';

import Card from '@/components/ui/Card';
import type { GameweekHistory, ChipUsage } from '@/lib/types';

interface ManagerStats {
  name: string;
  teamId: number;
  history: GameweekHistory[];
  chips: ChipUsage[];
}

export function BestWorstGW({ managers }: { managers: ManagerStats[] }) {
  const stats = managers.map((m) => {
    const best = m.history.reduce((max, gw) => gw.points > max.points ? gw : max, m.history[0]);
    const worst = m.history.reduce((min, gw) => gw.points < min.points ? gw : min, m.history[0]);
    return { name: m.name, best, worst };
  });

  return (
    <Card>
      <h3 className="mb-3 text-sm font-bold text-fpl-muted uppercase tracking-wider">Beste / Verste GW</h3>
      <div className="space-y-2">
        {stats.sort((a, b) => b.best.points - a.best.points).map((s) => (
          <div key={s.name} className="flex items-center justify-between text-sm">
            <span className="truncate flex-1">{s.name}</span>
            <span className="ml-2 font-bold text-fpl-green">
              {s.best.points} <span className="text-xs text-fpl-muted">(GW{s.best.event})</span>
            </span>
            <span className="ml-3 font-bold text-fpl-pink">
              {s.worst.points} <span className="text-xs text-fpl-muted">(GW{s.worst.event})</span>
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function BenchPointsWasted({ managers }: { managers: ManagerStats[] }) {
  const stats = managers
    .map((m) => ({
      name: m.name,
      benchPoints: m.history.reduce((sum, gw) => sum + gw.points_on_bench, 0),
    }))
    .sort((a, b) => b.benchPoints - a.benchPoints);

  return (
    <Card>
      <h3 className="mb-3 text-sm font-bold text-fpl-muted uppercase tracking-wider">Poeng på benken</h3>
      <div className="space-y-2">
        {stats.map((s, i) => (
          <div key={s.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-fpl-muted">{i + 1}.</span>
              <span className="truncate">{s.name}</span>
            </div>
            <span className="font-bold text-fpl-pink">{s.benchPoints}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function TransferCosts({ managers }: { managers: ManagerStats[] }) {
  const stats = managers
    .map((m) => ({
      name: m.name,
      totalCost: m.history.reduce((sum, gw) => sum + gw.event_transfers_cost, 0),
      totalTransfers: m.history.reduce((sum, gw) => sum + gw.event_transfers, 0),
    }))
    .sort((a, b) => b.totalCost - a.totalCost);

  return (
    <Card>
      <h3 className="mb-3 text-sm font-bold text-fpl-muted uppercase tracking-wider">Transfer-kostnader</h3>
      <div className="space-y-2">
        {stats.map((s, i) => (
          <div key={s.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-fpl-muted">{i + 1}.</span>
              <span className="truncate">{s.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-fpl-muted">{s.totalTransfers} stk</span>
              <span className="font-bold text-fpl-pink">
                {s.totalCost > 0 ? `-${s.totalCost}` : '0'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function ChipsByManager({ managers }: { managers: ManagerStats[] }) {
  const chipLabels: Record<string, string> = {
    wildcard: 'Wildcard',
    freehit: 'Free Hit',
    bboost: 'Bench Boost',
    '3xc': 'Triple Captain',
  };

  const chipColors: Record<string, string> = {
    wildcard: 'bg-fpl-cyan/20 text-fpl-cyan',
    freehit: 'bg-fpl-green/20 text-fpl-green',
    bboost: 'bg-fpl-gold/20 text-fpl-gold',
    '3xc': 'bg-fpl-pink/20 text-fpl-pink',
  };

  return (
    <Card className="sm:col-span-2">
      <h3 className="mb-3 text-sm font-bold text-fpl-muted uppercase tracking-wider">Chip-bruk</h3>
      <div className="space-y-3">
        {managers.map((m) => (
          <div key={m.teamId} className="flex items-start gap-3">
            <span className="shrink-0 w-28 truncate text-sm font-medium pt-0.5">{m.name}</span>
            <div className="flex flex-wrap gap-1.5">
              {m.chips.length > 0 ? (
                [...m.chips].sort((a, b) => a.event - b.event).map((c, i) => (
                  <span
                    key={i}
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${chipColors[c.name] || 'bg-fpl-surface text-foreground'}`}
                  >
                    {chipLabels[c.name] || c.name} GW{c.event}
                  </span>
                ))
              ) : (
                <span className="text-xs text-fpl-muted pt-0.5">Ingen chips brukt</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
