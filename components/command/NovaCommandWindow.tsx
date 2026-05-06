"use client";

import {
  AppWindow,
  ArrowUpRight,
  Bot,
  CalendarDays,
  CheckCircle2,
  FileText,
  PanelsTopLeft,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { crmModules, type WindowKey } from "@/data/nova";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import type { NovaSystemActions, NovaSystemState } from "@/lib/nova-system";

type NovaCommandWindowProps = {
  system: NovaSystemState;
  systemActions: NovaSystemActions;
  onClose: () => void;
  onCreateApp: () => void;
  onOpenGuard: () => void;
  onOpenWindow: (window: WindowKey) => void;
};

const defaultPrompt = "I want an app to manage my clients, invoices, and schedule.";

type CommandResult = {
  title: string;
  body: string;
  target?: WindowKey;
  actionLabel?: string;
};

const commandTargets: Array<{ key: WindowKey; keywords: string[]; title: string; body: string; actionLabel: string }> = [
  {
    key: "nova-guard",
    keywords: ["guard", "permission", "approval", "protect", "sensitive", "security"],
    title: "Nova Guard opened",
    body: "Approvals, protected folders, and the visible action ledger are now in front.",
    actionLabel: "Focus Guard",
  },
  {
    key: "ai-center",
    keywords: ["ai", "model", "role", "intelligence", "assign", "claude", "gemini", "codex"],
    title: "AI Center opened",
    body: "You can inspect model routing and role assignments from the live AI surface.",
    actionLabel: "Focus AI Center",
  },
  {
    key: "nova-store",
    keywords: ["store", "install", "pack", "app", "connector", "agent"],
    title: "Nova Store opened",
    body: "Store packs can now be installed directly into the active space.",
    actionLabel: "Focus Store",
  },
  {
    key: "spaces",
    keywords: ["space", "project", "mission", "builder", "client", "creator"],
    title: "Spaces opened",
    body: "Mission spaces are ready to switch, draft, and organize.",
    actionLabel: "Focus Spaces",
  },
  {
    key: "my-space",
    keywords: ["file", "files", "folder", "summarize", "document", "space"],
    title: "My Space opened",
    body: "Your local workspace is ready for file review and summarization.",
    actionLabel: "Focus My Space",
  },
  {
    key: "offline-mode",
    keywords: ["offline", "local", "no internet", "connection"],
    title: "Offline Mode opened",
    body: "Local work, queued sync, and protected drafts are visible.",
    actionLabel: "Focus Offline Mode",
  },
  {
    key: "activity-center",
    keywords: ["activity", "notification", "history", "shortcut", "keyboard", "log"],
    title: "Activity Center opened",
    body: "System memory, notifications, and keyboard controls are ready.",
    actionLabel: "Focus Activity",
  },
];

export function NovaCommandWindow({
  system,
  systemActions,
  onClose,
  onCreateApp,
  onOpenGuard,
  onOpenWindow,
}: NovaCommandWindowProps) {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [answered, setAnswered] = useState(false);
  const [result, setResult] = useState<CommandResult | null>(null);

  function openTarget(target: (typeof commandTargets)[number]) {
    setAnswered(false);
    setResult({
      title: target.title,
      body: target.body,
      target: target.key,
      actionLabel: target.actionLabel,
    });
    systemActions.recordCommand(prompt, target.body);
    onOpenWindow(target.key);
  }

  function submitPrompt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedPrompt = prompt.toLowerCase();
    const wantsGeneratedApp = ["crm", "client", "invoice", "schedule", "build", "create"].some((keyword) =>
      normalizedPrompt.includes(keyword)
    );
    const matchedTarget = commandTargets.find((target) =>
      target.key === "nova-store" && wantsGeneratedApp
        ? false
        : target.keywords.some((keyword) => normalizedPrompt.includes(keyword))
    );

    if (wantsGeneratedApp) {
      setAnswered(true);
      setResult(null);
      systemActions.recordCommand(prompt, "Nova prepared a CRM Nova App generation plan.");
      return;
    }

    if (matchedTarget) {
      openTarget(matchedTarget);
      return;
    }

    setAnswered(false);
    setResult({
      title: "Nova Hub opened",
      body: "I could not map that exactly, so I opened the system overview and kept the command in context.",
      target: "nova-hub",
      actionLabel: "Focus Hub",
    });
    systemActions.recordCommand(prompt, "Nova opened the system overview and kept the command in context.");
    onOpenWindow("nova-hub");
  }

  return (
    <WindowFrame
      title="Nova Command"
      subtitle="Tell Nova what you want to do"
      icon={<Sparkles size={18} />}
      className="window--nova-command"
      tone="command"
      onClose={onClose}
    >
      <form className="command-form" onSubmit={submitPrompt}>
        <label className="search-line" style={{ minWidth: 0 }}>
          <Search size={15} />
          <input
            className="command-input"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            aria-label="Nova command prompt"
          />
        </label>
        <button className="primary-button" type="submit">
          <Sparkles size={16} />
          Ask Nova
        </button>
      </form>

      {answered ? (
        <div className="glass-card light-card" style={{ marginBottom: 14 }}>
          <h3>Nova can build this as a Nova App.</h3>
          <p>Proposed modules are ready. Generate the app to open the simulated CRM workspace.</p>
          <div className="module-list">
            {crmModules.map((module) => (
              <span className="module-chip" style={{ color: "#363f7d", background: "rgba(116,103,255,0.12)" }} key={module}>
                <PanelsTopLeft size={14} />
                {module}
              </span>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <button className="primary-button" type="button" onClick={onCreateApp}>
              <AppWindow size={16} />
              Generate CRM Nova App
            </button>
          </div>
        </div>
      ) : null}

      {result ? (
        <div className="glass-card light-card command-result" style={{ marginBottom: 14 }}>
          <CheckCircle2 size={18} />
          <div>
            <h3>{result.title}</h3>
            <p>{result.body}</p>
          </div>
          {result.target ? (
            <button className="compact-button" type="button" onClick={() => onOpenWindow(result.target!)}>
              {result.actionLabel ?? "Focus"}
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="suggestion-grid">
        <button
          className="suggestion-card"
          type="button"
          onClick={() => {
            setAnswered(true);
            systemActions.recordCommand("Create a client OS app", "Nova prepared CRM, invoices, calendar, tasks, and dashboard modules.");
          }}
        >
          <AppWindow size={18} />
          <strong>Create a client OS app</strong>
          <span>CRM, invoices, calendar, tasks, and dashboard from one intention.</span>
        </button>
        <button
          className="suggestion-card"
          type="button"
          onClick={() => {
            onOpenGuard();
            setAnswered(false);
            systemActions.recordCommand("Review sensitive actions", "Nova Guard opened from Command suggestions.");
            setResult({
              title: "Nova Guard opened",
              body: "Approvals, protected files, and action ledger are ready to inspect.",
              target: "nova-guard",
              actionLabel: "Focus Guard",
            });
          }}
        >
          <ShieldCheck size={18} />
          <strong>Review sensitive actions</strong>
          <span>Open Nova Guard to inspect approvals, protected files, and the ledger.</span>
        </button>
        <button
          className="suggestion-card"
          type="button"
          onClick={() =>
            openTarget({
              key: "ai-center",
              keywords: [],
              title: "AI Center opened",
              body: "Model routing and AI roles are now active in the desktop.",
              actionLabel: "Focus AI Center",
            })
          }
        >
          <Bot size={18} />
          <strong>Assign AI roles</strong>
          <span>Route coding, research, writing, and private work to the right model.</span>
        </button>
      </div>

      <div className="wide-grid">
        <div className="glass-card light-card">
          <h3>Quick actions</h3>
          <div className="module-list action-chip-list">
            <button
              className="module-chip chip-button"
              style={{ color: "#363f7d", background: "rgba(116,103,255,0.12)" }}
              type="button"
              onClick={() => onOpenWindow("my-space")}
            >
              <FileText size={14} /> Summarize files
            </button>
            <button
              className="module-chip chip-button"
              style={{ color: "#363f7d", background: "rgba(116,103,255,0.12)" }}
              type="button"
              onClick={() => onOpenWindow("spaces")}
            >
              <CalendarDays size={14} /> Plan week
            </button>
            <button
              className="module-chip chip-button"
              style={{ color: "#363f7d", background: "rgba(116,103,255,0.12)" }}
              type="button"
              onClick={() => onOpenWindow("nova-hub")}
            >
              <ArrowUpRight size={14} /> Prepare space
            </button>
          </div>
        </div>
        <div className="glass-card light-card">
          <h3>Command memory</h3>
          <div className="command-memory">
            {system.commandHistory.slice(0, 3).map((entry) => (
              <span key={entry.id}>
                <strong>{entry.prompt}</strong>
                <small>{entry.result}</small>
              </span>
            ))}
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}
