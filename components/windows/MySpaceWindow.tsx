"use client";

import { Clock, Database, Folder, Grid3X3, HardDrive, Home, Plus, Search, Share2, Star, Tags } from "lucide-react";
import { useMemo, useState } from "react";
import { folders } from "@/data/nova";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import { cn } from "@/lib/utils";
import type { NovaSystemActions, NovaSystemState } from "@/lib/nova-system";

type MySpaceWindowProps = {
  system: NovaSystemState;
  systemActions: NovaSystemActions;
  onClose?: () => void;
  onFocus?: () => void;
};

const sidebarItems = [
  { label: "My Space", icon: Home },
  { label: "Recent", icon: Clock },
  { label: "Starred", icon: Star },
  { label: "Shared", icon: Share2 },
  { label: "Collections", icon: Tags },
  { label: "Nova Drive", icon: HardDrive },
  { label: "Data Hub", icon: Database },
];

export function MySpaceWindow({ system, systemActions, onClose, onFocus }: MySpaceWindowProps) {
  const [query, setQuery] = useState("");
  const visibleFiles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return system.files;
    }

    return system.files.filter((file) => file.join(" ").toLowerCase().includes(normalizedQuery));
  }, [system.files, query]);

  function addFile() {
    systemActions.addFile();
    setQuery("");
  }

  return (
    <WindowFrame
      title="My Space"
      subtitle="Explorer"
      icon={<Home size={18} />}
      className="window--my-space light-panel"
      onClose={onClose}
      onFocus={onFocus}
    >
      <div className="split-window">
        <aside className="window-sidebar">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={cn("sidebar-item", system.activeFileSection === item.label && "active")}
                key={item.label}
                type="button"
                onClick={() => systemActions.setFileSection(item.label)}
                aria-pressed={system.activeFileSection === item.label}
              >
                <Icon size={15} /> {item.label}
              </button>
            );
          })}
        </aside>

        <main className="window-main">
          <div className="window-toolbar">
            <div>
              <strong>Good morning, Alex.</strong>
              <label className="search-line">
                <Search size={14} />
                <input
                  className="inline-search-input"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={`Find anything in ${system.activeFileSection}`}
                  aria-label="Search My Space"
                />
              </label>
            </div>
            <div className="toolbar-actions">
              <button className="icon-button" type="button" aria-label="Grid view">
                <Grid3X3 size={16} />
              </button>
              <button className="add-button" type="button" aria-label="Add item" onClick={addFile}>
                <Plus size={18} />
              </button>
            </div>
          </div>

          <h3 className="section-title">Folders</h3>
          <div className="folder-grid">
            {folders.map((folder) => (
              <div className="folder-card" key={folder.name}>
                <div className="folder-icon" />
                <strong>{folder.name}</strong>
                <span>{folder.count}</span>
              </div>
            ))}
          </div>

          <h3 className="section-title">Recent files</h3>
          <div className="file-list">
            {visibleFiles.map((file) => (
              <div className="file-row" key={file[0]}>
                <span className="file-name">
                  <span className="file-badge">
                    <Folder size={12} />
                  </span>
                  {file[0]}
                </span>
                <span>{file[1]}</span>
                <span>{file[2]}</span>
                <span>{file[3]}</span>
              </div>
            ))}
            {visibleFiles.length === 0 ? <div className="file-row">No files match this search.</div> : null}
          </div>
        </main>
      </div>
    </WindowFrame>
  );
}
