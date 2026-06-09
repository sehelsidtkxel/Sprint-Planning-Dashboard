"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function AdminLayout({
  title,
  subtitle,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const links = [
    { label: "Sprints", href: "/admin" },
    { label: "Streams", href: "/admin/streams" },
    { label: "Backlog", href: "/admin/backlog" },
    { label: "Dashboard", href: "/" },
  ];

  return (
    <main className="min-h-screen bg-slate-100 flex">
      <aside className="w-72 bg-slate-950 text-white min-h-screen p-5 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-white rounded-xl p-2">
            <Image
              src="/logo.jpeg"
              alt="Logo"
              width={46}
              height={46}
              className="object-contain"
            />
          </div>

          <div>
            <h1 className="font-bold text-xl">Signal</h1>
            <p className="text-xs text-slate-400">Admin Portal</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-xl font-semibold transition ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-3 rounded-xl font-semibold"
        >
          Logout
        </button>
      </aside>

      <section className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-4xl font-bold text-slate-900">
              {title}
            </h2>

            {subtitle && (
              <p className="text-slate-500 mt-1">{subtitle}</p>
            )}
          </div>

          {action}
        </div>

        {children}
      </section>
    </main>
  );
}