"use client";

import {
  Bell,
  Boxes,
  Folder,
  Grid3X3,
  Music2,
  PanelsTopLeft,
  Play,
  Pause,
  Plus,
  Settings,
  ShieldCheck,
  Sparkles,
  Store,
  Workflow,
} from "lucide-react";
import type { ComponentType } from "react";
import type { WindowKey } from "@/data/nova";
import { cn } from "@/lib/utils";
import type { NovaSystemActions, NovaSystemState } from "@/lib/nova-system";

type ActivityShelfProps = {
  activeWindows: WindowKey[];
  minimizedWindows: WindowKey[];
  system: NovaSystemState;
  systemActions: NovaSystemActions;
  onOpen: (window: WindowKey) => void;
  onMinimize: (window: WindowKey) => void;
  onCommand: () => void;
  onSwitcher: () => void;
};

const shelfRegistry: Record<WindowKey, { label: string; sublabel: string; icon: ComponentType<{ size?: number }> }> = {
  "my-space": { label: "My Space", sublabel: "Explorer", icon: Folder },
  personalize: { label: "Personalize", sublabel: "Settings", icon: Settings },
  "nova-hub": { label: "Nova Hub", sublabel: "Overview", icon: Sparkles },
  "ai-center": { label: "AI Center", sublabel: "Models", icon: Workflow },
  "nova-guard": { label: "Nova Guard", sublabel: "Approvals", icon: ShieldCheck },
  "nova-store": { label: "Nova Store", sublabel: "Packs", icon: Store },
  spaces: { label: "Spaces", sublabel: "Missions", icon: Boxes },
  "offline-mode": { label: "Offline", sublabel: "Local", icon: Folder },
  "activity-center": { label: "Activity", sublabel: "System", icon: Bell },
  "create-app": { label: "Builder", sublabel: "Nova App", icon: PanelsTopLeft },
  "crm-app": { label: "ClientFlow", sublabel: "CRM", icon: PanelsTopLeft },
};

const pinnedKeys: WindowKey[] = ["my-space", "personalize", "ai-center", "create-app"];

export function ActivityShelf({
  activeWindows,
  minimizedWindows,
  system,
  systemActions,
  onOpen,
  onMinimize,
  onCommand,
  onSwitcher,
}: ActivityShelfProps) {
  const liveWindows = [...activeWindows, ...minimizedWindows.filter((key) => !activeWindows.includes(key))];
  const runningKeys = liveWindows.filter((key) => !pinnedKeys.includes(key));
  const focusedWindow = activeWindows.at(-1);

  function windowButtonState(key: WindowKey) {
    const active = activeWindows.includes(key);
    const minimized = minimizedWindows.includes(key);
    const focused = focusedWindow === key;
    const action = minimized ? "Restore" : focused ? "Minimize" : active ? "Focus" : "Open";

    return { active, minimized, focused, action };
  }

  function handleWindowButton(key: WindowKey) {
    const { focused, minimized } = windowButtonState(key);

    if (minimized) {
      onOpen(key);
      return;
    }

    if (focused) {
      onMinimize(key);
      return;
    }

    onOpen(key);
  }

  return (
    <div className="shelf" aria-label="Activity Shelf">
      <button className="shelf-button icon-only" type="button" onClick={onCommand} aria-label="Nova launcher">
        <span className="shelf-icon">
          <Sparkles size={20} />
        </span>
      </button>
      {pinnedKeys.map((key) => {
        const item = shelfRegistry[key];
        const Icon = item.icon;
        const { active, minimized, action } = windowButtonState(key);
        return (
          <button
            key={item.label}
            className={cn("shelf-button", active && "active", minimized && "minimized")}
            type="button"
            onClick={() => handleWindowButton(key)}
            aria-label={`${action} ${item.label}`}
            title={`${action} ${item.label}`}
          >
            <span className="shelf-icon">
              <Icon size={20} />
            </span>
            <span className="shelf-text">
              <strong>{item.label}</strong>
              {item.sublabel ? <span>{item.sublabel}</span> : null}
            </span>
          </button>
        );
      })}
      {runningKeys.length ? <span className="shelf-divider" /> : null}
      {runningKeys.map((key) => {
        const item = shelfRegistry[key];
        const Icon = item.icon;
        const { active, minimized, action } = windowButtonState(key);
        return (
          <button
            key={key}
            className={cn("shelf-button running", active && "active", minimized && "minimized")}
            type="button"
            onClick={() => handleWindowButton(key)}
            aria-label={`${action} ${item.label}`}
            title={`${action} ${item.label}`}
          >
            <span className="shelf-icon">
              <Icon size={20} />
            </span>
            <span className="shelf-text">
              <strong>{item.label}</strong>
              <span>{item.sublabel}</span>
            </span>
          </button>
        );
      })}
      <span className="shelf-divider" />
      <button
        className={cn("shelf-button icon-only", system.soundscape !== "Silent" && "active")}
        type="button"
        aria-label={`Soundscape ${system.soundscape}`}
        title={`Soundscape: ${system.soundscape}`}
        onClick={systemActions.toggleSoundscape}
      >
        <span className="shelf-icon">
          <Music2 size={20} />
        </span>
      </button>
      <button
        className={cn("shelf-button icon-only", system.mediaPlaying && "active")}
        type="button"
        aria-label={system.mediaPlaying ? "Pause media" : "Play media"}
        title={system.mediaPlaying ? "Pause media" : "Play media"}
        onClick={systemActions.toggleMediaPlayback}
      >
        <span className="shelf-icon">
          {system.mediaPlaying ? <Pause size={20} /> : <Play size={20} />}
        </span>
      </button>
      <button className="shelf-button icon-only" type="button" onClick={() => onOpen("nova-store")} aria-label="Open Nova Store">
        <span className="shelf-icon">
          <Plus size={20} />
        </span>
      </button>
      <button className="shelf-button icon-only" type="button" onClick={onSwitcher} aria-label="Mission Control">
        <span className="shelf-icon">
          <Grid3X3 size={20} />
        </span>
      </button>
    </div>
  );
}
