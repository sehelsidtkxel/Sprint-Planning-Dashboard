"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

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

export default function FeatureSuggestionAdmin() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

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

  async function updateStatus(
    item: Suggestion,
    status: "Approved" | "Rejected"
  ) {
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

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">
        Feature Suggestions
      </h2>

      <div className="space-y-4">
        {suggestions.map((item) => (
          <div key={item.id} className="border rounded-xl p-5">
            <div className="flex justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {item.requester_name} · {item.requester_email}
                </p>
              </div>

              <span className="bg-slate-100 px-3 py-1 rounded-full text-sm font-semibold">
                {item.status || "Pending"}
              </span>
            </div>

            <p className="mt-4 text-gray-700">
              {item.details}
            </p>

            <div className="grid grid-cols-3 gap-3 mt-4 text-sm">
              <div className="bg-slate-50 p-3 rounded-lg">
                <b>Application</b>
                <p>{item.application}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg">
                <b>Impact</b>
                <p>{item.feature_impact}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg">
                <b>Impact Value</b>
                <p>{item.impact_value || "-"}</p>
              </div>
            </div>

            <div className="mt-4 bg-slate-50 p-3 rounded-lg">
              <b>Requirements</b>
              <p className="mt-1 whitespace-pre-wrap">
                {item.requirements}
              </p>
            </div>

            {(item.status === "Pending" || !item.status) && (
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => updateStatus(item, "Approved")}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
                >
                  Approve
                </button>

                <button
                  type="button"
                  onClick={() => updateStatus(item, "Rejected")}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}

        {suggestions.length === 0 && (
          <p className="text-gray-500">
            No feature suggestions submitted yet.
          </p>
        )}
      </div>
    </div>
  );
}