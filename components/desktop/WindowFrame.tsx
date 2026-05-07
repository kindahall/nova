"use client";

import { motion, useDragControls } from "framer-motion";
import { Maximize2, Minus, Sparkles, X } from "lucide-react";
import { useState } from "react";
import type { CSSProperties, MouseEvent, PointerEvent, ReactNode } from "react";
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
  windowKey,
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
  const [restoreSize, setRestoreSize] = useState<NovaWindowSize | undefined>();
  const [maximized, setMaximized] = useState(false);

  function startDrag(event: PointerEvent<HTMLElement>) {
    onFocus?.();
    dragControls.start(event);
  }

  function stopWindowAction(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
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
      setMaximized(false);
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

  function toggleMaximize(event: MouseEvent<HTMLButtonElement>) {
    stopWindowAction(event);
    onFocus?.();

    if (maximized) {
      const nextSize = restoreSize ?? windowSize;
      setDraftSize(nextSize);
      setMaximized(false);
      if (nextSize) {
        onResizeEnd?.(nextSize);
      }
      return;
    }

    const currentFrame = event.currentTarget.closest(".window-frame");
    const rect = currentFrame instanceof HTMLElement ? currentFrame.getBoundingClientRect() : undefined;
    const currentSize = {
      width: Math.round(rect?.width ?? effectiveSize?.width ?? 780),
      height: Math.round(rect?.height ?? effectiveSize?.height ?? 560),
    };
    const nextSize = {
      width: Math.round(Math.min(window.innerWidth - 150, Math.max(760, window.innerWidth * 0.78))),
      height: Math.round(Math.min(window.innerHeight - 132, Math.max(540, window.innerHeight * 0.76))),
    };

    setRestoreSize(currentSize);
    setDraftSize(nextSize);
    setMaximized(true);
    onResizeEnd?.(nextSize);
  }

  function handleAssist(event: MouseEvent<HTMLButtonElement>) {
    stopWindowAction(event);
    onAssist?.();
  }

  function handleMinimize(event: MouseEvent<HTMLButtonElement>) {
    stopWindowAction(event);
    onMinimize?.();
  }

  function handleClose(event: MouseEvent<HTMLButtonElement>) {
    stopWindowAction(event);
    onClose?.();
  }

  return (
    <motion.section
      className={cn("window-frame", tone === "dark" && "dark", tone === "command" && "command", className)}
      style={sizeStyle}
      data-context-kind={windowKey ? "window" : undefined}
      data-context-id={windowKey}
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
        <div className="window-actions" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => event.stopPropagation()}>
          {onAssist ? (
            <button className="icon-button" type="button" aria-label="Nova assistance" onClick={handleAssist}>
              <Sparkles size={16} />
            </button>
          ) : null}
          <button className="icon-button" type="button" aria-label={maximized ? `Restore ${title}` : `Maximize ${title}`} onClick={toggleMaximize}>
            <Maximize2 size={16} />
          </button>
          {onMinimize ? (
            <button className="icon-button" type="button" aria-label={`Minimize ${title}`} onClick={handleMinimize}>
              <Minus size={16} />
            </button>
          ) : null}
          {onClose ? (
            <button className="icon-button" type="button" aria-label={`Close ${title}`} onClick={handleClose}>
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
