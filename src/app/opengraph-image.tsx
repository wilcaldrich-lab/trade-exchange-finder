import { ImageResponse } from "next/og";

export const alt = "Trade Exchange Finder, a directory of business barter exchanges";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f3eee4",
          color: "#1c1915",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 64,
              height: 64,
              border: "3px solid #1c1915",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
            }}
          >
            Bx
          </div>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: "#6e4710" }}>
            Trade exchange finder
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 76, lineHeight: 1, maxWidth: 900 }}>Find a business barter exchange</div>
          <div style={{ fontSize: 30, color: "#5c564c" }}>Published fees only. Missing figures stay blank.</div>
        </div>
        <div style={{ fontSize: 26 }}>barterexchanges.org</div>
      </div>
    ),
    { ...size },
  );
}
