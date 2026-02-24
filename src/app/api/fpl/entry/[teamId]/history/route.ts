import { NextRequest, NextResponse } from 'next/server';
import { FPL_API_BASE } from '@/lib/config';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const { teamId } = await params;
  const res = await fetch(`${FPL_API_BASE}/entry/${teamId}/history/`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}
