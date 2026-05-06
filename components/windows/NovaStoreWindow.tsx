"use client";

import { Check, Download, LoaderCircle, PackagePlus, Search, Sparkles, Store } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { storeItems } from "@/data/nova";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import { cn } from "@/lib/utils";
import type { NovaSystemActions, NovaSystemState } from "@/lib/nova-system";

type NovaStoreWindowProps = {
  system: NovaSystemState;
  systemActions: NovaSystemActions;
  onClose?: () => void;
  onFocus?: () => void;
};

export function NovaStoreWindow({ system, systemActions, onClose, onFocus }: NovaStoreWindowProps) {
  const [query, setQuery] = useState("");
  const [installing, setInstalling] = useState("");

  useEffect(() => {
    if (!installing) {
      return;
    }

    const timer = window.setTimeout(() => {
      systemActions.installPack(installing);
      setInstalling("");
    }, 760);

    return () => window.clearTimeout(timer);
  }, [installing, systemActions]);

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return storeItems;
    }

    return storeItems.filter((item) => `${item[0]} ${item[1]}`.toLowerCase().includes(normalizedQuery));
  }, [query]);

  function installPack(name: string) {
    if (installing) {
      return;
    }

    if (system.installedPacks.includes(name)) {
      systemActions.openPackPreview(name);
      return;
    }

    setInstalling(name);
  }

  function installFromIntent() {
    const targetPack = "Automation Desk";
    setQuery("");
    installPack(targetPack);
  }

  return (
    <WindowFrame
      title="Nova Store"
      subtitle="Apps, packs, agents, templates"
      icon={<Store size={18} />}
      className="window--nova-store"
      tone="dark"
      windowSize={system.windowSizes["nova-store"]}
      onClose={onClose}
      onFocus={onFocus}
      onResizeEnd={(size) => systemActions.setWindowSize("nova-store", size)}
    >
      <div className="window-toolbar" style={{ borderBottomColor: "rgba(255,255,255,0.12)" }}>
        <label className="search-line" style={{ color: "rgba(255,255,255,0.68)" }}>
          <Search size={15} />
          <input
            className="inline-search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search packs, connectors, agents, and automations"
            aria-label="Search Nova Store"
          />
        </label>
        <button className="primary-button" type="button" onClick={installFromIntent}>
          <PackagePlus size={16} />
          Add from intent
        </button>
      </div>

      <div className="cards-grid" style={{ marginTop: 18 }}>
        <div className="glass-card">
          <Sparkles size={20} />
          <h3>Recommended for you</h3>
          <p>{installing ? `Installing ${installing}...` : system.storeActivity}</p>
          <div className="metric">{system.installedPacks.length}</div>
        </div>
        <div className="glass-card">
          <Download size={20} />
          <h3>Local-first apps</h3>
          <p>Apps can work without cloud dependencies when possible.</p>
          <div className="metric">18</div>
        </div>
        <div className="glass-card">
          <Store size={20} />
          <h3>Agents</h3>
          <p>Specialized assistants can be pinned to spaces and windows.</p>
          <div className="metric">12</div>
        </div>
      </div>

      <div className="wide-grid">
        <div className="glass-card">
          <h3>Featured packs</h3>
          <div className="stack-list">
            {visibleItems.map((item) => {
              const isInstalled = system.installedPacks.includes(item[0]);
              const isInstalling = installing === item[0];
              return (
                <div className={cn("store-row", isInstalled && "selected")} key={item[0]}>
                  <span className="row-title">
                    {isInstalled ? <Check size={16} /> : <PackagePlus size={16} />}
                    <span>
                      <strong>{item[0]}</strong>
                      <span>{item[1]}</span>
                    </span>
                  </span>
                  <button className="compact-button" type="button" onClick={() => installPack(item[0])} disabled={Boolean(installing)}>
                    {isInstalling ? <LoaderCircle size={13} className="spin" /> : null}
                    {isInstalling ? "Installing" : isInstalled ? "Open" : item[2]}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <div className="glass-card">
          <h3>Store philosophy</h3>
          <p>
            Nova Store is not a grid of random apps. It is a catalog of working surfaces, templates, agents, and
            automations that can be assembled into a space.
          </p>
        </div>
      </div>
    </WindowFrame>
  );
}
