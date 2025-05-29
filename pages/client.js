import { useEffect, useState } from "react";
import { auth, provider, db } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";


export default function Client() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [contactNumber, setContactNumber] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const clientRef = doc(db, "clients", currentUser.email);
        const snap = await getDoc(clientRef);
        if (snap.exists()) {
          router.push("/dashboard");
        } else {
          setChecking(false);
        }
      } else {
        signInWithPopup(auth, provider)
          .then(async (result) => {
            const clientRef = doc(db, "clients", result.user.email);
            const snap = await getDoc(clientRef);
            if (snap.exists()) {
              router.push("/dashboard");
            } else {
              setUser(result.user);
              setChecking(false);
            }
          })
          .catch((err) => {
            console.error("Google login error:", err);
          });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const clientRef = doc(db, "clients", user.email);
      await setDoc(clientRef, {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        contactNumber,
        type: "client",
      });
      router.push("/dashboard");
    } catch (err) {
      console.error("Error saving client:", err);
      alert("Something went wrong. Try again.");
    }
  };

  if (checking || !user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
        <p>Checking registration status...</p>
      </div>
    );
  }

  return (
    
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <img src="https://revantech.in/ribsweb/dist/img/ribs-icon.png" alt="Logo" className="w-10 h-10 object-contain" />
        <span className="text-xl font-bold text-indigo-700">FreelanceHub</span>
      </div>
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white p-6 rounded-md shadow"
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Client Registration</h1>

        <div className="mb-4">
          <label className="block mb-1 text-gray-800">Name</label>
          <input
            type="text"
            value={user.displayName}
            disabled
            className="w-full mb-4 p-3 border text-black border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-800">Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full p-3 rounded bg-gray-100 text-black border border-gray-300"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-800">Contact Number</label>
          <input
            type="tel"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            required
            className="w-full p-3 rounded bg-gray-100 text-black border border-gray-300"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded mt-4 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
