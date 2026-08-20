import type { Metadata } from 'next';
import CheckoutForm from '@/components/checkout/CheckoutForm';

export const metadata: Metadata = { title: 'Checkout' };

export default function CheckoutPage() {
  return (
    <div>
      <div className="section pt-8">
        <h1 className="text-h1">Checkout</h1>
      </div>
      <CheckoutForm />
    </div>
  );
}
