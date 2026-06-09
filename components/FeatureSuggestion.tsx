"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

const applications = [
  "EDGE",
  "Leads",
  "DataWarehouse",
  "Set",
  "DevOps",
];

const featureImpacts = [
  "Increase Revenue",
  "Reduce Cost",
  "Strategic / Fundamentals",
];

export default function FeatureSuggestion() {
  const [requesterName, setRequesterName] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [application, setApplication] = useState("");
  const [featureImpact, setFeatureImpact] = useState("");
  const [impactValue, setImpactValue] = useState("");
  const [requirements, setRequirements] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState<"success" | "error">("success");

  async function submitSuggestion(e: React.FormEvent) {
    e.preventDefault();

    const needsImpactValue =
      featureImpact === "Increase Revenue" ||
      featureImpact === "Reduce Cost";

    if (
      !requesterName.trim() ||
      !requesterEmail.trim() ||
      !title.trim() ||
      !description.trim() ||
      !application ||
      !featureImpact ||
      (needsImpactValue && !impactValue.trim()) ||
      !requirements.trim()
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
          details: description,
          application,
          feature_impact: featureImpact,
          impact_value: needsImpactValue ? impactValue : null,
          requirements,
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
    setDescription("");
    setApplication("");
    setFeatureImpact("");
    setImpactValue("");
    setRequirements("");

    setMessageType("success");
    setMessage("Suggestion submitted successfully.");
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
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <select
            required
            className="border rounded-lg p-3 w-full"
            value={application}
            onChange={(e) => setApplication(e.target.value)}
          >
            <option value="">Select Application</option>

            {applications.map((app) => (
              <option key={app} value={app}>
                {app}
              </option>
            ))}
          </select>

          <select
            required
            className="border rounded-lg p-3 w-full"
            value={featureImpact}
            onChange={(e) => {
              setFeatureImpact(e.target.value);
              setImpactValue("");
            }}
          >
            <option value="">Select Feature Impact</option>

            {featureImpacts.map((impact) => (
              <option key={impact} value={impact}>
                {impact}
              </option>
            ))}
          </select>
        </div>

        {featureImpact === "Increase Revenue" && (
          <input
            required
            pattern="[a-zA-Z0-9 ]+"
            className="border rounded-lg p-3 w-full"
            placeholder="Revenue Impact Value"
            value={impactValue}
            onChange={(e) => setImpactValue(e.target.value)}
          />
        )}

        {featureImpact === "Reduce Cost" && (
          <input
            required
            pattern="[a-zA-Z0-9 ]+"
            className="border rounded-lg p-3 w-full"
            placeholder="Cost Saving Value"
            value={impactValue}
            onChange={(e) => setImpactValue(e.target.value)}
          />
        )}

        <textarea
          required
          rows={5}
          maxLength={3000}
          className="border rounded-lg p-3 w-full whitespace-pre-wrap"
          placeholder="Requirements"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
        />

        <p className="text-xs text-gray-400 text-right">
          {requirements.length}/3000
        </p>

        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold">
          Submit Suggestion
        </button>
      </form>
    </div>
  );
}