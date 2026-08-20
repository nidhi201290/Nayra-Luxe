'use client';

import { useEffect, useState } from 'react';

const MESSAGES = [
  'Free Shipping on orders above ₹999',
  'Anti-Tarnish Guarantee on every piece',
  'Get ₹150 off | Code: NAYRA150',
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-charcoal py-2 text-center text-caption tracked-caps text-ivory">
      <p className="animate-bounce-in" key={index}>
        {MESSAGES[index]}
      </p>
    </div>
  );
}
