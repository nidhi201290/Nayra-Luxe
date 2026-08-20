'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ImagePlus, Trash2 } from 'lucide-react';
import { MEDIA_SLOTS } from '@/lib/media-slots';
import { useSiteMediaStore } from '@/lib/admin-store';
import { uploadImage } from '@/lib/upload';
import { cn } from '@/lib/utils';

export default function AdminMediaPage() {
  const images = useSiteMediaStore((s) => s.images);
  const setImage = useSiteMediaStore((s) => s.setImage);
  const removeImage = useSiteMediaStore((s) => s.removeImage);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [error, setError] = useState('');

  const groups = MEDIA_SLOTS.reduce<Record<string, typeof MEDIA_SLOTS>>((acc, slot) => {
    (acc[slot.group] ||= []).push(slot);
    return acc;
  }, {});

  async function handleUpload(key: string, file: File) {
    setUploadingKey(key);
    setError('');
    try {
      const url = await uploadImage(file, 'media');
      setImage(key, url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploadingKey(null);
    }
  }

  return (
    <div>
      <h1 className="mb-2 text-h1">Media</h1>
      <p className="mb-6 text-body text-charcoal-muted">
        Upload real photography for the homepage banner, category tiles, collection banners, and the About page. Any
        slot left empty keeps its placeholder graphic.
      </p>

      {error && <p className="mb-4 text-caption text-error">{error}</p>}

      <div className="space-y-10">
        {Object.entries(groups).map(([group, slots]) => (
          <section key={group}>
            <h2 className="mb-4 font-body text-h4">{group}</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {slots.map((slot) => (
                <MediaSlotCard
                  key={slot.key}
                  label={slot.label}
                  imageUrl={images[slot.key]}
                  uploading={uploadingKey === slot.key}
                  onUpload={(file) => handleUpload(slot.key, file)}
                  onRemove={() => removeImage(slot.key)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function MediaSlotCard({
  label,
  imageUrl,
  uploading,
  onUpload,
  onRemove,
}: {
  label: string;
  imageUrl?: string;
  uploading: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="overflow-hidden rounded-md border border-border bg-white">
      <div className="relative aspect-[4/3] bg-ivory">
        {imageUrl ? (
          <Image src={imageUrl} alt={label} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-caption text-charcoal-muted">No image set</div>
        )}
      </div>
      <div className="space-y-2 p-3">
        <p className="line-clamp-2 text-caption font-medium text-charcoal">{label}</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
            e.target.value = '';
          }}
        />
        <div className="flex gap-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'flex flex-1 items-center justify-center gap-1 rounded-sm border border-gold-primary py-1.5 text-caption font-medium text-gold-primary transition-colors hover:bg-blush',
              uploading && 'cursor-not-allowed opacity-50'
            )}
          >
            <ImagePlus className="h-3.5 w-3.5" />
            {uploading ? 'Uploading…' : imageUrl ? 'Replace' : 'Upload'}
          </button>
          {imageUrl && (
            <button
              type="button"
              aria-label={`Remove ${label} image`}
              onClick={onRemove}
              className="flex items-center justify-center rounded-sm border border-border px-2 text-charcoal-muted hover:border-error hover:text-error"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
