import {
  aiProviders,
  guardPermissions,
  recentFiles,
  spaces,
  storeItems,
  type WindowKey,
  type AiProvider,
  type GuardPermission,
  type NovaFile,
  type NovaSpace,
} from "@/data/nova";

export type { NovaSpace } from "@/data/nova";

export type NovaOfflineStatus = "offline" | "checking" | "ready";
export type NovaThemeMode = "Light" | "Dim" | "Focus";
export type NovaDisplayMode = "Desktop" | "Focus Wall" | "Presentation";
export type NovaFontScale = "Small" | "Standard" | "Large";
export type NovaInterfaceDensity = "Minimal" | "Balanced" | "Dense";
export type NovaPersonalizePanel =
  | "Look & Feel"
  | "Themes"
  | "Colors"
  | "Fonts"
  | "Layout"
  | "Sound"
  | "Privacy"
  | "About";

export type NovaTheme = {
  vibe: string;
  accent: string;
  mode: NovaThemeMode;
  transparency: number;
};

export type NovaActivityEntry = {
  id: string;
  time: string;
  title: string;
  body: string;
  tone: "info" | "success" | "guard" | "system";
};

export type NovaCommandEntry = {
  id: string;
  time: string;
  prompt: string;
  result: string;
};

export type NovaWindowSize = {
  width: number;
  height: number;
};

export type NovaSystemState = {
  stateVersion: number;
  openWindows: WindowKey[];
  minimizedWindows: WindowKey[];
  windowSizes: Partial<Record<WindowKey, NovaWindowSize>>;
  files: NovaFile[];
  activeFileSection: string;
  activeFileName: string;
  openedFileName?: string;
  fileInsight: string;
  aiProviders: AiProvider[];
  selectedProvider: string;
  guardPermissions: GuardPermission[];
  guardNote: string;
  installedPacks: string[];
  storeActivity: string;
  spaces: NovaSpace[];
  activeSpace: string;
  theme: NovaTheme;
  personalizePanel: NovaPersonalizePanel;
  brightness: number;
  displayMode: NovaDisplayMode;
  fontScale: NovaFontScale;
  interfaceDensity: NovaInterfaceDensity;
  soundEnabled: boolean;
  mediaPlaying: boolean;
  soundscape: string;
  offlineStatus: NovaOfflineStatus;
  hubActions: number;
  hubSignal: string;
  crmActiveView: string;
  activityLog: NovaActivityEntry[];
  commandHistory: NovaCommandEntry[];
};

export type NovaSystemActions = {
  addFile: () => void;
  setFileSection: (section: string) => void;
  selectFile: (fileName: string) => void;
  openFile: (fileName: string) => void;
  closeFile: () => void;
  summarizeFile: (fileName: string) => void;
  shareFile: (fileName: string) => void;
  pinFileToSpace: (fileName: string) => void;
  setTheme: (theme: Partial<NovaTheme>) => void;
  setPersonalizePanel: (panel: NovaPersonalizePanel) => void;
  setBrightness: (brightness: number) => void;
  cycleDisplayMode: () => void;
  setFontScale: (scale: NovaFontScale) => void;
  setInterfaceDensity: (density: NovaInterfaceDensity) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setWindowSize: (windowKey: WindowKey, size: NovaWindowSize) => void;
  toggleSoundscape: () => void;
  toggleMediaPlayback: () => void;
  recordCommand: (prompt: string, result: string) => void;
  selectProvider: (provider: string) => void;
  toggleSelectedProvider: () => void;
  toggleGuardPermission: (permission: string) => void;
  installPack: (pack: string) => void;
  openPackPreview: (pack: string) => void;
  createSpace: () => void;
  setActiveSpace: (space: string) => void;
  runHubPulse: () => void;
  setOfflineStatus: (status: NovaOfflineStatus) => void;
  setCrmActiveView: (view: string) => void;
  resetSystem: () => void;
};

const initialWindows: WindowKey[] = ["personalize"];

function mergeFiles(files: NovaFile[] | undefined) {
  if (!files?.length) {
    return defaultNovaSystemState.files;
  }

  const fileNames = new Set(files.map((file) => file[0]));
  return [...files, ...defaultNovaSystemState.files.filter((file) => !fileNames.has(file[0]))];
}

