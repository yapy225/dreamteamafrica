"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const LEGAL_PATHS = [
  "/conditions-generales",
  "/conditions-utilisation",
  "/mentions-legales",
  "/politique-cookies",
];

const STORAGE_KEY = "dta_bfp";

function getFingerprint(): string {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return stored;
  const fp = Math.random().toString(36).slice(2) + Date.now().toString(36);
  localStorage.setItem(STORAGE_KEY, fp);
  return fp;
}

function sendSignal(signal: string) {
  try {
    const fp = getFingerprint();
    navigator.sendBeacon(
      "/api/behavior",
      JSON.stringify({ signal, fp }),
    );
  } catch {
    // silent
  }
}

export default function BehaviorTracker() {
  const pathname = usePathname();
  const lastNav = useRef(Date.now());

  // Track legal page views
  useEffect(() => {
    if (LEGAL_PATHS.some((p) => pathname.startsWith(p))) {
      sendSignal("cgv_view");
    }

    // Detect rapid navigation (<1s between pages)
    const now = Date.now();
    if (now - lastNav.current < 1000) {
      sendSignal("rapid_nav");
    }
    lastNav.current = now;
  }, [pathname]);

  // Detect DevTools (resize-based heuristic)
  useEffect(() => {
    let devtoolsSent = false;
    const threshold = 160;

    const check = () => {
      const widthDiff = window.outerWidth - window.innerWidth > threshold;
      const heightDiff = window.outerHeight - window.innerHeight > threshold;
      if ((widthDiff || heightDiff) && !devtoolsSent) {
        devtoolsSent = true;
        sendSignal("devtools_open");
      }
    };

    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Detect right-click context menu (source inspect attempt)
  useEffect(() => {
    let count = 0;
    const handler = (e: MouseEvent) => {
      count++;
      if (count >= 3) {
        sendSignal("source_inspect");
        count = 0;
      }
    };
    document.addEventListener("contextmenu", handler);
    return () => document.removeEventListener("contextmenu", handler);
  }, []);

  // Inject fingerprint into fetch headers for checkout friction
  useEffect(() => {
    const fp = getFingerprint();
    const originalFetch = window.fetch;
    window.fetch = function (input, init) {
      const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : (input as Request).url;
      if (url.includes("/api/checkout")) {
        init = init || {};
        const headers = new Headers(init.headers);
        headers.set("x-behavior-fp", fp);
        init.headers = headers;
      }
      return originalFetch.call(this, input, init);
    };
    return () => { window.fetch = originalFetch; };
  }, []);

  return null;
}
