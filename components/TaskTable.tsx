"use client";

import { useState } from "react";
import StatusBadge from "./StatusBadge";
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

function formatDate(dateString?: string) {
  if (!dateString) return "-";

  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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

export default function TaskTable({ tasks }: Props) {
  const groupedStreams = tasks.reduce((acc: any, sprint: any) => {
    const streamName = sprint.streams?.name || "Unassigned";

    if (!acc[streamName]) {
      acc[streamName] = [];
    }

    acc[streamName].push(sprint);

    return acc;
  }, {});

  const streamNames = Object.keys(groupedStreams);
  const [openStreams, setOpenStreams] = useState<string[]>(streamNames);

  function toggleStream(streamName: string) {
    setOpenStreams((current) =>
      current.includes(streamName)
        ? current.filter((name) => name !== streamName)
        : [...current, streamName]
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedStreams).map(
        ([streamName, streamSprints]: any) => {
          const isOpen = openStreams.includes(streamName);

          return (
            <section key={streamName} className="space-y-4">
              <button
                type="button"
                onClick={() => toggleStream(streamName)}
                className={`${getStreamColor(
                  streamSprints[0]?.streams?.color
                )} w-full text-white px-6 py-4 rounded-xl cursor-pointer flex justify-between items-center`}
              >
                <span className="text-2xl font-bold">
                  {streamName}
                </span>

                <span className="text-xl">
                  {isOpen ? "▼" : "▶"}
                </span>
              </button>

              {isOpen &&
                streamSprints.map((task: SprintTask, index: number) => (
                  <div
                    key={task.id || index}
                    className="bg-white rounded-xl shadow-sm border overflow-hidden"
                  >
                    <div className="px-6 py-5 border-b flex justify-between items-center gap-6">
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold">
                          {task.title || `Sprint ${index + 1}`}
                        </h2>

                        <p className="text-gray-500">
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
                            Resource
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
                        <tr className="border-t hover:bg-slate-50 transition">
                          <td className="p-4">{task.phase}</td>
                          <td className="p-4">{task.category}</td>
                          <td className="p-4">{task.resources}</td>
                          <td className="p-4 font-medium">{task.task}</td>
                          <td className="p-4">{task.feature}</td>
                          <td className="p-4">{task.comments}</td>
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