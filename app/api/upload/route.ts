import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};
// Fixed allow-list, not user input, to keep the upload path from ever escaping the media bucket.
const ALLOWED_FOLDERS = new Set(['products', 'media']);
const BUCKET = 'media';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file');
  const folderField = formData.get('folder');
  const folder = typeof folderField === 'string' && ALLOWED_FOLDERS.has(folderField) ? folderField : 'products';

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return NextResponse.json({ error: 'Unsupported file type. Use JPEG, PNG, WebP, or GIF.' }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: 'File too large. Max 5MB.' }, { status: 400 });
  }

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 503 });
  }

  const storagePath = `${folder}/${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  const url = publicUrlData.publicUrl;

  const { error: insertError } = await supabase.from('media').insert({
    url,
    storage_path: storagePath,
    folder,
    content_type: file.type,
    size_bytes: file.size,
  });

  if (insertError) {
    // The file is already uploaded and servable; failing to log it to the
    // `media` table shouldn't block the caller from getting a usable URL.
    console.error('Failed to record upload in media table:', insertError.message);
  }

  return NextResponse.json({ url });
}

export async function GET(request: NextRequest) {
  const folder = request.nextUrl.searchParams.get('folder');

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 503 });
  }

  let query = supabase.from('media').select('*').order('created_at', { ascending: false });
  if (folder && ALLOWED_FOLDERS.has(folder)) {
    query = query.eq('folder', folder);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ media: data });
}
