"use client";

import {
  Bell,
  Check,
  Grid2X2,
  Info,
  Layout,
  Monitor,
  Moon,
  Palette,
  Shield,
  SlidersHorizontal,
  Sun,
  Type,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { ComponentType } from "react";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import type { NovaPersonalizePanel, NovaSystemActions, NovaSystemState } from "@/lib/nova-system";

type PersonalizeWindowProps = {
  system: NovaSystemState;
  systemActions: NovaSystemActions;
  onClose?: () => void;
  onMinimize?: () => void;
  onFocus?: () => void;
};

const vibeOptions = ["Luminous", "Dusk", "Aurora", "Void"];
const accentOptions = ["#7467ff", "#2587f7", "#28a6f4", "#43d0c4", "#6ecb5d", "#ff9d57", "#ff7da9"];
const modeOptions = [
  { label: "Light", icon: Sun },
  { label: "Dim", icon: Moon },
  { label: "Focus", icon: Bell },
] as const;

const panelOptions: Array<{ label: NovaPersonalizePanel; icon: ComponentType<{ size?: number }> }> = [
  { label: "Look & Feel", icon: Palette },
  { label: "Themes", icon: Grid2X2 },
  { label: "Colors", icon: SlidersHorizontal },
  { label: "Fonts", icon: Type },
  { label: "Layout", icon: Layout },
  { label: "Sound", icon: Volume2 },
  { label: "Privacy", icon: Shield },
  { label: "About", icon: Info },
];

const fontScales = ["Small", "Standard", "Large"] as const;
const densityOptions = ["Minimal", "Balanced", "Dense"] as const;

export function PersonalizeWindow({ system, systemActions, onClose, onMinimize, onFocus }: PersonalizeWindowProps) {
  function renderThemeControls() {
    return (
      <>
        <h3 className="section-title">Choose your vibe</h3>
        <div className="vibe-grid">
          {vibeOptions.map((vibe) => (
            <button
              className={system.theme.vibe === vibe ? "vibe-card active" : "vibe-card"}
              key={vibe}
              type="button"
              onClick={() => systemActions.setTheme({ vibe })}
              aria-pressed={system.theme.vibe === vibe}
            >
              <div className={`vibe-preview ${vibe.toLowerCase()}`} />
              <span>
                {system.theme.vibe === vibe ? <Check size={12} /> : null} {vibe}
              </span>
            </button>
          ))}
        </div>
      </>
    );
  }

  function renderColorControls() {
    return (
      <>
        <h3 className="section-title">Accent</h3>
        <div className="swatch-row">
          {accentOptions.map((color) => (
            <button
              className={system.theme.accent === color ? "swatch active" : "swatch"}
              key={color}
              style={{ background: color }}
              type="button"
              onClick={() => systemActions.setTheme({ accent: color })}
              aria-label={`Use accent ${color}`}
              aria-pressed={system.theme.accent === color}
            />
          ))}
        </div>

        <h3 className="section-title">Transparency</h3>
        <label className="range-line">
          <span>Clear</span>
          <input
            className="range-input"
            type="range"
            min="0"
            max="100"
            value={system.theme.transparency}
            onChange={(event) => systemActions.setTheme({ transparency: Number(event.target.value) })}
            aria-label="Window transparency"
          />
          <span>Opaque</span>
        </label>
      </>
    );
  }

  function renderPanel() {
    switch (system.personalizePanel) {
      case "Themes":
        return (
          <div className="personalize-panel">
            {renderThemeControls()}
            <div className="status-card">
              <strong>{system.theme.vibe}</strong>
              <span>Saved to Nova system state and restored from the local API.</span>
            </div>
          </div>
        );
      case "Colors":
        return <div className="personalize-panel">{renderColorControls()}</div>;
      case "Fonts":
        return (
          <div className="personalize-panel">
            <h3 className="section-title">Text scale</h3>
            <div className="mode-row">
              {fontScales.map((scale) => (
                <button
                  className={system.fontScale === scale ? "mode-card active" : "mode-card"}
                  key={scale}
                  type="button"
                  onClick={() => systemActions.setFontScale(scale)}
                  aria-pressed={system.fontScale === scale}
                >
                  <Type size={22} />
                  <strong>{scale}</strong>
                </button>
              ))}
            </div>
            <div className="status-card">
              <strong>Interface scale: {system.fontScale}</strong>
              <span>Window text and desktop labels follow this profile.</span>
            </div>
          </div>
        );
      case "Layout":
        return (
          <div className="personalize-panel">
            <h3 className="section-title">Interface density</h3>
            <div className="mode-row">
              {densityOptions.map((density) => (
                <button
                  className={system.interfaceDensity === density ? "mode-card active" : "mode-card"}
                  key={density}
                  type="button"
                  onClick={() => systemActions.setInterfaceDensity(density)}
                  aria-pressed={system.interfaceDensity === density}
                >
                  <Layout size={22} />
                  <strong>{density}</strong>
                </button>
              ))}
            </div>
            <h3 className="section-title">Display mode</h3>
            <button className="wide-action-button" type="button" onClick={systemActions.cycleDisplayMode}>
              <Monitor size={18} />
              <span>
                <strong>{system.displayMode}</strong>
                <small>Click to cycle Desktop, Focus Wall, and Presentation.</small>
              </span>
            </button>
          </div>
        );
      case "Sound":
        return (
          <div className="personalize-panel">
            <h3 className="section-title">System feedback</h3>
            <div className="mode-row">
              <button
                className={system.soundEnabled ? "mode-card active" : "mode-card"}
                type="button"
                onClick={() => systemActions.setSoundEnabled(true)}
                aria-pressed={system.soundEnabled}
              >
                <Volume2 size={22} />
                <strong>Soft</strong>
              </button>
              <button
                className={!system.soundEnabled ? "mode-card active" : "mode-card"}
                type="button"
                onClick={() => systemActions.setSoundEnabled(false)}
                aria-pressed={!system.soundEnabled}
              >
                <VolumeX size={22} />
                <strong>Muted</strong>
              </button>
            </div>
            <div className="status-card">
              <strong>{system.soundEnabled ? "Soft feedback enabled" : "Visual feedback only"}</strong>
              <span>Nova records the preference and updates the activity feed.</span>
            </div>
          </div>
        );
      case "Privacy":
        return (
          <div className="personalize-panel">
            <h3 className="section-title">Sensitive data</h3>
            <div className="control-list">
              {["Access files", "Send data to AI", "Background actions"].map((permission) => {
                const active = system.guardPermissions.find((item) => item.name === permission)?.enabled;
                return (
                  <button className="settings-row" key={permission} type="button" onClick={() => systemActions.toggleGuardPermission(permission)}>
                    <Shield size={16} />
                    <span>
                      <strong>{permission}</strong>
                      <small>{active ? "Allowed with Guard visibility" : "Limited until approved"}</small>
                    </span>
                    <b>{active ? "On" : "Off"}</b>
                  </button>
                );
              })}
            </div>
          </div>
        );
      case "About":
        return (
          <div className="personalize-panel">
            <h3 className="section-title">Nova OS Web Space</h3>
            <div className="status-card">
              <strong>Prototype V1</strong>
              <span>Local API, persistent system memory, movable windows, and simulated Nova Apps.</span>
            </div>
            <button className="wide-action-button danger" type="button" onClick={systemActions.resetSystem}>
              <Info size={18} />
              <span>
                <strong>Reset local system state</strong>
                <small>Restore the default Nova desktop memory.</small>
              </span>
            </button>
          </div>
        );
      case "Look & Feel":
      default:
        return (
          <div className="personalize-panel">
            {renderThemeControls()}

            <h3 className="section-title">Mode</h3>
            <div className="mode-row">
              {modeOptions.map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    className={system.theme.mode === mode.label ? "mode-card active" : "mode-card"}
                    key={mode.label}
                    type="button"
                    onClick={() => systemActions.setTheme({ mode: mode.label })}
                    aria-pressed={system.theme.mode === mode.label}
                  >
                    <Icon size={22} />
                    <strong>{mode.label}</strong>
                  </button>
                );
              })}
            </div>

            {renderColorControls()}
          </div>
        );
    }
  }

  return (
    <WindowFrame
      title="Personalize"
      subtitle="Look and feel"
      icon={<Palette size={18} />}
      className="window--personalize light-panel"
      windowKey="personalize"
      windowSize={system.windowSizes.personalize}
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
      onResizeEnd={(size) => systemActions.setWindowSize("personalize", size)}
    >
      <div className="personalize-layout">
        <aside className="window-sidebar">
          {panelOptions.map((panel) => {
            const Icon = panel.icon;
            return (
              <button
                className={system.personalizePanel === panel.label ? "sidebar-item active" : "sidebar-item"}
                key={panel.label}
                type="button"
                onClick={() => systemActions.setPersonalizePanel(panel.label)}
                aria-pressed={system.personalizePanel === panel.label}
              >
                <Icon size={15} /> {panel.label}
              </button>
            );
          })}
        </aside>

        <main className="window-main">{renderPanel()}</main>
      </div>
    </WindowFrame>
  );
}
