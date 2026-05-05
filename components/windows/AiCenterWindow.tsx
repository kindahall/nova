"use client";

import { Bot, BrainCircuit, KeyRound, PlugZap, Workflow } from "lucide-react";
import { useState } from "react";
import { aiProviders } from "@/data/nova";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import { cn } from "@/lib/utils";

type AiCenterWindowProps = {
  onClose?: () => void;
  onFocus?: () => void;
};

export function AiCenterWindow({ onClose, onFocus }: AiCenterWindowProps) {
  const [providers, setProviders] = useState(aiProviders);
  const [selectedProvider, setSelectedProvider] = useState(aiProviders[1].name);
  const activeProvider = providers.find((provider) => provider.name === selectedProvider) ?? providers[0];
  const connectedCount = providers.filter((provider) => provider.state !== "Disconnected").length;

  function toggleSelectedProvider() {
    setProviders((current) =>
      current.map((provider) =>
        provider.name === activeProvider.name
          ? { ...provider, state: provider.state === "Disconnected" ? "Connected" : "Disconnected" }
          : provider
      )
    );
  }

  return (
    <WindowFrame
      title="AI Center"
      subtitle="Connected intelligences and roles"
      icon={<BrainCircuit size={18} />}
      className="window--ai-center"
      tone="dark"
      onClose={onClose}
      onFocus={onFocus}
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
            {providers.map((provider) => (
              <button
                className={cn("status-row", selectedProvider === provider.name && "selected")}
                key={provider.name}
                type="button"
                onClick={() => setSelectedProvider(provider.name)}
                aria-pressed={selectedProvider === provider.name}
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
            <button className="primary-button" type="button" onClick={toggleSelectedProvider}>
              <PlugZap size={16} />
              {activeProvider.state === "Disconnected" ? "Connect provider" : "Disconnect provider"}
            </button>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}
