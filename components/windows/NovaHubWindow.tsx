"use client";

import { Activity, CalendarClock, FolderOpen, PanelsTopLeft, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { ledger, type WindowKey } from "@/data/nova";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import type { NovaSystemActions, NovaSystemState } from "@/lib/nova-system";

type NovaHubWindowProps = {
  system: NovaSystemState;
  systemActions: NovaSystemActions;
  onClose?: () => void;
  onMinimize?: () => void;
  onFocus?: () => void;
  onCreateApp: () => void;
  onOpenWindow: (window: WindowKey) => void;
};

export function NovaHubWindow({ system, systemActions, onClose, onMinimize, onFocus, onCreateApp, onOpenWindow }: NovaHubWindowProps) {
  const connectedCount = system.aiProviders.filter((provider) => provider.state !== "Disconnected").length;
  const enabledPermissionCount = system.guardPermissions.filter((permission) => permission.enabled).length;

  return (
    <WindowFrame
      title="Nova Hub"
      subtitle="Your system at a glance"
      icon={<Sparkles size={18} />}
      className="window--nova-hub"
      tone="dark"
      windowKey="nova-hub"
      windowSize={system.windowSizes["nova-hub"]}
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
      onAssist={systemActions.runHubPulse}
      onResizeEnd={(size) => systemActions.setWindowSize("nova-hub", size)}
    >
      <div className="cards-grid">
        <button className="glass-card action-card" type="button" onClick={systemActions.runHubPulse}>
          <Activity size={20} />
          <h3>Today</h3>
          <p>{system.hubSignal}</p>
          <div className="metric">{system.hubActions}</div>
        </button>
        <button className="glass-card action-card" type="button" onClick={() => onOpenWindow("ai-center")}>
          <Workflow size={20} />
          <h3>AI routing</h3>
          <p>{system.selectedProvider} is selected. Disconnected providers stay visible for routing decisions.</p>
          <div className="metric">{connectedCount}</div>
        </button>
        <button className="glass-card action-card" type="button" onClick={() => onOpenWindow("nova-guard")}>
          <ShieldCheck size={20} />
          <h3>Guard</h3>
          <p>Approvals are active for installs, terminal access, and sensitive AI data transfers.</p>
          <div className="metric">{enabledPermissionCount}</div>
        </button>
      </div>

      <div className="wide-grid">
        <div className="glass-card">
          <h3>Recommended next move</h3>
          <p>Create the flagship CRM Nova App from the demo intention and open it as a native surface.</p>
          <div className="module-list">
            {["CRM", "Invoices", "Calendar", "Tasks", "Dashboard"].map((module) => (
              <span className="module-chip" key={module}>
                <PanelsTopLeft size={14} /> {module}
              </span>
            ))}
          </div>
          <div style={{ marginTop: 18 }}>
            <button className="primary-button" type="button" onClick={onCreateApp}>
              <Sparkles size={16} />
              Create CRM Nova App
            </button>
            <button className="ghost-button" type="button" onClick={() => onOpenWindow("nova-store")} style={{ marginLeft: 10 }}>
              <PanelsTopLeft size={16} />
              Open Store
            </button>
          </div>
        </div>
        <div className="glass-card">
          <h3>Recent activity</h3>
          <div className="stack-list">
            {ledger.map((item) => (
              <div className="ledger-row" key={item[0] + item[1]}>
                <span className="row-title">
                  <CalendarClock size={16} />
                  <span>
                    <strong>{item[1]}</strong>
                    <span>{item[0]}</span>
                  </span>
                </span>
                <span className="pill">{item[2]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="wide-grid">
        <div className="glass-card">
          <h3>Open spaces</h3>
          <p>{system.activeSpace} is active with {system.installedPacks.length} installed packs and {system.files.length} indexed files.</p>
          <div style={{ marginTop: 16 }}>
            <button className="ghost-button" type="button" onClick={() => onOpenWindow("spaces")}>
              <Workflow size={16} />
              Manage spaces
            </button>
          </div>
        </div>
        <div className="glass-card">
          <h3>Files</h3>
          <p>My Space is indexed locally with Nova Drive available for cloud-backed project folders.</p>
          <div className="module-list">
            <span className="module-chip">
              <FolderOpen size={14} /> Work
            </span>
            <span className="module-chip">
              <FolderOpen size={14} /> Design
            </span>
            <span className="module-chip">
              <FolderOpen size={14} /> {system.files.length} files
            </span>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}
