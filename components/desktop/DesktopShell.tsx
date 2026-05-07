"use client";

import { AnimatePresence } from "framer-motion";
import {
  AppWindow,
  Bell,
  Calculator,
  CloudSun,
  Command,
  FilePlus2,
  FileText,
  FolderOpen,
  Grid3X3,
  Maximize2,
  Minus,
  Palette,
  Pin,
  RefreshCw,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  StickyNote,
  Volume2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import type { WindowKey } from "@/data/nova";
import { CreateNovaAppWindow } from "@/components/apps/CreateNovaAppWindow";
import { GeneratedCrmAppWindow } from "@/components/apps/GeneratedCrmAppWindow";
import { NovaCommandWindow } from "@/components/command/NovaCommandWindow";
import { TopCommandBar } from "@/components/command/TopCommandBar";
import { NovaContextMenu, type NovaContextMenuItem } from "@/components/desktop/NovaContextMenu";
import { ActivityShelf } from "@/components/shelf/ActivityShelf";
import { ActivityCenterWindow } from "@/components/windows/ActivityCenterWindow";
import { AiCenterWindow } from "@/components/windows/AiCenterWindow";
import { MySpaceWindow } from "@/components/windows/MySpaceWindow";
import { NovaGuardWindow } from "@/components/windows/NovaGuardWindow";
import { NovaHubWindow } from "@/components/windows/NovaHubWindow";
import { NovaStoreWindow } from "@/components/windows/NovaStoreWindow";
import { OfflineModePanel } from "@/components/windows/OfflineModePanel";
import { PersonalizeWindow } from "@/components/windows/PersonalizeWindow";
import { SpacesWindow } from "@/components/windows/SpacesWindow";
import { DesktopIcons } from "@/components/desktop/DesktopIcons";
import { FileWindowOrganizer } from "@/components/desktop/FileWindowOrganizer";
import { MissionControlOverlay } from "@/components/desktop/MissionControlOverlay";
import { NotificationStack } from "@/components/desktop/NotificationStack";
import { SystemStatus } from "@/components/desktop/SystemStatus";
import { NovaRail } from "@/components/rail/NovaRail";
import { CalculatorWindow } from "@/components/windows/CalculatorWindow";
import { FileViewerWindow } from "@/components/windows/FileViewerWindow";
import { NotesWindow } from "@/components/windows/NotesWindow";
import { WeatherWindow } from "@/components/windows/WeatherWindow";
import type { NovaSystemActions, NovaSystemState } from "@/lib/nova-system";

type DesktopShellProps = {
  system: NovaSystemState;
  systemActions: NovaSystemActions;
  activeWindows: WindowKey[];
  minimizedWindows: WindowKey[];
  commandOpen: boolean;
  switcherOpen: boolean;
  onOpen: (window: WindowKey) => void;
  onClose: (window: WindowKey) => void;
  onMinimize: (window: WindowKey) => void;
  onOpenCommand: () => void;
  onCloseCommand: () => void;
  onOpenSwitcher: () => void;
  onCloseSwitcher: () => void;
  onCreateApp: () => void;
  onGenerated: () => void;
  attentionWindow?: WindowKey;
};

type ContextTarget =
  | { kind: "desktop" }
  | { kind: "file"; fileName: string }
  | { kind: "location"; section: string }
  | { kind: "window"; windowKey: WindowKey; source: "window" | "shelf" };

type ContextMenuState = {
  x: number;
  y: number;
  target: ContextTarget;
};

const windowLabels: Record<WindowKey, string> = {
  "my-space": "My Space",
  personalize: "Personalize",
  "nova-hub": "Nova Hub",
  "ai-center": "AI Center",
  "nova-guard": "Nova Guard",
  "nova-store": "Nova Store",
  spaces: "Spaces",
  "offline-mode": "Offline Mode",
  "activity-center": "Activity Center",
  weather: "Weather",
  notes: "Notes",
  calculator: "Calculator",
  "create-app": "Builder",
  "crm-app": "ClientFlow",
};

function isWindowKey(value: string | undefined): value is WindowKey {
  return Boolean(value && value in windowLabels);
}

export function DesktopShell({
  system,
  systemActions,
  activeWindows,
  minimizedWindows,
  commandOpen,
  switcherOpen,
  onOpen,
  onClose,
  onMinimize,
  onOpenCommand,
  onCloseCommand,
  onOpenSwitcher,
  onCloseSwitcher,
  onCreateApp,
  onGenerated,
  attentionWindow,
}: DesktopShellProps) {
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  useEffect(() => {
    if (!contextMenu) {
      return;
    }

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setContextMenu(null);
      }
    }

    function handleBlur() {
      setContextMenu(null);
    }

    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("blur", handleBlur, { once: true });

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("blur", handleBlur);
    };
  }, [contextMenu]);

  function contextIcon(icon: NovaContextMenuItem["icon"]) {
    return icon;
  }

  function buildWindowItems(windowKey: WindowKey): NovaContextMenuItem[] {
    const isOpen = activeWindows.includes(windowKey);
    const isMinimized = minimizedWindows.includes(windowKey);
    const isFocused = activeWindows.at(-1) === windowKey;

    return [
      {
        id: "open",
        label: isMinimized ? "Restore window" : isFocused ? "Keep focused" : isOpen ? "Focus window" : "Open window",
        detail: windowLabels[windowKey],
        icon: contextIcon(<AppWindow size={15} />),
        shortcut: isOpen ? undefined : "Open",
        onSelect: () => onOpen(windowKey),
      },
      {
        id: "minimize",
        label: "Send to shelf",
        detail: "Keep it running in the Activity Shelf.",
        icon: contextIcon(<Minus size={15} />),
        disabled: !isOpen,
        onSelect: () => onMinimize(windowKey),
      },
      {
        id: "mission-control",
        label: "Show in Mission Control",
        detail: "Browse all running windows.",
        icon: contextIcon(<Grid3X3 size={15} />),
        onSelect: onOpenSwitcher,
      },
      {
        id: "close",
        label: "Close window",
        detail: "Remove it from the current desktop.",
        icon: contextIcon(<X size={15} />),
        danger: true,
        dividerBefore: true,
        disabled: !isOpen && !isMinimized,
        onSelect: () => onClose(windowKey),
      },
    ];
  }

  function buildContextItems(target: ContextTarget): NovaContextMenuItem[] {
    if (target.kind === "file") {
      const file = system.files.find((item) => item[0] === target.fileName);
      return [
        {
          id: "open-file",
          label: "Open file",
          detail: file ? `${file[1]} • ${file[3]}` : "Open in My Space reader.",
          icon: contextIcon(<FileText size={15} />),
          onSelect: () => {
            systemActions.openFile(target.fileName);
            onOpen("my-space");
          },
        },
        {
          id: "summarize-file",
          label: "Summarize with Nova",
          detail: "Create a local working summary.",
          icon: contextIcon(<Sparkles size={15} />),
          onSelect: () => systemActions.summarizeFile(target.fileName),
        },
        {
          id: "pin-file",
          label: `Pin to ${system.activeSpace}`,
          detail: "Attach it to the active mission.",
          icon: contextIcon(<Pin size={15} />),
          onSelect: () => systemActions.pinFileToSpace(target.fileName),
        },
        {
          id: "guard-share",
          label: "Guard share",
          detail: "Queue approval before anything leaves Nova.",
          icon: contextIcon(<Share2 size={15} />),
          onSelect: () => systemActions.shareFile(target.fileName),
        },
      ];
    }

    if (target.kind === "location") {
      return [
        {
          id: "open-location",
          label: `Open ${target.section}`,
          detail: "Navigate My Space to this location.",
          icon: contextIcon(<FolderOpen size={15} />),
          onSelect: () => {
            systemActions.setFileSection(target.section);
            onOpen("my-space");
          },
        },
        {
          id: "scan-location",
          label: "Scan with Nova",
          detail: "Refresh memory for this location.",
          icon: contextIcon(<Search size={15} />),
          onSelect: () =>
            systemActions.recordCommand(
              `Scan ${target.section}`,
              `Nova scanned ${target.section}, refreshed file memory, and kept the result local.`
            ),
        },
        {
          id: "pin-location",
          label: `Attach to ${system.activeSpace}`,
          detail: "Use this location as mission context.",
          icon: contextIcon(<Pin size={15} />),
          onSelect: () =>
            systemActions.recordCommand(
              `Attach ${target.section}`,
              `${target.section} was attached to ${system.activeSpace} as visible workspace context.`
            ),
        },
      ];
    }

    if (target.kind === "window") {
      return buildWindowItems(target.windowKey);
    }

    return [
      {
        id: "new-file",
        label: "New Nova document",
        detail: "Create a local file and open My Space.",
        icon: contextIcon(<FilePlus2 size={15} />),
        shortcut: "N",
        onSelect: () => {
          systemActions.addFile();
          onOpen("my-space");
        },
      },
      {
        id: "nova-command",
        label: "Ask Nova",
        detail: "Open the command surface.",
        icon: contextIcon(<Command size={15} />),
        shortcut: "⌘K",
        onSelect: onOpenCommand,
      },
      {
        id: "new-space",
        label: "Create mission space",
        detail: "Draft a new workspace shell.",
        icon: contextIcon(<FolderOpen size={15} />),
        onSelect: () => {
          systemActions.createSpace();
          onOpen("spaces");
        },
      },
      {
        id: "open-weather",
        label: "Open Weather",
        detail: "Local conditions, forecast, wind, rain.",
        icon: contextIcon(<CloudSun size={15} />),
        dividerBefore: true,
        onSelect: () => onOpen("weather"),
      },
      {
        id: "open-notes",
        label: "Open Notes",
        detail: "Local notebook saved in the browser.",
        icon: contextIcon(<StickyNote size={15} />),
        onSelect: () => onOpen("notes"),
      },
      {
        id: "open-calculator",
        label: "Open Calculator",
        detail: "Quick math utility.",
        icon: contextIcon(<Calculator size={15} />),
        onSelect: () => onOpen("calculator"),
      },
      {
        id: "refresh-system",
        label: "Refresh Nova memory",
        detail: "Check files, Guard, apps, and AI routing.",
        icon: contextIcon(<RefreshCw size={15} />),
        onSelect: () => {
          systemActions.runHubPulse();
          onOpen("nova-hub");
        },
      },
      {
        id: "personalize",
        label: "Personalize desktop",
        detail: "Theme, layout, sound, privacy.",
        icon: contextIcon(<Palette size={15} />),
        dividerBefore: true,
        onSelect: () => onOpen("personalize"),
      },
      {
        id: "cycle-display",
        label: "Cycle display mode",
        detail: `Current mode: ${system.displayMode}.`,
        icon: contextIcon(<Maximize2 size={15} />),
        onSelect: systemActions.cycleDisplayMode,
      },
      {
        id: "toggle-soundscape",
        label: system.soundscape === "Silent" ? "Start soundscape" : "Mute soundscape",
        detail: system.soundscape === "Silent" ? "Enable Focus Flow feedback." : `Current: ${system.soundscape}.`,
        icon: contextIcon(<Volume2 size={15} />),
        onSelect: systemActions.toggleSoundscape,
      },
      {
        id: "activity",
        label: "Open Activity Center",
        detail: "Review system memory and notifications.",
        icon: contextIcon(<Bell size={15} />),
        dividerBefore: true,
        onSelect: () => onOpen("activity-center"),
      },
      {
        id: "guard",
        label: "Open Nova Guard",
        detail: "Inspect permissions and approvals.",
        icon: contextIcon(<ShieldCheck size={15} />),
        onSelect: () => onOpen("nova-guard"),
      },
    ];
  }

  function getContextTitle(target: ContextTarget) {
    if (target.kind === "file") {
      return {
        title: target.fileName,
        subtitle: "File utilities",
      };
    }

    if (target.kind === "location") {
      return {
        title: target.section,
        subtitle: "Location utilities",
      };
    }

    if (target.kind === "window") {
      return {
        title: windowLabels[target.windowKey],
        subtitle: target.source === "shelf" ? "Shelf window controls" : "Window controls",
      };
    }

    return {
      title: "Nova Desktop",
      subtitle: "System utilities",
    };
  }

  function handleContextMenu(event: ReactMouseEvent<HTMLElement>) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    event.preventDefault();

    const contextSource = target.closest<HTMLElement>("[data-context-kind]");
    const kind = contextSource?.dataset.contextKind;
    const id = contextSource?.dataset.contextId;
    let contextTarget: ContextTarget = { kind: "desktop" };

    if (kind === "file" && id) {
      contextTarget = { kind: "file", fileName: id };
    } else if (kind === "location" && id) {
      contextTarget = { kind: "location", section: id };
    } else if (kind === "shelf-window" && isWindowKey(id)) {
      contextTarget = { kind: "window", windowKey: id, source: "shelf" };
    } else if (kind === "window" && isWindowKey(id)) {
      contextTarget = { kind: "window", windowKey: id, source: "window" };
    }

    setContextMenu({
      x: Math.min(event.clientX, window.innerWidth - 304),
      y: Math.min(event.clientY, window.innerHeight - 430),
      target: contextTarget,
    });
  }

  function renderWindow(windowKey: WindowKey) {
    switch (windowKey) {
      case "my-space":
        return (
          <MySpaceWindow
            key={windowKey}
            system={system}
            systemActions={systemActions}
            onClose={() => onClose(windowKey)}
            onMinimize={() => onMinimize(windowKey)}
            onFocus={() => onOpen(windowKey)}
          />
        );
      case "personalize":
        return (
          <PersonalizeWindow
            key={windowKey}
            system={system}
            systemActions={systemActions}
            onClose={() => onClose(windowKey)}
            onMinimize={() => onMinimize(windowKey)}
            onFocus={() => onOpen(windowKey)}
          />
        );
      case "nova-hub":
        return (
          <NovaHubWindow
            key={windowKey}
            system={system}
            systemActions={systemActions}
            onClose={() => onClose(windowKey)}
            onMinimize={() => onMinimize(windowKey)}
            onCreateApp={onCreateApp}
            onFocus={() => onOpen(windowKey)}
            onOpenWindow={onOpen}
          />
        );
      case "ai-center":
        return (
          <AiCenterWindow
            key={windowKey}
            system={system}
            systemActions={systemActions}
            onClose={() => onClose(windowKey)}
            onMinimize={() => onMinimize(windowKey)}
            onFocus={() => onOpen(windowKey)}
          />
        );
      case "nova-guard":
        return (
          <NovaGuardWindow
            key={windowKey}
            system={system}
            systemActions={systemActions}
            onClose={() => onClose(windowKey)}
            onMinimize={() => onMinimize(windowKey)}
            onFocus={() => onOpen(windowKey)}
          />
        );
      case "nova-store":
        return (
          <NovaStoreWindow
            key={windowKey}
            system={system}
            systemActions={systemActions}
            onClose={() => onClose(windowKey)}
            onMinimize={() => onMinimize(windowKey)}
            onFocus={() => onOpen(windowKey)}
          />
        );
      case "spaces":
        return (
          <SpacesWindow
            key={windowKey}
            system={system}
            systemActions={systemActions}
            onClose={() => onClose(windowKey)}
            onMinimize={() => onMinimize(windowKey)}
            onFocus={() => onOpen(windowKey)}
          />
        );
      case "offline-mode":
        return (
          <OfflineModePanel
            key={windowKey}
            system={system}
            systemActions={systemActions}
            onClose={() => onClose(windowKey)}
            onMinimize={() => onMinimize(windowKey)}
            onFocus={() => onOpen(windowKey)}
          />
        );
      case "activity-center":
        return (
          <ActivityCenterWindow
            key={windowKey}
            system={system}
            systemActions={systemActions}
            onOpenWindow={onOpen}
            onClose={() => onClose(windowKey)}
            onMinimize={() => onMinimize(windowKey)}
            onFocus={() => onOpen(windowKey)}
          />
        );
      case "weather":
        return (
          <WeatherWindow
            key={windowKey}
            system={system}
            systemActions={systemActions}
            onClose={() => onClose(windowKey)}
            onMinimize={() => onMinimize(windowKey)}
            onFocus={() => onOpen(windowKey)}
          />
        );
      case "notes":
        return (
          <NotesWindow
            key={windowKey}
            system={system}
            systemActions={systemActions}
            onClose={() => onClose(windowKey)}
            onMinimize={() => onMinimize(windowKey)}
            onFocus={() => onOpen(windowKey)}
          />
        );
      case "calculator":
        return (
          <CalculatorWindow
            key={windowKey}
            system={system}
            systemActions={systemActions}
            onClose={() => onClose(windowKey)}
            onMinimize={() => onMinimize(windowKey)}
            onFocus={() => onOpen(windowKey)}
          />
        );
      case "create-app":
        return (
          <CreateNovaAppWindow
            key={windowKey}
            onClose={() => onClose(windowKey)}
            onMinimize={() => onMinimize(windowKey)}
            onGenerated={onGenerated}
            onFocus={() => onOpen(windowKey)}
          />
        );
      case "crm-app":
        return (
          <GeneratedCrmAppWindow
            key={windowKey}
            system={system}
            systemActions={systemActions}
            onClose={() => onClose(windowKey)}
            onMinimize={() => onMinimize(windowKey)}
            onFocus={() => onOpen(windowKey)}
          />
        );
      default:
        return null;
    }
  }

  const menuCopy = contextMenu ? getContextTitle(contextMenu.target) : undefined;
  const menuItems = contextMenu ? buildContextItems(contextMenu.target) : [];

  return (
    <main className="desktop-stage" onContextMenu={handleContextMenu}>
      <div className="aurora-ribbon" />
      <div className="star-field" />
      <NovaRail
        activeWindows={activeWindows}
        system={system}
        systemActions={systemActions}
        minimizedWindows={minimizedWindows}
        attentionWindow={attentionWindow}
        onOpen={onOpen}
        onCommand={onOpenCommand}
      />
      <TopCommandBar onOpen={onOpenCommand} />
      <SystemStatus system={system} onOpenWeather={() => onOpen("weather")} />
      <NotificationStack activityLog={system.activityLog} onOpenActivity={() => onOpen("activity-center")} />
      <DesktopIcons onOpen={onOpen} />
      <FileWindowOrganizer
        count={system.openedFileNames.length}
        activeFileName={system.openedFileName}
        onArrange={systemActions.arrangeFileWindows}
      />

      <section className="window-layer" aria-label="Nova desktop windows">
        <AnimatePresence>
          {activeWindows.map((windowKey) => renderWindow(windowKey))}
          {system.openedFileNames.map((fileName) => {
            const file = system.files.find((item) => item[0] === fileName);
            return file ? <FileViewerWindow key={`file-window-${fileName}`} file={file} system={system} systemActions={systemActions} /> : null;
          })}
          {commandOpen ? (
            <NovaCommandWindow
              key="nova-command"
              system={system}
              systemActions={systemActions}
              onClose={onCloseCommand}
              onCreateApp={onCreateApp}
              onOpenGuard={() => onOpen("nova-guard")}
              onOpenWindow={onOpen}
            />
          ) : null}
        </AnimatePresence>
      </section>

      {switcherOpen ? (
        <MissionControlOverlay
          activeWindows={activeWindows}
          minimizedWindows={minimizedWindows}
          onOpenWindow={onOpen}
          onCloseWindow={onClose}
          onDismiss={onCloseSwitcher}
        />
      ) : null}

      <ActivityShelf
        activeWindows={activeWindows}
        minimizedWindows={minimizedWindows}
        system={system}
        systemActions={systemActions}
        attentionWindow={attentionWindow}
        onOpen={onOpen}
        onMinimize={onMinimize}
        onCommand={onOpenCommand}
        onSwitcher={onOpenSwitcher}
      />
      <AnimatePresence>
        {contextMenu && menuCopy ? (
          <NovaContextMenu
            key={`${contextMenu.target.kind}-${contextMenu.x}-${contextMenu.y}`}
            x={contextMenu.x}
            y={contextMenu.y}
            title={menuCopy.title}
            subtitle={menuCopy.subtitle}
            items={menuItems}
            onClose={() => setContextMenu(null)}
          />
        ) : null}
      </AnimatePresence>
    </main>
  );
}
