export default function PolicyLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="section section-y max-w-2xl">
      <h1 className="mb-8 text-h1">{title}</h1>
      <div className="space-y-4 text-body text-charcoal-muted [&_h2]:mt-8 [&_h2]:mb-2 [&_h2]:text-h4 [&_h2]:text-charcoal [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1">
        {children}
      </div>
    </div>
  );
}
