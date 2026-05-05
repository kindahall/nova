"use client";

import { Boxes, Check, FolderKanban, Layers3, Plus, Workflow } from "lucide-react";
import { useState } from "react";
import { spaces } from "@/data/nova";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import { cn } from "@/lib/utils";

type SpacesWindowProps = {
  onClose?: () => void;
  onFocus?: () => void;
};

export function SpacesWindow({ onClose, onFocus }: SpacesWindowProps) {
  const [activeSpace, setActiveSpace] = useState(spaces[0][0]);
  const [draftSpaces, setDraftSpaces] = useState<typeof spaces>([]);
  const allSpaces = [...spaces, ...draftSpaces];
  const activeSpaceDetails = allSpaces.find((space) => space[0] === activeSpace) ?? allSpaces[0];

  function createSpace() {
    const newSpace = ["Launch Lab", "3 apps", "4 automations", "Draft"] as (typeof spaces)[number];
    setDraftSpaces((current) => (current.some((space) => space[0] === newSpace[0]) ? current : [...current, newSpace]));
    setActiveSpace(newSpace[0]);
  }

  return (
    <WindowFrame
      title="Spaces"
      subtitle="Mission-based workspaces"
      icon={<Boxes size={18} />}
      className="window--spaces"
      tone="dark"
      onClose={onClose}
      onFocus={onFocus}
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
            {allSpaces.map((space) => (
              <button
                className={cn("space-row", activeSpace === space[0] && "selected")}
                key={space[0]}
                type="button"
                onClick={() => setActiveSpace(space[0])}
                aria-pressed={activeSpace === space[0]}
              >
                <span className="row-title">
                  {activeSpace === space[0] ? <Check size={16} /> : <Boxes size={16} />}
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
            <button className="primary-button" type="button" onClick={createSpace}>
              <Plus size={16} />
              New space
            </button>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}
