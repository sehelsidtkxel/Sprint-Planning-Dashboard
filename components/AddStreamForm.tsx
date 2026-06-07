export default function AddStreamForm() {
  return (
    <div className="bg-white p-6 rounded-xl border">
      <h2 className="text-xl font-bold mb-4">
        Add Stream
      </h2>

      <input
        className="border rounded-lg p-3 w-full"
        placeholder="Stream Name"
      />

      <button className="mt-4 bg-blue-600 text-white px-5 py-3 rounded-lg">
        Save Stream
      </button>
    </div>
  );
}