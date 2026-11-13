"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          backgroundColor: "#05060a",
          backgroundImage:
            "linear-gradient(rgba(57, 240, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(57, 240, 255, 0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          color: "#e9f6ef",
          fontFamily: '"Avenir Next", "Segoe UI", sans-serif',
        }}
      >
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "4rem 1rem" }}>
          <p
            style={{
              margin: 0,
              color: "#ff3d9a",
              fontFamily: "ui-monospace, monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            [ System ]
          </p>
          <h1 style={{ fontSize: "2.5rem", lineHeight: 1.15, margin: "0.5rem 0 0" }}>Something went wrong</h1>
          <p style={{ marginTop: "0.75rem", color: "#b7c6ce" }}>The page did not finish loading. Try it again.</p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              height: "3rem",
              border: "1px solid #e7ffab",
              borderRadius: "2px",
              background: "#b6ff3c",
              color: "#071208",
              fontFamily: "ui-monospace, monospace",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "0 1rem",
              boxShadow: "0 0 16px rgba(182, 255, 60, 0.38)",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
