"use client";

import { FileLock2, History, ShieldCheck, Siren } from "lucide-react";
import { ledger } from "@/data/nova";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import { cn } from "@/lib/utils";
import type { NovaSystemActions, NovaSystemState } from "@/lib/nova-system";

type NovaGuardWindowProps = {
  system: NovaSystemState;
  systemActions: NovaSystemActions;
  onClose?: () => void;
  onMinimize?: () => void;
  onFocus?: () => void;
};

export function NovaGuardWindow({ system, systemActions, onClose, onMinimize, onFocus }: NovaGuardWindowProps) {
  const enabledCount = system.guardPermissions.filter((permission) => permission.enabled).length;

  return (
    <WindowFrame
      title="Nova Guard"
      subtitle="Permissions, limits, and visible actions"
      icon={<ShieldCheck size={18} />}
      className="window--nova-guard"
      tone="dark"
      windowKey="nova-guard"
      windowSize={system.windowSizes["nova-guard"]}
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
      onResizeEnd={(size) => systemActions.setWindowSize("nova-guard", size)}
    >
      <div className="cards-grid">
        <div className="glass-card">
          <FileLock2 size={20} />
          <h3>Protected folders</h3>
          <p>{system.guardNote}</p>
          <div className="metric">7</div>
        </div>
        <div className="glass-card">
          <Siren size={20} />
          <h3>Approval gates</h3>
          <p>Installs, terminal sessions, and system edits require your confirmation.</p>
          <div className="metric">{enabledCount}</div>
        </div>
        <div className="glass-card">
          <History size={20} />
          <h3>Nova Ledger</h3>
          <p>AI actions remain visible after they happen.</p>
          <div className="metric">Live</div>
        </div>
      </div>

      <div className="wide-grid">
        <div className="glass-card">
          <h3>Permissions</h3>
          <div className="stack-list">
            {system.guardPermissions.map((permission) => (
              <div className="permission-row" key={permission.name}>
                <span className="row-title">
                  <ShieldCheck size={16} />
                  <span>
                    <strong>{permission.name}</strong>
                    <span>{permission.mode}</span>
                  </span>
                </span>
                <button
                  className={cn("toggle", permission.enabled && "on")}
                  type="button"
                  onClick={() => systemActions.toggleGuardPermission(permission.name)}
                  aria-label={`${permission.name} ${permission.enabled ? "enabled" : "disabled"}`}
                  aria-pressed={permission.enabled}
                >
                  <i />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card">
          <h3>Recent protected actions</h3>
          <div className="stack-list">
            {ledger.map((item) => (
              <div className="ledger-row" key={item[1]}>
                <span className="row-title">
                  <History size={16} />
                  <span>
                    <strong>{item[1]}</strong>
                    <span>{item[0]}</span>
                  </span>
                </span>
                <span className="pill green">{item[2]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}
