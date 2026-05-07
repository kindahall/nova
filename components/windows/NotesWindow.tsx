"use client";

import { FilePlus2, NotebookPen, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import { cn } from "@/lib/utils";
import type { NovaSystemActions, NovaSystemState } from "@/lib/nova-system";

type Note = {
  id: string;
  title: string;
  body: string;
  updated: string;
};

type NotesWindowProps = {
  system: NovaSystemState;
  systemActions: NovaSystemActions;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
};

const NOTES_KEY = "nova-os-notes";
const seedNotes: Note[] = [
  {
    id: "note-welcome",
    title: "Nova notes",
    body: "Use this app for quick notes, ideas, commands, and reminders. Notes stay in local browser storage.",
    updated: "Just now",
  },
  {
    id: "note-builder",
    title: "Builder Studio",
    body: "Prepare CRM flow, invoices, calendar, and guarded sharing.",
    updated: "Today",
  },
];

function loadNotes() {
  if (typeof window === "undefined") {
    return seedNotes;
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(NOTES_KEY) ?? "");
    return Array.isArray(parsed) && parsed.length ? (parsed as Note[]) : seedNotes;
  } catch {
    return seedNotes;
  }
}

function noteTitle(body: string) {
  const firstLine = body.split("\n").find(Boolean)?.trim();
  return firstLine?.slice(0, 34) || "Untitled note";
}

export function NotesWindow({ system, systemActions, onClose, onMinimize, onFocus }: NotesWindowProps) {
  const [notes, setNotes] = useState<Note[]>(loadNotes);
  const [activeId, setActiveId] = useState(() => loadNotes()[0]?.id ?? seedNotes[0].id);
  const activeNote = useMemo(() => notes.find((note) => note.id === activeId) ?? notes[0], [activeId, notes]);

  useEffect(() => {
    window.localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  }, [notes]);

  function addNote() {
    const note: Note = {
      id: `${Date.now()}`,
      title: "Untitled note",
      body: "",
      updated: "Just now",
    };
    setNotes((current) => [note, ...current]);
    setActiveId(note.id);
    systemActions.recordCommand("Create note", "A new local note was created.");
  }

  function updateBody(body: string) {
    setNotes((current) =>
      current.map((note) =>
        note.id === activeNote.id
          ? {
              ...note,
              title: noteTitle(body),
              body,
              updated: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
            }
          : note
      )
    );
  }

  function deleteNote() {
    setNotes((current) => {
      const next = current.filter((note) => note.id !== activeNote.id);
      setActiveId(next[0]?.id ?? seedNotes[0].id);
      return next.length ? next : seedNotes;
    });
    systemActions.recordCommand("Delete note", "A local note was removed.");
  }

  return (
    <WindowFrame
      title="Notes"
      subtitle="Local notebook"
      icon={<NotebookPen size={18} />}
      className="window--notes light-panel"
      windowKey="notes"
      windowSize={system.windowSizes.notes}
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
      onResizeEnd={(size) => systemActions.setWindowSize("notes", size)}
    >
      <div className="notes-layout">
        <aside className="notes-list">
          <button className="primary-button" type="button" onClick={addNote}>
            <FilePlus2 size={15} />
            New note
          </button>
          {notes.map((note) => (
            <button
              className={cn("note-row", activeNote?.id === note.id && "active")}
              type="button"
              key={note.id}
              onClick={() => setActiveId(note.id)}
            >
              <strong>{note.title}</strong>
              <span>{note.updated}</span>
            </button>
          ))}
        </aside>
        <main className="note-editor">
          {activeNote ? (
            <>
              <div className="note-editor-header">
                <span>{activeNote.updated}</span>
                <button className="compact-button danger" type="button" onClick={deleteNote}>
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
              <textarea value={activeNote.body} onChange={(event) => updateBody(event.target.value)} aria-label="Note body" />
            </>
          ) : null}
        </main>
      </div>
    </WindowFrame>
  );
}
