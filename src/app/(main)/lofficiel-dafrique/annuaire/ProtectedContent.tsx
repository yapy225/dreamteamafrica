"use client";

import { useEffect } from "react";

export default function ProtectedContent({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handler = (e: Event) => e.preventDefault();
    // Disable right-click
    document.addEventListener("contextmenu", handler);
    // Disable copy
    document.addEventListener("copy", handler);
    // Disable cut
    document.addEventListener("cut", handler);
    // Disable print (Ctrl+P)
    const keyHandler = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "p" || e.key === "P" || e.key === "s" || e.key === "S" || e.key === "u" || e.key === "U")
      ) {
        e.preventDefault();
      }
      // Disable PrintScreen
      if (e.key === "PrintScreen") {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", keyHandler);

    return () => {
      document.removeEventListener("contextmenu", handler);
      document.removeEventListener("copy", handler);
      document.removeEventListener("cut", handler);
      document.removeEventListener("keydown", keyHandler);
    };
  }, []);

  return (
    <div
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
      onDragStart={(e) => e.preventDefault()}
    >
      {children}
    </div>
  );
}
