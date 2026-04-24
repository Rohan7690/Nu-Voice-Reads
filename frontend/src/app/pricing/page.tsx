'use client';
import { useAuth } from '@/lib/AuthContext';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Script from 'next/script';

export default function Pricing() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);

  if (!loading && user?.isPremium) {
    return <div className="text-center py-20 animate-fade-in"><h2 className="text-2xl font-bold text-green-400 mb-4">You are already Premium!</h2><button onClick={() => router.push('/')} className="btn-primary">Back</button></div>
  }

  const handleSubscribe = async () => {
    if (!user) {
      router.push('/login?redirect=/pricing');
      return;
    }

    setProcessing(true);
    try {
      // 1. Create order on backend
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to create order');

      // 2. Open Razorpay Modal
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "NuVoice Reads",
        description: "Premium Subscription",
        order_id: data.orderId,
        handler: async function (response: any) {
          // 1. Manually notify backend since webhook won't work on localhost
          await fetch('/api/checkout/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              email: user.email
            })
          });

          // 2. Update local state so UI reflects changes
          const updatedUser = { ...user, isPremium: true };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          window.location.href = '/dashboard?payment=success';
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      setProcessing(false);
    } catch (err: any) {
      alert(err.message);
      setProcessing(false);
    }
  };

  const features = [
    "Full access to all Premium Stories",
    "Ad-free reading experience",
    "Support your favorite writers directly",
    "Exclusive community features",
    "Cancel anytime"
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 md:py-20 animate-fade-in">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Upgrade to Premium</h1>
        <p className="text-xl opacity-70">Unlock a world of uninterrupted reading.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Visual / List side */}
        <div className="space-y-6 bg-gradient-to-br from-primary/10 to-transparent p-8 rounded-3xl border border-primary/20">
          <h2 className="text-2xl font-semibold mb-6">Everything you need</h2>
          <ul className="space-y-4">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-lg opacity-90">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing Card */}
        <div className="glass p-8 md:p-10 rounded-3xl text-center relative overflow-hidden backdrop-blur-xl border border-white/10 shadow-2xl">
          <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>

          <h3 className="text-2xl font-bold mb-2 relative">Monthly Plan</h3>
          <p className="opacity-70 mb-8 relative">Billed automatically</p>

          <div className="text-5xl font-black mb-8 relative flex items-baseline justify-center gap-1">
            $5<span className="text-lg opacity-50 font-normal">/mo</span>
          </div>

          <button
            onClick={handleSubscribe}
            disabled={processing}
            className="w-full btn-primary text-lg py-4 relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative flex items-center justify-center gap-2">
              {processing ? <><Loader2 className="w-5 h-5 animate-spin" /> Preparing Checkout...</> : 'Subscribe Now'}
            </span>
          </button>

          <p className="text-xs opacity-50 mt-6 relative">Secured by Razorpay. You will be redirected to the checkout page.</p>
        </div>
      </div>
    </div>
  );
}
