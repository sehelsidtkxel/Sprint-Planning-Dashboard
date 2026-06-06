async function getData() {
  const response = await fetch(
    "/api/sprints",
    {
      cache: "no-store",
    }
  );

  return response.json();
}
export default async function HomePage() {
  const data = await getData();

  return (
    <main
      style={{
        padding: "40px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "Arial",
      }}
    >
      <h1
        style={{
          fontSize: "36px",
          marginBottom: "10px",
        }}
      >
        Sprint Planning Dashboard
      </h1>

      <p
        style={{
          color: "#666",
          marginBottom: "30px",
        }}
      >
        Live data powered by Google Sheets
      </p>

      {data.tasks.map((task: any, index: number) => (
        <div
          key={index}
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "20px",
            background: "#fff",
          }}
        >
          <h2>{task.phase}</h2>

          <p>
            <strong>Dates:</strong> {task.dates}
          </p>

          <p>
            <strong>Category:</strong> {task.category}
          </p>

          <p>
            <strong>Resources:</strong> {task.resources}
          </p>

          <p>
            <strong>Task:</strong> {task.task}
          </p>

          <p>
            <strong>Feature:</strong> {task.feature}
          </p>

          <p>
            <strong>Comments:</strong> {task.comments}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            <span
              style={{
                background:
                  task.status === "Done"
                    ? "green"
                    : "orange",
                color: "white",
                padding: "4px 10px",
                borderRadius: "20px",
              }}
            >
              {task.status}
            </span>
          </p>
        </div>
      ))}
    </main>
  );
}