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

interface ManagerRankData {
  name: string;
  teamId: number;
  history: { event: number; total_points: number }[];
}

export default function RankChart({ managers }: { managers: ManagerRankData[] }) {
  if (managers.length === 0) return null;

  const maxGw = Math.max(...managers.flatMap(m => m.history.map(h => h.event)));

  // For each GW, compute league rank by sorting by total_points
  const data = Array.from({ length: maxGw }, (_, i) => {
    const gw = i + 1;
    const managerPoints = managers
      .map(m => {
        const gwData = m.history.find(h => h.event === gw);
        return { name: m.name, points: gwData?.total_points ?? 0 };
      })
      .sort((a, b) => b.points - a.points);

    const point: Record<string, number> = { gw };
    managerPoints.forEach((mp, idx) => {
      point[mp.name] = idx + 1;
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
          <YAxis
            stroke="#9ca3af"
            fontSize={12}
            reversed
            domain={[1, managers.length]}
            tickCount={managers.length}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#16082a',
              border: '1px solid #2d1650',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            labelFormatter={(v) => `Gameweek ${v}`}
            formatter={(value, name) => [`#${value}`, name]}
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
