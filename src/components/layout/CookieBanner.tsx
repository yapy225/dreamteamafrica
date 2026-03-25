"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const COOKIE_KEY = "dta_consent";

type ConsentChoice = "granted" | "denied";

function getStoredConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(COOKIE_KEY);
  if (v === "granted" || v === "denied") return v;
  return null;
}

function applyConsent(choice: ConsentChoice) {
  // Google Consent Mode v2 update
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  }
  if (choice === "granted") {
    gtag("consent", "update", {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted",
    });
    // Facebook Pixel — grant consent
    if (typeof window.fbq === "function") {
      window.fbq("consent", "grant");
    }
  } else {
    gtag("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
  }
}

declare global {
  interface Window {
    dataLayer: unknown[];
    fbq: (...args: unknown[]) => void;
  }
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored) {
      applyConsent(stored);
    } else {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_KEY, "granted");
    applyConsent("granted");
    setVisible(false);
  };

  const handleRefuse = () => {
    localStorage.setItem(COOKIE_KEY, "denied");
    applyConsent("denied");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[9999] p-4 sm:p-6">
      <div className="mx-auto max-w-2xl rounded-2xl border border-dta-sand bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          <div className="flex-1">
            <p className="text-sm font-semibold text-dta-dark">
              Ce site utilise des cookies
            </p>
            <p className="mt-1 text-xs leading-relaxed text-dta-char/70">
              Nous utilisons des cookies pour mesurer l&apos;audience, personnaliser
              les publicit&eacute;s et am&eacute;liorer votre exp&eacute;rience.
              Vous pouvez accepter ou refuser.{" "}
              <Link
                href="/politique-cookies"
                className="underline hover:text-dta-accent"
              >
                En savoir plus
              </Link>
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              onClick={handleRefuse}
              className="rounded-full border border-dta-sand px-4 py-2 text-xs font-semibold text-dta-char transition-colors hover:bg-gray-100"
            >
              Refuser
            </button>
            <button
              onClick={handleAccept}
              className="rounded-full bg-dta-accent px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-dta-accent-dark"
            >
              Accepter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
