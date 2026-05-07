"use client";

import { Boxes, Check, FolderKanban, Layers3, Plus, Workflow } from "lucide-react";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import { cn } from "@/lib/utils";
import type { NovaSystemActions, NovaSystemState } from "@/lib/nova-system";

type SpacesWindowProps = {
  system: NovaSystemState;
  systemActions: NovaSystemActions;
  onClose?: () => void;
  onMinimize?: () => void;
  onFocus?: () => void;
};

export function SpacesWindow({ system, systemActions, onClose, onMinimize, onFocus }: SpacesWindowProps) {
  const activeSpaceDetails = system.spaces.find((space) => space[0] === system.activeSpace) ?? system.spaces[0];

  return (
    <WindowFrame
      title="Spaces"
      subtitle="Mission-based workspaces"
      icon={<Boxes size={18} />}
      className="window--spaces"
      tone="dark"
      windowKey="spaces"
      windowSize={system.windowSizes.spaces}
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
      onResizeEnd={(size) => systemActions.setWindowSize("spaces", size)}
    >
      <div className="cards-grid">
        <div className="glass-card">
          <FolderKanban size={20} />
          <h3>Active space</h3>
          <p>{activeSpaceDetails[0]} gathers files, apps, agents, and automations around the current mission.</p>
          <div className="metric">{activeSpaceDetails[0].split(" ")[0]}</div>
        </div>
        <div className="glass-card">
          <Workflow size={20} />
          <h3>Automations</h3>
          <p>Recurring actions stay scoped to the space that owns them.</p>
          <div className="metric">{activeSpaceDetails[2].split(" ")[0]}</div>
        </div>
        <div className="glass-card">
          <Layers3 size={20} />
          <h3>Context packs</h3>
          <p>Nova loads only the context that belongs to the selected space.</p>
          <div className="metric">3</div>
        </div>
      </div>

      <div className="wide-grid">
        <div className="glass-card">
          <h3>Your spaces</h3>
          <div className="stack-list">
            {system.spaces.map((space) => (
              <button
                className={cn("space-row", system.activeSpace === space[0] && "selected")}
                key={space[0]}
                type="button"
                onClick={() => systemActions.setActiveSpace(space[0])}
                aria-pressed={system.activeSpace === space[0]}
              >
                <span className="row-title">
                  {system.activeSpace === space[0] ? <Check size={16} /> : <Boxes size={16} />}
                  <span>
                    <strong>{space[0]}</strong>
                    <span>
                      {space[1]} - {space[2]}
                    </span>
                  </span>
                </span>
                <span className="pill">{space[3]}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="glass-card">
          <h3>Create a new space</h3>
          <p>
            Nova will draft a mission space, then propose apps, folders, agents, and guard rules before it creates
            anything.
          </p>
          <div style={{ marginTop: 18 }}>
            <button className="primary-button" type="button" onClick={systemActions.createSpace}>
              <Plus size={16} />
              New space
            </button>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}
