import { getLeagueStandings, getBootstrapData } from '@/lib/fpl-api';
import { FPL_LEAGUE_ID } from '@/lib/config';
import LeagueTable from '@/components/league/LeagueTable';

export default async function HomePage() {
  const [standings, bootstrap] = await Promise.all([
    getLeagueStandings(FPL_LEAGUE_ID),
    getBootstrapData(),
  ]);

  const currentEvent = bootstrap.events.find(e => e.is_current)
    || bootstrap.events.filter(e => e.finished).pop();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{standings.league.name}</h1>
          <p className="text-sm text-fpl-muted">
            {currentEvent ? `Gameweek ${currentEvent.id}` : 'Sesong ikke startet'}
            {currentEvent && ` • Snitt: ${currentEvent.average_entry_score} poeng`}
          </p>
        </div>
        {currentEvent && (
          <div className="flex gap-3">
            <div className="rounded-lg border border-fpl-border bg-fpl-surface px-3 py-2 text-center">
              <div className="text-xs text-fpl-muted">Høyeste</div>
              <div className="text-lg font-bold text-fpl-green">{currentEvent.highest_score}</div>
            </div>
            <div className="rounded-lg border border-fpl-border bg-fpl-surface px-3 py-2 text-center">
              <div className="text-xs text-fpl-muted">Snitt</div>
              <div className="text-lg font-bold text-fpl-cyan">{currentEvent.average_entry_score}</div>
            </div>
          </div>
        )}
      </div>

      <LeagueTable entries={standings.standings.results} />
    </div>
  );
}
