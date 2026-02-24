import { getManagerEntry, getEntryHistory, getBootstrapData } from '@/lib/fpl-api';
import ManagerCard from '@/components/manager/ManagerCard';
import ManagerHistory from '@/components/manager/ManagerHistory';
import ManagerCharts from '@/components/manager/ManagerCharts';
import Link from 'next/link';

export default async function ManagerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [manager, history, bootstrap] = await Promise.all([
    getManagerEntry(id),
    getEntryHistory(id),
    getBootstrapData(),
  ]);

  const currentGw = bootstrap.events.find(e => e.is_current)?.id
    || bootstrap.events.filter(e => e.finished).pop()?.id
    || 1;

  return (
    <div className="space-y-6">
      <Link href="/" className="text-sm text-fpl-muted hover:text-fpl-green transition-colors">
        &larr; Tilbake til ligatabell
      </Link>

      <ManagerCard manager={manager} />

      <div className="grid gap-6 lg:grid-cols-2">
        <ManagerCharts
          history={history.current}
          managerName={`${manager.player_first_name} ${manager.player_last_name}`}
        />

        <div className="space-y-4">
          <h2 className="text-lg font-bold">Chips brukt</h2>
          {history.chips.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {history.chips.map((chip) => (
                <div
                  key={chip.event}
                  className="rounded-lg border border-fpl-border bg-fpl-surface px-3 py-2"
                >
                  <div className="text-xs text-fpl-muted">GW {chip.event}</div>
                  <div className="font-medium text-fpl-cyan">{chip.name}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-fpl-muted">Ingen chips brukt enda</p>
          )}

          {history.past.length > 0 && (
            <>
              <h2 className="text-lg font-bold mt-6">Tidligere sesonger</h2>
              <div className="overflow-x-auto rounded-lg border border-fpl-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-fpl-border bg-fpl-dark">
                      <th className="px-3 py-2 text-left text-fpl-muted">Sesong</th>
                      <th className="px-3 py-2 text-right text-fpl-muted">Poeng</th>
                      <th className="px-3 py-2 text-right text-fpl-muted">Rank</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.past.map((s) => (
                      <tr key={s.season_name} className="border-b border-fpl-border/50">
                        <td className="px-3 py-2">{s.season_name}</td>
                        <td className="px-3 py-2 text-right font-medium">{s.total_points}</td>
                        <td className="px-3 py-2 text-right text-fpl-muted">
                          {s.rank.toLocaleString('nb-NO')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      <ManagerHistory history={history.current} currentGw={currentGw} managerId={id} />
    </div>
  );
}
