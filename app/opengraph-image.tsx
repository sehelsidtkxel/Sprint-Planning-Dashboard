import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const alt = "framebrand · Sprint & Release Hub";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Link preview card shown when the dashboard URL is shared (Slack, Teams, email).
export default async function OpenGraphImage() {
  const logoSvg = await readFile(
    path.join(process.cwd(), "public", "signal-sprint-release-hub.svg"),
    "utf8"
  );
  const logoSrc = `data:image/svg+xml;base64,${Buffer.from(
    logoSvg.replaceAll("currentColor", "#161616")
  ).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#f8fafc",
          borderTop: "16px solid #161616",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={513} height={60} alt="" />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, color: "#0f172a" }}>
            Sprint & Release Hub
          </div>
          <div style={{ fontSize: 34, color: "#475569", marginTop: 20 }}>
            Sprint progress, release dates and backlog across all streams.
          </div>
        </div>
      </div>
    ),
    size
  );
}
