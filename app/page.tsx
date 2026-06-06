import Header from "../components/Header";
import StreamTabs from "../components/StreamTabs";
import StreamSummary from "../components/StreamSummary";
import StatusBadge from "../components/StatusBadge";

import { getSprintTasks } from "../lib/googleSheets";

export default async function HomePage() {
  const tasks = await getSprintTasks();

  return (
    <main className="min-h-screen bg-slate-100">

      <div className="max-w-7xl mx-auto p-8">

        <Header />

        <StreamTabs />

        <StreamSummary totalTasks={tasks.length} />

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

          {/* Sprint Header */}

          <div className="px-6 py-5 border-b flex justify-between items-center">

            <div>
              <h2 className="text-2xl font-bold">
                Sprint 1
              </h2>

              <p className="text-gray-500">
                June 1 - June 19
              </p>
            </div>

            <StatusBadge status="In Progress" />

          </div>

          {/* Table */}

          <table className="w-full">

            <thead className="bg-slate-50">

              <tr>

                <th className="p-4 text-left text-xs uppercase font-bold text-gray-500">
                  Phase
                </th>

                <th className="p-4 text-left text-xs uppercase font-bold text-gray-500">
                  Dates
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

              {tasks.map((task, index) => (

                <tr
                  key={index}
                  className="
                    border-t
                    hover:bg-slate-50
                    transition
                  "
                >

                  <td className="p-4">
                    {task.phase}
                  </td>

                  <td className="p-4">
                    {task.dates}
                  </td>

                  <td className="p-4">
                    {task.category}
                  </td>

                  <td className="p-4">
                    {task.resources}
                  </td>

                  <td className="p-4 font-medium">
                    {task.task}
                  </td>

                  <td className="p-4">
                    {task.feature}
                  </td>

                  <td className="p-4">
                    {task.comments}
                  </td>

                  <td className="p-4">
                    <StatusBadge
                      status={task.status}
                    />
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </main>
  );
}