'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

const POSTS = [
  'https://www.instagram.com/reel/DcOQYGVJjym/',
  'https://www.instagram.com/reel/DbsznrdqxE_/',
  'https://www.instagram.com/reel/DbVCTA9pI0C/',
  'https://www.instagram.com/reel/DbFG5uYpVff/',
  'https://www.instagram.com/p/Da5JITwCdK7/',
  'https://www.instagram.com/reel/DamHFejJYAF/',
];

function InstagramEmbed({ href }: { href: string }) {
  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={href}
      data-instgrm-version="14"
      style={{
        background: '#FFF',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)',
        margin: '0 auto',
        maxWidth: 400,
        minWidth: 270,
        width: '100%',
      }}
    />
  );
}

export default function InstagramFeed() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Covers client-side navigation back to this page, where embed.js is
    // already loaded but hasn't seen these fresh blockquote elements yet.
    if (window.instgrm) window.instgrm.Embeds.process();
  }, []);

  return (
    <section className="section section-y">
      <div className="mb-6 text-center">
        <p className="eyebrow mb-2">Follow Along</p>
        <h2 className="text-h2">@nayra_luxe on Instagram</h2>
      </div>
      <div ref={containerRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {POSTS.map((href) => (
          <InstagramEmbed key={href} href={href} />
        ))}
      </div>
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => window.instgrm?.Embeds.process()}
      />
    </section>
  );
}
