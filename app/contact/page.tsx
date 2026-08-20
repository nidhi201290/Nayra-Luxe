import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Questions about an order, sizing, or just want to say hi? Reach Nayra Luxe via WhatsApp, Instagram or email.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Us',
    description: 'Questions about an order, sizing, or just want to say hi? Reach Nayra Luxe via WhatsApp, Instagram or email.',
    url: '/contact',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <div className="section section-y max-w-2xl">
      <h1 className="mb-2 text-h1">Contact Us</h1>
      <p className="mb-10 text-body-lg text-charcoal-muted">
        Questions about an order, sizing, or just want to say hi? We&apos;d love to hear from you.
      </p>
      <ContactForm />
    </div>
  );
}
