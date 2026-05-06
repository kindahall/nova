"use client";

import { motion, useDragControls } from "framer-motion";
import { Maximize2, Minus, Sparkles, X } from "lucide-react";
import { useState } from "react";
import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { WindowKey } from "@/data/nova";
import type { NovaWindowSize } from "@/lib/nova-system";

type WindowFrameProps = {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  className?: string;
  windowKey?: WindowKey;
  windowSize?: NovaWindowSize;
  tone?: "light" | "dark" | "command";
  children: ReactNode;
  onClose?: () => void;
  onFocus?: () => void;
  onMinimize?: () => void;
  onAssist?: () => void;
  onResizeEnd?: (size: NovaWindowSize) => void;
};

export function WindowFrame({
  title,
  subtitle,
  icon,
  className,
  windowSize,
  tone = "light",
  children,
  onClose,
  onFocus,
  onMinimize,
  onAssist,
  onResizeEnd,
}: WindowFrameProps) {
  const dragControls = useDragControls();
  const [draftSize, setDraftSize] = useState<NovaWindowSize | undefined>();

  function startDrag(event: PointerEvent<HTMLElement>) {
    onFocus?.();
    dragControls.start(event);
  }

  function startResize(event: PointerEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    onFocus?.();

    const frame = event.currentTarget.closest(".window-frame");
    if (!(frame instanceof HTMLElement)) {
      return;
    }

    const rect = frame.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = rect.width;
    const startHeight = rect.height;
    let nextSize: NovaWindowSize = { width: startWidth, height: startHeight };

    function handlePointerMove(moveEvent: globalThis.PointerEvent) {
      const maxWidth = Math.max(360, window.innerWidth - 96);
      const maxHeight = Math.max(260, window.innerHeight - 92);
      nextSize = {
        width: Math.round(Math.min(maxWidth, Math.max(360, startWidth + moveEvent.clientX - startX))),
        height: Math.round(Math.min(maxHeight, Math.max(260, startHeight + moveEvent.clientY - startY))),
      };
      setDraftSize(nextSize);
    }

    function handlePointerUp() {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      onResizeEnd?.(nextSize);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp, { once: true });
  }

  const effectiveSize = draftSize ?? windowSize;
  const sizeStyle = effectiveSize ? ({ width: effectiveSize.width, height: effectiveSize.height } as CSSProperties) : undefined;

  return (
    <motion.section
      className={cn("window-frame", tone === "dark" && "dark", tone === "command" && "command", className)}
      style={sizeStyle}
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
      <button className="window-resize-handle" type="button" aria-label={`Resize ${title}`} onPointerDown={startResize}>
        <Maximize2 size={12} />
      </button>
    </motion.section>
  );
}
