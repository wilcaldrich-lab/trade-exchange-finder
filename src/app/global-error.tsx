"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#080a10",
          color: "#e8eef7",
          fontFamily: '"Avenir Next", "Segoe UI", sans-serif',
        }}
      >
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "4rem 1rem" }}>
          <h1 style={{ fontSize: "2.5rem", lineHeight: 1, margin: 0 }}>Something went wrong</h1>
          <p style={{ marginTop: "0.75rem", color: "#a7b3c7" }}>The page did not finish loading. Try it again.</p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              height: "3rem",
              border: 0,
              borderRadius: "0.375rem",
              background: "#2ee0cc",
              color: "#080a10",
              fontWeight: 700,
              padding: "0 1rem",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
