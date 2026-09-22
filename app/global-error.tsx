"use client";

// This replaces the root layout, so globals.css and the font variables never
// load. Everything here is inline and self-contained on purpose: it has to
// render correctly on the one occasion the rest of the app could not.
const palette = {
  cream: "#F1EAD8",
  darkEarth: "#68604D",
  earthInk: "#5F5746",
  lightSage: "#BEC5A4",
};

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en-GB">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
          backgroundColor: palette.cream,
          color: palette.darkEarth,
          fontFamily: "Georgia, 'Times New Roman', serif",
          lineHeight: 1.6,
        }}
      >
        <main style={{ maxWidth: "34rem" }}>
          <h1 style={{ margin: 0, fontSize: "2.25rem", lineHeight: 1.15, fontWeight: 400 }}>
            Something has gone properly wrong
          </h1>
          <p
            style={{
              marginTop: "1.25rem",
              fontSize: "1.0625rem",
              color: palette.earthInk,
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            GrowGuide hit an error it could not recover from. A reload is the best first step.
            Anything you saved about your plot lives in this browser and is not affected.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "2rem",
              minHeight: "2.75rem",
              padding: "0.75rem 1.25rem",
              borderRadius: "10px",
              border: "none",
              backgroundColor: palette.darkEarth,
              color: palette.cream,
              fontSize: "0.9375rem",
              fontWeight: 600,
              fontFamily: "system-ui, -apple-system, sans-serif",
              cursor: "pointer",
            }}
          >
            Reload GrowGuide
          </button>
          {error.digest && (
            <p
              style={{
                marginTop: "2.5rem",
                paddingTop: "1.25rem",
                borderTop: `1px solid ${palette.lightSage}`,
                fontSize: "0.875rem",
                color: palette.earthInk,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              }}
            >
              Reference {error.digest}
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
