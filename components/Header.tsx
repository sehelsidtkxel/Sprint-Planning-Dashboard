"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../lib/supabase";

export default function Header({
  search,
  onSearchChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
}) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setIsAdmin(!!session);
    }

    checkUser();
  }, []);

  return (
    <header className="w-full mb-6">
      <div className="bg-slate-950 text-white border border-slate-800 rounded-2xl px-5 py-4 shadow-lg">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 rounded-xl p-2 flex items-center justify-center">
              <Image
                src="/logo.jpeg"
                alt="Signal Logo"
                width={34}
                height={34}
                priority
                className="object-contain rounded"
              />
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                Signal
              </h1>

              <span className="text-slate-500">·</span>

              <p className="text-slate-300 text-sm">
                Sprint Release Hub
              </p>

              <span className="border border-orange-500/40 bg-orange-500/10 text-orange-300 px-3 py-1 rounded-md text-xs font-mono tracking-wider">
                EDGE 2.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 min-w-[320px]">
              <span className="text-slate-500 mr-2">⌕</span>

              <input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search tasks, features, streams..."
                className="bg-transparent outline-none text-sm text-slate-300 placeholder:text-slate-500 w-full"
              />
            </div>

            {isAdmin && (
  <Link
    href="/admin"
    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
  >
    Admin Panel →
  </Link>
)}

            
          </div>
        </div>
      </div>
    </header>
  );
}