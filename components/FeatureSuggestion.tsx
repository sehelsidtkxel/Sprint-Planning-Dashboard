"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

const featureImpacts = [
  "Increase Revenue",
  "Reduce Cost",
  "Strategic / Fundamental",
];

export default function FeatureSuggestion({
  onSubmitted,
}: {
  onSubmitted?: () => void;
}) {
  const [requesterName, setRequesterName] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");
  const [title, setTitle] = useState("");
  const [requirementsText, setRequirementsText] = useState("");
  const [featureImpact, setFeatureImpact] = useState("");
  const [impactValue, setImpactValue] = useState("");
  const [logicalReasoning, setLogicalReasoning] = useState("");
  const [solution, setSolution] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState<"success" | "error">("success");

  async function submitSuggestion(e: React.FormEvent) {
    e.preventDefault();

    const needsImpactValue =
      featureImpact === "Increase Revenue" ||
      featureImpact === "Reduce Cost";

    const needsLogicalReasoning =
      needsImpactValue && impactValue.trim().length > 0;

    if (
      !requesterName.trim() ||
      !requesterEmail.trim() ||
      !title.trim() ||
      !requirementsText.trim() ||
      !featureImpact ||
      (needsImpactValue && !impactValue.trim()) ||
      (needsLogicalReasoning && !logicalReasoning.trim()) ||
      !solution.trim()
    ) {
      setMessageType("error");
      setMessage("Please complete all fields.");
      return;
    }

    const { error } = await supabase
      .from("feature_suggestions")
      .insert([
        {
          requester_name: requesterName,
          requester_email: requesterEmail,
          title,
          details: requirementsText,
          feature_impact: featureImpact,
          impact_value: needsImpactValue ? impactValue : null,
          logical_reasoning: needsLogicalReasoning
            ? logicalReasoning
            : null,
          requirements: solution,
        },
      ]);

    if (error) {
      setMessageType("error");
      setMessage(error.message);
      return;
    }

    setRequesterName("");
    setRequesterEmail("");
    setTitle("");
    setRequirementsText("");
    setFeatureImpact("");
    setImpactValue("");
    setLogicalReasoning("");
    setSolution("");

    setMessageType("success");
    setMessage("Feature request submitted successfully.");

    setTimeout(() => {
      onSubmitted?.();
    }, 1500);
  }

  return (
    <div className="mb-6 bg-white rounded-xl border shadow-sm p-5">
      {message && (
        <div
          className={`mb-4 rounded-lg px-4 py-3 font-semibold border ${
            messageType === "success"
              ? "bg-green-100 text-green-700 border-green-200"
              : "bg-red-100 text-red-700 border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={submitSuggestion} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            required
            className="border rounded-lg p-3 w-full"
            placeholder="Requester Name"
            value={requesterName}
            onChange={(e) => setRequesterName(e.target.value)}
          />

          <input
            required
            type="email"
            className="border rounded-lg p-3 w-full"
            placeholder="Requester Email"
            value={requesterEmail}
            onChange={(e) => setRequesterEmail(e.target.value)}
          />
        </div>

        <input
          required
          className="border rounded-lg p-3 w-full"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          required
          rows={4}
          maxLength={2000}
          className="border rounded-lg p-3 w-full whitespace-pre-wrap"
          placeholder="Requirements"
          value={requirementsText}
          onChange={(e) => setRequirementsText(e.target.value)}
        />

        <select
          required
          className="border rounded-lg p-3 w-full"
          value={featureImpact}
          onChange={(e) => {
            setFeatureImpact(e.target.value);
            setImpactValue("");
            setLogicalReasoning("");
          }}
        >
          <option value="">Select Feature Impact</option>

          {featureImpacts.map((impact) => (
            <option key={impact} value={impact}>
              {impact}
            </option>
          ))}
        </select>

        {featureImpact === "Increase Revenue" && (
          <input
            required
            className="border rounded-lg p-3 w-full"
            placeholder="Revenue Impact Value"
            value={impactValue}
            onChange={(e) => {
              setImpactValue(e.target.value);
              setLogicalReasoning("");
            }}
          />
        )}

        {featureImpact === "Reduce Cost" && (
          <input
            required
            className="border rounded-lg p-3 w-full"
            placeholder="Cost Saving Value"
            value={impactValue}
            onChange={(e) => {
              setImpactValue(e.target.value);
              setLogicalReasoning("");
            }}
          />
        )}

        {(featureImpact === "Increase Revenue" ||
          featureImpact === "Reduce Cost") &&
          impactValue.trim() && (
            <textarea
              required
              rows={4}
              maxLength={2000}
              className="border rounded-lg p-3 w-full whitespace-pre-wrap"
              placeholder="Logical Reasoning"
              value={logicalReasoning}
              onChange={(e) => setLogicalReasoning(e.target.value)}
            />
          )}

        <textarea
          required
          rows={5}
          maxLength={3000}
          className="border rounded-lg p-3 w-full whitespace-pre-wrap"
          placeholder="Solution"
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
        />

        <p className="text-xs text-gray-400 text-right">
          {solution.length}/3000
        </p>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Submit Feature Request
        </button>
      </form>
    </div>
  );
}