"use client";

import { Columns2, GalleryHorizontalEnd, Grid2X2, Maximize2, Rows2, type LucideIcon } from "lucide-react";
import type { NovaFileArrangeMode } from "@/lib/nova-system";

type FileWindowOrganizerProps = {
  count: number;
  activeFileName?: string;
  onArrange: (mode: NovaFileArrangeMode) => void;
};

const controls: Array<{ mode: NovaFileArrangeMode; label: string; icon: LucideIcon; detail: string }> = [
  { mode: "fill", label: "Fill", icon: Maximize2, detail: "Fill the workspace with the active file" },
  { mode: "left", label: "Left", icon: Columns2, detail: "Move the active file to the left half" },
  { mode: "right", label: "Right", icon: Rows2, detail: "Move the active file to the right half" },
  { mode: "grid", label: "Grid", icon: Grid2X2, detail: "Arrange all open files in a grid" },
  { mode: "cascade", label: "Stack", icon: GalleryHorizontalEnd, detail: "Cascade open files" },
];

export function FileWindowOrganizer({ count, activeFileName, onArrange }: FileWindowOrganizerProps) {
  if (!count) {
    return null;
  }

  return (
    <div className="file-window-organizer" aria-label="File window organizer">
      <span>
        {count} file{count > 1 ? "s" : ""} open
        {activeFileName ? <small>{activeFileName}</small> : null}
      </span>
      {controls.map((control) => {
        const Icon = control.icon;
        return (
          <button key={control.mode} type="button" title={control.detail} onClick={() => onArrange(control.mode)}>
            <Icon size={14} />
            {control.label}
          </button>
        );
      })}
    </div>
  );
}
