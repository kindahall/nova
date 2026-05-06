"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import type { WindowKey } from "@/data/nova";
import { DesktopShell } from "@/components/desktop/DesktopShell";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import {
  defaultNovaSystemState,
  mergeNovaSystemState,
  type NovaDisplayMode,
  type NovaFontScale,
  type NovaInterfaceDensity,
  type NovaOfflineStatus,
  type NovaPersonalizePanel,
  type NovaSpace,
  type NovaSystemActions,
  type NovaSystemState,
  type NovaTheme,
} from "@/lib/nova-system";

const STORAGE_KEY = "nova-os-onboarding-complete";
const SYSTEM_STORAGE_KEY = "nova-os-system-state";
const SYSTEM_API = "/api/nova-system";
const STORAGE_EVENT = "nova-os-onboarding-changed";
const SYSTEM_STORAGE_EVENT = "nova-os-system-changed";
let cachedSystemRaw = "";
let cachedSystemSnapshot = defaultNovaSystemState;
let persistTimer: number | undefined;

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

function persistSystemSnapshot(system: NovaSystemState) {
  if (typeof window === "undefined") {
    return;
  }

  if (persistTimer) {
    window.clearTimeout(persistTimer);
  }

  persistTimer = window.setTimeout(() => {
    fetch(SYSTEM_API, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: system }),
    }).catch(() => {
      // The desktop stays local-first if the local API is unavailable.
    });
  }, 120);
}

