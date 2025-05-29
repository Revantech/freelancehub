import { useState, useEffect } from "react";
import { auth, provider } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import Layout from "../component/Layout";

const db = getFirestore();

export default function Consultant() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [hourlyPay, setHourlyPay] = useState("");
  const [expertise, setExpertise] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const suggestions = ["Python Full Stack", "Java", "JavaScript", "Node.js", "React", "Machine Learning"];

  useEffect(() => {
    if (profilePic) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(profilePic);
    } else {
      setPreview(null);
    }
  }, [profilePic]);

  const handleExpertiseClick = (tech) => {
    if (!expertise.includes(tech)) {
      setExpertise((prev) => (prev ? `${prev}, ${tech}` : tech));
    }
  };

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;
      setUser(loggedInUser);

      // Check if this email is already used as client
      const clientQuery = query(collection(db, "clients"), where("email", "==", loggedInUser.email));
      const clientSnapshot = await getDocs(clientQuery);

      if (!clientSnapshot.empty) {
        setError("This email is already registered as a client.");
        setUser(null);
        return;
      }

    } catch (err) {
      console.error(err.message);
    }
  };

  const handleSubmit = async () => {
    if (!name || !contact || !hourlyPay || !expertise) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      await addDoc(collection(db, "consultants"), {
        email: user.email,
        name,
        contact,
        hourlyPay,
        expertise,
        profilePic: preview,
        createdAt: new Date(),
      });

      router.push("/dashboard");
    } catch (err) {
      setError("Registration failed. Try again.");
      console.error(err.message);
    }
  };

  return (
    <Layout>
    <div className="min-h-screen bg-gray-100 p-8 text-black p-6 flex flex-col items-center">
        
      {!user ? (
        <button
          onClick={handleLogin}
          className="mt-20 bg-green-600 hover:bg-green-500 px-6 py-3 rounded-lg font-semibold"
        >
          Sign in with Google to Register as Consultant
        </button>
      ) : (
        <div className="w-full max-w-xl mt-10 space-y-4">
          <h2 className="text-2xl font-bold text-center">Consultant Registration</h2>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded border bg-gray-100 text-back"
          />

          <input
            placeholder="Contact Number"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full p-2 rounded border bg-gray-100 text-back"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePic(e.target.files[0])}
            className="w-full p-2 border bg-gray-100 text-back"
          />
          {preview && <img src={preview} alt="Preview" className="w-20 h-20 rounded-full object-cover" />}

          <textarea
            placeholder="Your expertise..."
            value={expertise}
            onChange={(e) => setExpertise(e.target.value)}
            rows={3}
            className="w-full p-2 rounded border bg-gray-100 text-back"
          />

          <div className="flex flex-wrap gap-2">
            {suggestions.map((tech) => (
              <button
                key={tech}
                onClick={() => handleExpertiseClick(tech)}
                className="px-3 py-1 bg-gray-300 hover:bg-gray-s200 rounded-full text-sm"
              >
                {tech}
              </button>
            ))}
          </div>

          <input
            placeholder="Hourly Pay ($/hr)"
            value={hourlyPay}
            onChange={(e) => setHourlyPay(e.target.value)}
            className="w-full p-2 rounded border bg-gray-100 text-back"
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-green-600 hover:bg-green-500 py-3 rounded-lg font-semibold"
          >
            Submit
          </button>
        </div>
      )}
      </div>
      </Layout>
  );
}
