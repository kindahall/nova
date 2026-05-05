"use client";

import { CloudSun } from "lucide-react";

export function SystemStatus() {
  return (
    <div className="system-status" aria-label="System status">
      <CloudSun size={25} />
      <div>
        <strong>10:42 AM</strong>
        <span>May 20</span>
      </div>
    </div>
  );
}
