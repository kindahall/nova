"use client";

import { Bell, Check, Grid2X2, Info, Layout, Moon, Palette, Shield, SlidersHorizontal, Sun, Type, Volume2 } from "lucide-react";
import { useState } from "react";
import { WindowFrame } from "@/components/desktop/WindowFrame";

type PersonalizeWindowProps = {
  onClose?: () => void;
  onFocus?: () => void;
};

const vibeOptions = ["Luminous", "Dusk", "Aurora", "Void"];
const accentOptions = ["#7467ff", "#2587f7", "#28a6f4", "#43d0c4", "#6ecb5d", "#ff9d57", "#ff7da9"];
const modeOptions = [
  { label: "Light", icon: Sun },
  { label: "Dim", icon: Moon },
  { label: "Focus", icon: Bell },
];

export function PersonalizeWindow({ onClose, onFocus }: PersonalizeWindowProps) {
  const [activeVibe, setActiveVibe] = useState(vibeOptions[0]);
  const [activeAccent, setActiveAccent] = useState(accentOptions[0]);
  const [activeMode, setActiveMode] = useState(modeOptions[0].label);
  const [transparency, setTransparency] = useState(34);

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
                className={activeVibe === vibe ? "vibe-card active" : "vibe-card"}
                key={vibe}
                type="button"
                onClick={() => setActiveVibe(vibe)}
                aria-pressed={activeVibe === vibe}
              >
                <div className={`vibe-preview ${vibe.toLowerCase()}`} />
                <span>
                  {activeVibe === vibe ? <Check size={12} /> : null} {vibe}
                </span>
              </button>
            ))}
          </div>

          <h3 className="section-title">Accent</h3>
          <div className="swatch-row">
            {accentOptions.map((color) => (
              <button
                className={activeAccent === color ? "swatch active" : "swatch"}
                key={color}
                style={{ background: color }}
                type="button"
                onClick={() => setActiveAccent(color)}
                aria-label={`Use accent ${color}`}
                aria-pressed={activeAccent === color}
              />
            ))}
          </div>

          <h3 className="section-title">Mode</h3>
          <div className="mode-row">
            {modeOptions.map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  className={activeMode === mode.label ? "mode-card active" : "mode-card"}
                  key={mode.label}
                  type="button"
                  onClick={() => setActiveMode(mode.label)}
                  aria-pressed={activeMode === mode.label}
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
              value={transparency}
              onChange={(event) => setTransparency(Number(event.target.value))}
              aria-label="Window transparency"
            />
            <span>Opaque</span>
          </label>
        </main>
      </div>
    </WindowFrame>
  );
}
