import {
  getLeagueStandings,
  getBootstrapData,
  getGameweekPicks,
  getLiveEvent,
} from '@/lib/fpl-api';
import { FPL_LEAGUE_ID } from '@/lib/config';
import GameweekPicker from '@/components/gameweek/GameweekPicker';
import SquadView from '@/components/gameweek/SquadView';
import Link from 'next/link';
import type { Player, FPLTeam } from '@/lib/types';

export default async function GameweekPage({
  params,
}: {
  params: Promise<{ gw: string }>;
}) {
  const { gw: gwStr } = await params;
  const gw = parseInt(gwStr, 10);

  const [standings, bootstrap] = await Promise.all([
    getLeagueStandings(FPL_LEAGUE_ID),
    getBootstrapData(),
  ]);

  const maxGw = bootstrap.events.filter(e => e.finished).length
    || bootstrap.events.find(e => e.is_current)?.id
    || 1;

  const event = bootstrap.events.find(e => e.id === gw);

  // Build lookup maps
  const playerMap = new Map<number, Player>();
  bootstrap.elements.forEach(p => playerMap.set(p.id, p));

  const teamMap = new Map<number, string>();
  bootstrap.teams.forEach((t: FPLTeam) => teamMap.set(t.id, t.short_name));

  // Fetch picks and live data
  const entries = standings.standings.results;
  const [picksResults, liveData] = await Promise.all([
    Promise.allSettled(entries.map(e => getGameweekPicks(e.entry, gw))),
    getLiveEvent(gw),
  ]);

  // Build live points map
  const livePoints = new Map<number, number>();
  liveData.elements.forEach(el => livePoints.set(el.id, el.stats.total_points));

  // Pair entries with their picks
  const managersWithPicks = entries.map((entry, i) => {
    const result = picksResults[i];
    const picks = result.status === 'fulfilled' ? result.value : null;
    const totalPoints = picks
      ? picks.picks.reduce((sum, p) => {
          if (p.position > 11 && picks.active_chip !== 'bboost') return sum;
          const pts = livePoints.get(p.element) || 0;
          return sum + pts * p.multiplier;
        }, 0)
      : entry.event_total;

    return { entry, picks, totalPoints };
  });

  managersWithPicks.sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/" className="text-sm text-fpl-muted hover:text-fpl-green transition-colors">
            &larr; Tilbake
          </Link>
          <h1 className="text-2xl font-bold mt-1">Gameweek {gw}</h1>
          {event && (
            <p className="text-sm text-fpl-muted">
              Snitt: {event.average_entry_score} • Høyeste: {event.highest_score}
            </p>
          )}
        </div>
        <GameweekPicker currentGw={gw} maxGw={maxGw} />
      </div>

      {/* Summary table */}
      <div className="overflow-x-auto rounded-xl border border-fpl-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-fpl-border bg-fpl-dark">
              <th className="px-3 py-2 text-left text-fpl-muted w-8">#</th>
              <th className="px-3 py-2 text-left text-fpl-muted">Manager</th>
              <th className="px-3 py-2 text-right text-fpl-muted">Poeng</th>
              <th className="hidden px-3 py-2 text-center text-fpl-muted sm:table-cell">Kaptein</th>
              <th className="hidden px-3 py-2 text-center text-fpl-muted sm:table-cell">Chip</th>
            </tr>
          </thead>
          <tbody>
            {managersWithPicks.map((m, i) => {
              const captain = m.picks?.picks.find(p => p.is_captain);
              const captainPlayer = captain ? playerMap.get(captain.element) : undefined;
              const captainPts = captain ? (livePoints.get(captain.element) || 0) * captain.multiplier : 0;

              return (
                <tr key={m.entry.entry} className="border-b border-fpl-border/50 hover:bg-fpl-surface-light transition-colors">
                  <td className="px-3 py-2 text-fpl-muted">{i + 1}</td>
                  <td className="px-3 py-2">
                    <Link href={`/manager/${m.entry.entry}`} className="font-medium hover:text-fpl-green transition-colors">
                      {m.entry.player_name}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-right font-bold text-fpl-green">{m.totalPoints}</td>
                  <td className="hidden px-3 py-2 text-center sm:table-cell">
                    {captainPlayer && (
                      <span className="text-fpl-muted">
                        {captainPlayer.web_name}{' '}
                        <span className="font-bold text-fpl-gold">({captainPts})</span>
                      </span>
                    )}
                  </td>
                  <td className="hidden px-3 py-2 text-center sm:table-cell">
                    {m.picks?.active_chip && (
                      <span className="rounded-full bg-fpl-cyan/20 px-2 py-0.5 text-xs text-fpl-cyan">
                        {m.picks.active_chip}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Squad views */}
      <h2 className="text-lg font-bold">Lagoppstillinger</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {managersWithPicks.map((m) =>
          m.picks ? (
            <div key={m.entry.entry} className="space-y-2">
              <div className="flex items-center justify-between">
                <Link href={`/manager/${m.entry.entry}`} className="font-medium text-sm hover:text-fpl-green transition-colors">
                  {m.entry.player_name}
                </Link>
                <span className="text-sm font-bold text-fpl-green">{m.totalPoints} pts</span>
              </div>
              <SquadView
                picks={m.picks.picks}
                playerMap={playerMap}
                livePoints={livePoints}
                activeChip={m.picks.active_chip}
                teamMap={teamMap}
              />
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
