import { useRouter } from "next/router";


export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      
      {/* Top bar with Login button on right */}
      <div className="flex justify-between p-4">
      <div className="flex items-center gap-2 p-4">
  <img
    src="https://revantech.in/ribsweb/dist/img/ribs-icon.png"
    alt="Logo"
    className="w-10 h-10 object-contain"
  />
  <span className="text-xl font-bold text-indigo-700">FreelanceHub</span>
</div>
        <button
          onClick={() => router.push("/login")}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg px-6 py-1 transition"
        >
          Login
        </button>
      </div>

      {/* Centered main content */}
      <div className="flex-grow flex flex-col justify-center items-center px-4">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-12">
          Welcome to FreelanceHub
        </h1>

        <div className="flex space-x-6">
          <button
            onClick={() => router.push("/client")}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg px-10 py-4 transition"
          >
            Hire
          </button>
          <button
            onClick={() => router.push("/consultant")}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg px-10 py-4 transition"
          >
            Get Hired
          </button>
        </div>
      </div>
    </div>
  );
}
