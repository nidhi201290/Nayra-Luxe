import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 503 });
  }

  const { data, error } = await supabase.from('site_media').select('key, url');
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const images = Object.fromEntries((data ?? []).map((row) => [row.key, row.url]));
  return NextResponse.json({ images });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { key, url } = body;

  if (typeof key !== 'string' || typeof url !== 'string' || !key || !url) {
    return NextResponse.json({ error: 'key and url are required' }, { status: 400 });
  }

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 503 });
  }

  const { error } = await supabase
    .from('site_media')
    .upsert({ key, url, updated_at: new Date().toISOString() }, { onConflict: 'key' });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key');
  if (!key) {
    return NextResponse.json({ error: 'key is required' }, { status: 400 });
  }

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 503 });
  }

  const { error } = await supabase.from('site_media').delete().eq('key', key);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
