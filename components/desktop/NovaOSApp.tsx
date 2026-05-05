"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import type { WindowKey } from "@/data/nova";
import { DesktopShell } from "@/components/desktop/DesktopShell";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import {
  defaultNovaSystemState,
  mergeNovaSystemState,
  type NovaOfflineStatus,
  type NovaSpace,
  type NovaSystemActions,
  type NovaSystemState,
  type NovaTheme,
} from "@/lib/nova-system";

const STORAGE_KEY = "nova-os-onboarding-complete";
const SYSTEM_STORAGE_KEY = "nova-os-system-state";
const STORAGE_EVENT = "nova-os-onboarding-changed";
const SYSTEM_STORAGE_EVENT = "nova-os-system-changed";
let cachedSystemRaw = "";
let cachedSystemSnapshot = defaultNovaSystemState;

function subscribeToOnboarding(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", callback);
  window.addEventListener(STORAGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(STORAGE_EVENT, callback);
  };
}

function getOnboardingSnapshot() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(STORAGE_KEY) === "true";
}

function subscribeToSystem(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", callback);
  window.addEventListener(SYSTEM_STORAGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(SYSTEM_STORAGE_EVENT, callback);
  };
}

function getSystemSnapshot(): NovaSystemState {
  if (typeof window === "undefined") {
    return defaultNovaSystemState;
  }

  const stored = window.localStorage.getItem(SYSTEM_STORAGE_KEY) ?? "";
  if (stored === cachedSystemRaw) {
    return cachedSystemSnapshot;
  }

  cachedSystemRaw = stored;
  if (!stored) {
    cachedSystemSnapshot = defaultNovaSystemState;
    return cachedSystemSnapshot;
  }

  try {
    cachedSystemSnapshot = mergeNovaSystemState(JSON.parse(stored));
  } catch {
    cachedSystemSnapshot = defaultNovaSystemState;
  }

  return cachedSystemSnapshot;
}

function writeSystemSnapshot(system: NovaSystemState) {
  window.localStorage.setItem(SYSTEM_STORAGE_KEY, JSON.stringify(system));
  window.dispatchEvent(new Event(SYSTEM_STORAGE_EVENT));
}

function createActivity(title: string, body: string, tone: NovaSystemState["activityLog"][number]["tone"] = "info") {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    title,
    body,
    tone,
  };
}

function pushActivity(
  current: NovaSystemState,
  title: string,
  body: string,
  tone: NovaSystemState["activityLog"][number]["tone"] = "info"
) {
  return [createActivity(title, body, tone), ...current.activityLog].slice(0, 18);
}

