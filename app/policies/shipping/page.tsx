import type { Metadata } from 'next';
import PolicyLayout from '@/components/PolicyLayout';

export const metadata: Metadata = { title: 'Shipping Policy', alternates: { canonical: '/policies/shipping' } };

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout title="Shipping Policy">
      <p>We currently ship across India only. International shipping is not available at this time.</p>

      <h2>Processing Time</h2>
      <p>Orders are processed and dispatched within 1-2 business days of payment confirmation.</p>

      <h2>Delivery Timelines</h2>
      <ul>
        <li>Metro cities: 3-5 business days</li>
        <li>Other cities/towns: 5-7 business days</li>
      </ul>
      <p>Delivery timelines are estimates provided via our shipping partner Shiprocket and may vary based on your pincode and courier serviceability.</p>

      <h2>Shipping Charges</h2>
      <p>Free shipping on all orders above ₹999. A flat shipping fee of ₹79 applies to orders below that value.</p>

      <h2>Order Tracking</h2>
      <p>Once your order is shipped, you&apos;ll receive a tracking link via WhatsApp/email. You can also track your order from My Orders in your account.</p>
    </PolicyLayout>
  );
}