export const defaultNovaSystemState: NovaSystemState = {
  stateVersion: 3,
  openWindows: initialWindows,
  minimizedWindows: [],
  windowSizes: {},
  files: recentFiles,
  activeFileSection: "My Space",
  activeFileName: recentFiles[0][0],
  openedFileName: undefined,
  fileInsight: "Nova is ready to preview, summarize, or route this file into the active space.",
  aiProviders,
  selectedProvider: "Codex",
  guardPermissions,
  guardNote: "Nova asks before reading sensitive locations.",
  installedPacks: storeItems.filter((item) => item[2] === "Installed").map((item) => item[0]),
  storeActivity: "Founder Pack is active in Builder Studio.",
  spaces,
  activeSpace: spaces[0][0],
  theme: {
    vibe: "Luminous",
    accent: "#7467ff",
    mode: "Light",
    transparency: 34,
  },
  personalizePanel: "Look & Feel",
  brightness: 74,
  displayMode: "Desktop",
  fontScale: "Standard",
  interfaceDensity: "Balanced",
  soundEnabled: true,
  mediaPlaying: false,
  soundscape: "Silent",
  offlineStatus: "offline",
  hubActions: 12,
  hubSignal: "System is calm. Builder Studio is still the active mission.",
  crmActiveView: "Dashboard",
  activityLog: [
    {
      id: "boot-ready",
      time: "09:42",
      title: "Nova desktop ready",
      body: "Builder Studio, My Space, Guard, and AI routing are available.",
      tone: "system",
    },
    {
      id: "guard-default",
      time: "09:39",
      title: "Nova Guard active",
      body: "Sensitive actions require approval and remain visible in the ledger.",
      tone: "guard",
    },
    {
      id: "store-founder",
      time: "09:36",
      title: "Founder Pack installed",
      body: "CRM, invoices, pitch room, and starter automations are pinned.",
      tone: "success",
    },
  ],
  commandHistory: [
    {
      id: "command-seed",
      time: "09:42",
      prompt: "Prepare Builder Studio",
      result: "Nova Hub, Guard, AI Center, and My Space are ready.",
    },
  ],
};

export function mergeNovaSystemState(value: unknown): NovaSystemState {
  if (!value || typeof value !== "object") {
    return defaultNovaSystemState;
  }

  const state = value as Partial<NovaSystemState>;
  const incomingOpenWindows = Array.isArray(state.openWindows) ? state.openWindows : defaultNovaSystemState.openWindows;
  const isLegacyDefaultWindowStack =
    state.stateVersion !== defaultNovaSystemState.stateVersion &&
    incomingOpenWindows.length === 2 &&
    incomingOpenWindows[0] === "my-space" &&
    incomingOpenWindows[1] === "personalize" &&
    !(Array.isArray(state.minimizedWindows) && state.minimizedWindows.length);

  return {
    ...defaultNovaSystemState,
    ...state,
    stateVersion: defaultNovaSystemState.stateVersion,
    theme: {
      ...defaultNovaSystemState.theme,
      ...(state.theme ?? {}),
    },
    minimizedWindows: Array.isArray(state.minimizedWindows) ? state.minimizedWindows : defaultNovaSystemState.minimizedWindows,
    windowSizes: state.windowSizes ?? defaultNovaSystemState.windowSizes,
    files: mergeFiles(state.files),
    openWindows: isLegacyDefaultWindowStack ? defaultNovaSystemState.openWindows : incomingOpenWindows,
    aiProviders: state.aiProviders?.length ? state.aiProviders : defaultNovaSystemState.aiProviders,
    guardPermissions: state.guardPermissions?.length ? state.guardPermissions : defaultNovaSystemState.guardPermissions,
    installedPacks: state.installedPacks?.length ? state.installedPacks : defaultNovaSystemState.installedPacks,
    spaces: state.spaces?.length ? state.spaces : defaultNovaSystemState.spaces,
    activityLog: state.activityLog?.length ? state.activityLog : defaultNovaSystemState.activityLog,
    commandHistory: state.commandHistory?.length ? state.commandHistory : defaultNovaSystemState.commandHistory,
  };
}
