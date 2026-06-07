import { SprintTask } from "../lib/types";

interface Props {
  tasks: SprintTask[];
}

export default function DashboardStats({ tasks }: Props) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "Done").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const blocked = tasks.filter((t) => t.status === "Blocked").length;

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl border p-5 shadow-sm">
        <p className="text-gray-500 text-sm">Total Sprints</p>
        <h3 className="text-3xl font-bold">{total}</h3>
      </div>

      <div className="bg-white rounded-xl border p-5 shadow-sm">
        <p className="text-gray-500 text-sm">Done</p>
        <h3 className="text-3xl font-bold text-green-600">{done}</h3>
      </div>

      <div className="bg-white rounded-xl border p-5 shadow-sm">
        <p className="text-gray-500 text-sm">In Progress</p>
        <h3 className="text-3xl font-bold text-blue-600">{inProgress}</h3>
      </div>

      <div className="bg-white rounded-xl border p-5 shadow-sm">
        <p className="text-gray-500 text-sm">Blocked</p>
        <h3 className="text-3xl font-bold text-red-600">{blocked}</h3>
      </div>
    </div>
  );
}