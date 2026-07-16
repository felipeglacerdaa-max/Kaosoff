"use client";

import { useEffect, useState } from "react";
import { getTimeRemaining } from "@/lib/utils";

interface CountdownTimerProps {
  targetDate: string;
  onComplete?: () => void;
  className?: string;
}

export function CountdownTimer({
  targetDate,
  onComplete,
  className,
}: CountdownTimerProps) {
  const [time, setTime] = useState(getTimeRemaining(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getTimeRemaining(targetDate);
      setTime(remaining);
      if (remaining.total <= 0) {
        clearInterval(interval);
        onComplete?.();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  if (time.total <= 0) return null;

  const units = [
    { label: "dias", value: time.days },
    { label: "horas", value: time.hours },
    { label: "min", value: time.minutes },
    { label: "seg", value: time.seconds },
  ];

  return (
    <div className={className}>
      <div className="flex gap-6 md:gap-10">
        {units.map((unit) => (
          <div key={unit.label} className="text-center">
            <span className="block font-display text-3xl md:text-5xl tabular-nums">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="block text-[10px] tracking-widest uppercase text-ash mt-1">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
