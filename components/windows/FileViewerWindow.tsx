"use client";

import { ClipboardCheck, Folder, Pin, ShieldCheck, Sparkles } from "lucide-react";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import { fileContext, fileIcon, fileProfile, fileReaderContent, fileTypeClass } from "@/components/windows/nova-file-helpers";
import { cn } from "@/lib/utils";
import type { NovaFile } from "@/data/nova";
import type { NovaSystemActions, NovaSystemState } from "@/lib/nova-system";

type FileViewerWindowProps = {
  file: NovaFile;
  system: NovaSystemState;
  systemActions: NovaSystemActions;
};

export function FileViewerWindow({ file, system, systemActions }: FileViewerWindowProps) {
  const profile = fileProfile(file);
  const layout = system.fileWindowLayouts[file[0]];

  return (
    <WindowFrame
      title={file[0]}
      subtitle={`${profile.label} file`}
      icon={<span className={cn("file-window-title-icon", profile.className)}>{profile.icon}</span>}
      className={cn("window--file-viewer", fileTypeClass(file))}
      contextKind="file"
      contextId={file[0]}
      windowLayout={layout}
      onClose={() => systemActions.closeFile(file[0])}
      onFocus={() => systemActions.focusFileWindow(file[0])}
      onResizeEnd={(size) => {
        const fallback = layout ?? { x: 420, y: 150, width: 520, height: 560 };
        systemActions.setFileWindowLayout(file[0], { ...fallback, ...size });
      }}
    >
      <div className="file-window-body">
        <section className="file-window-summary">
          <div className={cn("preview-file-orb", profile.className)}>{fileIcon(file)}</div>
          <div>
            <span className="preview-state">
              <ClipboardCheck size={13} />
              Open file
            </span>
            <h3>{file[0]}</h3>
            <p>{fileContext(file)}</p>
          </div>
        </section>

        <div className="preview-meta-grid">
          <span>Type<strong>{file[1]}</strong></span>
          <span>Modified<strong>{file[2]}</strong></span>
          <span>Size<strong>{file[3]}</strong></span>
          <span>Space<strong>{system.activeSpace}</strong></span>
        </div>

        <div className="file-reader-surface">{fileReaderContent(file)}</div>

        <div className="file-insight-card">
          <Sparkles size={16} />
          <div>
            <strong>Nova insight</strong>
            <p>{system.activeFileName === file[0] ? system.fileInsight : `${file[0]} is open and ready for Nova actions.`}</p>
          </div>
        </div>

        <div className="preview-actions">
          <button className="primary-button" type="button" onClick={() => systemActions.summarizeFile(file[0])}>
            <Sparkles size={15} />
            Summarize
          </button>
          <button className="compact-button" type="button" onClick={() => systemActions.pinFileToSpace(file[0])}>
            <Pin size={14} />
            Pin
          </button>
          <button className="compact-button" type="button" onClick={() => systemActions.shareFile(file[0])}>
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
      </div>
    </WindowFrame>
  );
}
