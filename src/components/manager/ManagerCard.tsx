import Card from '@/components/ui/Card';
import type { ManagerEntry } from '@/lib/types';
import { formatNumber } from '@/lib/utils';

export default function ManagerCard({ manager }: { manager: ManagerEntry }) {
  return (
    <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold">
          {manager.player_first_name} {manager.player_last_name}
        </h1>
        <p className="text-fpl-muted">{manager.name}</p>
      </div>
      <div className="flex gap-4">
        <div className="text-center">
          <div className="text-xs text-fpl-muted">Poeng</div>
          <div className="text-2xl font-bold text-fpl-green">{formatNumber(manager.summary_overall_points)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-fpl-muted">Rank</div>
          <div className="text-2xl font-bold text-fpl-cyan">{formatNumber(manager.summary_overall_rank)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-fpl-muted">GW poeng</div>
          <div className="text-2xl font-bold">{manager.summary_event_points}</div>
        </div>
      </div>
    </Card>
  );
}
