"use client";

import { CloudSun } from "lucide-react";
import { useEffect, useState } from "react";
import type { NovaSystemState } from "@/lib/nova-system";

type SystemStatusProps = {
  system: NovaSystemState;
  onOpenWeather: () => void;
};

function formatClock(date: Date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function formatDate(date: Date) {
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function localTemp() {
  const hour = new Date().getHours();
  return 15 + (new Date().getDate() % 5) + (hour > 11 && hour < 18 ? 4 : hour < 7 ? -2 : 1);
}

export function SystemStatus({ system, onOpenWeather }: SystemStatusProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <button className="system-status" type="button" onClick={onOpenWeather} aria-label="Open Weather">
      <CloudSun size={25} />
      <div>
        <strong>{formatClock(now)}</strong>
        <span>
          {localTemp()}°C - {formatDate(now)} - {system.activeSpace}
        </span>
      </div>
    </button>
  );
}
