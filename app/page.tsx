async function getData() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/sprints`,
    {
      next: {
        revalidate: 60
      }
    }
  );

  if (!response.ok) {
    return null;
  }

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
        fontFamily: "Arial"
      }}
    >
      <h1
        style={{
          fontSize: "36px",
          marginBottom: "10px"
        }}
      >
        Sprint Planning Dashboard
      </h1>

      <p
        style={{
          color: "#666",
          marginBottom: "30px"
        }}
      >
        Live data powered by Google Sheets
      </p>

      {!data && (
        <div>
          Waiting for Google Sheets connection...
        </div>
      )}

      {data?.streams?.map((stream: any) => (
        <div
          key={stream.id}
          style={{
            marginBottom: "30px",
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "20px"
          }}
        >
          <h2>{stream.name}</h2>

          <p>
            Sprints: {stream.sprints.length}
          </p>
        </div>
      ))}
    </main>
  );
}