function writeSystemSnapshot(system: NovaSystemState, options: { persist?: boolean } = {}) {
  const nextSystem = mergeNovaSystemState(system);
  window.localStorage.setItem(SYSTEM_STORAGE_KEY, JSON.stringify(nextSystem));
  window.dispatchEvent(new Event(SYSTEM_STORAGE_EVENT));

  if (options.persist !== false) {
    persistSystemSnapshot(nextSystem);
  }
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
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const displayClass = system.displayMode.toLowerCase().replaceAll(" ", "-");
  const densityClass = system.interfaceDensity.toLowerCase();
  const fontScale = system.fontScale === "Large" ? "1.04" : system.fontScale === "Small" ? "0.96" : "1";
  const brightnessShadow = `${Math.max(0, 100 - system.brightness) / 170}`;
  const rootStyle = {
    "--nova-accent": system.theme.accent,
    "--nova-glass-alpha": `${0.52 + (system.theme.transparency / 100) * 0.36}`,
    "--nova-font-scale": fontScale,
    "--nova-brightness-shadow": brightnessShadow,
  } as CSSProperties;

  const updateSystem = useCallback((updater: (current: NovaSystemState) => NovaSystemState) => {
    writeSystemSnapshot(updater(getSystemSnapshot()));
  }, []);

  useEffect(() => {
    let active = true;

    fetch(SYSTEM_API)
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: { source?: string; state?: unknown } | null) => {
        if (!active || !payload?.state) {
          return;
        }

        const hasLocalState = Boolean(window.localStorage.getItem(SYSTEM_STORAGE_KEY));
        if (!hasLocalState) {
          writeSystemSnapshot(mergeNovaSystemState(payload.state), { persist: false });
          return;
        }

        writeSystemSnapshot(getSystemSnapshot());
      })
      .catch(() => {
        persistSystemSnapshot(getSystemSnapshot());
      });

    return () => {
      active = false;
    };
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
        minimizedWindows: current.minimizedWindows.filter((item) => item !== windowKey),
      };
    });
  }, [updateSystem]);

  const closeWindow = useCallback((windowKey: WindowKey) => {
    updateSystem((current) => ({
      ...current,
      openWindows: current.openWindows.filter((item) => item !== windowKey),
      minimizedWindows: current.minimizedWindows.filter((item) => item !== windowKey),
    }));
  }, [updateSystem]);

  const minimizeWindow = useCallback((windowKey: WindowKey) => {
    updateSystem((current) => ({
      ...current,
      openWindows: current.openWindows.filter((item) => item !== windowKey),
      minimizedWindows: current.minimizedWindows.includes(windowKey)
        ? current.minimizedWindows
        : [...current.minimizedWindows, windowKey],
      activityLog: pushActivity(current, "Window minimized", `${windowKey.replaceAll("-", " ")} was sent to the Activity Shelf.`, "system"),
    }));
  }, [updateSystem]);

  useEffect(() => {
    function handleKeyboard(event: KeyboardEvent) {
      const modifier = event.metaKey || event.ctrlKey;

      if (modifier && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSwitcherOpen(false);
        setCommandOpen(true);
        return;
      }

      if (modifier && event.key === "Tab") {
        event.preventDefault();
        setCommandOpen(false);
        setSwitcherOpen(true);
        return;
      }

      if (event.key === "Escape") {
        setCommandOpen(false);
        setSwitcherOpen(false);
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
    setSwitcherOpen(false);
    openWindow("create-app");
  }

  function openGeneratedCrm() {
    setCommandOpen(false);
    setSwitcherOpen(false);
    updateSystem((current) => {
      const withoutBuilder = current.openWindows.filter((item) => item !== "create-app" && item !== "crm-app");
      return {
        ...current,
        openWindows: [...withoutBuilder, "crm-app"],
        minimizedWindows: current.minimizedWindows.filter((item) => item !== "crm-app" && item !== "create-app"),
        activityLog: pushActivity(current, "ClientFlow opened", "The generated CRM Nova App is now running.", "success"),
      };
    });
  }

  const systemActions: NovaSystemActions = {
    addFile() {
      updateSystem((current) => ({
        ...current,
        activeFileSection: "Recent",
        activeFileName: "Untitled_Nova_App.nova",
        fileInsight: "This new Nova document is ready for app planning, notes, or a generated workflow.",
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
    selectFile(fileName: string) {
      updateSystem((current) => {
        const file = current.files.find((item) => item[0] === fileName);
        return {
          ...current,
          activeFileName: fileName,
          fileInsight: file
            ? `${file[0]} is selected. Nova can summarize it, pin it to ${current.activeSpace}, or send a guarded share request.`
            : current.fileInsight,
          activityLog: file ? pushActivity(current, "File selected", `${file[0]} is now active in My Space.`) : current.activityLog,
        };
      });
    },
    summarizeFile(fileName: string) {
      updateSystem((current) => {
        const file = current.files.find((item) => item[0] === fileName);
        return {
          ...current,
          activeFileName: fileName,
          fileInsight: file
            ? `Summary ready: ${file[0]} contains useful context for ${current.activeSpace}. Key actions were staged in Nova Hub.`
            : current.fileInsight,
          hubActions: current.hubActions + 1,
          hubSignal: file ? `${file[0]} was summarized and added to the active mission context.` : current.hubSignal,
          activityLog: file
            ? pushActivity(current, "File summarized", `${file[0]} was summarized into ${current.activeSpace}.`, "system")
            : current.activityLog,
        };
      });
    },
    shareFile(fileName: string) {
      updateSystem((current) => {
        const file = current.files.find((item) => item[0] === fileName);
        return {
          ...current,
          activeFileName: fileName,
          guardNote: file ? `Share request queued for ${file[0]}. Nova Guard will ask before sending anything out.` : current.guardNote,
          fileInsight: file ? `${file[0]} is waiting on Guard approval before any external share.` : current.fileInsight,
          hubActions: current.hubActions + 1,
          hubSignal: file ? `Share approval queued for ${file[0]}.` : current.hubSignal,
          activityLog: file
            ? pushActivity(current, "Guard share queued", `${file[0]} needs approval before leaving Nova OS.`, "guard")
            : current.activityLog,
        };
      });
    },
    pinFileToSpace(fileName: string) {
      updateSystem((current) => {
        const file = current.files.find((item) => item[0] === fileName);
        return {
          ...current,
          activeFileName: fileName,
          fileInsight: file ? `${file[0]} is pinned to ${current.activeSpace} and will travel with that mission.` : current.fileInsight,
          hubActions: current.hubActions + 1,
          hubSignal: file ? `${file[0]} was pinned to ${current.activeSpace}.` : current.hubSignal,
          activityLog: file
            ? pushActivity(current, "File pinned", `${file[0]} was pinned to ${current.activeSpace}.`, "success")
            : current.activityLog,
        };
      });
    },
    setTheme(theme: Partial<NovaTheme>) {
      updateSystem((current) => {
        const changeLabel = theme.vibe ?? theme.mode ?? (theme.accent ? "a new accent" : undefined);
        return {
          ...current,
          theme: { ...current.theme, ...theme },
          hubSignal: changeLabel
            ? `Personalization updated: ${changeLabel}.`
            : `Glass transparency changed to ${theme.transparency ?? current.theme.transparency}%.`,
          activityLog: changeLabel
            ? pushActivity(current, "Personalization updated", `Nova theme changed to ${changeLabel}.`)
            : current.activityLog,
        };
      });
    },
    setPersonalizePanel(panel: NovaPersonalizePanel) {
      updateSystem((current) => ({
        ...current,
        personalizePanel: panel,
        hubSignal: `Personalize opened ${panel}.`,
      }));
    },
    setBrightness(brightness: number) {
      const nextBrightness = Math.min(100, Math.max(20, Math.round(brightness)));
      updateSystem((current) => ({
        ...current,
        brightness: nextBrightness,
        hubSignal: `Display brightness set to ${nextBrightness}%.`,
        activityLog: pushActivity(current, "Display adjusted", `Brightness changed to ${nextBrightness}%.`, "system"),
      }));
    },
    cycleDisplayMode() {
      const modes: NovaDisplayMode[] = ["Desktop", "Focus Wall", "Presentation"];
      updateSystem((current) => {
        const nextMode = modes[(modes.indexOf(current.displayMode) + 1) % modes.length];
        return {
          ...current,
          displayMode: nextMode,
          hubSignal: `Display mode switched to ${nextMode}.`,
          activityLog: pushActivity(current, "Display mode changed", `Nova is now in ${nextMode} mode.`, "system"),
        };
      });
    },
    setFontScale(scale: NovaFontScale) {
      updateSystem((current) => ({
        ...current,
        fontScale: scale,
        hubSignal: `Interface text scale changed to ${scale}.`,
        activityLog: pushActivity(current, "Font scale updated", `Nova text scale is now ${scale}.`),
      }));
    },
    setInterfaceDensity(density: NovaInterfaceDensity) {
      updateSystem((current) => ({
        ...current,
        interfaceDensity: density,
        hubSignal: `Interface density changed to ${density}.`,
        activityLog: pushActivity(current, "Layout density updated", `Nova windows now use ${density} density.`),
      }));
    },
    setSoundEnabled(enabled: boolean) {
      updateSystem((current) => ({
        ...current,
        soundEnabled: enabled,
        hubSignal: `System sound feedback ${enabled ? "enabled" : "muted"}.`,
        activityLog: pushActivity(current, "Sound feedback changed", `System feedback is now ${enabled ? "on" : "muted"}.`),
      }));
    },
    setWindowSize(windowKey, size) {
      updateSystem((current) => ({
        ...current,
        windowSizes: {
          ...current.windowSizes,
          [windowKey]: size,
        },
      }));
    },
    toggleSoundscape() {
      updateSystem((current) => {
        const nextSoundscape = current.soundscape === "Focus Flow" ? "Silent" : "Focus Flow";
        return {
          ...current,
          soundscape: nextSoundscape,
          soundEnabled: nextSoundscape !== "Silent",
          hubSignal: nextSoundscape === "Silent" ? "Soundscape muted." : "Focus Flow soundscape is active.",
          activityLog: pushActivity(
            current,
            "Soundscape changed",
            nextSoundscape === "Silent" ? "Nova soundscape is muted." : "Focus Flow soundscape is running.",
            "system"
          ),
        };
      });
    },
    toggleMediaPlayback() {
      updateSystem((current) => ({
        ...current,
        mediaPlaying: !current.mediaPlaying,
        hubSignal: !current.mediaPlaying ? "Media preview started in the shelf." : "Media preview paused.",
        activityLog: pushActivity(
          current,
          "Media shelf changed",
          !current.mediaPlaying ? "Media preview started." : "Media preview paused.",
          "system"
        ),
      }));
    },
    recordCommand(prompt: string, result: string) {
      updateSystem((current) => ({
        ...current,
        commandHistory: [
          {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
            prompt,
            result,
          },
          ...current.commandHistory,
        ].slice(0, 8),
        hubActions: current.hubActions + 1,
        hubSignal: result,
        activityLog: pushActivity(current, "Nova Command", result, "system"),
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
    <div
      className={`nova-root vibe-${system.theme.vibe.toLowerCase()} mode-${system.theme.mode.toLowerCase()} display-${displayClass} density-${densityClass}`}
      style={rootStyle}
    >
      {onboardingComplete ? (
        <DesktopShell
          system={system}
          systemActions={systemActions}
          activeWindows={system.openWindows}
          minimizedWindows={system.minimizedWindows}
          commandOpen={commandOpen}
          switcherOpen={switcherOpen}
          onOpen={openWindow}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onOpenCommand={() => setCommandOpen(true)}
          onCloseCommand={() => setCommandOpen(false)}
          onOpenSwitcher={() => {
            setCommandOpen(false);
            setSwitcherOpen(true);
          }}
          onCloseSwitcher={() => setSwitcherOpen(false)}
          onCreateApp={openCreateApp}
          onGenerated={openGeneratedCrm}
        />
      ) : (
        <OnboardingFlow onComplete={completeOnboarding} />
      )}
    </div>
  );
}
