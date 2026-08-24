import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 503 });
  }

  const { data, error } = await supabase.from('products').select('id, images');
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const images = Object.fromEntries((data ?? []).map((row) => [row.id, row.images ?? []]));
  return NextResponse.json({ images });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, images } = body;

  if (typeof id !== 'string' || !id || !Array.isArray(images)) {
    return NextResponse.json({ error: 'id and images[] are required' }, { status: 400 });
  }

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 503 });
  }

  const { error } = await supabase
    .from('products')
    .update({ images, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
