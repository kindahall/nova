"use client";

import {
  Bell,
  Boxes,
  Folder,
  Grid3X3,
  Music2,
  PanelsTopLeft,
  Play,
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

type ActivityShelfProps = {
  activeWindows: WindowKey[];
  onOpen: (window: WindowKey) => void;
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

export function ActivityShelf({ activeWindows, onOpen, onCommand, onSwitcher }: ActivityShelfProps) {
  const runningKeys = activeWindows.filter((key) => !pinnedKeys.includes(key));

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
        const active = activeWindows.includes(key);
        return (
          <button
            key={item.label}
            className={cn("shelf-button", active && "active")}
            type="button"
            onClick={() => onOpen(key)}
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
        return (
          <button key={key} className="shelf-button active running" type="button" onClick={() => onOpen(key)}>
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
      <button className="shelf-button icon-only" type="button" aria-label="Weightless music">
        <span className="shelf-icon">
          <Music2 size={20} />
        </span>
      </button>
      <button className="shelf-button icon-only" type="button" aria-label="Play media">
        <span className="shelf-icon">
          <Play size={20} />
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
