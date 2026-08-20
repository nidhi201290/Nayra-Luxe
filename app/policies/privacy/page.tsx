import type { Metadata } from 'next';
import PolicyLayout from '@/components/PolicyLayout';

export const metadata: Metadata = { title: 'Privacy Policy', alternates: { canonical: '/policies/privacy' } };

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout title="Privacy Policy">
      <p>Nayra Luxe (&quot;we&quot;, &quot;us&quot;) respects your privacy. This policy explains what data we collect and how we use it.</p>

      <h2>Information We Collect</h2>
      <ul>
        <li>Contact details: name, phone number, email address</li>
        <li>Shipping addresses</li>
        <li>Order history and payment status (payment details themselves are processed securely by Razorpay — we never store card/UPI details)</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>To process and deliver your orders</li>
        <li>To send order updates via WhatsApp/email</li>
        <li>To improve our products and service</li>
        <li>For marketing communications, which you can opt out of anytime</li>
      </ul>

      <h2>Data Sharing</h2>
      <p>We share order and address details only with our payment processor (Razorpay) and shipping partner (Shiprocket) to fulfil your order. We do not sell your data to third parties.</p>

      <h2>Your Rights</h2>
      <p>You can request access to, correction of, or deletion of your personal data by contacting care@nayraluxe.com.</p>
    </PolicyLayout>
  );
}
