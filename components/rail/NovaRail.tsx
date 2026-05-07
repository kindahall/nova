"use client";

import {
  Boxes,
  Bell,
  Calculator,
  CloudSun,
  Folder,
  Home,
  Mail,
  Monitor,
  NotebookPen,
  Settings,
  ShieldCheck,
  Sparkles,
  Store,
  Sun,
  Workflow,
} from "lucide-react";
import type { ComponentType, CSSProperties } from "react";
import type { WindowKey } from "@/data/nova";
import { cn } from "@/lib/utils";
import type { NovaSystemActions, NovaSystemState } from "@/lib/nova-system";

type NovaRailProps = {
  activeWindows: WindowKey[];
  minimizedWindows: WindowKey[];
  attentionWindow?: WindowKey;
  system: NovaSystemState;
  systemActions: NovaSystemActions;
  onOpen: (window: WindowKey) => void;
  onCommand: () => void;
};

const railItems: Array<{ key: WindowKey; label: string; icon: ComponentType<{ size?: number }> }> = [
  { key: "nova-hub", label: "Nova Hub", icon: Home },
  { key: "my-space", label: "My Space", icon: Folder },
  { key: "spaces", label: "Spaces", icon: Boxes },
  { key: "ai-center", label: "AI Center", icon: Workflow },
  { key: "nova-store", label: "Nova Store", icon: Store },
  { key: "nova-guard", label: "Nova Guard", icon: ShieldCheck },
  { key: "activity-center", label: "Activity Center", icon: Bell },
  { key: "weather", label: "Weather", icon: CloudSun },
  { key: "notes", label: "Notes", icon: NotebookPen },
  { key: "calculator", label: "Calculator", icon: Calculator },
];

export function NovaRail({ activeWindows, minimizedWindows, attentionWindow, system, systemActions, onOpen, onCommand }: NovaRailProps) {
  function bumpBrightness() {
    systemActions.setBrightness(system.brightness >= 94 ? 54 : system.brightness + 10);
  }

  function openSettings() {
    systemActions.setPersonalizePanel("Look & Feel");
    onOpen("personalize");
  }

  return (
    <nav className="nova-rail" aria-label="Nova Rail">
      <button className="rail-brand" type="button" onClick={onCommand} aria-label="Open Nova Command">
        <span className="nova-gem small">
          <Sparkles size={15} />
        </span>
        <span>NOVA OS</span>
      </button>

      {railItems.map((item) => {
        const Icon = item.icon;
        const active = activeWindows.includes(item.key);
        const minimized = minimizedWindows.includes(item.key);
        const needsAttention = attentionWindow === item.key;
        return (
          <button
            key={item.key}
            className={cn("rail-button", active && "active", minimized && "minimized", needsAttention && "attention")}
            type="button"
            title={item.label}
            aria-label={minimized ? `Restore ${item.label}` : item.label}
            data-context-kind="shelf-window"
            data-context-id={item.key}
            onClick={() => onOpen(item.key)}
          >
            <Icon size={19} />
            {minimized ? <span className="rail-minimized-dot" /> : null}
          </button>
        );
      })}

      <button className="rail-button" type="button" title="Nova Command" aria-label="Nova Command" onClick={onCommand}>
        <Sparkles size={19} />
      </button>

      <button className="rail-button" type="button" title="Mail" aria-label="Mail" onClick={() => onOpen("activity-center")}>
        <Mail size={19} />
      </button>

      <div className="rail-spacer" />

      <div className="system-stack" aria-label="System controls">
        <button
          className="system-button brightness"
          type="button"
          aria-label={`Brightness ${system.brightness}%`}
          title={`Brightness ${system.brightness}%`}
          onClick={bumpBrightness}
          style={{ "--brightness-level": `${system.brightness}%` } as CSSProperties}
        >
          <Sun size={17} />
          <span>{system.brightness}%</span>
          <span className="brightness-line" />
        </button>
        <button
          className="system-button"
          type="button"
          aria-label={`Display mode ${system.displayMode}`}
          title={`Display mode: ${system.displayMode}`}
          onClick={systemActions.cycleDisplayMode}
        >
          <Monitor size={17} />
        </button>
        <button className="system-button" type="button" aria-label="Settings" onClick={openSettings}>
          <Settings size={17} />
        </button>
      </div>
    </nav>
  );
}
