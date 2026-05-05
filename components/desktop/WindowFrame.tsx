"use client";

import { motion, useDragControls } from "framer-motion";
import { Minus, Sparkles, X } from "lucide-react";
import type { PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

type WindowFrameProps = {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  className?: string;
  tone?: "light" | "dark" | "command";
  children: ReactNode;
  onClose?: () => void;
  onFocus?: () => void;
  onMinimize?: () => void;
  onAssist?: () => void;
};

export function WindowFrame({
  title,
  subtitle,
  icon,
  className,
  tone = "light",
  children,
  onClose,
  onFocus,
  onMinimize,
  onAssist,
}: WindowFrameProps) {
  const dragControls = useDragControls();

  function startDrag(event: PointerEvent<HTMLElement>) {
    onFocus?.();
    dragControls.start(event);
  }

  return (
    <motion.section
      className={cn("window-frame", tone === "dark" && "dark", tone === "command" && "command", className)}
      initial={{ opacity: 0, scale: 0.96, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 18 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      drag
      dragControls={dragControls}
      dragElastic={0.04}
      dragListener={false}
      dragMomentum={false}
      whileDrag={{ scale: 1.01 }}
      layout
    >
      <header className="window-header" onPointerDown={startDrag}>
        <div className="window-title">
          {icon}
          <div>
            <h2>{title}</h2>
            {subtitle ? <span>{subtitle}</span> : null}
          </div>
        </div>
        <div className="window-actions" onPointerDown={(event) => event.stopPropagation()}>
          <button className="icon-button" type="button" aria-label="Nova assistance" onClick={onAssist}>
            <Sparkles size={16} />
          </button>
          <button className="icon-button" type="button" aria-label={`Minimize ${title}`} onClick={onMinimize ?? onClose}>
            <Minus size={16} />
          </button>
          {onClose ? (
            <button className="icon-button" type="button" aria-label={`Close ${title}`} onClick={onClose}>
              <X size={16} />
            </button>
          ) : null}
        </div>
      </header>
      <div className="window-content">{children}</div>
    </motion.section>
  );
}
