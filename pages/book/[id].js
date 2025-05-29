import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function BookConsultant() {
  const router = useRouter();
  const { id } = router.query;
  const [consultant, setConsultant] = useState(null);
  const [hours, setHours] = useState(1);

  useEffect(() => {
    const fetchConsultant = async () => {
      if (!id) return;
      const docRef = doc(db, 'consultants', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setConsultant(docSnap.data());
      }
    };
    fetchConsultant();
  }, [id]);

  const handlePayment = async () => {
    const stripe = await stripePromise;

    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        consultantName: consultant.name,
        consultantEmail: consultant.email,
        hourlyRate: parseFloat(consultant.hourlyPay),
        hours,
      }),
    });

    const { id: sessionId } = await res.json();
    const result = await stripe.redirectToCheckout({ sessionId });
    if (result.error) {
      alert(result.error.message);
    }
  };

  if (!consultant) return <p className="p-10 text-center">Loading consultant...</p>;

  return (
      <div className="min-h-screen bg-gray-50 text-gray-800 p-10">
          <div className="flex items-center gap-2 mb-6">
  <img src="https://revantech.in/ribsweb/dist/img/ribs-icon.png" alt="Logo" className="w-10 h-10 object-contain" />
  <span className="text-xl font-bold text-indigo-700">FreelanceHub</span>
</div>
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-4">Book {consultant.name}</h1>
        <p className="mb-2"><strong>Email:</strong> {consultant.email}</p>
        <p className="mb-2"><strong>Expertise:</strong> {consultant.expertise}</p>
        <p className="mb-6"><strong>Hourly Rate:</strong> ${consultant.hourlyPay}</p>

        <label className="block mb-4">
          <span className="font-semibold">Number of Hours</span>
          <input
            type="number"
            value={hours}
            min="1"
            onChange={(e) => setHours(e.target.value)}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
          />
        </label>

        <button
          onClick={handlePayment}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded w-full"
        >
          Pay ${(consultant.hourlyPay * hours).toFixed(2)}
        </button>
      </div>
    </div>
  );
}
