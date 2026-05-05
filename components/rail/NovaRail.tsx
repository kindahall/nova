"use client";

import {
  Boxes,
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
import type { ComponentType } from "react";
import type { WindowKey } from "@/data/nova";
import { cn } from "@/lib/utils";

type NovaRailProps = {
  activeWindows: WindowKey[];
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
];

export function NovaRail({ activeWindows, onOpen, onCommand }: NovaRailProps) {
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

      <button className="rail-button" type="button" title="Mail" aria-label="Mail">
        <Mail size={19} />
      </button>

      <div className="rail-spacer" />

      <div className="system-stack" aria-label="System controls">
        <div className="system-button brightness" aria-label="Brightness 74%">
          <Sun size={17} />
          <span>74%</span>
          <span className="brightness-line" />
        </div>
        <button className="system-button" type="button" aria-label="Display">
          <Monitor size={17} />
        </button>
        <button className="system-button" type="button" aria-label="Settings" onClick={() => onOpen("personalize")}>
          <Settings size={17} />
        </button>
      </div>
    </nav>
  );
}
