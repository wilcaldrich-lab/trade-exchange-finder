import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#080a10",
          color: "#2ee0cc",
          border: "2px solid #2ee0cc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 15,
          fontWeight: 700,
        }}
      >
        Bx
      </div>
    ),
    { ...size },
  );
}
