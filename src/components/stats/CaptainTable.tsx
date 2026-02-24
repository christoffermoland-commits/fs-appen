'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import type { Pick, Player } from '@/lib/types';

interface CaptainData {
  managerName: string;
  teamId: number;
  gwPicks: { gw: number; picks: Pick[] }[];
}

export default function CaptainTable({
  managers,
  playerMap,
  maxGw,
}: {
  managers: CaptainData[];
  playerMap: Record<number, Player>;
  maxGw: number;
}) {
  const [visibleGws, setVisibleGws] = useState(5);
  const gws = Array.from({ length: maxGw }, (_, i) => maxGw - i);
  const displayGws = gws.slice(0, visibleGws);

  return (
    <Card className="overflow-hidden p-0">
      <div className="px-4 pt-4 pb-2">
        <h3 className="text-sm font-bold text-fpl-muted uppercase tracking-wider">Kapteinvalg</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-fpl-border bg-fpl-dark">
              <th className="sticky left-0 z-10 bg-fpl-dark px-3 py-2 text-left text-xs text-fpl-muted">Manager</th>
              {displayGws.map(gw => (
                <th key={gw} className="px-2 py-2 text-center text-xs text-fpl-muted whitespace-nowrap">GW{gw}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {managers.map((m) => (
              <tr key={m.teamId} className="border-b border-fpl-border/50 hover:bg-fpl-surface-light transition-colors">
                <td className="sticky left-0 z-10 bg-fpl-surface px-3 py-2 font-medium whitespace-nowrap">{m.managerName}</td>
                {displayGws.map(gw => {
                  const gwData = m.gwPicks.find(p => p.gw === gw);
                  const captain = gwData?.picks.find(p => p.is_captain);
                  const player = captain ? playerMap[captain.element] : undefined;
                  return (
                    <td key={gw} className="px-2 py-2 text-center whitespace-nowrap">
                      {player ? (
                        <span className="text-xs">{player.web_name}</span>
                      ) : (
                        <span className="text-xs text-fpl-muted">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {visibleGws < maxGw && (
        <div className="px-4 py-2 text-center">
          <button
            onClick={() => setVisibleGws(v => Math.min(v + 10, maxGw))}
            className="text-xs text-fpl-cyan hover:underline"
          >
            Vis flere gameweeks
          </button>
        </div>
      )}
    </Card>
  );
}
