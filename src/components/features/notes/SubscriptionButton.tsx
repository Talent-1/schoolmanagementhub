"use client";

import { useFlutterwave } from 'flutterwave-react-v3';

interface Props {
  email: string;
  amount: number;
}

export const SubscriptionButton = ({ email, amount }: Props) => {
  const handleFlutterPayment = useFlutterwave({
    public_key: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY!,
    amount,
    currency: 'NGN',
    payment_options: 'card,ussd,banktransfer',
    customer: { email },
    customizations: { title: 'Hillcity Premium', description: 'Unlimited Notes' },
   
  });

  
const handleClick = () => {
  handleFlutterPayment({
    tx_ref: `tx_${Date.now()}`,
    meta: {
      staffId: currentStaffId 
    },
    callback: (res) => {
      // This is just to update the UI locally, not for security!
      alert("Payment successful! Refreshing...");
      window.location.reload(); 
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