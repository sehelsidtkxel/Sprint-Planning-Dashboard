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
    .filter(
      (task) =>
        new Date(task.release_date) >= new Date()
    )
    .sort(
      (a, b) =>
        new Date(a.release_date).getTime() -
        new Date(b.release_date).getTime()
    )[0];

  if (!upcoming) {
    return null;
  }

  const daysRemaining = getDaysRemaining(
    upcoming.release_date
  );

  return (
  <div className="mb-5 rounded-2xl bg-gradient-to-r from-slate-950 via-blue-900 to-indigo-800 text-white px-5 py-4 shadow-md">
    <div className="flex items-center justify-between gap-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-blue-200 font-semibold">
          🚀 Upcoming Release
        </p>

        <div className="flex items-center gap-4 mt-2 flex-wrap">
          <h2 className="text-2xl font-bold">
            {upcoming.title}
          </h2>

          <span className="text-sm text-blue-100">
            {upcoming.streams?.name || "Unassigned Stream"}
          </span>
        </div>

        <div className="flex gap-2 mt-3 flex-wrap">
          <span className="bg-white/15 px-3 py-1 rounded-full text-xs font-semibold">
            Phase: {upcoming.phase}
          </span>

          <span className="bg-white/15 px-3 py-1 rounded-full text-xs font-semibold">
            Status: {upcoming.status}
          </span>
        </div>
      </div>

      <div className="bg-white text-slate-900 rounded-xl px-5 py-3 min-w-[190px] text-center shadow-sm">
        <p className="text-xs font-semibold text-slate-500">
          Release Date
        </p>

        <p className="text-lg font-bold mt-1">
          {formatDate(upcoming.release_date)}
        </p>

        <p className="mt-1 text-blue-600 text-sm font-bold">
          {daysRemaining === 0
            ? "Releasing Today"
            : `${daysRemaining} days remaining`}
        </p>
      </div>
    </div>
  </div>
);
}