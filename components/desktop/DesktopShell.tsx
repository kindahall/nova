"use client";

import { AnimatePresence } from "framer-motion";
import type { WindowKey } from "@/data/nova";
import { CreateNovaAppWindow } from "@/components/apps/CreateNovaAppWindow";
import { GeneratedCrmAppWindow } from "@/components/apps/GeneratedCrmAppWindow";
import { NovaCommandWindow } from "@/components/command/NovaCommandWindow";
import { TopCommandBar } from "@/components/command/TopCommandBar";
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
import { MissionControlOverlay } from "@/components/desktop/MissionControlOverlay";
import { NotificationStack } from "@/components/desktop/NotificationStack";
import { SystemStatus } from "@/components/desktop/SystemStatus";
import { NovaRail } from "@/components/rail/NovaRail";
import type { NovaSystemActions, NovaSystemState } from "@/lib/nova-system";

type DesktopShellProps = {
  system: NovaSystemState;
  systemActions: NovaSystemActions;
  activeWindows: WindowKey[];
  commandOpen: boolean;
  switcherOpen: boolean;
  onOpen: (window: WindowKey) => void;
  onClose: (window: WindowKey) => void;
  onOpenCommand: () => void;
  onCloseCommand: () => void;
  onOpenSwitcher: () => void;
  onCloseSwitcher: () => void;
  onCreateApp: () => void;
  onGenerated: () => void;
};

export function DesktopShell({
  system,
  systemActions,
  activeWindows,
  commandOpen,
  switcherOpen,
  onOpen,
  onClose,
  onOpenCommand,
  onCloseCommand,
  onOpenSwitcher,
  onCloseSwitcher,
  onCreateApp,
  onGenerated,
}: DesktopShellProps) {
  function renderWindow(windowKey: WindowKey) {
    switch (windowKey) {
      case "my-space":
        return (
          <MySpaceWindow
            key={windowKey}
            system={system}
            systemActions={systemActions}
            onClose={() => onClose(windowKey)}
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
            onFocus={() => onOpen(windowKey)}
          />
        );
      case "create-app":
        return (
          <CreateNovaAppWindow
            key={windowKey}
            onClose={() => onClose(windowKey)}
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
            onFocus={() => onOpen(windowKey)}
          />
        );
      default:
        return null;
    }
  }

  return (
    <main className="desktop-stage">
      <div className="aurora-ribbon" />
      <div className="star-field" />
      <NovaRail
        activeWindows={activeWindows}
        system={system}
        systemActions={systemActions}
        onOpen={onOpen}
        onCommand={onOpenCommand}
      />
      <TopCommandBar onOpen={onOpenCommand} />
      <SystemStatus system={system} onOpenActivity={() => onOpen("activity-center")} />
      <NotificationStack activityLog={system.activityLog} onOpenActivity={() => onOpen("activity-center")} />
      <DesktopIcons onOpen={onOpen} />

      <section className="window-layer" aria-label="Nova desktop windows">
        <AnimatePresence>
          {activeWindows.map((windowKey) => renderWindow(windowKey))}
          {commandOpen ? (
            <NovaCommandWindow
              key="nova-command"
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
          onOpenWindow={onOpen}
          onCloseWindow={onClose}
          onDismiss={onCloseSwitcher}
        />
      ) : null}

      <ActivityShelf activeWindows={activeWindows} onOpen={onOpen} onCommand={onOpenCommand} onSwitcher={onOpenSwitcher} />
    </main>
  );
}
