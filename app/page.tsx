export default function HomePage() {
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

      <div
        style={{
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          background: "#fff"
        }}
      >
        Application is running successfully 🚀
      </div>
    </main>
  );
}
