"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Suggestion = {
  id: string;
  requester_name: string;
  requester_email: string;
  title: string;
  details: string;
  application?: string;
  feature_impact: string;
  impact_value?: string;
  logical_reasoning?: string;
  requirements: string;
  status: string;
};

type Stream = {
  id: string;
  name: string;
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
  const [streams, setStreams] = useState<Stream[]>([]);
  const [selectedStreams, setSelectedStreams] = useState<
    Record<string, string>
  >({});

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Pending" | "Approved" | "Rejected"
  >("All");

  async function loadSuggestions() {
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

  async function loadStreams() {
    const { data, error } = await supabase
      .from("streams")
      .select("id, name")
      .order("name");

    if (error) {
      alert(error.message);
      return;
    }

    setStreams(data || []);
  }

  async function updateStatus(
    item: Suggestion,
    status: "Approved" | "Rejected"
  ) {
    if (status === "Approved") {
      const streamId = selectedStreams[item.id];

      if (!streamId) {
        alert("Please select a stream before approving this request.");
        return;
      }

      const { error: backlogError } = await supabase
        .from("backlog_items")
        .insert([
          {
            stream_id: streamId,
            title: item.title,
            details: `${item.details}

Feature Impact: ${item.feature_impact}
Impact Value: ${item.impact_value || "-"}
Logical Reasoning: ${item.logical_reasoning || "-"}

Solution:
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
    loadStreams();
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
      item.feature_impact?.toLowerCase().includes(query) ||
      item.details?.toLowerCase().includes(query) ||
      item.requirements?.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <p className="text-sm text-slate-500 font-semibold">
            Total Requests
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
              Submitted Feature Requests
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              {filteredSuggestions.length} request(s) found
            </p>
          </div>

          <div className="flex gap-3">
            <select
              className="border rounded-xl px-4 py-3"
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

            <input
              className="border rounded-xl px-4 py-3 w-80"
              placeholder="Search feature requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="divide-y">
          {filteredSuggestions.map((item) => {
            const currentStatus = item.status || "Pending";

            return (
              <div
                key={item.id}
                className="p-6 hover:bg-slate-50 transition"
              >
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

                    <div className="mt-5 bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs uppercase font-bold text-slate-500">
                        Requirements
                      </p>

                      <p className="mt-2 text-slate-700 whitespace-pre-wrap">
                        {item.details}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mt-5 text-sm">
                      <div className="bg-slate-50 p-3 rounded-xl">
                        <p className="text-xs uppercase font-bold text-slate-500">
                          Feature Impact
                        </p>

                        <p className="font-semibold mt-1">
                          {item.feature_impact || "-"}
                        </p>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl">
                        <p className="text-xs uppercase font-bold text-slate-500">
                          Impact Value
                        </p>

                        <p className="font-semibold mt-1">
                          {item.impact_value || "-"}
                        </p>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl">
                        <p className="text-xs uppercase font-bold text-slate-500">
                          Logical Reasoning
                        </p>

                        <p className="font-semibold mt-1 whitespace-pre-wrap">
                          {item.logical_reasoning || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs uppercase font-bold text-slate-500">
                        Solution
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-slate-700">
                        {item.requirements}
                      </p>
                    </div>
                  </div>

                  {currentStatus === "Pending" && (
                    <div className="flex flex-col gap-3 shrink-0 w-64">
                      <select
                        className="border rounded-xl px-3 py-2"
                        value={selectedStreams[item.id] || ""}
                        onChange={(e) =>
                          setSelectedStreams({
                            ...selectedStreams,
                            [item.id]: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Stream</option>

                        {streams.map((stream) => (
                          <option key={stream.id} value={stream.id}>
                            {stream.name}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => updateStatus(item, "Approved")}
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl font-semibold"
                      >
                        Approve
                      </button>

                      <button
                        type="button"
                        onClick={() => updateStatus(item, "Rejected")}
                        className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl font-semibold"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredSuggestions.length === 0 && (
            <div className="p-10 text-center">
              <h3 className="text-xl font-bold text-slate-800">
                No feature requests found
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