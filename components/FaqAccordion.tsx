'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FaqAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border border-y border-border">
      {faqs.map((faq, i) => (
        <div key={faq.q}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex w-full items-center justify-between py-4 text-left text-body-lg font-medium text-charcoal"
          >
            {faq.q}
            <ChevronDown className={cn('h-5 w-5 flex-none transition-transform', openIndex === i && 'rotate-180 text-gold-primary')} />
          </button>
          {openIndex === i && <p className="pb-4 text-body text-charcoal-muted">{faq.a}</p>}
        </div>
      ))}
    </div>
  );
}
