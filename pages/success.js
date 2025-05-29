// pages/success.js
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-8">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Payment Successful!</h1>
        <p className="text-gray-700 mb-6">Your session has been booked. You’ll be contacted shortly.</p>
        <Link href="/dashboard">
          <button className="bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-2 rounded">
            Go to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
