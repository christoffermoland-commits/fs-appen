import { cn } from '@/lib/utils';
import type { Pick, Player } from '@/lib/types';
import Badge from '@/components/ui/Badge';

interface SquadViewProps {
  picks: Pick[];
  playerMap: Map<number, Player>;
  livePoints: Map<number, number>;
  activeChip: string | null;
  teamMap: Map<number, string>;
}

const POSITION_NAMES: Record<number, string> = {
  1: 'GK',
  2: 'DEF',
  3: 'MID',
  4: 'FWD',
};

export default function SquadView({
  picks,
  playerMap,
  livePoints,
  activeChip,
  teamMap,
}: SquadViewProps) {
  const starters = picks.filter(p => p.position <= 11);
  const bench = picks.filter(p => p.position > 11);

  // Group starters by position
  const grouped: Record<number, (Pick & { player?: Player; points: number })[]> = {};
  starters.forEach((pick) => {
    const player = playerMap.get(pick.element);
    const posType = player?.element_type || 0;
    if (!grouped[posType]) grouped[posType] = [];
    const pts = livePoints.get(pick.element) || 0;
    grouped[posType].push({ ...pick, player, points: pts * pick.multiplier });
  });

  return (
    <div className="rounded-xl border border-fpl-border bg-fpl-surface p-4">
      {activeChip && (
        <div className="mb-3">
          <Badge variant="gold">{activeChip}</Badge>
        </div>
      )}

      {/* Starting 11 */}
      <div className="space-y-2">
        {[1, 2, 3, 4].map((pos) => (
          <div key={pos} className="flex flex-wrap justify-center gap-2">
            {(grouped[pos] || []).map((pick) => (
              <PlayerTile
                key={pick.element}
                pick={pick}
                player={pick.player}
                points={pick.points}
                teamShort={teamMap.get(pick.player?.team || 0) || ''}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Bench */}
      <div className="mt-3 border-t border-fpl-border pt-3">
        <div className="mb-1 text-center text-xs text-fpl-muted">Benk</div>
        <div className="flex justify-center gap-2">
          {bench.map((pick) => {
            const player = playerMap.get(pick.element);
            const pts = livePoints.get(pick.element) || 0;
            return (
              <PlayerTile
                key={pick.element}
                pick={pick}
                player={player}
                points={pts}
                teamShort={teamMap.get(player?.team || 0) || ''}
                isBench
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PlayerTile({
  pick,
  player,
  points,
  teamShort,
  isBench = false,
}: {
  pick: Pick;
  player?: Player;
  points: number;
  teamShort: string;
  isBench?: boolean;
}) {
  return (
    <div
      className={cn(
        'relative flex w-[70px] flex-col items-center rounded-lg p-1.5 text-center',
        isBench ? 'bg-fpl-dark/50' : 'bg-fpl-dark'
      )}
    >
      {pick.is_captain && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-fpl-gold text-[9px] font-bold text-black">
          C
        </span>
      )}
      {pick.is_vice_captain && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-fpl-silver text-[9px] font-bold text-black">
          V
        </span>
      )}
      <div className="truncate text-[11px] font-medium leading-tight">
        {player?.web_name || '???'}
      </div>
      <div className="text-[9px] text-fpl-muted">{teamShort}</div>
      <div
        className={cn(
          'mt-0.5 rounded px-1.5 py-0.5 text-xs font-bold',
          points >= 8 ? 'bg-fpl-green/20 text-fpl-green' :
          points >= 4 ? 'bg-fpl-surface-light text-foreground' :
          'bg-fpl-pink/10 text-fpl-pink'
        )}
      >
        {points}
      </div>
    </div>
  );
}
