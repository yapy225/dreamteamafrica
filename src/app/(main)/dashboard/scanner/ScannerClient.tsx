"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  MapPin,
  Clock,
  Users,
  ScanLine,
  RotateCcw,
} from "lucide-react";

type TicketInfo = {
  type: "TICKET" | "RESERVATION";
  valid: boolean;
  id: string;
  eventTitle: string;
  eventVenue: string;
  eventAddress: string;
  eventDate: string;
  holder: string;
  tier?: string;
  price?: number;
  guests?: number;
  checkedIn: boolean;
  checkedInAt: string | null;
};

type ScanState =
  | { status: "scanning" }
  | { status: "loading" }
  | { status: "valid"; ticket: TicketInfo; checkInResult?: string }
  | { status: "already"; ticket: TicketInfo }
  | { status: "invalid"; message: string };

export default function ScannerClient() {
  const [state, setState] = useState<ScanState>({ status: "scanning" });
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const processingRef = useRef(false);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch {
        // already stopped
      }
    }
  }, []);

  const extractId = (text: string): string | null => {
    // URL format: https://dreamteamafrica.com/check/{id}
    const urlMatch = text.match(/\/check\/([a-zA-Z0-9_-]+)/);
    if (urlMatch) return urlMatch[1];
    // Raw ID (cuid)
    if (/^[a-z0-9]{20,}$/i.test(text)) return text;
    // Legacy JSON format
    try {
      const json = JSON.parse(text);
      return json.reservationId || json.ticketId || null;
    } catch {
      return null;
    }
  };

  const handleScan = useCallback(
    async (decodedText: string) => {
      if (processingRef.current) return;
      processingRef.current = true;

      const id = extractId(decodedText);
      if (!id) {
        setState({ status: "invalid", message: "QR code non reconnu" });
        processingRef.current = false;
        return;
      }

      setState({ status: "loading" });
      await stopScanner();

      try {
        // Fetch ticket info
        const res = await fetch(`/api/check/${id}`);
        if (!res.ok) {
          setState({ status: "invalid", message: "Billet introuvable" });
          processingRef.current = false;
          return;
        }

        const ticket: TicketInfo = await res.json();

        if (ticket.checkedIn) {
          setState({ status: "already", ticket });
          processingRef.current = false;
          return;
        }

        // Auto check-in
        const checkRes = await fetch(`/api/check/${id}`, { method: "POST" });
        const checkData = await checkRes.json();

        if (checkRes.ok) {
          setState({
            status: "valid",
            ticket,
            checkInResult: checkData.message,
          });
        } else {
          setState({ status: "already", ticket });
        }
      } catch {
        setState({ status: "invalid", message: "Erreur de connexion" });
      }

      processingRef.current = false;
    },
    [stopScanner],
  );

  const startScanner = useCallback(async () => {
    processingRef.current = false;
    setState({ status: "scanning" });

    if (!containerRef.current) return;

    // Small delay to ensure DOM is ready
    await new Promise((r) => setTimeout(r, 300));

    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (text) => handleScan(text),
        () => {},
      );
    } catch (err) {
      console.error("Scanner error:", err);
      setState({
        status: "invalid",
        message: "Impossible d'accéder à la caméra. Vérifiez les permissions.",
      });
    }
  }, [handleScan]);

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
    };
  }, [startScanner, stopScanner]);

  const reset = () => {
    startScanner();
  };

  const formatDate = (d: string) =>
    new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(d));

  const formatTime = (d: string) =>
    new Date(d).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <div className="mb-6 text-center">
        <h1 className="font-serif text-2xl font-bold text-dta-dark">
          Scanner billets
        </h1>
        <p className="mt-1 text-sm text-dta-char/70">
          Scannez le QR code du billet pour valider l&apos;entr&eacute;e
        </p>
      </div>

      {/* Scanner view */}
      {state.status === "scanning" && (
        <div className="overflow-hidden rounded-2xl bg-dta-dark shadow-lg">
          <div className="relative">
            <div id="qr-reader" ref={containerRef} className="w-full" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <ScanLine size={48} className="animate-pulse text-dta-accent/50" />
            </div>
          </div>
          <div className="p-4 text-center">
            <p className="text-sm text-white/60">
              Pointez la cam&eacute;ra vers le QR code
            </p>
          </div>
        </div>
      )}

      {/* Loading */}
      {state.status === "loading" && (
        <div className="rounded-2xl bg-white p-12 text-center shadow-lg">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-dta-sand border-t-dta-accent" />
          <p className="mt-4 text-sm text-dta-char/70">V&eacute;rification...</p>
        </div>
      )}

      {/* Valid - Check-in success */}
      {state.status === "valid" && (
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
          <div className="bg-green-500 p-6 text-center">
            <CheckCircle size={48} className="mx-auto text-white" />
            <h2 className="mt-2 text-xl font-bold text-white">
              Entr&eacute;e valid&eacute;e
            </h2>
          </div>
          <TicketDetails ticket={state.ticket} formatDate={formatDate} formatTime={formatTime} />
          <div className="p-4">
            <button onClick={reset} className="flex w-full items-center justify-center gap-2 rounded-xl bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark">
              <RotateCcw size={16} />
              Scanner un autre billet
            </button>
          </div>
        </div>
      )}

      {/* Already checked in */}
      {state.status === "already" && (
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
          <div className="bg-amber-500 p-6 text-center">
            <AlertTriangle size={48} className="mx-auto text-white" />
            <h2 className="mt-2 text-xl font-bold text-white">
              D&eacute;j&agrave; scann&eacute;
            </h2>
            {state.ticket.checkedInAt && (
              <p className="mt-1 text-sm text-white/80">
                Entr&eacute;e valid&eacute;e le{" "}
                {new Date(state.ticket.checkedInAt).toLocaleString("fr-FR")}
              </p>
            )}
          </div>
          <TicketDetails ticket={state.ticket} formatDate={formatDate} formatTime={formatTime} />
          <div className="p-4">
            <button onClick={reset} className="flex w-full items-center justify-center gap-2 rounded-xl bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark">
              <RotateCcw size={16} />
              Scanner un autre billet
            </button>
          </div>
        </div>
      )}

      {/* Invalid */}
      {state.status === "invalid" && (
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
          <div className="bg-red-500 p-6 text-center">
            <XCircle size={48} className="mx-auto text-white" />
            <h2 className="mt-2 text-xl font-bold text-white">
              Billet invalide
            </h2>
            <p className="mt-1 text-sm text-white/80">{state.message}</p>
          </div>
          <div className="p-4">
            <button onClick={reset} className="flex w-full items-center justify-center gap-2 rounded-xl bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark">
              <RotateCcw size={16} />
              R&eacute;essayer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TicketDetails({
  ticket,
  formatDate,
  formatTime,
}: {
  ticket: TicketInfo;
  formatDate: (d: string) => string;
  formatTime: (d: string) => string;
}) {
  return (
    <div className="space-y-3 p-5">
      <h3 className="font-serif text-lg font-bold text-dta-dark">
        {ticket.eventTitle}
      </h3>
      <div className="flex items-center gap-2 text-sm text-dta-char">
        <Calendar size={16} className="flex-shrink-0 text-dta-accent" />
        <span>{formatDate(ticket.eventDate)}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-dta-char">
        <Clock size={16} className="flex-shrink-0 text-dta-accent" />
        <span>{formatTime(ticket.eventDate)}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-dta-char">
        <MapPin size={16} className="flex-shrink-0 text-dta-accent" />
        <span>{ticket.eventVenue}</span>
      </div>
      {ticket.eventAddress && (
        <p className="pl-6 text-sm text-dta-char/70">{ticket.eventAddress}</p>
      )}

      <div className="mt-2 rounded-lg bg-dta-beige p-4">
        <p className="text-xs uppercase tracking-wider text-dta-taupe">Titulaire</p>
        <p className="mt-1 text-base font-bold text-dta-dark">{ticket.holder}</p>

        {ticket.type === "TICKET" && ticket.tier && (
          <>
            <p className="mt-3 text-xs uppercase tracking-wider text-dta-taupe">Cat&eacute;gorie</p>
            <p className="mt-1 font-semibold text-dta-accent">{ticket.tier}</p>
          </>
        )}

        {ticket.type === "RESERVATION" && ticket.guests && (
          <>
            <p className="mt-3 text-xs uppercase tracking-wider text-dta-taupe">Places</p>
            <p className="mt-1 flex items-center gap-1 font-semibold text-dta-accent">
              <Users size={14} />
              {ticket.guests} place{ticket.guests > 1 ? "s" : ""}
            </p>
          </>
        )}

        <p className="mt-3 text-xs uppercase tracking-wider text-dta-taupe">R&eacute;f.</p>
        <p className="mt-1 font-mono text-xs text-dta-char">
          {ticket.id.slice(0, 8).toUpperCase()}
        </p>
      </div>
    </div>
  );
}
