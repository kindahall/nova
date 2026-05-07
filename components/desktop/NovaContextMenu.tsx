"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type NovaContextMenuItem = {
  id: string;
  label: string;
  detail?: string;
  shortcut?: string;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  dividerBefore?: boolean;
  onSelect: () => void;
};

type NovaContextMenuProps = {
  x: number;
  y: number;
  title: string;
  subtitle?: string;
  items: NovaContextMenuItem[];
  onClose: () => void;
};

export function NovaContextMenu({ x, y, title, subtitle, items, onClose }: NovaContextMenuProps) {
  return (
    <div
      className="context-menu-layer"
      onPointerDown={onClose}
      onContextMenu={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <motion.div
        className="nova-context-menu"
        style={{ left: x, top: y }}
        initial={{ opacity: 0, scale: 0.96, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 4 }}
        transition={{ duration: 0.14, ease: "easeOut" }}
        role="menu"
        aria-label={title}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <header>
          <strong>{title}</strong>
          {subtitle ? <span>{subtitle}</span> : null}
        </header>
        <div className="context-menu-items">
          {items.map((item) => (
            <button
              className={cn("context-menu-item", item.danger && "danger", item.dividerBefore && "with-divider")}
              type="button"
              role="menuitem"
              key={item.id}
              disabled={item.disabled}
              onClick={() => {
                item.onSelect();
                onClose();
              }}
            >
              <span className="context-menu-icon">{item.icon}</span>
              <span className="context-menu-copy">
                <strong>{item.label}</strong>
                {item.detail ? <small>{item.detail}</small> : null}
              </span>
              {item.shortcut ? <kbd>{item.shortcut}</kbd> : null}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
