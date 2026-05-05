"use client";

import { Bot, Folder, Grid3X3, Music2, PanelsTopLeft, Play, Plus, Settings, Sparkles } from "lucide-react";
import type { ComponentType } from "react";
import type { WindowKey } from "@/data/nova";
import { cn } from "@/lib/utils";

type ActivityShelfProps = {
  activeWindows: WindowKey[];
  onOpen: (window: WindowKey) => void;
  onCommand: () => void;
};

export function ActivityShelf({ activeWindows, onOpen, onCommand }: ActivityShelfProps) {
  const items: Array<{
    key?: WindowKey;
    label: string;
    sublabel?: string;
    icon: ComponentType<{ size?: number }>;
    action?: () => void;
  }> = [
    { key: "my-space", label: "My Space", sublabel: "Explorer", icon: Folder },
    { key: "personalize", label: "Personalize", sublabel: "Settings", icon: Settings },
    { key: "ai-center", label: "AI Center", sublabel: "Models", icon: Bot },
    { key: "create-app", label: "Builder", sublabel: "Nova App", icon: PanelsTopLeft },
  ];

  return (
    <div className="shelf" aria-label="Activity Shelf">
      <button className="shelf-button icon-only" type="button" onClick={onCommand} aria-label="Nova launcher">
        <span className="shelf-icon">
          <Sparkles size={20} />
        </span>
      </button>
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.key ? activeWindows.includes(item.key) : false;
        return (
          <button
            key={item.label}
            className={cn("shelf-button", active && "active")}
            type="button"
            onClick={item.action ?? (() => item.key && onOpen(item.key))}
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
      <button className="shelf-button icon-only" type="button" onClick={() => onOpen("spaces")} aria-label="Open Spaces">
        <span className="shelf-icon">
          <Grid3X3 size={20} />
        </span>
      </button>
    </div>
  );
}
