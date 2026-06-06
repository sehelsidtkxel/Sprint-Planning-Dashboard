interface Props {
  totalTasks: number;
}

export default function StreamSummary({
  totalTasks,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">

      <h2 className="text-3xl font-bold mb-4">
        EDGE 2.0
      </h2>

      <div className="flex gap-10 text-gray-600">

        <div>
          <span className="font-bold text-black">
            1
          </span>{" "}
          Sprint
        </div>

        <div>
          <span className="font-bold text-black">
            {totalTasks}
          </span>{" "}
          Items
        </div>

        <div>
          <span className="font-bold text-green-600">
            1
          </span>{" "}
          Done
        </div>

        <div>
          <span className="font-bold text-blue-600">
            0
          </span>{" "}
          In Progress
        </div>

      </div>

    </div>
  );
}