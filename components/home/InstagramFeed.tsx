const POSTS = [
  'https://www.instagram.com/reel/DcOQYGVJjym/',
  'https://www.instagram.com/reel/DbsznrdqxE_/',
  'https://www.instagram.com/reel/DbVCTA9pI0C/',
  'https://www.instagram.com/reel/DbFG5uYpVff/',
  'https://www.instagram.com/p/Da5JITwCdK7/',
  'https://www.instagram.com/reel/DamHFejJYAF/',
];

export default function InstagramFeed() {
  return (
    <section className="section section-y">
      <div className="mb-6 text-center">
        <p className="eyebrow mb-2">Follow Along</p>
        <h2 className="text-h2">@nayra_luxe on Instagram</h2>
      </div>
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
        {POSTS.map((href) => (
          <div
            key={href}
            className="h-[560px] w-[280px] flex-none snap-start overflow-hidden rounded-md border border-border bg-ivory"
          >
            <iframe
              src={`${href}embed/`}
              className="h-full w-full"
              style={{ border: 0, overflow: 'hidden' }}
              allow="encrypted-media"
              title="Nayra Luxe on Instagram"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
