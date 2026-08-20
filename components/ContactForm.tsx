'use client';

import { useState } from 'react';
import { Instagram, Mail, MessageCircle } from 'lucide-react';

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        <a
          href="https://wa.me/919811553264"
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center gap-2 rounded-md border border-border p-5 text-center hover:border-gold-primary"
        >
          <MessageCircle className="h-6 w-6 text-gold-primary" />
          <span className="text-body font-medium text-charcoal">WhatsApp</span>
          <span className="text-caption text-charcoal-muted">+91 98115 53264</span>
        </a>
        <a
          href="https://www.instagram.com/nayra_luxe/"
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center gap-2 rounded-md border border-border p-5 text-center hover:border-gold-primary"
        >
          <Instagram className="h-6 w-6 text-gold-primary" />
          <span className="text-body font-medium text-charcoal">Instagram</span>
          <span className="text-caption text-charcoal-muted">@nayra_luxe</span>
        </a>
        <a
          href="mailto:care@nayraluxe.com"
          className="flex flex-col items-center gap-2 rounded-md border border-border p-5 text-center hover:border-gold-primary"
        >
          <Mail className="h-6 w-6 text-gold-primary" />
          <span className="text-body font-medium text-charcoal">Email</span>
          <span className="text-caption text-charcoal-muted">care@nayraluxe.com</span>
        </a>
      </div>

      {submitted ? (
        <div className="rounded-md bg-blush p-6 text-center text-body text-charcoal">
          Thanks for reaching out! We&apos;ll get back to you within 24 hours.
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="space-y-4"
        >
          <input required placeholder="Name" className="input-field" />
          <input required type="email" placeholder="Email" className="input-field" />
          <textarea required placeholder="Message" rows={5} className="input-field" />
          <button type="submit" className="btn-primary">Send Message</button>
        </form>
      )}
    </>
  );
}
