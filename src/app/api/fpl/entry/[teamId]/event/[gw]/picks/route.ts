import { NextRequest, NextResponse } from 'next/server';
import { FPL_API_BASE } from '@/lib/config';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ teamId: string; gw: string }> }
) {
  const { teamId, gw } = await params;
  const res = await fetch(`${FPL_API_BASE}/entry/${teamId}/event/${gw}/picks/`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch picks' }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' },
  });
}
