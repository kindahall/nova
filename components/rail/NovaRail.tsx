"use client";

import {
  Boxes,
  Bell,
  Folder,
  Home,
  Mail,
  Monitor,
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
];

export function NovaRail({ activeWindows, system, systemActions, onOpen, onCommand }: NovaRailProps) {
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
        return (
          <button
            key={item.key}
            className={cn("rail-button", activeWindows.includes(item.key) && "active")}
            type="button"
            title={item.label}
            aria-label={item.label}
            onClick={() => onOpen(item.key)}
          >
            <Icon size={19} />
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
