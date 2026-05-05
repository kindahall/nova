"use client";

import type { CSSProperties } from "react";
import { useState, useSyncExternalStore } from "react";
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
const initialWindows: WindowKey[] = ["my-space", "personalize"];
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

export function NovaOSApp() {
  const onboardingComplete = useSyncExternalStore(subscribeToOnboarding, getOnboardingSnapshot, () => false);
  const system = useSyncExternalStore(subscribeToSystem, getSystemSnapshot, () => defaultNovaSystemState);
  const [activeWindows, setActiveWindows] = useState<WindowKey[]>(initialWindows);
  const [commandOpen, setCommandOpen] = useState(false);
  const rootStyle = {
    "--nova-accent": system.theme.accent,
    "--nova-glass-alpha": `${0.52 + (system.theme.transparency / 100) * 0.36}`,
  } as CSSProperties;

  function updateSystem(updater: (current: NovaSystemState) => NovaSystemState) {
    writeSystemSnapshot(updater(getSystemSnapshot()));
  }

  function completeOnboarding() {
    window.localStorage.setItem(STORAGE_KEY, "true");
    window.dispatchEvent(new Event(STORAGE_EVENT));
    writeSystemSnapshot(mergeNovaSystemState(getSystemSnapshot()));
    setActiveWindows(initialWindows);
  }

  function openWindow(windowKey: WindowKey) {
    setActiveWindows((current) => {
      const next = current.filter((item) => item !== windowKey);
      return [...next, windowKey];
    });
  }

  function closeWindow(windowKey: WindowKey) {
    setActiveWindows((current) => current.filter((item) => item !== windowKey));
  }

  function openCreateApp() {
    setCommandOpen(false);
    openWindow("create-app");
  }

  function openGeneratedCrm() {
    setCommandOpen(false);
    setActiveWindows((current) => {
      const withoutBuilder = current.filter((item) => item !== "create-app" && item !== "crm-app");
      return [...withoutBuilder, "crm-app"];
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
        };
      });
    },
    setActiveSpace(space: string) {
      updateSystem((current) => ({
        ...current,
        activeSpace: space,
        hubSignal: `${space} is now the active mission space.`,
      }));
    },
    runHubPulse() {
      updateSystem((current) => ({
        ...current,
        hubActions: current.hubActions + 1,
        hubSignal: "Nova refreshed files, spaces, guard state, and AI routing.",
      }));
    },
    setOfflineStatus(status: NovaOfflineStatus) {
      updateSystem((current) => ({
        ...current,
        offlineStatus: status,
        hubSignal: status === "ready" ? "Connection check completed. Cloud work is ready to resume." : current.hubSignal,
      }));
    },
    setCrmActiveView(view: string) {
      updateSystem((current) => ({ ...current, crmActiveView: view }));
    },
    resetSystem() {
      writeSystemSnapshot(defaultNovaSystemState);
      setActiveWindows(initialWindows);
    },
  };

  return (
    <div className={`nova-root vibe-${system.theme.vibe.toLowerCase()} mode-${system.theme.mode.toLowerCase()}`} style={rootStyle}>
      {onboardingComplete ? (
        <DesktopShell
          system={system}
          systemActions={systemActions}
          activeWindows={activeWindows}
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
