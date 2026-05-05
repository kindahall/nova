"use client";

import { Bell, CheckCircle2 } from "lucide-react";
import type { NovaActivityEntry } from "@/lib/nova-system";
import { cn } from "@/lib/utils";

type NotificationStackProps = {
  activityLog: NovaActivityEntry[];
  onOpenActivity: () => void;
};

export function NotificationStack({ activityLog, onOpenActivity }: NotificationStackProps) {
  const liveEntries = activityLog.filter((entry) => /^\d/.test(entry.id)).slice(0, 2);

  if (!liveEntries.length) {
    return null;
  }

  return (
    <aside className="notification-stack" aria-label="Nova notifications" aria-live="polite">
      {liveEntries.map((entry) => (
        <button
          className={cn("notification-toast", entry.tone)}
          key={entry.id}
          type="button"
          onClick={onOpenActivity}
          aria-label={`Open Activity Center for ${entry.title}`}
        >
          <span className="notification-icon">{entry.tone === "info" ? <Bell size={15} /> : <CheckCircle2 size={15} />}</span>
          <span>
            <strong>{entry.title}</strong>
            <span>{entry.body}</span>
          </span>
          <time>{entry.time}</time>
        </button>
      ))}
    </aside>
  );
}
