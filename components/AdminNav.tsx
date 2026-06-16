"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  GitBranch,
  LayoutDashboard,
  ListTodo,
  LogOut,
} from "lucide-react";
import { AppIcon } from "./icons";
import { UIButton } from "./ui";
import { supabase } from "../lib/supabase";

export default function AdminNav() {
  const router = useRouter();

  async function handleLogout() {
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/login");
  }

  return (
    <div className="bg-white rounded-2xl border shadow-sm px-6 py-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="bg-slate-50 p-2 rounded-xl border">
              <Image
                src="/logo.jpeg"
                alt="Signal Logo"
                width={70}
                height={40}
                priority
                className="object-contain"
              />
            </div>

            <div>
              <h1 className="font-bold text-xl text-slate-900">
                Sprint Release Hub
              </h1>

              <p className="text-sm text-slate-500">
                Administration Portal
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/admin"
              className="bg-blue-600 text-white px-5 py-2 rounded font-semibold inline-flex items-center gap-2"
            >
              <AppIcon icon={CalendarDays} size="sm" />
              Sprints
            </Link>

            <Link
              href="/admin/streams"
              className="bg-slate-700 text-white px-5 py-2 rounded font-semibold inline-flex items-center gap-2"
            >
              <AppIcon icon={GitBranch} size="sm" />
              Streams
            </Link>

            <Link
              href="/admin/backlog"
              className="bg-purple-600 text-white px-5 py-2 rounded font-semibold inline-flex items-center gap-2"
            >
              <AppIcon icon={ListTodo} size="sm" />
              Backlog
            </Link>

            <Link
              href="/"
              className="bg-green-600 text-white px-5 py-2 rounded font-semibold inline-flex items-center gap-2"
            >
              <AppIcon icon={LayoutDashboard} size="sm" />
              Dashboard
            </Link>
          </div>
        </div>

        <UIButton onClick={handleLogout} variant="danger">
          <AppIcon icon={LogOut} size="sm" />
          Logout
        </UIButton>
      </div>
    </div>
  );
}