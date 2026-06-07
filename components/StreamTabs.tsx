interface Stream {
  id: string;
  name: string;
  color: string;
}

interface Props {
  streams: Stream[];
  selectedStream: string;
  onSelectStream: (streamId: string) => void;
}

function getDotColor(color?: string) {
  switch (color?.toLowerCase()) {
    case "green":
      return "bg-green-500";
    case "orange":
      return "bg-orange-500";
    case "red":
      return "bg-red-500";
    case "purple":
      return "bg-purple-500";
    default:
      return "bg-blue-500";
  }
}

export default function StreamTabs({
  streams,
  selectedStream,
  onSelectStream,
}: Props) {
  return (
    <div className="flex gap-3 mb-6 flex-wrap">
      <button
        onClick={() => onSelectStream("all")}
        className={`px-5 py-3 rounded-xl border font-semibold ${
          selectedStream === "all"
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white hover:bg-gray-50"
        }`}
      >
        All Streams
      </button>

      {streams.map((stream) => (
        <button
          key={stream.id}
          onClick={() => onSelectStream(stream.id)}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition ${
            selectedStream === stream.id
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          <div className={`w-3 h-3 rounded-full ${getDotColor(stream.color)}`} />
          <span className="font-semibold">{stream.name}</span>
        </button>
      ))}

      <button
  onClick={() => onSelectStream("backlog")}
  className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition ${
    selectedStream === "backlog"
      ? "bg-purple-600 text-white border-purple-600"
      : "bg-white hover:bg-gray-50"
  }`}
>
  <span>🏷</span>
  <span className="font-semibold">Backlog</span>
</button>
    </div>
  );
}