"use client";

import { Archive, Database, FileText, Image as ImageIcon, Music2, Palette, Sparkles, Table2 } from "lucide-react";
import type { ReactNode } from "react";
import type { NovaFile } from "@/data/nova";

export type NovaFileKind = "pdf" | "nova" | "image" | "audio" | "spreadsheet" | "design" | "data" | "archive" | "text" | "document";

export type NovaFileProfile = {
  kind: NovaFileKind;
  label: string;
  className: string;
  icon: ReactNode;
};

export function fileProfile(file: NovaFile): NovaFileProfile {
  const signature = `${file[0]} ${file[1]}`;

  if (/PDF/i.test(file[1])) {
    return { kind: "pdf", label: "PDF", className: "file-kind-pdf", icon: <FileText size={13} /> };
  }

  if (/Archive|zip/i.test(signature)) {
    return { kind: "archive", label: "Archive", className: "file-kind-archive", icon: <Archive size={13} /> };
  }

  if (/CSV|JSON|Dataset|Index/i.test(file[1])) {
    return { kind: "data", label: "Data", className: "file-kind-data", icon: <Database size={13} /> };
  }

  if (/Spreadsheet|xlsx/i.test(signature)) {
    return { kind: "spreadsheet", label: "Sheet", className: "file-kind-spreadsheet", icon: <Table2 size={13} /> };
  }

  if (/PNG|Image/i.test(file[1])) {
    return { kind: "image", label: "Image", className: "file-kind-image", icon: <ImageIcon size={13} /> };
  }

  if (/MP3|Audio/i.test(file[1])) {
    return { kind: "audio", label: "Audio", className: "file-kind-audio", icon: <Music2 size={13} /> };
  }

  if (/Design|fig/i.test(signature)) {
    return { kind: "design", label: "Design", className: "file-kind-design", icon: <Palette size={13} /> };
  }

  if (/Nova/i.test(file[1])) {
    return { kind: "nova", label: "Nova", className: "file-kind-nova", icon: <Sparkles size={13} /> };
  }

  if (/Text|txt/i.test(signature)) {
    return { kind: "text", label: "Text", className: "file-kind-text", icon: <FileText size={13} /> };
  }

  return { kind: "document", label: "Doc", className: "file-kind-document", icon: <FileText size={13} /> };
}

export function fileTypeClass(file: NovaFile) {
  return fileProfile(file).className;
}

export function fileIcon(file: NovaFile) {
  return fileProfile(file).icon;
}

export function fileContext(file: NovaFile) {
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

export function fileReaderContent(file: NovaFile) {
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
