"use client";

import { AudioLines, Search, SlidersHorizontal, Sparkles } from "lucide-react";

type TopCommandBarProps = {
  onOpen: () => void;
};

export function TopCommandBar({ onOpen }: TopCommandBarProps) {
  return (
    <button className="top-command" type="button" onClick={onOpen} aria-label="Open Nova Command">
      <span className="top-command-main">
        <Search size={17} />
        <span className="top-command-placeholder">Ask Nova...</span>
      </span>
      <span className="top-command-actions">
        <span className="mode-chip">Quiet</span>
        <AudioLines size={17} />
        <SlidersHorizontal size={17} />
        <span className="nova-gem small">
          <Sparkles size={14} />
        </span>
      </span>
    </button>
  );
}
