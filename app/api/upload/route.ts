import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};
// Fixed allow-list, not user input, to keep the upload path from ever escaping public/uploads.
const ALLOWED_FOLDERS = new Set(['products', 'media']);

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

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
  await mkdir(uploadDir, { recursive: true });

  const filename = `${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  return NextResponse.json({ url: `/uploads/${folder}/${filename}` });
}
