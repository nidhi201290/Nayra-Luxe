import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { createInvoice, fetchInvoices } from '@/lib/inventory/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const denied = requireAdmin();
  if (denied) return denied;
  try {
    const invoices = await fetchInvoices();
    return NextResponse.json({ invoices });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin();
  if (denied) return denied;
  try {
    const input = await request.json();
    const invoice = await createInvoice(input);
    return NextResponse.json({ invoice });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
