import type { Metadata } from 'next';
import PolicyLayout from '@/components/PolicyLayout';

export const metadata: Metadata = { title: 'Terms & Conditions', alternates: { canonical: '/policies/terms' } };

export default function TermsPolicyPage() {
  return (
    <PolicyLayout title="Terms & Conditions">
      <p>By using the Nayra Luxe website and placing an order, you agree to the following terms.</p>

      <h2>Orders & Payment</h2>
      <p>All orders must be paid for online via Razorpay (UPI, cards, netbanking, or wallets) at the time of purchase. We do not offer Cash on Delivery. An order is only confirmed after successful payment.</p>

      <h2>Pricing</h2>
      <p>All prices are listed in INR (₹) and are inclusive of applicable taxes. We reserve the right to change prices at any time without prior notice.</p>

      <h2>Product Accuracy</h2>
      <p>We make every effort to display product colors and details accurately; slight variations may occur due to screen settings and handcrafted finishing.</p>

      <h2>Reviews</h2>
      <p>Product reviews may only be submitted by customers who have received a delivered order for that product, to ensure authenticity.</p>

      <h2>Limitation of Liability</h2>
      <p>Nayra Luxe is not liable for delays caused by courier partners, incorrect address information provided by the customer, or events beyond our reasonable control.</p>

      <h2>Governing Law</h2>
      <p>These terms are governed by the laws of India.</p>
    </PolicyLayout>
  );
}
