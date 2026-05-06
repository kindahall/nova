"use client";

import { Bot, BrainCircuit, KeyRound, PlugZap, Workflow } from "lucide-react";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import { cn } from "@/lib/utils";
import type { NovaSystemActions, NovaSystemState } from "@/lib/nova-system";

type AiCenterWindowProps = {
  system: NovaSystemState;
  systemActions: NovaSystemActions;
  onClose?: () => void;
  onFocus?: () => void;
};

export function AiCenterWindow({ system, systemActions, onClose, onFocus }: AiCenterWindowProps) {
  const activeProvider = system.aiProviders.find((provider) => provider.name === system.selectedProvider) ?? system.aiProviders[0];
  const connectedCount = system.aiProviders.filter((provider) => provider.state !== "Disconnected").length;

  return (
    <WindowFrame
      title="AI Center"
      subtitle="Connected intelligences and roles"
      icon={<BrainCircuit size={18} />}
      className="window--ai-center"
      tone="dark"
      windowSize={system.windowSizes["ai-center"]}
      onClose={onClose}
      onFocus={onFocus}
      onResizeEnd={(size) => systemActions.setWindowSize("ai-center", size)}
    >
      <div className="cards-grid">
        <div className="glass-card">
          <PlugZap size={20} />
          <h3>Connected providers</h3>
          <p>Multi-model routing is ready in simulation mode.</p>
          <div className="metric">{connectedCount}</div>
        </div>
        <div className="glass-card">
          <Workflow size={20} />
          <h3>Role map</h3>
          <p>{activeProvider.name} is selected for {activeProvider.role.toLowerCase()}.</p>
          <div className="metric">{activeProvider.name}</div>
        </div>
        <div className="glass-card">
          <KeyRound size={20} />
          <h3>Privacy</h3>
          <p>Local AI is reserved for private work and sensitive drafts.</p>
          <div className="metric">Local</div>
        </div>
      </div>

      <div className="wide-grid">
        <div className="glass-card">
          <h3>Providers</h3>
          <div className="stack-list">
            {system.aiProviders.map((provider) => (
              <button
                className={cn("status-row", system.selectedProvider === provider.name && "selected")}
                key={provider.name}
                type="button"
                onClick={() => systemActions.selectProvider(provider.name)}
                aria-pressed={system.selectedProvider === provider.name}
              >
                <span className="row-title">
                  <Bot size={16} />
                  <span>
                    <strong>{provider.name}</strong>
                    <span>{provider.role}</span>
                  </span>
                </span>
                <span className="progress-bar" aria-label={`${provider.name} confidence`}>
                  <i style={{ width: `${provider.level}%` }} />
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="glass-card">
          <h3>Routing rule</h3>
          <p>
            When you ask for software, Nova sends the build to Codex. Research goes to Gemini. Private notes stay with
            the local model. General planning remains flexible.
          </p>
          <div className="module-list">
            <span className="module-chip">Selected: {activeProvider.name}</span>
            <span className="module-chip">State: {activeProvider.state}</span>
            <span className="module-chip">Role: {activeProvider.role}</span>
          </div>
          <div style={{ marginTop: 18 }}>
            <button className="primary-button" type="button" onClick={systemActions.toggleSelectedProvider}>
              <PlugZap size={16} />
              {activeProvider.state === "Disconnected" ? "Connect provider" : "Disconnect provider"}
            </button>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}
