"use client";

import { CloudSun } from "lucide-react";
import { useEffect, useState } from "react";
import type { NovaSystemState } from "@/lib/nova-system";

type SystemStatusProps = {
  system: NovaSystemState;
  onOpenActivity: () => void;
};

function formatClock(date: Date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function formatDate(date: Date) {
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function SystemStatus({ system, onOpenActivity }: SystemStatusProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <button className="system-status" type="button" onClick={onOpenActivity} aria-label="Open Activity Center">
      <CloudSun size={25} />
      <div>
        <strong>{formatClock(now)}</strong>
        <span>
          {formatDate(now)} - {system.activeSpace}
        </span>
      </div>
    </button>
  );
}
