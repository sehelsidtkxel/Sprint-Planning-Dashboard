import { UIButton, UIInput } from "./ui";

export default function AddStreamForm() {
  return (
    <div className="bg-white p-6 rounded-xl border">
      <h2 className="text-xl font-bold mb-4">
        Add Stream
      </h2>

      <UIInput placeholder="Stream Name" />

      <UIButton className="mt-4" size="lg">
        Save Stream
      </UIButton>
    </div>
  );
}