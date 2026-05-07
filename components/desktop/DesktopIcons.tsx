"use client";

import { Archive, Calculator, CloudSun, FolderOpen, Gem, NotebookPen } from "lucide-react";
import type { WindowKey } from "@/data/nova";

type DesktopIconsProps = {
  onOpen: (window: WindowKey) => void;
};

export function DesktopIcons({ onOpen }: DesktopIconsProps) {
  return (
    <div className="desktop-icons" aria-label="Desktop shortcuts">
      <button className="desktop-icon" type="button" onClick={() => onOpen("my-space")} data-context-kind="window" data-context-id="my-space">
        <span className="desktop-prism">
          <Gem size={26} />
        </span>
        <span>My Space</span>
      </button>
      <button className="desktop-icon" type="button" onClick={() => onOpen("spaces")} data-context-kind="window" data-context-id="spaces">
        <span className="desktop-orb">
          <FolderOpen size={25} />
        </span>
        <span>Projects</span>
      </button>
      <button className="desktop-icon" type="button" onClick={() => onOpen("nova-guard")} data-context-kind="window" data-context-id="nova-guard">
        <span className="desktop-cube">
          <Archive size={25} />
        </span>
        <span>Archives</span>
      </button>
      <button className="desktop-icon" type="button" onClick={() => onOpen("weather")} data-context-kind="window" data-context-id="weather">
        <span className="desktop-orb">
          <CloudSun size={25} />
        </span>
        <span>Weather</span>
      </button>
      <button className="desktop-icon" type="button" onClick={() => onOpen("notes")} data-context-kind="window" data-context-id="notes">
        <span className="desktop-prism">
          <NotebookPen size={24} />
        </span>
        <span>Notes</span>
      </button>
      <button className="desktop-icon" type="button" onClick={() => onOpen("calculator")} data-context-kind="window" data-context-id="calculator">
        <span className="desktop-cube">
          <Calculator size={24} />
        </span>
        <span>Calculator</span>
      </button>
    </div>
  );
}
