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
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "20px",
        background: "#ffffff"
      }}
    >
      <h3
        style={{
          marginTop: 0
        }}
      >
        {sprint.title}
      </h3>

      <p>
        <strong>Version:</strong> {sprint.version}
      </p>

      <p>
        <strong>Sprint Dates:</strong> {sprint.sprintDates}
      </p>

      <p>
        <strong>Release Date:</strong> {sprint.releaseDate}
      </p>

      <div
        style={{
          marginTop: "15px"
        }}
      >
        <StatusBadge
          status={sprint.status}
        />
      </div>

      <hr
        style={{
          margin: "20px 0"
        }}
      />

      {sprint.items.map((item: any) => (
        <div
          key={item.id}
          style={{
            marginBottom: "15px"
          }}
        >
          <strong>{item.phase}</strong>

          <p>{item.tasks}</p>

          <small>
            {item.features}
          </small>
        </div>
      ))}
    </div>
  );
}
