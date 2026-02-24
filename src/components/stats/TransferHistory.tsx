'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import type { Player, Transfer } from '@/lib/types';

interface ManagerTransfers {
  name: string;
  teamId: number;
  transfers: Transfer[];
}

export default function TransferHistory({
  managers,
  playerMap,
}: {
  managers: ManagerTransfers[];
  playerMap: Record<number, Player>;
}) {
  const [selectedManager, setSelectedManager] = useState<number | 'all'>('all');

  const filteredManagers = selectedManager === 'all'
    ? managers
    : managers.filter(m => m.teamId === selectedManager);

  // Flatten and sort all transfers
  const allTransfers = filteredManagers
    .flatMap(m => m.transfers.map(t => ({ ...t, managerName: m.name })))
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 50);

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h3 className="text-sm font-bold text-fpl-muted uppercase tracking-wider">Transfers</h3>
        <select
          value={selectedManager}
          onChange={e => setSelectedManager(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="rounded-lg border border-fpl-border bg-fpl-dark px-2 py-1 text-xs focus:border-fpl-green focus:outline-none"
        >
          <option value="all">Alle managere</option>
          {managers.map(m => <option key={m.teamId} value={m.teamId}>{m.name}</option>)}
        </select>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        <div className="space-y-1 px-4 pb-4">
          {allTransfers.length > 0 ? allTransfers.map((t, i) => {
            const playerIn = playerMap[t.element_in];
            const playerOut = playerMap[t.element_out];
            return (
              <div key={`${t.entry}-${t.time}-${i}`} className="flex items-center gap-2 rounded-lg bg-fpl-dark px-3 py-2 text-xs">
                <span className="shrink-0 rounded bg-fpl-surface px-1.5 py-0.5 text-fpl-muted">
                  GW{t.event}
                </span>
                {selectedManager === 'all' && (
                  <span className="shrink-0 truncate max-w-[80px] text-fpl-muted">
                    {t.managerName.split(' ')[0]}
                  </span>
                )}
                <div className="flex flex-1 items-center gap-1 min-w-0">
                  <span className="text-fpl-green font-medium truncate">
                    {playerIn?.web_name || '?'}
                  </span>
                  <span className="text-fpl-muted shrink-0">&larr;</span>
                  <span className="text-fpl-pink truncate">
                    {playerOut?.web_name || '?'}
                  </span>
                </div>
              </div>
            );
          }) : (
            <p className="text-sm text-fpl-muted py-4 text-center">Ingen transfers funnet</p>
          )}
        </div>
      </div>
    </Card>
  );
}
