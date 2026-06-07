"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function AdminNav() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="flex justify-between items-center mb-6 bg-white rounded-xl border shadow-sm p-4">
      <div className="flex items-center gap-6">
        <Image
          src="/logo.jpeg"
          alt="Company Logo"
          width={150}
          height={50}
          priority
        />

        <div className="flex gap-3">
          <Link
            href="/admin"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold"
          >
            Sprints
          </Link>

          <Link
            href="/admin/streams"
            className="bg-slate-700 text-white px-5 py-2 rounded-lg font-semibold"
          >
            Streams
          </Link>
<Link
  href="/admin/backlog"
  className="bg-purple-600 text-white px-5 py-2 rounded-lg font-semibold"
>
  Backlog
</Link>
          <Link
            href="/"
            className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold"
          >
            Dashboard
          </Link>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-5 py-2 rounded-lg font-semibold"
      >
        Logout
      </button>
    </div>
  );
}