import type { Metadata } from 'next';
import FaqAccordion from '@/components/FaqAccordion';

const FAQS = [
  {
    q: 'How long does shipping take?',
    a: 'Orders are dispatched within 1-2 business days and delivered within 4-6 business days across India via Shiprocket, depending on your pincode.',
  },
  {
    q: 'Will my jewelry tarnish over time?',
    a: 'No — every piece is 18K gold plated over 316L stainless steel, which is anti-tarnish, waterproof and sweatproof. With basic care (see our Care Instructions on each product page), it will keep its shine for years.',
  },
  {
    q: 'What is your return and exchange policy?',
    a: 'We offer easy 7-day returns and exchanges on unworn items in original packaging. See our full Return & Exchange Policy for details.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept UPI, credit/debit cards, netbanking and wallets via Razorpay. We do not offer Cash on Delivery at this time.',
  },
  {
    q: 'How do I find my ring size?',
    a: 'Check the Size Guide on any ring product page — wrap a strip of paper around your finger and measure against our size chart. Sizes 5-9 available.',
  },
  {
    q: 'Do I need an account to place an order?',
    a: 'No — guest checkout is available. You can optionally create an account after checkout to track your order history.',
  },
];

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Shipping, returns, sizing, payments and care — answers to common Nayra Luxe questions.',
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'Frequently Asked Questions',
    description: 'Shipping, returns, sizing, payments and care — answers to common Nayra Luxe questions.',
    url: '/faq',
    type: 'website',
  },
};

export default function FaqPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  return (
    <div className="section section-y max-w-2xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="mb-8 text-h1">Frequently Asked Questions</h1>
      <FaqAccordion faqs={FAQS} />
    </div>
  );
}
