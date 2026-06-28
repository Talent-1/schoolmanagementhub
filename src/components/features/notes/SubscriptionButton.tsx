"use client";

import { useMemo, useState, useEffect } from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

interface Props {
  email: string;
  amount: number;
}

export const SubscriptionButton = ({ email, amount }: Props) => {
  // 1. Generate the txRef once after the component mounts to stay "Pure"
  const [txRef, setTxRef] = useState<string>("");

  useEffect(() => {
    setTxRef(`tx_${Date.now()}`);
  }, []);

  // 2. config now depends on the stable txRef
  const config = useMemo(() => ({
    public_key: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY ?? "",
    tx_ref: txRef,
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
      disabled={!txRef}
      className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
    >
      Upgrade to Premium
    </button>
  );
};