export async function uploadImage(file: File, folder: 'products' | 'media' = 'products'): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);
  const res = await fetch('/api/upload', { method: 'POST', body: formData });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Upload failed');
  }
  const { url } = await res.json();
  return url;
}
