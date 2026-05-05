"use client";

import { Archive, FolderOpen, Gem } from "lucide-react";
import type { WindowKey } from "@/data/nova";

type DesktopIconsProps = {
  onOpen: (window: WindowKey) => void;
};

export function DesktopIcons({ onOpen }: DesktopIconsProps) {
  return (
    <div className="desktop-icons" aria-label="Desktop shortcuts">
      <button className="desktop-icon" type="button" onClick={() => onOpen("my-space")}>
        <span className="desktop-prism">
          <Gem size={26} />
        </span>
        <span>My Space</span>
      </button>
      <button className="desktop-icon" type="button" onClick={() => onOpen("spaces")}>
        <span className="desktop-orb">
          <FolderOpen size={25} />
        </span>
        <span>Projects</span>
      </button>
      <button className="desktop-icon" type="button" onClick={() => onOpen("nova-guard")}>
        <span className="desktop-cube">
          <Archive size={25} />
        </span>
        <span>Archives</span>
      </button>
    </div>
  );
}
