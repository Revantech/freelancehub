import Image from "next/image";
import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between p-4 shadow bg-white">
        <Link href="/dashboard">
          <div className="flex items-center gap-2 cursor-pointer">
            <img src="https://revantech.in/ribsweb/dist/img/ribs-icon.png" alt="Logo" width={40} height={40} />
            <span className="text-xl font-bold text-indigo-700">FreelanceHub</span>
          </div>
        </Link>
      </header>

      <main className="p-4">{children}</main>
    </div>
  );
}
