"use client";

import { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge";
import RichTextDisplay from "./RichTextDisplay";
import FeatureSuggestion from "./FeatureSuggestion";
import { SprintTask } from "../lib/types";

interface Props {
  tasks: SprintTask[];
}

function getProgress(status?: string) {
  switch (status) {
    case "Done":
      return 100;
    case "In Progress":
      return 60;
    case "Blocked":
      return 10;
    default:
      return 20;
  }
}

function formatDate(dateString?: string) {
  if (!dateString) return "-";

  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getReleaseWeek(dateValue?: string) {
  if (!dateValue) return "Not set";

  const date = new Date(dateValue);
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  const week = Math.ceil(day / 7);

  const suffix =
    week === 1 ? "1st" :
    week === 2 ? "2nd" :
    week === 3 ? "3rd" : `${week}th`;

  return `${month} ${suffix} week (${date.getFullYear()})`;
}

function getStreamColor(color?: string) {
  switch (color?.toLowerCase()) {
    case "green":
      return "bg-green-700";
    case "orange":
      return "bg-orange-500";
    case "red":
      return "bg-red-600";
    case "purple":
      return "bg-purple-700";
    case "blue":
      return "bg-blue-700";
    default:
      return "bg-slate-900";
  }
}

function getResourceChips(resources?: string) {
  if (!resources) return [];

  return resources
    .replaceAll("**", "")
    .split(/\n|,|•|-/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatUpdated(dateString?: string) {
  if (!dateString) return "Recently updated";

  return `Updated ${new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}`;
}

export default function TaskTable({ tasks }: Props) {
  const [openStreams, setOpenStreams] = useState<string[]>([]);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);

  const groupedStreams = tasks.reduce((acc: any, sprint: any) => {
    const streamName = sprint.streams?.name || "Unassigned";

    if (!acc[streamName]) {
      acc[streamName] = [];
    }

    acc[streamName].push(sprint);
    return acc;
  }, {});

  const streamNames = Object.keys(groupedStreams);

  useEffect(() => {
    setOpenStreams(streamNames);
  }, [tasks.length]);

  function toggleStream(streamName: string) {
    setOpenStreams((current) =>
      current.includes(streamName)
        ? current.filter((name) => name !== streamName)
        : [...current, streamName]
    );
  }

  function expandAll() {
    setOpenStreams(streamNames);
  }

  function collapseAll() {
    setOpenStreams([]);
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-xl border shadow-sm p-10 text-center">
        <h2 className="text-2xl font-bold text-slate-800">
          No sprints found
        </h2>
        <p className="text-gray-500 mt-2">
          No sprint data is available for the selected stream.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowSuggestionForm(!showSuggestionForm)}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            showSuggestionForm
              ? "bg-indigo-600 text-white"
              : "bg-white border text-slate-700"
          }`}
        >
          Feature Request
        </button>

        <button
          onClick={expandAll}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg font-semibold"
        >
          Expand All
        </button>

        <button
          onClick={collapseAll}
          className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-semibold"
        >
          Collapse All
        </button>
      </div>

     {showSuggestionForm && (
  <FeatureSuggestion
    onSubmitted={() => setShowSuggestionForm(false)}
  />
)}

      {Object.entries(groupedStreams).map(
        ([streamName, streamSprints]: any) => {
          const isOpen = openStreams.includes(streamName);

          const planned = streamSprints.filter(
            (t: any) => t.status === "Planned"
          ).length;

          const inProgress = streamSprints.filter(
            (t: any) => t.status === "In Progress"
          ).length;

          const done = streamSprints.filter(
            (t: any) => t.status === "Done"
          ).length;

          const blocked = streamSprints.filter(
            (t: any) => t.status === "Blocked"
          ).length;

          const total = streamSprints.length;

          const streamProgress =
            total === 0
              ? 0
              : Math.round(
                  streamSprints.reduce(
                    (sum: number, sprint: any) =>
                      sum + getProgress(sprint.status),
                    0
                  ) / total
                );

          return (
            <section key={streamName} className="space-y-4">
              <button
                type="button"
                onClick={() => toggleStream(streamName)}
                className={`${getStreamColor(
                  streamSprints[0]?.streams?.color
                )} w-full text-white px-6 py-5 rounded-xl cursor-pointer text-left`}
              >
                <div className="flex justify-between items-start gap-6">
                  <div className="w-full">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-2xl font-bold">
                        {streamName}
                      </span>

                      <span className="text-sm font-bold bg-white/20 px-3 py-1 rounded-full">
                        {streamProgress}% Complete
                      </span>
                    </div>

                    <div className="mt-4 h-3 bg-white/25 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full"
                        style={{ width: `${streamProgress}%` }}
                      />
                    </div>

                    <div className="flex gap-2 mt-3 flex-wrap">
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                        Planned: {planned}
                      </span>

                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                        In Progress: {inProgress}
                      </span>

                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                        Done: {done}
                      </span>

                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold">
                        Blocked: {blocked}
                      </span>
                    </div>
                  </div>

                  <span className="text-xl mt-1">
                    {isOpen ? "▼" : "▶"}
                  </span>
                </div>
              </button>

              {isOpen &&
                streamSprints.map((task: any, index: number) => (
                  <div
                    key={task.id || index}
                    className="bg-white rounded-xl shadow-sm border overflow-hidden"
                  >
                    <div className="px-6 py-5 border-b flex justify-between items-center gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h2 className="text-2xl font-bold">
                            {task.title || `Sprint ${index + 1}`}
                          </h2>

                          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold">
                            {formatUpdated(task.updated_at || task.created_at)}
                          </span>
                        </div>

                        <p className="text-gray-500 mt-1">
                          {formatDate(task.start_date)} -{" "}
                          {formatDate(task.end_date)}
                        </p>

                        <div className="mt-4 max-w-md">
                          <div className="flex justify-between text-sm mb-1 text-gray-600">
                            <span>Progress</span>
                            <span>{getProgress(task.status)}%</span>
                          </div>

                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600"
                              style={{
                                width: `${getProgress(task.status)}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="mt-3 inline-flex overflow-hidden rounded-xl border border-green-700 shadow-sm">
                          <div className="bg-green-100 text-green-700 px-4 py-2 font-bold">
                            📅 RELEASE WEEK
                          </div>

                          <div className="bg-green-700 text-white px-5 py-2 font-bold">
                            {getReleaseWeek(task.release_date)}
                          </div>
                        </div>
                      </div>

                      <StatusBadge status={task.status} />
                    </div>

                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="p-4 text-left text-xs uppercase font-bold text-gray-500">
                            Phase
                          </th>
                          <th className="p-4 text-left text-xs uppercase font-bold text-gray-500">
                            Category
                          </th>
                          <th className="p-4 text-left text-xs uppercase font-bold text-gray-500">
                            Resources
                          </th>
                          <th className="p-4 text-left text-xs uppercase font-bold text-gray-500">
                            Task
                          </th>
                          <th className="p-4 text-left text-xs uppercase font-bold text-gray-500">
                            Feature
                          </th>
                          <th className="p-4 text-left text-xs uppercase font-bold text-gray-500">
                            Comments
                          </th>
                          <th className="p-4 text-left text-xs uppercase font-bold text-gray-500">
                            Status
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr className="border-t hover:bg-slate-50 transition align-top">
                          <td className="p-4">{task.phase}</td>
                          <td className="p-4">{task.category}</td>

                          <td className="p-4 max-w-xs">
                            <div className="flex gap-2 flex-wrap">
                              {getResourceChips(task.resources).map(
                                (resource) => (
                                  <span
                                    key={resource}
                                    className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold"
                                  >
                                    {resource}
                                  </span>
                                )
                              )}
                            </div>
                          </td>

                          <td className="p-4 max-w-sm text-sm">
                            <RichTextDisplay text={task.task} />
                          </td>

                          <td className="p-4 max-w-sm text-sm">
                            <RichTextDisplay text={task.feature} />
                          </td>

                          <td className="p-4 max-w-sm text-sm">
                            <RichTextDisplay text={task.comments} />
                          </td>

                          <td className="p-4">
                            <StatusBadge status={task.status} />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))}
            </section>
          );
        }
      )}
    </div>
  );
}