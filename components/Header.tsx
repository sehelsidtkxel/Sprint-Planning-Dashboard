"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../lib/supabase";

export default function Header() {
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
    <div className="bg-slate-900 text-white rounded-xl px-8 py-5 mb-8 flex items-center justify-between">
      <div className="flex items-center gap-5">
        <Image
          src="/logo.jpeg"
          alt="Company Logo"
          width={180}
          height={80}
          priority
        />

        <div>
          <h1 className="text-3xl font-bold">
            Sprint Release Hub
          </h1>

          <p className="text-sm text-slate-300">
            Public Release Dashboard
          </p>
        </div>
      </div>

      {isAdmin && (
        <Link
          href="/admin"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Admin Panel
        </Link>
      )}
    </div>
  );
}