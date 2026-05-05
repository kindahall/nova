"use client";

import {
  Bell,
  Bot,
  Boxes,
  Folder,
  PanelsTopLeft,
  Settings,
  ShieldCheck,
  Sparkles,
  Store,
  WifiOff,
  X,
} from "lucide-react";
import type { ComponentType } from "react";
import type { WindowKey } from "@/data/nova";

type MissionControlOverlayProps = {
  activeWindows: WindowKey[];
  onCloseWindow: (window: WindowKey) => void;
  onDismiss: () => void;
  onOpenWindow: (window: WindowKey) => void;
};

const windowRegistry: Record<WindowKey, { label: string; subtitle: string; icon: ComponentType<{ size?: number }> }> = {
  "my-space": { label: "My Space", subtitle: "Files, previews, and local context", icon: Folder },
  personalize: { label: "Personalize", subtitle: "Theme, density, and system feel", icon: Settings },
  "nova-hub": { label: "Nova Hub", subtitle: "System overview and action pulse", icon: Sparkles },
  "ai-center": { label: "AI Center", subtitle: "Provider routing and model roles", icon: Bot },
  "nova-guard": { label: "Nova Guard", subtitle: "Permissions and approval ledger", icon: ShieldCheck },
  "nova-store": { label: "Nova Store", subtitle: "Packs, apps, and connectors", icon: Store },
  spaces: { label: "Spaces", subtitle: "Mission workspaces", icon: Boxes },
  "offline-mode": { label: "Offline Mode", subtitle: "Local work and queued sync", icon: WifiOff },
  "activity-center": { label: "Activity Center", subtitle: "Notifications and shortcuts", icon: Bell },
  "create-app": { label: "Nova Builder", subtitle: "Generate a working Nova App", icon: PanelsTopLeft },
  "crm-app": { label: "ClientFlow", subtitle: "Generated CRM Nova App", icon: PanelsTopLeft },
};

export function MissionControlOverlay({
  activeWindows,
  onCloseWindow,
  onDismiss,
  onOpenWindow,
}: MissionControlOverlayProps) {
  return (
    <div className="mission-control-backdrop" role="dialog" aria-modal="true" aria-label="Mission Control">
      <section className="mission-control-panel">
        <header className="mission-control-header">
          <div>
            <span>Mission Control</span>
            <h2>Open windows</h2>
          </div>
          <button className="icon-button" type="button" onClick={onDismiss} aria-label="Close Mission Control">
            <X size={17} />
          </button>
        </header>

        <div className="mission-grid">
          {activeWindows.map((windowKey, index) => {
            const item = windowRegistry[windowKey];
            const Icon = item.icon;
            const focused = index === activeWindows.length - 1;
            return (
              <article className={focused ? "mission-card focused" : "mission-card"} key={windowKey}>
                <button
                  className="mission-open"
                  type="button"
                  onClick={() => {
                    onOpenWindow(windowKey);
                    onDismiss();
                  }}
                >
                  <span className="mission-icon">
                    <Icon size={20} />
                  </span>
                  <span>
                    <strong>{item.label}</strong>
                    <span>{item.subtitle}</span>
                  </span>
                </button>
                <div className="mission-card-footer">
                  <span>{focused ? "Focused" : "Running"}</span>
                  <button
                    className="mini-close"
                    type="button"
                    onClick={() => onCloseWindow(windowKey)}
                    aria-label={`Close ${item.label}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              </article>
            );
          })}

          {activeWindows.length === 0 ? (
            <div className="mission-empty">
              <Sparkles size={22} />
              <strong>No windows open</strong>
              <span>Use the rail, shelf, or Nova Command to open a system surface.</span>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
