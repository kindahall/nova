"use client";

import {
  Clock,
  ClipboardCheck,
  Database,
  FileText,
  Folder,
  Grid3X3,
  HardDrive,
  Home,
  Image as ImageIcon,
  Music2,
  Pin,
  Plus,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Tags,
} from "lucide-react";
import { useMemo, useState } from "react";
import { folders, type NovaFile } from "@/data/nova";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import { cn } from "@/lib/utils";
import type { NovaSystemActions, NovaSystemState } from "@/lib/nova-system";

type MySpaceWindowProps = {
  system: NovaSystemState;
  systemActions: NovaSystemActions;
  onClose?: () => void;
  onMinimize?: () => void;
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

function fileIcon(file: NovaFile) {
  if (file[1].includes("PNG")) {
    return <ImageIcon size={13} />;
  }

  if (file[1].includes("MP3")) {
    return <Music2 size={13} />;
  }

  return <FileText size={13} />;
}

function fileContext(file: NovaFile) {
  if (file[1].includes("PDF")) {
    return "Presentation and reference material ready for extraction.";
  }

  if (file[1].includes("PNG")) {
    return "Visual asset indexed for moodboards, decks, and product surfaces.";
  }

  if (file[1].includes("MP3")) {
    return "Audio draft ready for transcription, notes, or publishing prep.";
  }

  if (file[1].includes("Text")) {
    return "Plain notes ready for cleanup, summary, and next-action capture.";
  }

  return "Nova document ready for planning, generation, and workspace context.";
}

export function MySpaceWindow({ system, systemActions, onClose, onMinimize, onFocus }: MySpaceWindowProps) {
  const [query, setQuery] = useState("");
  const visibleFiles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return system.files;
    }

    return system.files.filter((file) => file.join(" ").toLowerCase().includes(normalizedQuery));
  }, [system.files, query]);
  const selectedFile =
    visibleFiles.find((file) => file[0] === system.activeFileName) ?? visibleFiles[0] ?? system.files[0];

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
      windowSize={system.windowSizes["my-space"]}
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
      onResizeEnd={(size) => systemActions.setWindowSize("my-space", size)}
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

          <div className="file-workspace">
            <section className="file-browser" aria-label="File browser">
              <h3 className="section-title">Folders</h3>
              <div className="folder-grid">
                {folders.map((folder) => (
                  <button className="folder-card" key={folder.name} type="button" onClick={() => systemActions.setFileSection(folder.name)}>
                    <div className="folder-icon" />
                    <strong>{folder.name}</strong>
                    <span>{folder.count}</span>
                  </button>
                ))}
              </div>

              <h3 className="section-title">Recent files</h3>
              <div className="file-list">
                {visibleFiles.map((file) => {
                  const selected = selectedFile?.[0] === file[0];
                  return (
                    <button
                      className={cn("file-row", selected && "selected")}
                      key={file[0]}
                      type="button"
                      onClick={() => systemActions.selectFile(file[0])}
                      aria-label={`Preview ${file[0]}`}
                      aria-pressed={selected}
                    >
                      <span className="file-name">
                        <span className="file-badge">{fileIcon(file)}</span>
                        {file[0]}
                      </span>
                      <span>{file[1]}</span>
                      <span>{file[2]}</span>
                      <span>{file[3]}</span>
                    </button>
                  );
                })}
                {visibleFiles.length === 0 ? <div className="file-row empty">No files match this search.</div> : null}
              </div>
            </section>

            {selectedFile ? (
              <aside className="file-preview-panel" aria-label="File preview">
                <div className="preview-file-orb">{fileIcon(selectedFile)}</div>
                <span className="preview-state">
                  <ClipboardCheck size={13} />
                  Active file
                </span>
                <h3>{selectedFile[0]}</h3>
                <p>{fileContext(selectedFile)}</p>

                <div className="preview-meta-grid">
                  <span>Type<strong>{selectedFile[1]}</strong></span>
                  <span>Modified<strong>{selectedFile[2]}</strong></span>
                  <span>Size<strong>{selectedFile[3]}</strong></span>
                  <span>Space<strong>{system.activeSpace}</strong></span>
                </div>

                <div className="file-insight-card">
                  <Sparkles size={16} />
                  <div>
                    <strong>Nova insight</strong>
                    <p>{system.fileInsight}</p>
                  </div>
                </div>

                <div className="preview-actions">
                  <button className="primary-button" type="button" onClick={() => systemActions.summarizeFile(selectedFile[0])}>
                    <Sparkles size={15} />
                    Summarize
                  </button>
                  <button className="compact-button" type="button" onClick={() => systemActions.pinFileToSpace(selectedFile[0])}>
                    <Pin size={14} />
                    Pin
                  </button>
                  <button className="compact-button" type="button" onClick={() => systemActions.shareFile(selectedFile[0])}>
                    <ShieldCheck size={14} />
                    Guard share
                  </button>
                </div>

                <div className="mini-route">
                  <span>
                    <Folder size={13} />
                    {system.activeFileSection}
                  </span>
                  <span>{system.selectedProvider}</span>
                </div>
              </aside>
            ) : null}
          </div>
        </main>
      </div>
    </WindowFrame>
  );
}
