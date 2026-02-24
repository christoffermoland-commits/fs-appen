import { NextRequest, NextResponse } from 'next/server';
import { FPL_API_BASE } from '@/lib/config';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const res = await fetch(`${FPL_API_BASE}/event/${eventId}/live/`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch live data' }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
  });
}
