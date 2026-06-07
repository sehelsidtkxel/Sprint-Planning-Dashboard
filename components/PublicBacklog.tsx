export default function PublicBacklog({
  backlogItems,
}: {
  backlogItems: any[];
}) {
  const grouped = backlogItems.reduce((acc: any, item: any) => {
    const streamName = item.streams?.name || "Unassigned";

    if (!acc[streamName]) {
      acc[streamName] = [];
    }

    acc[streamName].push(item);

    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([streamName, items]: any) => (
        <div
          key={streamName}
          className="bg-white rounded-xl border shadow-sm p-6"
        >
          <h2 className="text-2xl font-bold mb-4">
            {streamName}
          </h2>

          <div className="space-y-3">
            {items.map((item: any) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 bg-slate-50"
              >
                <h3 className="font-semibold">
                  {item.title}
                </h3>

                <p className="text-gray-600 mt-1">
                  {item.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}