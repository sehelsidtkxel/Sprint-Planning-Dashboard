"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/admin");
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-white rounded-xl border shadow-sm p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-2">
          Admin Login
        </h1>

        <p className="text-gray-500 mb-6">
          Sign in to manage sprint releases.
        </p>

        <input
          type="email"
          className="border rounded-lg p-3 w-full mb-4"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border rounded-lg p-3 w-full mb-6"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-blue-600 text-white w-full py-3 rounded-lg font-semibold">
          Login
        </button>
      </form>
    </main>
  );
}