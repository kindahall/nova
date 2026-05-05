"use client";

import { Bell, Check, Grid2X2, Info, Layout, Moon, Palette, Shield, SlidersHorizontal, Sun, Type, Volume2 } from "lucide-react";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import type { NovaSystemActions, NovaSystemState } from "@/lib/nova-system";

type PersonalizeWindowProps = {
  system: NovaSystemState;
  systemActions: NovaSystemActions;
  onClose?: () => void;
  onFocus?: () => void;
};

const vibeOptions = ["Luminous", "Dusk", "Aurora", "Void"];
const accentOptions = ["#7467ff", "#2587f7", "#28a6f4", "#43d0c4", "#6ecb5d", "#ff9d57", "#ff7da9"];
const modeOptions = [
  { label: "Light", icon: Sun },
  { label: "Dim", icon: Moon },
  { label: "Focus", icon: Bell },
] as const;

export function PersonalizeWindow({ system, systemActions, onClose, onFocus }: PersonalizeWindowProps) {
  return (
    <WindowFrame
      title="Personalize"
      subtitle="Look and feel"
      icon={<Palette size={18} />}
      className="window--personalize light-panel"
      onClose={onClose}
      onFocus={onFocus}
    >
      <div className="personalize-layout">
        <aside className="window-sidebar">
          <span className="sidebar-item active">
            <Palette size={15} /> Look & Feel
          </span>
          <span className="sidebar-item">
            <Grid2X2 size={15} /> Themes
          </span>
          <span className="sidebar-item">
            <SlidersHorizontal size={15} /> Colors
          </span>
          <span className="sidebar-item">
            <Type size={15} /> Fonts
          </span>
          <span className="sidebar-item">
            <Layout size={15} /> Layout
          </span>
          <span className="sidebar-item">
            <Volume2 size={15} /> Sound
          </span>
          <span className="sidebar-item">
            <Shield size={15} /> Privacy
          </span>
          <span className="sidebar-item">
            <Info size={15} /> About
          </span>
        </aside>

        <main className="window-main">
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
        </main>
      </div>
    </WindowFrame>
  );
}
