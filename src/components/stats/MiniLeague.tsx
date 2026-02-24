'use client';

import Card from '@/components/ui/Card';
import type { Pick } from '@/lib/types';

interface MiniLeagueManager {
  name: string;
  teamId: number;
  currentSquad: number[]; // element IDs of starting 11
}

function calculateSimilarity(a: number[], b: number[]): number {
  const setA = new Set(a);
  const shared = b.filter(id => setA.has(id));
  return shared.length;
}

export default function MiniLeague({ managers }: { managers: MiniLeagueManager[] }) {
  if (managers.length < 2) return null;

  // Calculate all pairwise similarities
  const pairs: { m1: string; m2: string; shared: number }[] = [];
  for (let i = 0; i < managers.length; i++) {
    for (let j = i + 1; j < managers.length; j++) {
      const shared = calculateSimilarity(managers[i].currentSquad, managers[j].currentSquad);
      pairs.push({
        m1: managers[i].name,
        m2: managers[j].name,
        shared,
      });
    }
  }

  const mostSimilar = [...pairs].sort((a, b) => b.shared - a.shared).slice(0, 5);
  const mostDifferent = [...pairs].sort((a, b) => a.shared - b.shared).slice(0, 5);

  // Most template (average shared players)
  const templateScores = managers.map(m => {
    const avgShared = managers
      .filter(other => other.teamId !== m.teamId)
      .reduce((sum, other) => sum + calculateSimilarity(m.currentSquad, other.currentSquad), 0)
      / (managers.length - 1);
    return { name: m.name, avgShared };
  }).sort((a, b) => b.avgShared - a.avgShared);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <h3 className="mb-3 text-sm font-bold text-fpl-muted uppercase tracking-wider">Mest like lag</h3>
        <div className="space-y-2">
          {mostSimilar.map((p, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="truncate flex-1">
                {p.m1.split(' ')[0]} &amp; {p.m2.split(' ')[0]}
              </span>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 11 }).map((_, j) => (
                    <div
                      key={j}
                      className={`h-2 w-2 rounded-full ${j < p.shared ? 'bg-fpl-green' : 'bg-fpl-border'}`}
                    />
                  ))}
                </div>
                <span className="font-bold text-fpl-green">{p.shared}/11</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 text-sm font-bold text-fpl-muted uppercase tracking-wider">Mest unike lag</h3>
        <div className="space-y-2">
          {mostDifferent.map((p, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="truncate flex-1">
                {p.m1.split(' ')[0]} &amp; {p.m2.split(' ')[0]}
              </span>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 11 }).map((_, j) => (
                    <div
                      key={j}
                      className={`h-2 w-2 rounded-full ${j < p.shared ? 'bg-fpl-pink' : 'bg-fpl-border'}`}
                    />
                  ))}
                </div>
                <span className="font-bold text-fpl-pink">{p.shared}/11</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="sm:col-span-2">
        <h3 className="mb-3 text-sm font-bold text-fpl-muted uppercase tracking-wider">Template-score</h3>
        <p className="text-xs text-fpl-muted mb-3">Gjennomsnittlig antall felles spillere med resten av ligaen</p>
        <div className="space-y-2">
          {templateScores.map((s, i) => (
            <div key={s.name} className="flex items-center gap-3 text-sm">
              <span className="w-5 text-right text-fpl-muted">{i + 1}.</span>
              <span className="flex-1 truncate">{s.name}</span>
              <div className="w-24 h-2 rounded-full bg-fpl-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-fpl-cyan"
                  style={{ width: `${(s.avgShared / 11) * 100}%` }}
                />
              </div>
              <span className="font-bold text-fpl-cyan w-10 text-right">{s.avgShared.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
