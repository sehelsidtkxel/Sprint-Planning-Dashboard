function formatDate(dateString?: string) {
  if (!dateString) return "Not set";

  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getDaysRemaining(dateString?: string) {
  if (!dateString) return null;

  const today = new Date();
  const releaseDate = new Date(dateString);

  today.setHours(0, 0, 0, 0);
  releaseDate.setHours(0, 0, 0, 0);

  const diff = releaseDate.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function UpcomingReleaseHero({
  tasks,
}: {
  tasks: any[];
}) {
  const upcoming = tasks
    .filter((task) => task.release_date)
    .filter((task) => new Date(task.release_date) >= new Date())
    .sort(
      (a, b) =>
        new Date(a.release_date).getTime() -
        new Date(b.release_date).getTime()
    )[0];

  if (!upcoming) {
    return null;
  }

  const daysRemaining = getDaysRemaining(upcoming.release_date);

  return (
    <div className="mb-6 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-800 text-white px-6 py-5 shadow-lg">
      <div className="flex items-center justify-between gap-6">
        <div>
          <p className="text-sm uppercase tracking-widest text-blue-200 font-semibold">
            🚀 Upcoming Release
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {upcoming.title}
          </h2>

          <p className="text-blue-100 mt-1 text-base">
            {upcoming.streams?.name || "Unassigned Stream"}
          </p>

          <div className="flex gap-2 mt-3 flex-wrap">
            <span className="bg-white/15 px-4 py-2 rounded-full text-sm font-semibold">
              Phase: {upcoming.phase}
            </span>

            <span className="bg-white/15 px-4 py-2 rounded-full text-sm font-semibold">
              Status: {upcoming.status}
            </span>
          </div>
        </div>

        <div className="bg-white text-slate-900 rounded-2xl p-6 min-w-[220px] text-center shadow-md">
          <p className="text-sm text-slate-500 font-semibold">
            Release Date
          </p>

          <p className="text-2xl font-bold mt-2">
            {formatDate(upcoming.release_date)}
          </p>

          <p className="mt-3 text-blue-600 font-bold">
            {daysRemaining === 0
              ? "Releasing Today"
              : `${daysRemaining} days remaining`}
          </p>
        </div>
      </div>
    </div>
  );
}