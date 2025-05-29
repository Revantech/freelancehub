import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [consultants, setConsultants] = useState([]);
  const [filteredConsultants, setFilteredConsultants] = useState([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (!u) {
        router.push("/login");
      } else {
        setUser(u);
        fetchConsultants();
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchConsultants = async () => {
    try {
      const q = query(collection(db, "consultants"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log("Data",data)
      setConsultants(data);
      setFilteredConsultants(data);
    } catch (error) {
      console.error("Error fetching consultants:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = consultants.filter(
      (c) =>
        c.name?.toLowerCase().includes(value) ||
        c.expertise?.toLowerCase().includes(value)
    );
    setFilteredConsultants(filtered);
  };

  if (!user) return null;

  return (
    
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex items-center justify-between mb-6">
  {/* Left side: Logo */}
  <div className="flex items-center gap-2">
    <img
      src="https://revantech.in/ribsweb/dist/img/ribs-icon.png" // Make sure logo.png exists in public/
      alt="Company Logo"
      className="w-10 h-10 object-contain"
    />
    <span className="text-xl font-bold text-indigo-600">FreelanceHub</span>
  </div>

  {/* Right side: User Info & Logout */}
  <div className="flex items-center gap-4">
    <div className="text-right text-sm text-gray-700">
      <div className="font-semibold">{user.displayName}</div>
      <div>{user.email}</div>
    </div>
    <button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-500 text-white font-semibold rounded-md px-4 py-2 transition"
    >
      Logout
    </button>
  </div>
</div>

      

      {consultants.find((c) => c.email === user.email) ? (
        
        <div className="mt-10 max-w-3xl mx-auto text-gray-800">
    <h2 className="text-3xl font-bold mb-6 text-center">
      Welcome back, {consultants.find((c) => c.email === user.email)?.name}!
    </h2>

    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Your Consultant Profile</h3>
      <form className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            className="w-full p-2 rounded border border-gray-300"
            defaultValue={consultants.find((c) => c.email === user.email)?.name}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full p-2 rounded border border-gray-300 bg-gray-100"
            value={user.email}
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contact Number</label>
          <input
            type="text"
            className="w-full p-2 rounded border border-gray-300"
            defaultValue={consultants.find((c) => c.email === user.email)?.contact || ""}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Profile Picture</label>
          <div className="flex items-center gap-4">
            <img
              src={
                consultants.find((c) => c.email === user.email)?.profilePic ||
                "/default-profile.png"
              }
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border"
            />
            <input type="file" accept="image/*" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Expertise</label>
          <textarea
            rows={2}
            className="w-full p-2 rounded border border-gray-300"
            defaultValue={consultants.find((c) => c.email === user.email)?.expertise || ""}
          ></textarea>

          <div className="flex flex-wrap gap-2 mt-2">
            {["Python", "Full Stack", "Java", "React", "Node.js", "JavaScript"].map((skill) => (
              <span
                key={skill}
                className="cursor-pointer bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm hover:bg-blue-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Hourly Pay ($)</label>
          <input
            type="number"
            className="w-full p-2 rounded border border-gray-300"
            defaultValue={consultants.find((c) => c.email === user.email)?.hourlyPay || ""}
          />
        </div>

       
      </form>
    </div>
  </div>
      ) : (
        <div>
          <div className="mb-6">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
              Consultants
            </h1>
            <div className="mb-6 flex justify-end">
  <input
    type="text"
    placeholder="Search consultants..."
    value={search}
    onChange={handleSearch}
    className="w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredConsultants.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-xl shadow-md p-6 flex flex-col"
              >
                <img
                  src={c.profilePic || "/default-profile.png"}
                  alt={c.name}
                  className="w-28 h-28 rounded-full mx-auto mb-5 object-cover border-4 border-blue-500"
                />
                <h2 className="text-2xl font-semibold text-center text-gray-800">
                  {c.name}
                </h2>
                <p className="text-center text-blue-600 mb-3 italic">
                  Expertise: {c.expertise}
                </p>
                <p className="text-center text-blue-800 font-medium mb-5">
                  Hourly Rate: <span className="text-blue-900">${c.hourlyPay}</span>
                </p>

                <button
                  onClick={() => router.push(`/book/${c.id}`)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg py-3 mb-4 transition"
                >
                  Book Now
                </button>

                <div>
                  <h3 className="font-semibold mb-2 text-gray-700">Reviews</h3>
                  <p className="text-blue-500 text-sm italic">No reviews yet.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
