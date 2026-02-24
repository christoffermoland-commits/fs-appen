export function formatNumber(num: number): string {
  return num.toLocaleString('nb-NO');
}

export function getRankMovement(current: number, last: number): 'up' | 'down' | 'same' {
  if (last === 0) return 'same'; // new entry
  if (current < last) return 'up';
  if (current > last) return 'down';
  return 'same';
}

export function getOrdinal(n: number): string {
  return `${n}.`;
}

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export const MANAGER_COLORS = [
  '#00FF87', '#04F5FF', '#FF2882', '#FFD700',
  '#a78bfa', '#fb923c', '#34d399', '#f472b6',
  '#60a5fa', '#fbbf24', '#c084fc', '#4ade80',
  '#f87171', '#38bdf8', '#a3e635', '#e879f9',
];
