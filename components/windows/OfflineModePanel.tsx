"use client";

import { CloudOff, FolderCheck, HardDrive, RefreshCw, ShieldCheck, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import { WindowFrame } from "@/components/desktop/WindowFrame";

type OfflineModePanelProps = {
  onClose?: () => void;
  onFocus?: () => void;
};

export function OfflineModePanel({ onClose, onFocus }: OfflineModePanelProps) {
  const [status, setStatus] = useState<"offline" | "checking" | "ready">("offline");

  useEffect(() => {
    if (status !== "checking") {
      return;
    }

    const timer = window.setTimeout(() => setStatus("ready"), 900);
    return () => window.clearTimeout(timer);
  }, [status]);

  function checkConnection() {
    setStatus("checking");
  }

  return (
    <WindowFrame
      title="Offline Mode"
      subtitle="Local work remains available"
      icon={<CloudOff size={18} />}
      className="window--offline-mode"
      tone="dark"
      onClose={onClose}
      onFocus={onFocus}
    >
      <div className="cards-grid">
        <div className="glass-card">
          <WifiOff size={20} />
          <h3>Cloud paused</h3>
          <p>
            {status === "ready"
              ? "Connection is available. Nova will still ask before resuming sensitive sync."
              : "Internet-dependent models, sync, and store downloads wait until reconnection."}
          </p>
          <div className="metric">{status === "checking" ? "Checking" : status === "ready" ? "Ready" : "Paused"}</div>
        </div>
        <div className="glass-card">
          <HardDrive size={20} />
          <h3>Local still works</h3>
          <p>Files, local apps, drafts, and installed Nova Apps remain available.</p>
          <div className="metric">Safe</div>
        </div>
        <div className="glass-card">
          <ShieldCheck size={20} />
          <h3>Drafts protected</h3>
          <p>Pending AI requests are queued with visible status and no silent data transfer.</p>
          <div className="metric">Queued</div>
        </div>
      </div>

      <div className="wide-grid">
        <div className="glass-card">
          <h3>Available offline</h3>
          <div className="module-list">
            {["My Space", "CRM App", "Notes", "Local AI", "Draft automations", "Nova Guard"].map((item) => (
              <span className="module-chip" key={item}>
                <FolderCheck size={14} /> {item}
              </span>
            ))}
          </div>
        </div>
        <div className="glass-card">
          <h3>Reconnect</h3>
          <p>Nova will resume queued cloud work only after the connection returns and you approve anything sensitive.</p>
          <div style={{ marginTop: 18 }}>
            <button className="primary-button" type="button" onClick={checkConnection} disabled={status === "checking"}>
              <RefreshCw size={16} className={status === "checking" ? "spin" : undefined} />
              {status === "ready" ? "Connection ready" : status === "checking" ? "Checking..." : "Check connection"}
            </button>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}
