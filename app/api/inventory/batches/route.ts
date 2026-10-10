import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { addBatch } from '@/lib/inventory/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const denied = requireAdmin();
  if (denied) return denied;
  try {
    const input = await request.json();
    await addBatch(input);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
