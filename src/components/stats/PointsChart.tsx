'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { MANAGER_COLORS } from '@/lib/utils';

interface ManagerData {
  name: string;
  teamId: number;
  history: { event: number; points: number; total_points: number }[];
}

export default function PointsChart({
  managers,
  mode = 'cumulative',
}: {
  managers: ManagerData[];
  mode?: 'cumulative' | 'weekly';
}) {
  if (managers.length === 0) return null;

  const maxGw = Math.max(...managers.flatMap(m => m.history.map(h => h.event)));
  const data = Array.from({ length: maxGw }, (_, i) => {
    const gw = i + 1;
    const point: Record<string, number> = { gw };
    managers.forEach((m) => {
      const gwData = m.history.find(h => h.event === gw);
      if (gwData) {
        point[m.name] = mode === 'cumulative' ? gwData.total_points : gwData.points;
      }
    });
    return point;
  });

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d1650" />
          <XAxis
            dataKey="gw"
            stroke="#9ca3af"
            fontSize={12}
            tickFormatter={(v) => `GW${v}`}
          />
          <YAxis stroke="#9ca3af" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#16082a',
              border: '1px solid #2d1650',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            labelFormatter={(v) => `Gameweek ${v}`}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          {managers.map((m, i) => (
            <Line
              key={m.teamId}
              type="monotone"
              dataKey={m.name}
              stroke={MANAGER_COLORS[i % MANAGER_COLORS.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
