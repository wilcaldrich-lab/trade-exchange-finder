import { ImageResponse } from "next/og";
import { getExchange } from "@/lib/catalog";
import { NOT_PUBLISHED } from "@/lib/format";
import { locationLine } from "@/lib/places";

export const alt = "Business barter exchange";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const exchange = await getExchange(slug);
  const name = exchange?.name || "Exchange not listed";
  const place = exchange ? locationLine(exchange) : "";
  const line = place && place !== NOT_PUBLISHED ? place : "Business barter exchange";
  const titleSize = name.length > 42 ? 56 : 72;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#05060a",
          backgroundImage:
            "linear-gradient(rgba(57, 240, 255, 0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(57, 240, 255, 0.09) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          color: "#e9f6ef",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 64,
              height: 64,
              border: "3px solid #b6ff3c",
              color: "#b6ff3c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
            }}
          >
            Bx
          </div>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: "#39f0ff" }}>
            Trade exchange finder
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 3, textTransform: "uppercase", color: "#ff3d9a" }}>
            [ Listing ]
          </div>
          <div style={{ fontSize: titleSize, lineHeight: 1.05, maxWidth: 1000, color: "#e9f6ef" }}>{name}</div>
          <div style={{ fontSize: 30, color: "#b7c6ce" }}>{line}</div>
        </div>
        <div style={{ fontSize: 26, color: "#b6ff3c" }}>barterexchanges.org</div>
      </div>
    ),
    { ...size },
  );
}
