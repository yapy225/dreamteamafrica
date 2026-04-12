"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ScanLine, CheckCircle, XCircle, RotateCcw, Wallet } from "lucide-react";

type ScanState =
  | { status: "idle" }
  | { status: "scanning" }
  | { status: "scanned"; qrToken: string }
  | { status: "loading" }
  | { status: "success"; data: { exposant: string; montantNtbc: number; commission: number; netExposant: number } }
  | { status: "error"; message: string };

export default function NtbcScannerClient({
  soldeNtbc,
  exposantName,
  qrToken,
}: {
  soldeNtbc: number;
  exposantName: string;
  qrToken: string;
}) {
  const [state, setState] = useState<ScanState>({ status: "idle" });
  const [montant, setMontant] = useState("");
  const [label, setLabel] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setState({ status: "scanning" });
    } catch {
      setState({ status: "error", message: "Impossible d'accéder à la caméra" });
    }
  };

  // Scan QR avec polling canvas
  useEffect(() => {
    if (state.status !== "scanning") return;
    let animFrame: number;
    let jsQR: any = null;

    // Try to load jsQR
    import("jsqr").then((mod) => { jsQR = mod.default; }).catch(() => {});

    const scan = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
        animFrame = requestAnimationFrame(scan);
        return;
      }
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(video, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      if (jsQR) {
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          try {
            const parsed = JSON.parse(code.data);
            if (parsed.type === "ntbc_visiteur" && parsed.qrToken) {
              stopCamera();
              setState({ status: "scanned", qrToken: parsed.qrToken });
              return;
            }
          } catch {}
        }
      }
      animFrame = requestAnimationFrame(scan);
    };

    animFrame = requestAnimationFrame(scan);
    return () => { cancelAnimationFrame(animFrame); };
  }, [state.status, stopCamera]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const handlePaiement = async () => {
    if (!montant || state.status !== "scanned") return;
    setState({ status: "loading" });

    try {
      const res = await fetch("/api/ntbc/paiement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qrToken: (state as any).qrToken,
          montant: Number(montant),
          label: label || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setState({ status: "error", message: data.error || "Erreur" });
        return;
      }

      // Son de succès
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(523, ctx.currentTime);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.setValueAtTime(659, ctx.currentTime + 0.15);
        gain2.gain.setValueAtTime(0.3, ctx.currentTime + 0.15);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc2.start(ctx.currentTime + 0.15);
        osc2.stop(ctx.currentTime + 0.35);
        setTimeout(() => ctx.close(), 500);
      } catch {}

      setState({ status: "success", data });
    } catch (err) {
      setState({ status: "error", message: "Erreur réseau" });
    }
  };

  const reset = () => {
    setState({ status: "idle" });
    setMontant("");
    setLabel("");
  };

  return (
    <div className="space-y-6 py-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Encaisser un paiement</h1>
        <p className="mt-1 flex items-center justify-center gap-2 text-sm text-slate-500">
          <Wallet className="h-4 w-4" /> {soldeNtbc} NTBC · {exposantName}
        </p>
      </div>

      {/* IDLE */}
      {state.status === "idle" && (
        <button
          onClick={startCamera}
          className="mx-auto flex flex-col items-center gap-3 rounded-2xl bg-slate-100 px-12 py-16 hover:bg-slate-200"
        >
          <ScanLine className="h-12 w-12 text-[#0D2B1E]" />
          <span className="font-semibold text-[#0D2B1E]">Scanner le QR du visiteur</span>
        </button>
      )}

      {/* SCANNING */}
      {state.status === "scanning" && (
        <div className="relative overflow-hidden rounded-2xl bg-black">
          <video ref={videoRef} autoPlay playsInline className="w-full" />
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute inset-0 rounded-2xl border-4 border-[#C9A84C]/50 pointer-events-none" />
          <p className="absolute bottom-4 left-0 right-0 text-center text-sm text-white">
            Pointez vers le QR du visiteur
          </p>
        </div>
      )}

      {/* SCANNED — saisir montant */}
      {state.status === "scanned" && (
        <div className="space-y-4">
          <div className="rounded-xl bg-green-50 p-4 text-center">
            <CheckCircle className="mx-auto h-8 w-8 text-green-500" />
            <p className="mt-2 font-semibold text-green-700">QR scanné</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Montant NTBC</label>
            <input
              type="number"
              min="0.01"
              max="1000"
              step="0.01"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              placeholder="Ex: 5"
              className="w-full rounded-xl border px-4 py-3 text-lg font-semibold focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
              autoFocus
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Label (optionnel)</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ex: Plat du jour"
              className="w-full rounded-xl border px-4 py-3 focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
            />
          </div>

          <button
            onClick={handlePaiement}
            disabled={!montant}
            className="w-full rounded-xl bg-[#0D2B1E] py-3 font-semibold text-white disabled:opacity-50"
          >
            Encaisser {montant || "..."} NTBC
          </button>
          <button onClick={reset} className="w-full text-sm text-slate-400 hover:text-slate-600">
            Annuler
          </button>
        </div>
      )}

      {/* LOADING */}
      {state.status === "loading" && (
        <div className="py-12 text-center text-slate-400">Traitement...</div>
      )}

      {/* SUCCESS */}
      {state.status === "success" && (
        <div className="space-y-4 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="text-xl font-bold text-green-700">Paiement reçu !</h2>
          <div className="rounded-xl bg-white p-4 shadow-sm text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Montant</span>
              <span className="font-semibold">{state.data.montantNtbc} NTBC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Commission (4%)</span>
              <span className="text-slate-500">-{state.data.commission} NTBC</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-semibold">Net reçu</span>
              <span className="font-bold text-green-600">{state.data.netExposant} NTBC</span>
            </div>
          </div>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0D2B1E] px-6 py-3 font-semibold text-white"
          >
            <RotateCcw className="h-4 w-4" /> Nouveau scan
          </button>
        </div>
      )}

      {/* ERROR */}
      {state.status === "error" && (
        <div className="space-y-4 text-center">
          <XCircle className="mx-auto h-16 w-16 text-red-500" />
          <p className="font-semibold text-red-600">{state.message}</p>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-6 py-3 font-semibold hover:bg-slate-200"
          >
            <RotateCcw className="h-4 w-4" /> Réessayer
          </button>
        </div>
      )}
    </div>
  );
}
