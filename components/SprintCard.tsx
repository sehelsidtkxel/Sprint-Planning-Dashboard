import StatusBadge from "./StatusBadge";

interface SprintCardProps {
  sprint: any;
}

export default function SprintCard({
  sprint,
}: SprintCardProps) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <h3>{sprint.title}</h3>

      <p>
        <strong>Version:</strong> {sprint.version}
      </p>

      <p>
        <strong>Sprint Dates:</strong>{" "}
        {sprint.sprintDates}
      </p>

      <p>
        <strong>Release Date:</strong>{" "}
        {sprint.releaseDate}
      </p>

      <div
        style={{
          margin: "15px 0",
        }}
      >
        <StatusBadge
          status={sprint.status}
        />
      </div>

      <hr />

      {sprint.items.map((item: any) => (
        <div
          key={item.id}
          style={{
            padding: "10px 0",
          }}
        >
          <strong>{item.task}</strong>

          <br />

          <small>
            {item.feature}
          </small>

          <div
            style={{
              marginTop: "5px",
            }}
          >
            <StatusBadge
              status={item.status}
            />
          </div>
        </div>
      ))}
    </div>
  );
}