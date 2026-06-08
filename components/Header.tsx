"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../lib/supabase";

export default function Header() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setIsAdmin(!!session);
    }

    checkUser();

    setLastUpdated(
      new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }, []);

  return (
    <div className="bg-slate-900 text-white rounded-2xl px-8 py-6 mb-8 shadow-sm">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="bg-white rounded-xl px-4 py-3 shadow-sm flex items-center justify-center">
            <Image
              src="/logo.jpeg"
              alt="Company Logo"
              width={120}
              height={50}
              priority
              className="object-contain"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold leading-tight">
              Sprint Release Hub
            </h1>

            <p className="text-sm text-slate-300 mt-1">
              Public Release Dashboard
            </p>

            <p className="text-xs text-slate-400 mt-1">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>

        {isAdmin && (
          <Link
            href="/admin"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold shadow-sm"
          >
            Admin Panel
          </Link>
        )}
      </div>
    </div>
  );
}