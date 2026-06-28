"use client";

import { useMemo, useState } from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

interface Props {
  email: string;
  amount: number;
}

export const SubscriptionButton = ({ email, amount }: Props) => {
  // 1. Initialize state with a function. 
  // This runs exactly once, immediately, without needing useEffect.
  const [txRef] = useState(() => `tx_${Date.now()}`);

  const config = useMemo(() => ({
    public_key: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY ?? "",
    tx_ref: txRef, // Now guaranteed to be stable
    amount,
    currency: 'NGN',
    payment_options: 'card,ussd,banktransfer',
    customer: { 
      email, 
      phone_number: "0000000000", 
      name: "Hillcity Staff" 
    },
    customizations: { 
      title: 'Hillcity Premium', 
      description: 'Unlimited Notes', 
      logo: '/logo.png' 
    },
  }), [amount, email, txRef]);

  const handleFlutterPayment = useFlutterwave(config);

  const handleClick = () => {
    handleFlutterPayment({
      callback: (response) => {
        console.log(response);
        alert("Payment successful!");
        closePaymentModal();
        window.location.reload();
      },
      onClose: () => {
        console.log("Payment closed");
      },
    });
  };

  return (
    <button 
      onClick={handleClick}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Upgrade to Premium
    </button>
  );
};