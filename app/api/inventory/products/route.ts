import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { createProductWithBatch, fetchProductsWithStock } from '@/lib/inventory/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const denied = requireAdmin();
  if (denied) return denied;
  try {
    const products = await fetchProductsWithStock();
    return NextResponse.json({ products });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin();
  if (denied) return denied;
  try {
    const input = await request.json();
    const productId = await createProductWithBatch(input);
    return NextResponse.json({ productId });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
