import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { fetchDashboardStats } from '@/lib/inventory/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const denied = requireAdmin();
  if (denied) return denied;
  try {
    const stats = await fetchDashboardStats();
    return NextResponse.json(stats);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
