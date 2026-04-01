"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", fontFamily: "Georgia, serif" }}>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <h1 style={{ fontSize: "1.5rem", color: "#1a1a1a" }}>Une erreur est survenue</h1>
            <p style={{ color: "#666", marginTop: "0.5rem" }}>Nous avons été notifiés et travaillons à la résoudre.</p>
            <button
              onClick={reset}
              style={{ marginTop: "1.5rem", padding: "0.75rem 1.5rem", background: "#C4704B", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}
            >
              Réessayer
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
