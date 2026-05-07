"use client";

import {
  Archive,
  ArrowLeft,
  Clock,
  ClipboardCheck,
  Database,
  FileText,
  Folder,
  Grid3X3,
  HardDrive,
  Home,
  Image as ImageIcon,
  List,
  Music2,
  Pin,
  Plus,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Tags,
  X,
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

const folderSections = folders.map((folder) => folder.name);
const sectionDescriptions: Record<string, string> = {
  "My Space": "Everything indexed for the current Nova workspace.",
  Recent: "Latest files touched by Nova and the user.",
  Starred: "Pinned files that should stay close to active missions.",
  Shared: "Files queued for collaboration or Guard-approved sharing.",
  Collections: "Grouped context packs for briefs, assets, and launch work.",
  "Nova Drive": "Cloud-backed indexes and sync-ready workspace files.",
  "Data Hub": "Datasets, spreadsheets, logs, and structured context.",
  Work: "Client, planning, invoice, and roadmap material.",
  Design: "Visual assets, brand systems, and moodboards.",
  Media: "Audio, images, and creative source files.",
  Docs: "Documents, notes, PDFs, and transcripts.",
  Archive: "Backups and older snapshots kept out of the active flow.",
};

const starredFileNames = ["Nova_Concept.pdf", "Client_Roadmap.nova", "Founder_Metrics.xlsx", "Brand_System.fig"];
const sharedFileNames = ["Shared_Brief.pdf", "Client_Call_Transcript.txt", "Invoice_Template.xlsx"];
const collectionFileNames = ["Brand_System.fig", "Launch_Moodboard.png", "Project_Plan.nova", "Shared_Brief.pdf"];
const novaDriveFileNames = ["Nova_Drive_Index.json", "Backup_Snapshot.nova", "Project_Plan.nova"];
const dataHubFileNames = ["Data_Hub_Contacts.csv", "Automation_Logs.json", "Founder_Metrics.xlsx", "Invoice_Template.xlsx"];

function orderedFiles(files: NovaFile[], fileNames: string[], include?: (file: NovaFile) => boolean) {
  const byName = new Map(files.map((file) => [file[0], file]));
  const pickedNames = new Set(fileNames);
  const pickedFiles = fileNames.flatMap((fileName) => {
    const file = byName.get(fileName);
    return file ? [file] : [];
  });
  const extraFiles = include ? files.filter((file) => include(file) && !pickedNames.has(file[0])) : [];
  return [...pickedFiles, ...extraFiles];
}

function sectionFiles(files: NovaFile[], section: string) {
  switch (section) {
    case "Recent":
      return files.slice(0, 8);
    case "Starred":
      return orderedFiles(files, starredFileNames);
    case "Shared":
      return orderedFiles(files, sharedFileNames);
    case "Collections":
      return orderedFiles(files, collectionFileNames);
    case "Nova Drive":
      return orderedFiles(files, novaDriveFileNames, (file) => file[0].includes("Nova_Drive"));
    case "Data Hub":
      return orderedFiles(files, dataHubFileNames, (file) => /CSV|JSON|Spreadsheet/.test(file[1]));
    case "Work":
      return files.filter((file) => /Client|Invoice|Roadmap|Plan|Metrics|Brief|Nova_App/.test(file[0]));
    case "Design":
      return files.filter((file) => /PNG|Design/.test(file[1]) || /Brand|Moodboard|Landscape/.test(file[0]));
    case "Media":
      return files.filter((file) => /PNG|MP3|Audio|Image/.test(file[1]) || /Music|Voice|Landscape|Moodboard/.test(file[0]));
    case "Docs":
      return files.filter((file) => /PDF|Text|Document/.test(file[1]) || /Notes|Transcript/.test(file[0]));
    case "Archive":
      return files.filter((file) => /Archive|Backup|Snapshot|zip/i.test(`${file[0]} ${file[1]}`));
    case "My Space":
    default:
      return files;
  }
}

function fileIcon(file: NovaFile) {
  if (/CSV|JSON|Spreadsheet/.test(file[1])) {
    return <Database size={13} />;
  }

  if (/Archive|zip/i.test(`${file[0]} ${file[1]}`)) {
    return <Archive size={13} />;
  }

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

function fileReaderContent(file: NovaFile) {
  if (/CSV|Spreadsheet/.test(file[1])) {
    return (
      <div className="reader-table">
        {[
          ["Name", "Status", "Value"],
          ["Aster Studio", "Active", "$12.4k"],
          ["Northline Labs", "Invoice", "$8.9k"],
          ["Luma Works", "Follow-up", "$4.8k"],
        ].map((row) => (
          <span key={row.join("-")}>
            {row.map((cell) => (
              <b key={cell}>{cell}</b>
            ))}
          </span>
        ))}
      </div>
    );
  }

  if (/JSON/.test(file[1])) {
    return (
      <pre className="reader-code">{`{
  "space": "Builder Studio",
  "source": "${file[0]}",
  "indexed": true,
  "guard": "visible"
}`}</pre>
    );
  }

  if (/PNG|Design/.test(file[1])) {
    return (
      <div className="reader-canvas">
        <span />
        <strong>{file[0]}</strong>
        <small>Visual preview rendered in Nova Space.</small>
      </div>
    );
  }

  if (/MP3|Audio/.test(file[1])) {
    return (
      <div className="reader-waveform">
        {[34, 58, 42, 76, 49, 88, 54, 69, 38, 61, 45, 72].map((height, index) => (
          <i key={`${height}-${index}`} style={{ height: `${height}%` }} />
        ))}
      </div>
    );
  }

  if (/Archive|zip/i.test(`${file[0]} ${file[1]}`)) {
    return (
      <div className="reader-package">
        {["Workspace snapshot", "Project files", "Guard ledger", "App state"].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    );
  }

  return (
    <div className="reader-document">
      <p>{fileContext(file)}</p>
      <p>Nova extracted the useful context, linked it to the active space, and kept the original file available here.</p>
      <p>Next actions can be summarized, pinned, or sent to Guard before any external sharing.</p>
    </div>
  );
}

export function MySpaceWindow({ system, systemActions, onClose, onMinimize, onFocus }: MySpaceWindowProps) {
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const scopedFiles = useMemo(() => sectionFiles(system.files, system.activeFileSection), [system.activeFileSection, system.files]);
  const visibleFiles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return scopedFiles;
    }

    return scopedFiles.filter((file) => file.join(" ").toLowerCase().includes(normalizedQuery));
  }, [scopedFiles, query]);
  const selectedFile = visibleFiles.find((file) => file[0] === system.activeFileName) ?? visibleFiles[0];
  const openedFile = system.openedFileName ? system.files.find((file) => file[0] === system.openedFileName) : undefined;
  const previewFile = openedFile ?? selectedFile;
  const locationIsOpen = system.activeFileSection !== "My Space";

  function openSection(section: string) {
    const firstFile = sectionFiles(system.files, section)[0];
    systemActions.setFileSection(section);
    if (firstFile) {
      systemActions.selectFile(firstFile[0]);
    }
    setQuery("");
  }

  function openFile(file: NovaFile) {
    systemActions.openFile(file[0]);
  }

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
      windowKey="my-space"
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
                onClick={() => openSection(item.label)}
                aria-pressed={system.activeFileSection === item.label}
                data-context-kind="location"
                data-context-id={item.label}
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
              <span className="section-context">{sectionDescriptions[system.activeFileSection] ?? sectionDescriptions["My Space"]}</span>
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
              <button
                className={cn("icon-button", viewMode === "list" && "active")}
                type="button"
                aria-label={viewMode === "grid" ? "Switch to list view" : "Switch to grid view"}
                title={viewMode === "grid" ? "Switch to list view" : "Switch to grid view"}
                onClick={() => setViewMode((current) => (current === "grid" ? "list" : "grid"))}
              >
                {viewMode === "grid" ? <List size={16} /> : <Grid3X3 size={16} />}
              </button>
              <button className="add-button" type="button" aria-label="Add item" onClick={addFile}>
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div className={cn("file-workspace", viewMode === "list" && "list-view")}>
            <section className="file-browser" aria-label="File browser">
              {locationIsOpen ? (
                <div className="open-location-card">
                  <button className="compact-button" type="button" aria-label="Back to My Space" onClick={() => openSection("My Space")}>
                    <ArrowLeft size={14} />
                    My Space
                  </button>
                  <span>
                    <strong>{system.activeFileSection}</strong>
                    <small>{sectionDescriptions[system.activeFileSection] ?? sectionDescriptions["My Space"]}</small>
                  </span>
                </div>
              ) : (
                <>
                  <div className="section-heading-row">
                    <h3 className="section-title">Folders</h3>
                    <span>{system.files.length} indexed</span>
                  </div>
                  <div className="folder-grid">
                    {folders.map((folder) => {
                      const folderCount = sectionFiles(system.files, folder.name).length;
                      return (
                        <button
                          className="folder-card"
                          key={folder.name}
                          type="button"
                          onClick={() => openSection(folder.name)}
                          aria-label={`Open ${folder.name} folder`}
                          data-context-kind="location"
                          data-context-id={folder.name}
                        >
                          <div className="folder-icon" />
                          <strong>{folder.name}</strong>
                          <span>{folderCount} items</span>
                          <em>Open</em>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              <div className="section-heading-row">
                <h3 className="section-title">{folderSections.includes(system.activeFileSection) ? `${system.activeFileSection} files` : system.activeFileSection}</h3>
                <span>{visibleFiles.length} shown</span>
              </div>
              <div className="file-list">
                {visibleFiles.map((file) => {
                  const selected = selectedFile?.[0] === file[0];
                  return (
                    <button
                      className={cn("file-row", selected && "selected", system.openedFileName === file[0] && "opened")}
                      key={file[0]}
                      type="button"
                      onClick={() => openFile(file)}
                      aria-label={`Open ${file[0]}`}
                      aria-pressed={selected}
                      data-context-kind="file"
                      data-context-id={file[0]}
                    >
                      <span className="file-name">
                        <span className="file-badge">{fileIcon(file)}</span>
                        {file[0]}
                      </span>
                      <span>{file[1]}</span>
                      <span>{file[2]}</span>
                      <span>{system.openedFileName === file[0] ? "Open" : file[3]}</span>
                    </button>
                  );
                })}
                {visibleFiles.length === 0 ? <div className="file-row empty">No files match this search in {system.activeFileSection}.</div> : null}
              </div>
            </section>

            {previewFile ? (
              <aside className={cn("file-preview-panel", openedFile && "file-reader-panel")} aria-label="File preview">
                <div className="preview-panel-top">
                  <div className="preview-file-orb">{fileIcon(previewFile)}</div>
                  {openedFile ? (
                    <button className="icon-button" type="button" aria-label={`Close ${openedFile[0]}`} onClick={systemActions.closeFile}>
                      <X size={15} />
                    </button>
                  ) : null}
                </div>
                <span className="preview-state">
                  <ClipboardCheck size={13} />
                  {openedFile ? "Open file" : "Active file"}
                </span>
                <h3>{previewFile[0]}</h3>
                <p>{fileContext(previewFile)}</p>

                <div className="preview-meta-grid">
                  <span>Type<strong>{previewFile[1]}</strong></span>
                  <span>Modified<strong>{previewFile[2]}</strong></span>
                  <span>Size<strong>{previewFile[3]}</strong></span>
                  <span>Space<strong>{system.activeSpace}</strong></span>
                </div>

                {openedFile ? <div className="file-reader-surface">{fileReaderContent(openedFile)}</div> : null}

                <div className="file-insight-card">
                  <Sparkles size={16} />
                  <div>
                    <strong>Nova insight</strong>
                    <p>{system.fileInsight}</p>
                  </div>
                </div>

                <div className="preview-actions">
                  {!openedFile ? (
                    <button className="primary-button" type="button" onClick={() => openFile(previewFile)} data-context-kind="file" data-context-id={previewFile[0]}>
                      <FileText size={15} />
                      Open
                    </button>
                  ) : null}
                  <button className={cn(!openedFile && "compact-button", openedFile && "primary-button")} type="button" onClick={() => systemActions.summarizeFile(previewFile[0])}>
                    <Sparkles size={15} />
                    Summarize
                  </button>
                  <button className="compact-button" type="button" onClick={() => systemActions.pinFileToSpace(previewFile[0])}>
                    <Pin size={14} />
                    Pin
                  </button>
                  <button className="compact-button" type="button" onClick={() => systemActions.shareFile(previewFile[0])}>
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
            ) : (
              <aside className="file-preview-panel empty-preview" aria-label="File preview">
                <div className="preview-file-orb">
                  <Search size={16} />
                </div>
                <span className="preview-state">No active file</span>
                <h3>No matching file</h3>
                <p>Clear the search or open another section to preview a file and use Nova actions.</p>
              </aside>
            )}
          </div>
        </main>
      </div>
    </WindowFrame>
  );
}
