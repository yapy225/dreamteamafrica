"use client";

import { useState, useEffect } from "react";

interface Props {
  targetDate: string;
}

export default function CountdownTimer({ targetDate }: Props) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = new Date(targetDate).getTime();

    const update = () => {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!mounted) return null;

  const blocks = [
    { value: timeLeft.days, label: "jours" },
    { value: timeLeft.hours, label: "heures" },
    { value: timeLeft.minutes, label: "min" },
    { value: timeLeft.seconds, label: "sec" },
  ];

  return (
    <div className="flex items-center gap-2">
      {blocks.map((b, i) => (
        <div key={b.label} className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-lg font-bold tabular-nums text-white backdrop-blur-sm sm:h-14 sm:w-14 sm:text-2xl">
              {String(b.value).padStart(2, "0")}
            </span>
            <span className="mt-1 text-[9px] uppercase tracking-wider text-white/50 sm:text-[10px]">
              {b.label}
            </span>
          </div>
          {i < blocks.length - 1 && (
            <span className="mb-4 text-lg font-bold text-white/30">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
