import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { GameweekHistory } from '@/lib/types';

export default function ManagerHistory({
  history,
  currentGw,
  managerId,
}: {
  history: GameweekHistory[];
  currentGw: number;
  managerId: string;
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold">Gameweek-historikk</h2>
      <div className="overflow-x-auto rounded-xl border border-fpl-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-fpl-border bg-fpl-dark">
              <th className="px-3 py-2 text-left text-fpl-muted">GW</th>
              <th className="px-3 py-2 text-right text-fpl-muted">Poeng</th>
              <th className="px-3 py-2 text-right text-fpl-muted">Totalt</th>
              <th className="hidden px-3 py-2 text-right text-fpl-muted sm:table-cell">Rank</th>
              <th className="hidden px-3 py-2 text-right text-fpl-muted sm:table-cell">Benk</th>
              <th className="hidden px-3 py-2 text-right text-fpl-muted md:table-cell">Transfers</th>
              <th className="hidden px-3 py-2 text-right text-fpl-muted md:table-cell">Kostnad</th>
            </tr>
          </thead>
          <tbody>
            {[...history].reverse().map((gw) => (
              <tr
                key={gw.event}
                className={cn(
                  'border-b border-fpl-border/50 transition-colors hover:bg-fpl-surface-light',
                  gw.event === currentGw && 'bg-fpl-purple/10'
                )}
              >
                <td className="px-3 py-2">
                  <Link
                    href={`/gameweek/${gw.event}`}
                    className="font-medium text-fpl-cyan hover:underline"
                  >
                    GW{gw.event}
                  </Link>
                </td>
                <td className={cn(
                  'px-3 py-2 text-right font-semibold',
                  gw.points >= 60 && 'text-fpl-green',
                  gw.points < 40 && 'text-fpl-pink',
                )}>
                  {gw.points}
                </td>
                <td className="px-3 py-2 text-right font-bold">{gw.total_points}</td>
                <td className="hidden px-3 py-2 text-right text-fpl-muted sm:table-cell">
                  {gw.overall_rank.toLocaleString('nb-NO')}
                </td>
                <td className="hidden px-3 py-2 text-right sm:table-cell">
                  {gw.points_on_bench > 0 ? (
                    <span className="text-fpl-pink">{gw.points_on_bench}</span>
                  ) : (
                    <span className="text-fpl-muted">0</span>
                  )}
                </td>
                <td className="hidden px-3 py-2 text-right text-fpl-muted md:table-cell">
                  {gw.event_transfers}
                </td>
                <td className="hidden px-3 py-2 text-right md:table-cell">
                  {gw.event_transfers_cost > 0 ? (
                    <span className="text-fpl-pink">-{gw.event_transfers_cost}</span>
                  ) : (
                    <span className="text-fpl-muted">0</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
