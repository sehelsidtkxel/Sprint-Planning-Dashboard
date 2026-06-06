export default function StreamTabs() {
  const tabs = [
    {
      name: "EDGE 2.0",
      count: "3 / 14",
      active: true,
    },
    {
      name: "LEADS",
      count: "2 / 10",
      active: false,
    },
    {
      name: "FILTERGO",
      count: "1 / 8",
      active: false,
    },
    {
      name: "DATA WAREHOUSE",
      count: "3 / 12",
      active: false,
    },
  ];

  return (
    <div className="flex gap-3 mb-6 flex-wrap">

      {tabs.map((tab) => (

        <button
          key={tab.name}
          className={`
            flex
            items-center
            gap-2
            px-5
            py-3
            rounded-xl
            border
            transition

            ${
              tab.active
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white hover:bg-gray-50"
            }
          `}
        >
          <div
            className={`
              w-3
              h-3
              rounded-full
              ${
                tab.active
                  ? "bg-white"
                  : "bg-green-500"
              }
            `}
          />

          <span className="font-semibold">
            {tab.name}
          </span>

          <span className="text-sm opacity-80">
            {tab.count}
          </span>

        </button>

      ))}

    </div>
  );
}