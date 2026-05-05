import {
  aiProviders,
  guardPermissions,
  recentFiles,
  spaces,
  storeItems,
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

export type NovaSystemState = {
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

export const defaultNovaSystemState: NovaSystemState = {
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
    aiProviders: state.aiProviders?.length ? state.aiProviders : defaultNovaSystemState.aiProviders,
    guardPermissions: state.guardPermissions?.length ? state.guardPermissions : defaultNovaSystemState.guardPermissions,
    installedPacks: state.installedPacks?.length ? state.installedPacks : defaultNovaSystemState.installedPacks,
    spaces: state.spaces?.length ? state.spaces : defaultNovaSystemState.spaces,
  };
}
