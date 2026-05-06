"use client";

import { Bell, CheckCircle2, Command, FileClock, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import type { WindowKey } from "@/data/nova";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import type { NovaSystemActions, NovaSystemState } from "@/lib/nova-system";
import { cn } from "@/lib/utils";

type ActivityCenterWindowProps = {
  system: NovaSystemState;
  systemActions: NovaSystemActions;
  onOpenWindow: (window: WindowKey) => void;
  onClose?: () => void;
  onMinimize?: () => void;
  onFocus?: () => void;
};

const shortcuts = [
  ["Ctrl/Cmd K", "Nova Command"],
  ["Ctrl/Cmd Tab", "Mission Control"],
  ["Ctrl/Cmd W", "Close top window"],
  ["Ctrl/Cmd 1", "Nova Hub"],
  ["Ctrl/Cmd 2", "My Space"],
  ["Ctrl/Cmd 3", "Spaces"],
  ["Ctrl/Cmd 4", "AI Center"],
  ["Ctrl/Cmd 5", "Store"],
  ["Ctrl/Cmd 6", "Guard"],
];

export function ActivityCenterWindow({ system, systemActions, onOpenWindow, onClose, onMinimize, onFocus }: ActivityCenterWindowProps) {
  const connectedCount = system.aiProviders.filter((provider) => provider.state !== "Disconnected").length;
  const guardCount = system.guardPermissions.filter((permission) => permission.enabled).length;

  return (
    <WindowFrame
      title="Activity Center"
      subtitle="System memory, notifications, and shortcuts"
      icon={<Bell size={18} />}
      className="window--activity-center"
      tone="dark"
      windowSize={system.windowSizes["activity-center"]}
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
      onAssist={systemActions.runHubPulse}
      onResizeEnd={(size) => systemActions.setWindowSize("activity-center", size)}
    >
      <div className="cards-grid">
        <button className="glass-card action-card" type="button" onClick={() => onOpenWindow("my-space")}>
          <FileClock size={20} />
          <h3>Files indexed</h3>
          <p>My Space keeps your local working set visible across sessions.</p>
          <div className="metric">{system.files.length}</div>
        </button>
        <button className="glass-card action-card" type="button" onClick={() => onOpenWindow("ai-center")}>
          <Sparkles size={20} />
          <h3>AI routing</h3>
          <p>{system.selectedProvider} is the current routing focus.</p>
          <div className="metric">{connectedCount}</div>
        </button>
        <button className="glass-card action-card" type="button" onClick={() => onOpenWindow("nova-guard")}>
          <ShieldCheck size={20} />
          <h3>Guard gates</h3>
          <p>Permission changes are recorded in the system activity feed.</p>
          <div className="metric">{guardCount}</div>
        </button>
      </div>

      <div className="wide-grid">
        <div className="glass-card">
          <h3>Activity feed</h3>
          <div className="activity-feed">
            {system.activityLog.map((entry) => (
              <div className={cn("activity-entry", entry.tone)} key={entry.id}>
                <span className="activity-icon">
                  <CheckCircle2 size={15} />
                </span>
                <span>
                  <strong>{entry.title}</strong>
                  <span>{entry.body}</span>
                </span>
                <time>{entry.time}</time>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card">
          <h3>Keyboard control</h3>
          <div className="shortcut-grid">
            {shortcuts.map((shortcut) => (
              <div className="shortcut-row" key={shortcut[0]}>
                <kbd>{shortcut[0]}</kbd>
                <span>{shortcut[1]}</span>
              </div>
            ))}
          </div>
          <div className="module-list">
            <button className="module-chip chip-button" type="button" onClick={systemActions.runHubPulse}>
              <Command size={14} />
              Refresh system
            </button>
            <button className="module-chip chip-button" type="button" onClick={systemActions.resetSystem}>
              <RotateCcw size={14} />
              Reset session
            </button>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}
