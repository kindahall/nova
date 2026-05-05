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

export type NovaSystemState = {
  openWindows: WindowKey[];
  files: NovaFile[];
  activeFileSection: string;
  aiProviders: AiProvider[];
  selectedProvider: string;
  guardPermissions: GuardPermission[];
  guardNote: string;
  installedPacks: string[];
  storeActivity: string;
  spaces: NovaSpace[];
  activeSpace: string;
  theme: NovaTheme;
  offlineStatus: NovaOfflineStatus;
  hubActions: number;
  hubSignal: string;
  crmActiveView: string;
  activityLog: NovaActivityEntry[];
};

export type NovaSystemActions = {
  addFile: () => void;
  setFileSection: (section: string) => void;
  setTheme: (theme: Partial<NovaTheme>) => void;
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

const initialWindows: WindowKey[] = ["my-space", "personalize"];

export const defaultNovaSystemState: NovaSystemState = {
  openWindows: initialWindows,
  files: recentFiles,
  activeFileSection: "My Space",
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
};

export function mergeNovaSystemState(value: unknown): NovaSystemState {
  if (!value || typeof value !== "object") {
    return defaultNovaSystemState;
  }

  const state = value as Partial<NovaSystemState>;

  return {
    ...defaultNovaSystemState,
    ...state,
    theme: {
      ...defaultNovaSystemState.theme,
      ...(state.theme ?? {}),
    },
    files: state.files?.length ? state.files : defaultNovaSystemState.files,
    openWindows: state.openWindows?.length ? state.openWindows : defaultNovaSystemState.openWindows,
    aiProviders: state.aiProviders?.length ? state.aiProviders : defaultNovaSystemState.aiProviders,
    guardPermissions: state.guardPermissions?.length ? state.guardPermissions : defaultNovaSystemState.guardPermissions,
    installedPacks: state.installedPacks?.length ? state.installedPacks : defaultNovaSystemState.installedPacks,
    spaces: state.spaces?.length ? state.spaces : defaultNovaSystemState.spaces,
    activityLog: state.activityLog?.length ? state.activityLog : defaultNovaSystemState.activityLog,
  };
}
