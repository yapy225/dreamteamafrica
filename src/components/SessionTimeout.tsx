"use client";

import { useEffect, useState, useCallback } from "react";
import { signOut } from "next-auth/react";

const CHECK_INTERVAL = 60_000; // 60 seconds
const WARNING_THRESHOLD = 60; // Show warning when <=60 seconds remain
const SESSION_MAX_AGE = 1800; // 30 minutes (must match auth.ts)

export default function SessionTimeout() {
  const [showWarning, setShowWarning] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session");
      const session = await res.json();

      // No active session — nothing to warn about
      if (!session?.user) {
        setIsAuthenticated(false);
        setShowWarning(false);
        return;
      }

      setIsAuthenticated(true);

      // Calculate time remaining based on session expiry
      const expires = session.expires ? new Date(session.expires).getTime() : 0;
      const now = Date.now();
      const secondsRemaining = Math.floor((expires - now) / 1000);

      if (secondsRemaining <= WARNING_THRESHOLD && secondsRemaining > 0) {
        setShowWarning(true);
      } else if (secondsRemaining <= 0) {
        // Session expired
        await signOut({ callbackUrl: "/auth/signin" });
      } else {
        setShowWarning(false);
      }
    } catch {
      // Network error — ignore silently
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      // Hitting the session endpoint with the existing cookie refreshes the JWT
      await fetch("/api/auth/session");
      setShowWarning(false);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    // Initial check
    checkSession();

    const interval = setInterval(checkSession, CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [checkSession]);

  // Set a timeout to force sign-out 1 minute after warning appears
  useEffect(() => {
    if (!showWarning) return;

    const timeout = setTimeout(async () => {
      await signOut({ callbackUrl: "/auth/signin" });
    }, 60_000);

    return () => clearTimeout(timeout);
  }, [showWarning]);

  if (!showWarning || !isAuthenticated) return null;

  return (
    <div
      role="alert"
      onClick={refreshSession}
      className="fixed left-0 right-0 top-0 z-[9999] cursor-pointer bg-amber-600 px-4 py-3 text-center text-sm font-medium text-white shadow-lg transition-colors hover:bg-amber-700"
    >
      Votre session expire dans 1 minute. Cliquez ici pour rester connect&eacute;.
    </div>
  );
}
