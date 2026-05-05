"use client";

import { FileLock2, History, ShieldCheck, Siren } from "lucide-react";
import { useState } from "react";
import { guardPermissions, ledger } from "@/data/nova";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import { cn } from "@/lib/utils";

type NovaGuardWindowProps = {
  onClose?: () => void;
  onFocus?: () => void;
};

export function NovaGuardWindow({ onClose, onFocus }: NovaGuardWindowProps) {
  const [permissions, setPermissions] = useState(guardPermissions);
  const enabledCount = permissions.filter((permission) => permission.enabled).length;
  const [guardNote, setGuardNote] = useState("Nova asks before reading sensitive locations.");

  function togglePermission(name: string) {
    const permission = permissions.find((item) => item.name === name);
    if (permission) {
      setGuardNote(`${permission.name} is now ${permission.enabled ? "limited" : "enabled"}.`);
    }

    setPermissions((current) =>
      current.map((currentPermission) =>
        currentPermission.name === name ? { ...currentPermission, enabled: !currentPermission.enabled } : currentPermission
      )
    );
  }

  return (
    <WindowFrame
      title="Nova Guard"
      subtitle="Permissions, limits, and visible actions"
      icon={<ShieldCheck size={18} />}
      className="window--nova-guard"
      tone="dark"
      onClose={onClose}
      onFocus={onFocus}
    >
      <div className="cards-grid">
        <div className="glass-card">
          <FileLock2 size={20} />
          <h3>Protected folders</h3>
          <p>{guardNote}</p>
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
            {permissions.map((permission) => (
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
                  onClick={() => togglePermission(permission.name)}
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
