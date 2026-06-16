"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { UIButton, UIInput } from "./ui";

type Suggestion = {
  id: string;
  requester_name: string;
  requester_email: string;
  title: string;
  details: string;
  application: string;
  feature_impact: string;
  impact_value?: string;
  requirements: string;
  status: string;
};

function getStatusStyle(status?: string) {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-700";
    case "Rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

export default function FeatureSuggestionAdmin() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Pending" | "Approved" | "Rejected"
  >("All");

  async function loadSuggestions() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("feature_suggestions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setSuggestions(data || []);
  }

  async function updateStatus(
    item: Suggestion,
    status: "Approved" | "Rejected"
  ) {
    if (!supabase) return;

    if (status === "Approved") {
      const { data: stream, error: streamError } = await supabase
        .from("streams")
        .select("id")
        .ilike("name", `%${item.application}%`)
        .limit(1)
        .single();

      if (streamError || !stream) {
        alert(`No matching stream found for ${item.application}`);
        return;
      }

      const { error: backlogError } = await supabase
        .from("backlog_items")
        .insert([
          {
            stream_id: stream.id,
            title: item.title,
            details: `${item.details}

Feature Impact: ${item.feature_impact}
Impact Value: ${item.impact_value || "-"}

Requirements:
${item.requirements}`,
            status: "Backlog",
          },
        ]);

      if (backlogError) {
        alert(backlogError.message);
        return;
      }
    }

    const { error } = await supabase
      .from("feature_suggestions")
      .update({ status })
      .eq("id", item.id);

    if (error) {
      alert(error.message);
      return;
    }

    loadSuggestions();
  }

  useEffect(() => {
    loadSuggestions();
  }, []);

  const pendingCount = suggestions.filter(
    (item) => !item.status || item.status === "Pending"
  ).length;

  const approvedCount = suggestions.filter(
    (item) => item.status === "Approved"
  ).length;

  const rejectedCount = suggestions.filter(
    (item) => item.status === "Rejected"
  ).length;

  const filteredSuggestions = suggestions.filter((item) => {
    const currentStatus = item.status || "Pending";
    const query = search.toLowerCase();

    const matchesStatus =
      statusFilter === "All" || currentStatus === statusFilter;

    const matchesSearch =
      !query ||
      item.title?.toLowerCase().includes(query) ||
      item.requester_name?.toLowerCase().includes(query) ||
      item.requester_email?.toLowerCase().includes(query) ||
      item.application?.toLowerCase().includes(query) ||
      item.feature_impact?.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <p className="text-sm text-slate-500 font-semibold">
            Total Suggestions
          </p>
          <h3 className="text-3xl font-bold mt-2">
            {suggestions.length}
          </h3>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <p className="text-sm text-slate-500 font-semibold">
            Pending
          </p>
          <h3 className="text-3xl font-bold mt-2 text-yellow-600">
            {pendingCount}
          </h3>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <p className="text-sm text-slate-500 font-semibold">
            Approved
          </p>
          <h3 className="text-3xl font-bold mt-2 text-green-600">
            {approvedCount}
          </h3>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <p className="text-sm text-slate-500 font-semibold">
            Rejected
          </p>
          <h3 className="text-3xl font-bold mt-2 text-red-600">
            {rejectedCount}
          </h3>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-5 border-b flex justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Submitted Feature Suggestions
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              {filteredSuggestions.length} request(s) found
            </p>
          </div>

          <div className="flex gap-3">
            <select
              className="border border-slate-300 rounded px-3 py-2 text-sm"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as
                    | "All"
                    | "Pending"
                    | "Approved"
                    | "Rejected"
                )
              }
            >
              <option>All</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>

            <div className="w-80">
              <UIInput
              placeholder="Search suggestions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="divide-y">
          {filteredSuggestions.map((item) => {
            const currentStatus = item.status || "Pending";

            return (
              <div key={item.id} className="p-6 hover:bg-slate-50 transition">
                <div className="flex justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-xl font-bold text-slate-900">
                        {item.title}
                      </h3>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                          currentStatus
                        )}`}
                      >
                        {currentStatus}
                      </span>
                    </div>

                    <p className="text-sm text-slate-500 mt-1">
                      {item.requester_name} · {item.requester_email}
                    </p>

                    <p className="mt-4 text-slate-700 whitespace-pre-wrap">
                      {item.details}
                    </p>

                    <div className="grid grid-cols-3 gap-3 mt-5 text-sm">
                      <div className="bg-slate-50 p-3 rounded-xl">
                        <p className="text-xs font-bold text-slate-500">
                          Application
                        </p>
                        <p className="font-semibold mt-1">
                          {item.application || "-"}
                        </p>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl">
                        <p className="text-xs font-bold text-slate-500">
                          Feature Impact
                        </p>
                        <p className="font-semibold mt-1">
                          {item.feature_impact || "-"}
                        </p>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl">
                        <p className="text-xs font-bold text-slate-500">
                          Impact Value
                        </p>
                        <p className="font-semibold mt-1">
                          {item.impact_value || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs font-bold text-slate-500">
                        Requirements
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-slate-700">
                        {item.requirements}
                      </p>
                    </div>
                  </div>

                  {currentStatus === "Pending" && (
                    <div className="flex flex-col gap-3 shrink-0">
                      <UIButton
                        onClick={() => updateStatus(item, "Approved")}
                        variant="primary"
                        className="bg-green-600 hover:bg-green-700 focus:ring-green-100"
                      >
                        Approve
                      </UIButton>

                      <UIButton
                        onClick={() => updateStatus(item, "Rejected")}
                        variant="danger"
                      >
                        Reject
                      </UIButton>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredSuggestions.length === 0 && (
            <div className="p-10 text-center">
              <h3 className="text-xl font-bold text-slate-800">
                No feature suggestions found
              </h3>

              <p className="text-slate-500 mt-2">
                Try adjusting your search or status filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}