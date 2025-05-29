import { useEffect } from "react";
import { useRouter } from "next/router";
import { auth, provider } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth";

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/dashboard");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleGoogleLogin = async () => {
    try {
      // Add prompt to force account selection
      provider.setCustomParameters({
        prompt: 'select_account',
      });

      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-10">
      <div className="flex items-center gap-2 mb-6">
  <img src="https://revantech.in/ribsweb/dist/img/ribs-icon.png" alt="Logo" className="w-10 h-10 object-contain" />
  <span className="text-xl font-bold text-indigo-700">FreelanceHub</span>
</div>
      <div className="max-w-xl mx-auto bg-white text-center rounded-lg shadow-md p-8">
        <h1 className="text-black text-3xl mb-6 font-semibold">Login</h1>
        <button
          onClick={handleGoogleLogin}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-md font-medium transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
