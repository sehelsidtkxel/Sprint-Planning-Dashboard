"use client";

import { useState } from "react";
import AddSprintForm from "../../components/AddSprintForm";
import SprintList from "../../components/SprintList";
import AuthGuard from "../../components/AuthGuard";
import AdminLayout from "../../components/AdminLayout";

export default function AdminPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <AuthGuard>
      <AdminLayout
        title="Sprint Management"
        subtitle="Create, edit, and manage sprint release details."
        action={
          <button
            onClick={() => setShowForm(!showForm)}
            className={`px-6 py-3 rounded-xl font-semibold text-white ${
              showForm ? "bg-slate-700" : "bg-blue-600"
            }`}
          >
            {showForm ? "← Back to List" : "+ Add Sprint"}
          </button>
        }
      >
        {showForm ? (
          <AddSprintForm onSuccess={() => setShowForm(false)} />
        ) : (
          <SprintList />
        )}
      </AdminLayout>
    </AuthGuard>
  );
}