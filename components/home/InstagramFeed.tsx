import Image from 'next/image';
import { Instagram } from 'lucide-react';
import ProductImage from '../ProductImage';

// `image` is optional — reel covers can't be fetched automatically (Instagram
// only serves real video frames to an active, focused tab), so those stay on
// the placeholder graphic until a real cover photo is supplied for that slot.
const POSTS: { href: string; image?: string }[] = [
  { href: 'https://www.instagram.com/reel/DcOQYGVJjym/' },
  { href: 'https://www.instagram.com/reel/DbsznrdqxE_/' },
  { href: 'https://www.instagram.com/reel/DbVCTA9pI0C/' },
  { href: 'https://www.instagram.com/reel/DbFG5uYpVff/' },
  {
    href: 'https://www.instagram.com/p/Da5JITwCdK7/',
    image:
      'https://ptfbtagybiglwyzwocrj.supabase.co/storage/v1/object/public/media/media/instagram-Da5JITwCdK7.png',
  },
  { href: 'https://www.instagram.com/reel/DamHFejJYAF/' },
];

export default function InstagramFeed() {
  return (
    <section className="section section-y">
      <div className="mb-6 text-center">
        <p className="eyebrow mb-2">Follow Along</p>
        <h2 className="text-h2">@nayra_luxe on Instagram</h2>
      </div>
      <div className="grid grid-cols-3 gap-2 md:grid-cols-6 md:gap-3">
        {POSTS.map(({ href, image }, i) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="group relative block overflow-hidden rounded-sm"
          >
            {image ? (
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={image}
                  alt="Nayra Luxe on Instagram"
                  fill
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                />
              </div>
            ) : (
              <ProductImage seed={i * 5} name="Nayra Luxe" className="transition-transform duration-200 group-hover:scale-105" />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-charcoal/0 transition-colors group-hover:bg-charcoal/30">
              <Instagram className="h-6 w-6 text-white opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
