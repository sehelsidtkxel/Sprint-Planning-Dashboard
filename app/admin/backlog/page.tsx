"use client";

import { useState } from "react";

import AuthGuard from "../../../components/AuthGuard";
import AdminLayout from "../../../components/AdminLayout";
import BacklogManager from "../../../components/BacklogManager";
import FeatureSuggestionAdmin from "../../../components/FeatureSuggestionAdmin";

export default function BacklogPage() {
  const [activeTab, setActiveTab] = useState<"backlog" | "suggestions">(
    "backlog"
  );

  return (
    <AuthGuard>
      <AdminLayout
        title="Backlog Management"
        subtitle="Manage backlog items and review submitted feature suggestions."
      >
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab("backlog")}
            className={`px-5 py-3 rounded-xl font-semibold transition ${
              activeTab === "backlog"
                ? "bg-blue-600 text-white"
                : "bg-white border text-slate-700"
            }`}
          >
            Backlog Items
          </button>

          <button
            onClick={() => setActiveTab("suggestions")}
            className={`px-5 py-3 rounded-xl font-semibold transition ${
              activeTab === "suggestions"
                ? "bg-purple-600 text-white"
                : "bg-white border text-slate-700"
            }`}
          >
            Feature Suggestions
          </button>
        </div>

        {activeTab === "backlog" ? (
          <BacklogManager />
        ) : (
          <FeatureSuggestionAdmin />
        )}
      </AdminLayout>
    </AuthGuard>
  );
}