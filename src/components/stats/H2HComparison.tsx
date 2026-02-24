'use client';

import { useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import { cn, MANAGER_COLORS } from '@/lib/utils';
import type { Pick, Player } from '@/lib/types';

interface H2HManager {
  name: string;
  teamId: number;
  gwPicks: { gw: number; picks: Pick[] }[];
}

export default function H2HComparison({
  managers,
  playerMap,
  currentGw,
}: {
  managers: H2HManager[];
  playerMap: Record<number, Player>;
  currentGw: number;
}) {
  const [m1, setM1] = useState(managers[0]?.teamId || 0);
  const [m2, setM2] = useState(managers[1]?.teamId || 0);
  const [gw, setGw] = useState(currentGw);

  const manager1 = managers.find(m => m.teamId === m1);
  const manager2 = managers.find(m => m.teamId === m2);

  const comparison = useMemo(() => {
    if (!manager1 || !manager2) return null;
    const picks1 = manager1.gwPicks.find(p => p.gw === gw)?.picks || [];
    const picks2 = manager2.gwPicks.find(p => p.gw === gw)?.picks || [];

    const squad1 = new Set(picks1.filter(p => p.position <= 11).map(p => p.element));
    const squad2 = new Set(picks2.filter(p => p.position <= 11).map(p => p.element));

    const shared = [...squad1].filter(id => squad2.has(id));
    const only1 = [...squad1].filter(id => !squad2.has(id));
    const only2 = [...squad2].filter(id => !squad1.has(id));

    const cap1 = picks1.find(p => p.is_captain);
    const cap2 = picks2.find(p => p.is_captain);

    return { picks1, picks2, shared, only1, only2, cap1, cap2 };
  }, [manager1, manager2, gw]);

  return (
    <Card>
      <h3 className="mb-4 text-sm font-bold text-fpl-muted uppercase tracking-wider">Head-to-Head</h3>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="text-xs text-fpl-muted">Manager 1</label>
          <select
            value={m1}
            onChange={e => setM1(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-fpl-border bg-fpl-dark px-3 py-2 text-sm focus:border-fpl-green focus:outline-none"
          >
            {managers.map(m => <option key={m.teamId} value={m.teamId}>{m.name}</option>)}
          </select>
        </div>
        <span className="text-center text-fpl-muted font-bold text-lg hidden sm:block pb-1">vs</span>
        <div className="flex-1">
          <label className="text-xs text-fpl-muted">Manager 2</label>
          <select
            value={m2}
            onChange={e => setM2(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-fpl-border bg-fpl-dark px-3 py-2 text-sm focus:border-fpl-green focus:outline-none"
          >
            {managers.map(m => <option key={m.teamId} value={m.teamId}>{m.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-fpl-muted">GW</label>
          <select
            value={gw}
            onChange={e => setGw(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-fpl-border bg-fpl-dark px-3 py-2 text-sm focus:border-fpl-green focus:outline-none"
          >
            {Array.from({ length: currentGw }, (_, i) => currentGw - i).map(g => (
              <option key={g} value={g}>GW{g}</option>
            ))}
          </select>
        </div>
      </div>

      {comparison && manager1 && manager2 && (
        <div className="mt-4 space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-fpl-dark p-3">
              <div className="text-2xl font-bold text-fpl-green">{comparison.shared.length}</div>
              <div className="text-xs text-fpl-muted">Felles</div>
            </div>
            <div className="rounded-lg bg-fpl-dark p-3">
              <div className="text-2xl font-bold text-fpl-cyan">{comparison.only1.length}</div>
              <div className="text-xs text-fpl-muted truncate">Bare {manager1.name.split(' ')[0]}</div>
            </div>
            <div className="rounded-lg bg-fpl-dark p-3">
              <div className="text-2xl font-bold text-fpl-pink">{comparison.only2.length}</div>
              <div className="text-xs text-fpl-muted truncate">Bare {manager2.name.split(' ')[0]}</div>
            </div>
          </div>

          {/* Captain comparison */}
          <div className="flex items-center justify-around rounded-lg bg-fpl-dark p-3">
            <div className="text-center">
              <div className="text-xs text-fpl-muted">{manager1.name.split(' ')[0]}</div>
              <div className="text-sm font-bold text-fpl-gold">
                {comparison.cap1 ? playerMap[comparison.cap1.element]?.web_name || '?' : '-'}
              </div>
            </div>
            <span className="text-xs text-fpl-muted">Kaptein</span>
            <div className="text-center">
              <div className="text-xs text-fpl-muted">{manager2.name.split(' ')[0]}</div>
              <div className="text-sm font-bold text-fpl-gold">
                {comparison.cap2 ? playerMap[comparison.cap2.element]?.web_name || '?' : '-'}
              </div>
            </div>
          </div>

          {/* Player lists */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <div className="mb-1 text-xs font-medium text-fpl-green">Felles spillere</div>
              {comparison.shared.map(id => (
                <div key={id} className="rounded px-2 py-1 text-xs bg-fpl-green/10 text-fpl-green mb-1">
                  {playerMap[id]?.web_name || id}
                </div>
              ))}
            </div>
            <div>
              <div className="mb-1 text-xs font-medium text-fpl-cyan">Bare {manager1.name.split(' ')[0]}</div>
              {comparison.only1.map(id => (
                <div key={id} className="rounded px-2 py-1 text-xs bg-fpl-cyan/10 text-fpl-cyan mb-1">
                  {playerMap[id]?.web_name || id}
                </div>
              ))}
            </div>
            <div>
              <div className="mb-1 text-xs font-medium text-fpl-pink">Bare {manager2.name.split(' ')[0]}</div>
              {comparison.only2.map(id => (
                <div key={id} className="rounded px-2 py-1 text-xs bg-fpl-pink/10 text-fpl-pink mb-1">
                  {playerMap[id]?.web_name || id}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