export function NovaOSApp() {
  const onboardingComplete = useSyncExternalStore(subscribeToOnboarding, getOnboardingSnapshot, () => false);
  const system = useSyncExternalStore(subscribeToSystem, getSystemSnapshot, () => defaultNovaSystemState);
  const [commandOpen, setCommandOpen] = useState(false);
  const rootStyle = {
    "--nova-accent": system.theme.accent,
    "--nova-glass-alpha": `${0.52 + (system.theme.transparency / 100) * 0.36}`,
  } as CSSProperties;

  const updateSystem = useCallback((updater: (current: NovaSystemState) => NovaSystemState) => {
    writeSystemSnapshot(updater(getSystemSnapshot()));
  }, []);

  function completeOnboarding() {
    window.localStorage.setItem(STORAGE_KEY, "true");
    window.dispatchEvent(new Event(STORAGE_EVENT));
    writeSystemSnapshot(mergeNovaSystemState(getSystemSnapshot()));
  }

  const openWindow = useCallback((windowKey: WindowKey) => {
    updateSystem((current) => {
      const next = current.openWindows.filter((item) => item !== windowKey);
      return {
        ...current,
        openWindows: [...next, windowKey],
      };
    });
  }, [updateSystem]);

  const closeWindow = useCallback((windowKey: WindowKey) => {
    updateSystem((current) => ({
      ...current,
      openWindows: current.openWindows.filter((item) => item !== windowKey),
    }));
  }, [updateSystem]);

  useEffect(() => {
    function handleKeyboard(event: KeyboardEvent) {
      const modifier = event.metaKey || event.ctrlKey;

      if (modifier && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
        return;
      }

      if (event.key === "Escape") {
        setCommandOpen(false);
        return;
      }

      if (modifier && event.key.toLowerCase() === "w") {
        event.preventDefault();
        const topWindow = getSystemSnapshot().openWindows.at(-1);
        if (topWindow) {
          closeWindow(topWindow);
        }
        return;
      }

      if (modifier && /^[1-8]$/.test(event.key)) {
        event.preventDefault();
        const shortcuts: WindowKey[] = [
          "nova-hub",
          "my-space",
          "spaces",
          "ai-center",
          "nova-store",
          "nova-guard",
          "activity-center",
          "personalize",
        ];
        const target = shortcuts[Number(event.key) - 1];
        if (target) {
          openWindow(target);
        }
      }
    }

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [closeWindow, openWindow]);

  function openCreateApp() {
    setCommandOpen(false);
    openWindow("create-app");
  }

  function openGeneratedCrm() {
    setCommandOpen(false);
    updateSystem((current) => {
      const withoutBuilder = current.openWindows.filter((item) => item !== "create-app" && item !== "crm-app");
      return {
        ...current,
        openWindows: [...withoutBuilder, "crm-app"],
        activityLog: pushActivity(current, "ClientFlow opened", "The generated CRM Nova App is now running.", "success"),
      };
    });
  }

  const systemActions: NovaSystemActions = {
    addFile() {
      updateSystem((current) => ({
        ...current,
        activeFileSection: "Recent",
        files: [
          ["Untitled_Nova_App.nova", "Nova Document", "Just now", "16 KB"],
          ...current.files.filter((file) => file[0] !== "Untitled_Nova_App.nova"),
        ],
        hubActions: current.hubActions + 1,
        hubSignal: "A new local Nova document was added to My Space.",
        activityLog: pushActivity(current, "File created", "Untitled_Nova_App.nova was added to My Space.", "success"),
      }));
    },
    setFileSection(section: string) {
      updateSystem((current) => ({ ...current, activeFileSection: section }));
    },
    setTheme(theme: Partial<NovaTheme>) {
      updateSystem((current) => ({
        ...current,
        theme: { ...current.theme, ...theme },
        hubSignal: `Personalization updated: ${theme.vibe ?? theme.mode ?? "accent changed"}.`,
        activityLog: pushActivity(current, "Personalization updated", `Nova theme changed to ${theme.vibe ?? theme.mode ?? "a new accent"}.`),
      }));
    },
    selectProvider(provider: string) {
      updateSystem((current) => ({ ...current, selectedProvider: provider }));
    },
    toggleSelectedProvider() {
      updateSystem((current) => {
        const selectedProvider = current.aiProviders.find((provider) => provider.name === current.selectedProvider);
        return {
          ...current,
          aiProviders: current.aiProviders.map((provider) =>
            provider.name === current.selectedProvider
              ? { ...provider, state: provider.state === "Disconnected" ? "Connected" : "Disconnected" }
              : provider
          ),
          hubActions: current.hubActions + 1,
          hubSignal: selectedProvider
            ? `${selectedProvider.name} was ${selectedProvider.state === "Disconnected" ? "connected" : "disconnected"}.`
            : current.hubSignal,
          activityLog: selectedProvider
            ? pushActivity(
                current,
                "AI routing changed",
                `${selectedProvider.name} was ${selectedProvider.state === "Disconnected" ? "connected" : "disconnected"}.`,
                "system"
              )
            : current.activityLog,
        };
      });
    },
    toggleGuardPermission(permissionName: string) {
      updateSystem((current) => {
        const permission = current.guardPermissions.find((item) => item.name === permissionName);
        const nextEnabled = permission ? !permission.enabled : false;
        return {
          ...current,
          guardPermissions: current.guardPermissions.map((permissionItem) =>
            permissionItem.name === permissionName ? { ...permissionItem, enabled: !permissionItem.enabled } : permissionItem
          ),
          guardNote: permission ? `${permission.name} is now ${nextEnabled ? "enabled" : "limited"}.` : current.guardNote,
          hubActions: current.hubActions + 1,
          hubSignal: permission ? `Nova Guard changed: ${permission.name} is ${nextEnabled ? "enabled" : "limited"}.` : current.hubSignal,
          activityLog: permission
            ? pushActivity(current, "Guard permission changed", `${permission.name} is now ${nextEnabled ? "enabled" : "limited"}.`, "guard")
            : current.activityLog,
        };
      });
    },
    installPack(pack: string) {
      updateSystem((current) => ({
        ...current,
        installedPacks: current.installedPacks.includes(pack) ? current.installedPacks : [...current.installedPacks, pack],
        storeActivity: `${pack} installed and pinned to ${current.activeSpace}.`,
        hubActions: current.hubActions + 1,
        hubSignal: `${pack} was installed into ${current.activeSpace}.`,
        activityLog: pushActivity(current, "Pack installed", `${pack} was pinned to ${current.activeSpace}.`, "success"),
      }));
    },
    openPackPreview(pack: string) {
      updateSystem((current) => ({
        ...current,
        storeActivity: `${pack} opened as a live pack preview.`,
      }));
    },
    createSpace() {
      updateSystem((current) => {
        const newSpace: NovaSpace = ["Launch Lab", "3 apps", "4 automations", "Draft"];
        const spaces = current.spaces.some((space) => space[0] === newSpace[0]) ? current.spaces : [...current.spaces, newSpace];
        return {
          ...current,
        spaces,
        activeSpace: newSpace[0],
        hubActions: current.hubActions + 1,
        hubSignal: "Launch Lab was drafted with starter apps, agents, and guard rules.",
        activityLog: pushActivity(current, "Space drafted", "Launch Lab was created with starter apps and guard rules.", "success"),
      };
      });
    },
    setActiveSpace(space: string) {
      updateSystem((current) => ({
        ...current,
        activeSpace: space,
        hubSignal: `${space} is now the active mission space.`,
        activityLog: pushActivity(current, "Space switched", `${space} is now the active mission.`),
      }));
    },
    runHubPulse() {
      updateSystem((current) => ({
        ...current,
        hubActions: current.hubActions + 1,
        hubSignal: "Nova refreshed files, spaces, guard state, and AI routing.",
        activityLog: pushActivity(current, "System refreshed", "Files, spaces, guard state, and AI routing were checked.", "system"),
      }));
    },
    setOfflineStatus(status: NovaOfflineStatus) {
      updateSystem((current) => ({
        ...current,
        offlineStatus: status,
        hubSignal: status === "ready" ? "Connection check completed. Cloud work is ready to resume." : current.hubSignal,
        activityLog:
          status === "ready"
            ? pushActivity(current, "Connection ready", "Cloud work can resume after your approvals.", "success")
            : current.activityLog,
      }));
    },
    setCrmActiveView(view: string) {
      updateSystem((current) => ({ ...current, crmActiveView: view }));
    },
    resetSystem() {
      writeSystemSnapshot(defaultNovaSystemState);
    },
  };

  return (
    <div className={`nova-root vibe-${system.theme.vibe.toLowerCase()} mode-${system.theme.mode.toLowerCase()}`} style={rootStyle}>
      {onboardingComplete ? (
        <DesktopShell
          system={system}
          systemActions={systemActions}
          activeWindows={system.openWindows}
          commandOpen={commandOpen}
          onOpen={openWindow}
          onClose={closeWindow}
          onOpenCommand={() => setCommandOpen(true)}
          onCloseCommand={() => setCommandOpen(false)}
          onCreateApp={openCreateApp}
          onGenerated={openGeneratedCrm}
        />
      ) : (
        <OnboardingFlow onComplete={completeOnboarding} />
      )}
    </div>
  );
}
