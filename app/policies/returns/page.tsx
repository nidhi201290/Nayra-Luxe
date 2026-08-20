import type { Metadata } from 'next';
import PolicyLayout from '@/components/PolicyLayout';

export const metadata: Metadata = { title: 'Return & Exchange Policy', alternates: { canonical: '/policies/returns' } };

export default function ReturnsPolicyPage() {
  return (
    <PolicyLayout title="Return & Exchange Policy">
      <p>We want you to love your Nayra Luxe piece. If something isn&apos;t right, we offer easy 7-day returns and exchanges.</p>

      <h2>Eligibility</h2>
      <ul>
        <li>Request must be raised within 7 days of delivery</li>
        <li>Item must be unworn, undamaged, and in its original packaging with tags intact</li>
        <li>Earrings are non-returnable for hygiene reasons unless defective</li>
      </ul>

      <h2>How to Initiate a Return</h2>
      <p>Go to My Orders, select the order, and choose &quot;Request Return/Exchange&quot;, or message us on WhatsApp with your order number.</p>

      <h2>Refunds</h2>
      <p>Once your returned item is received and inspected, refunds are processed to your original payment method within 5-7 business days.</p>

      <h2>Damaged or Incorrect Items</h2>
      <p>If you receive a damaged or incorrect item, contact us within 48 hours of delivery with photos, and we&apos;ll arrange a free replacement.</p>
    </PolicyLayout>
  );
}
