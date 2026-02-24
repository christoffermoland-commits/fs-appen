import { getLeagueStandings, getEntryHistory, getBootstrapData, getGameweekPicks, getTransfers, getCurrentGameweek } from '@/lib/fpl-api';
import { FPL_LEAGUE_ID } from '@/lib/config';
import StatsClient from '@/components/stats/StatsClient';
import Link from 'next/link';
import type { Player, Pick } from '@/lib/types';

export default async function StatsPage() {
  const [standings, bootstrap, currentGw] = await Promise.all([
    getLeagueStandings(FPL_LEAGUE_ID),
    getBootstrapData(),
    getCurrentGameweek(),
  ]);

  const entries = standings.standings.results;

  // Build player map
  const playerMap: Record<number, Player> = {};
  bootstrap.elements.forEach(p => { playerMap[p.id] = p; });

  // Fetch history and transfers for all managers in parallel
  const [historyResults, transferResults] = await Promise.all([
    Promise.allSettled(entries.map(e => getEntryHistory(e.entry))),
    Promise.allSettled(entries.map(e => getTransfers(e.entry))),
  ]);

  // Fetch all GW picks for all managers (for captain table, H2H, mini-league)
  const gwPicksResults = await Promise.allSettled(
    entries.flatMap(e =>
      Array.from({ length: currentGw }, (_, i) => i + 1).map(gw =>
        getGameweekPicks(e.entry, gw).then(result => ({
          teamId: e.entry,
          gw,
          picks: result.picks,
        }))
      )
    )
  );

  // Group picks by manager
  const picksByManager: Record<number, { gw: number; picks: Pick[] }[]> = {};
  gwPicksResults.forEach(result => {
    if (result.status === 'fulfilled') {
      const { teamId, gw, picks } = result.value;
      if (!picksByManager[teamId]) picksByManager[teamId] = [];
      picksByManager[teamId].push({ gw, picks });
    }
  });

  // Build manager data with all fields
  const managers = entries
    .map((entry, i) => {
      const histResult = historyResults[i];
      const transferResult = transferResults[i];
      if (histResult.status !== 'fulfilled') return null;

      const gwPicks = (picksByManager[entry.entry] || []).sort((a, b) => a.gw - b.gw);
      const latestPicks = gwPicks.find(p => p.gw === currentGw);
      const currentSquad = latestPicks
        ? latestPicks.picks.filter(p => p.position <= 11).map(p => p.element)
        : [];

      return {
        name: entry.player_name,
        teamId: entry.entry,
        history: histResult.value.current,
        chips: histResult.value.chips,
        transfers: transferResult.status === 'fulfilled' ? transferResult.value : [],
        gwPicks,
        currentSquad,
      };
    })
    .filter((m): m is NonNullable<typeof m> => m !== null);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/" className="text-sm text-fpl-muted hover:text-fpl-green transition-colors">
          &larr; Tilbake til ligatabell
        </Link>
        <h1 className="text-2xl font-bold mt-1">Statistikk</h1>
        <p className="text-sm text-fpl-muted">
          {standings.league.name} • {entries.length} managere
        </p>
      </div>

      <StatsClient
        managers={managers}
        playerMap={playerMap}
        currentGw={currentGw}
      />
    </div>
  );
}
