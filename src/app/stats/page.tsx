import { getLeagueStandings, getEntryHistory } from '@/lib/fpl-api';
import { FPL_LEAGUE_ID } from '@/lib/config';
import StatsClient from '@/components/stats/StatsClient';
import Link from 'next/link';

export default async function StatsPage() {
  const standings = await getLeagueStandings(FPL_LEAGUE_ID);
  const entries = standings.standings.results;

  // Fetch history for all managers in parallel
  const historyResults = await Promise.allSettled(
    entries.map(e => getEntryHistory(e.entry))
  );

  const managers = entries
    .map((entry, i) => {
      const result = historyResults[i];
      if (result.status !== 'fulfilled') return null;
      return {
        name: entry.player_name,
        teamId: entry.entry,
        history: result.value.current,
        chips: result.value.chips,
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

      <StatsClient managers={managers} />
    </div>
  );
}
