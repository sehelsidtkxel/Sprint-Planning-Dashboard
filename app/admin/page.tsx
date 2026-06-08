"use client";

import { useState } from "react";
import AddSprintForm from "../../components/AddSprintForm";
import SprintList from "../../components/SprintList";
import AdminNav from "../../components/AdminNav";
import AuthGuard from "../../components/AuthGuard";

export default function AdminPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <AuthGuard>
      <main className="min-h-screen bg-slate-100 p-8">
        <div className="max-w-7xl mx-auto">
          <AdminNav />
<div className="flex justify-end mb-6">
  <button
    onClick={() => setShowForm(!showForm)}
    className={`px-6 py-3 rounded-lg font-semibold text-white ${
      showForm ? "bg-slate-700" : "bg-blue-600"
    }`}
  >
    {showForm ? "← Back to List" : "+ Add Sprint"}
  </button>
</div>

          {showForm ? <AddSprintForm /> : <SprintList />}
        </div>
      </main>
    </AuthGuard>
  );
}