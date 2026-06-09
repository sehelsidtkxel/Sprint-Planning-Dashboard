"use client";

import { useState } from "react";

import AdminNav from "../../../components/AdminNav";
import AuthGuard from "../../../components/AuthGuard";
import BacklogManager from "../../../components/BacklogManager";
import FeatureSuggestionAdmin from "../../../components/FeatureSuggestionAdmin";

export default function BacklogPage() {
  const [activeTab, setActiveTab] = useState<
    "backlog" | "suggestions"
  >("backlog");

  return (
    <AuthGuard>
      <main className="min-h-screen bg-slate-100 p-8">
        <div className="max-w-7xl mx-auto">
          <AdminNav />

          <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
            <h1 className="text-4xl font-bold">
              Backlog Management
            </h1>

            <p className="text-gray-500 mt-2">
              Manage backlog tasks and feature requests.
            </p>
          </div>

          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setActiveTab("backlog")}
              className={`px-5 py-3 rounded-lg font-semibold ${
                activeTab === "backlog"
                  ? "bg-blue-600 text-white"
                  : "bg-white border text-slate-700"
              }`}
            >
              Backlog Items
            </button>

            <button
              onClick={() => setActiveTab("suggestions")}
              className={`px-5 py-3 rounded-lg font-semibold ${
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
        </div>
      </main>
    </AuthGuard>
  );
}