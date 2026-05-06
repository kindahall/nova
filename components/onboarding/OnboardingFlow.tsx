"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AppWindow,
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  Circle,
  HardDrive,
  Loader2,
  LockKeyhole,
  Palette,
  ShieldCheck,
  Sparkles,
  Wifi,
  WifiOff,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { onboardingSteps } from "@/data/nova";
import { cn } from "@/lib/utils";

type OnboardingFlowProps = {
  onComplete: () => void;
};

type ConnectionState = "idle" | "connecting" | "connected";
type AiName = "ChatGPT" | "Claude" | "Gemini" | "Codex" | "Local AI";
type RoleName = "Assistant" | "App Builder" | "Research" | "Private Tasks";

type SetupState = {
  network: string;
  connectionState: ConnectionState;
  connectedAis: Record<AiName, boolean>;
  roles: Record<RoleName, AiName>;
  vibe: string;
  density: string;
  language: string;
  workStyle: string;
  signIn: string;
  permissions: Record<string, boolean>;
  protection: string;
  startMode: string;
  fileLocation: string;
  startingSpace: string;
  essentialApps: string[];
};

const aiNames: AiName[] = ["ChatGPT", "Claude", "Gemini", "Codex", "Local AI"];
const aiRoles: RoleName[] = ["Assistant", "App Builder", "Research", "Private Tasks"];
const essentialApps = ["My Space", "AI Center", "Nova Guard", "Nova Store", "Builder", "Spaces", "Notes", "Calendar"];
const bootSteps = [
  "Indexing local files",
  "Installing selected apps",
  "Assigning AI roles",
  "Activating Nova Guard",
  "Preparing Builder Studio",
  "Opening desktop",
];

const initialSetup: SetupState = {
  network: "Nova Cloud",
  connectionState: "connected",
  connectedAis: {
    ChatGPT: true,
    Claude: true,
    Gemini: true,
    Codex: true,
    "Local AI": true,
  },
  roles: {
    Assistant: "Claude",
    "App Builder": "Codex",
    Research: "Gemini",
    "Private Tasks": "Local AI",
  },
  vibe: "Luminous",
  density: "Balanced",
  language: "English (US)",
  workStyle: "Builder",
  signIn: "Passkey",
  permissions: {
    "Read files": true,
    "Install apps": true,
    "Use terminal": false,
    "Share with AI": true,
    "Run in background": false,
  },
  protection: "Nova Guard",
  startMode: "Fresh space",
  fileLocation: "Local + Nova Drive",
  startingSpace: "Builder Studio",
  essentialApps: ["My Space", "AI Center", "Nova Guard", "Builder", "Spaces", "Calendar"],
};

const networkOptions = [
  { name: "Nova Cloud", detail: "Fast setup, app packs, cloud models" },
  { name: "Local network", detail: "Private LAN with local storage first" },
  { name: "Offline fallback", detail: "Continue with local apps only" },
];

const providerDetails: Record<AiName, string> = {
  ChatGPT: "General assistant",
  Claude: "Writing and strategy",
  Gemini: "Research",
  Codex: "App builder",
  "Local AI": "Private tasks",
};

function FittedOnboardingTitle({ title }: { title: string }) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    function fitTitle() {
      const titleElement = titleRef.current;
      const parent = titleElement?.parentElement;

      if (!titleElement || !parent) {
        return;
      }

      titleElement.style.fontSize = "";
      titleElement.style.whiteSpace = "nowrap";

      const computed = window.getComputedStyle(titleElement);
      const currentSize = Number.parseFloat(computed.fontSize);
      const availableWidth = titleElement.clientWidth || parent.clientWidth;
      const neededWidth = titleElement.scrollWidth;

      if (!currentSize || !availableWidth || neededWidth <= availableWidth) {
        return;
      }

      const fittedSize = Math.max(24, Math.floor(currentSize * (availableWidth / neededWidth) * 0.98));
      titleElement.style.fontSize = `${fittedSize}px`;
    }

    fitTitle();
    const firstFrame = window.requestAnimationFrame(fitTitle);
    const secondFrame = window.requestAnimationFrame(() => window.requestAnimationFrame(fitTitle));
    window.addEventListener("resize", fitTitle);

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.removeEventListener("resize", fitTitle);
    };
  }, [title]);

  return <h1 ref={titleRef}>{title}</h1>;
}

function connectedCount(setup: SetupState) {
  return Object.values(setup.connectedAis).filter(Boolean).length;
}

function selectedPermissions(setup: SetupState) {
  return Object.entries(setup.permissions)
    .filter(([, active]) => active)
    .map(([permission]) => permission);
}

function getDynamicPrimary(index: number, setup: SetupState, bootIndex: number) {
  if (index === 0) {
    return setup.connectionState === "connecting" ? "Connecting..." : setup.network;
  }
  if (index === 1) {
    return `${connectedCount(setup)} AIs connected`;
  }
  if (index === 2) {
    return `${setup.roles["App Builder"]} builds apps`;
  }
  if (index === 3) {
    return `${setup.vibe} / ${setup.density}`;
  }
  if (index === 5) {
    return `${selectedPermissions(setup).length} permissions active`;
  }
  if (index === 10) {
    return `${setup.essentialApps.length} essentials pinned`;
  }
  if (index === 11) {
    return "Setup memory ready";
  }
  if (index === 12) {
    return bootSteps[Math.min(bootIndex, bootSteps.length - 1)];
  }
  return onboardingSteps[index].primary;
}

function getDynamicStatus(index: number, setup: SetupState, bootIndex: number) {
  if (index === 0) {
    if (setup.connectionState === "connecting") {
      return `Connecting to ${setup.network}`;
    }
    return setup.network === "Offline fallback" ? "Local mode prepared" : "Cloud services ready";
  }
  if (index === 1) {
    return connectedCount(setup) === aiNames.length ? "Full model mesh active" : "Partial model mesh active";
  }
  if (index === 2) {
    return `${setup.roles.Assistant} assists, ${setup.roles.Research} researches`;
  }
  if (index === 3) {
    return `${setup.workStyle} profile, ${setup.language}`;
  }
  if (index === 5) {
    return selectedPermissions(setup).includes("Use terminal") ? "Terminal allowed with care" : "Terminal asks first";
  }
  if (index === 10) {
    return setup.essentialApps.join(", ");
  }
  if (index === 12) {
    return `${Math.min(bootIndex + 1, bootSteps.length)} of ${bootSteps.length} boot tasks`;
  }
  return onboardingSteps[index].status;
}

function memoryChips(setup: SetupState) {
  return [
    `${connectedCount(setup)} AIs connected`,
    `Guard: ${selectedPermissions(setup).includes("Use terminal") ? "terminal allowed" : "ask before terminal"}`,
    `Space: ${setup.startingSpace}`,
    `Apps: ${setup.essentialApps.length} selected`,
  ];
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [index, setIndex] = useState(0);
  const [setup, setSetup] = useState<SetupState>(initialSetup);
  const [bootIndex, setBootIndex] = useState(0);
  const step = onboardingSteps[index];
  const progress = useMemo(() => Math.round(((index + 1) / onboardingSteps.length) * 100), [index]);

  useEffect(() => {
    if (index !== 12) {
      return;
    }

    const interval = window.setInterval(() => {
      setBootIndex((current) => {
        if (current >= bootSteps.length - 1) {
          window.clearInterval(interval);
          window.setTimeout(() => setIndex(13), 760);
          return current;
        }
        return current + 1;
      });
    }, 780);

    return () => window.clearInterval(interval);
  }, [index]);

  function goNext() {
    if (index === onboardingSteps.length - 1) {
      onComplete();
      return;
    }
    const nextIndex = Math.min(index + 1, onboardingSteps.length - 1);
    if (nextIndex === 12) {
      setBootIndex(0);
    }
    setIndex(nextIndex);
  }

  function goBack() {
    const nextIndex = Math.max(index - 1, 0);
    if (nextIndex === 12) {
      setBootIndex(0);
    }
    setIndex(nextIndex);
  }

  function chooseNetwork(network: string) {
    setSetup((current) => ({ ...current, network, connectionState: "connecting" }));
    window.setTimeout(() => {
      setSetup((current) => ({ ...current, connectionState: "connected" }));
    }, 760);
  }

  function toggleAi(name: AiName) {
    setSetup((current) => ({
      ...current,
      connectedAis: { ...current.connectedAis, [name]: !current.connectedAis[name] },
    }));
  }

  function assignRole(role: RoleName, ai: AiName) {
    setSetup((current) => ({
      ...current,
      roles: { ...current.roles, [role]: ai },
    }));
  }

  function togglePermission(permission: string) {
    setSetup((current) => ({
      ...current,
      permissions: { ...current.permissions, [permission]: !current.permissions[permission] },
    }));
  }

  function toggleEssentialApp(app: string) {
    setSetup((current) => {
      const hasApp = current.essentialApps.includes(app);
      return {
        ...current,
        essentialApps: hasApp ? current.essentialApps.filter((item) => item !== app) : [...current.essentialApps, app],
      };
    });
  }

  function selectGenericOption(option: string) {
    setSetup((current) => {
      if (index === 4) {
        return { ...current, signIn: option };
      }
      if (index === 6) {
        return { ...current, protection: option };
      }
      if (index === 7) {
        return { ...current, startMode: option };
      }
      if (index === 8) {
        return { ...current, fileLocation: option };
      }
      if (index === 9) {
        return { ...current, startingSpace: option };
      }
      return current;
    });
  }

  function renderControls() {
    if (index === 0) {
      return (
        <div className="interactive-grid">
          {networkOptions.map((network) => {
            const active = setup.network === network.name;
            return (
              <motion.button
                className={cn("setup-card", active && "active")}
                type="button"
                key={network.name}
                onClick={() => chooseNetwork(network.name)}
                whileTap={{ scale: 0.97 }}
              >
                <span className="setup-card-icon">{network.name === "Offline fallback" ? <WifiOff size={18} /> : <Wifi size={18} />}</span>
                <strong>{network.name}</strong>
                <span>{network.detail}</span>
                {active && setup.connectionState === "connecting" ? <Loader2 className="spin" size={16} /> : null}
                {active && setup.connectionState === "connected" ? <CheckCircle2 size={16} /> : null}
              </motion.button>
            );
          })}
        </div>
      );
    }

    if (index === 1) {
      return (
        <div className="interactive-grid compact">
          {aiNames.map((name) => {
            const active = setup.connectedAis[name];
            return (
              <motion.button
                className={cn("setup-card ai-card", active && "active")}
                type="button"
                key={name}
                onClick={() => toggleAi(name)}
                whileTap={{ scale: 0.97 }}
              >
                <span className="setup-card-icon">
                  <Bot size={18} />
                </span>
                <strong>{name}</strong>
                <span>{providerDetails[name]}</span>
                <span className={cn("mini-state", active && "on")}>{active ? "Connected" : "Off"}</span>
              </motion.button>
            );
          })}
        </div>
      );
    }

    if (index === 2) {
      return (
        <div className="role-grid">
          {aiRoles.map((role) => (
            <label className="role-row" key={role}>
              <span>
                <strong>{role}</strong>
                <small>{role === "App Builder" ? "Creates Nova Apps" : role === "Private Tasks" ? "Keeps sensitive work local" : "Routes intent"}</small>
              </span>
              <select value={setup.roles[role]} onChange={(event) => assignRole(role, event.target.value as AiName)}>
                {aiNames.map((ai) => (
                  <option key={ai} value={ai}>
                    {ai}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      );
    }

    if (index === 3) {
      return (
        <div className="control-stack">
          <SegmentedControl
            label="Vibe"
            options={["Luminous", "Dusk", "Aurora", "Void"]}
            value={setup.vibe}
            onChange={(value) => setSetup((current) => ({ ...current, vibe: value }))}
          />
          <SegmentedControl
            label="Density"
            options={["Minimal", "Balanced", "Assisted"]}
            value={setup.density}
            onChange={(value) => setSetup((current) => ({ ...current, density: value }))}
          />
          <SegmentedControl
            label="Language"
            options={["English (US)", "Francais", "Local only"]}
            value={setup.language}
            onChange={(value) => setSetup((current) => ({ ...current, language: value }))}
          />
          <SegmentedControl
            label="Work style"
            options={["Builder", "Creator", "Operator"]}
            value={setup.workStyle}
            onChange={(value) => setSetup((current) => ({ ...current, workStyle: value }))}
          />
        </div>
      );
    }

    if (index === 5) {
      return (
        <div className="permission-list">
          {Object.entries(setup.permissions).map(([permission, enabled]) => (
            <button className={cn("permission-control", enabled && "active")} type="button" key={permission} onClick={() => togglePermission(permission)}>
              <span className="setup-card-icon">
                <ShieldCheck size={17} />
              </span>
              <span>
                <strong>{permission}</strong>
                <small>{enabled ? "Allowed with visible approval" : "Ask before acting"}</small>
              </span>
              <span className={cn("toggle", enabled && "on")} aria-label={enabled ? "Enabled" : "Disabled"}>
                <i />
              </span>
            </button>
          ))}
        </div>
      );
    }

    if (index === 10) {
      return (
        <div className="apps-picker">
          <div className="interactive-grid compact">
            {essentialApps.map((app) => {
              const active = setup.essentialApps.includes(app);
              return (
                <button className={cn("setup-card app-card", active && "active")} type="button" key={app} onClick={() => toggleEssentialApp(app)}>
                  <AppWindow size={17} />
                  <strong>{app}</strong>
                  <span>{active ? "Pinned to shelf" : "Tap to pin"}</span>
                </button>
              );
            })}
          </div>
          <MiniShelf apps={setup.essentialApps} />
        </div>
      );
    }

    if (index === 11) {
      return <ReviewSummary setup={setup} onJump={setIndex} />;
    }

    if (index === 12) {
      return <BootSequence bootIndex={bootIndex} />;
    }

    return (
      <div className="option-cloud">
        {step.options.map((option, optionIndex) => {
          const active =
            (index === 4 && setup.signIn === option) ||
            (index === 6 && setup.protection === option) ||
            (index === 7 && setup.startMode === option) ||
            (index === 8 && setup.fileLocation === option) ||
            (index === 9 && setup.startingSpace === option) ||
            optionIndex === 0;
          return (
            <button className={cn("option-pill", active && "active")} type="button" key={option} onClick={() => selectGenericOption(option)}>
              {active ? <Check size={14} /> : null}
              {option}
            </button>
          );
        })}
      </div>
    );
  }

  const dynamicPrimary = getDynamicPrimary(index, setup, bootIndex);
  const dynamicStatus = getDynamicStatus(index, setup, bootIndex);
  const isPreparing = index === 12;

  return (
    <main className="onboarding-root">
      <section className="onboarding-shell" aria-label="Nova OS onboarding">
        <div className="onboarding-panel">
          <div className="onboarding-brand">
            <span className="brand-mark">
              <span className="nova-gem small">
                <Sparkles size={15} />
              </span>
              NOVA OS
            </span>
            <span className="step-count">
              {String(index + 1).padStart(2, "0")} / {onboardingSteps.length}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              className="onboarding-copy"
              key={step.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.24 }}
            >
              <span className="kicker">{step.kicker}</span>
              <FittedOnboardingTitle title={step.title} />
              <p>{step.body}</p>
              {renderControls()}
              {index < 11 ? (
                <div className="setup-memory" aria-label="Setup memory">
                  {memoryChips(setup).map((chip) => (
                    <span key={chip}>{chip}</span>
                  ))}
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>

          <div>
            <div className="onboarding-actions">
              <button className="ghost-button" type="button" onClick={goBack} disabled={index === 0 || isPreparing}>
                <ArrowLeft size={16} />
                Back
              </button>
              <div className="progress-dots" aria-label={`Setup progress ${progress}%`}>
                {onboardingSteps.map((item, itemIndex) => (
                  <i className={itemIndex <= index ? "active" : undefined} key={item.title} />
                ))}
              </div>
              <button className="primary-button" type="button" onClick={goNext} disabled={isPreparing}>
                {index === onboardingSteps.length - 1 ? "Enter desktop" : isPreparing ? "Preparing..." : "Continue"}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="onboarding-preview">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.reference}
              className="reference-image-wrap"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 0.94, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.28 }}
            >
              {index === 1 ? (
                <AiMeshPreview setup={setup} />
              ) : (
                <Image
                  src={step.reference}
                  alt=""
                  fill
                  priority={index === 0}
                  sizes="(max-width: 820px) 100vw, 52vw"
                  className="reference-image"
                />
              )}
              <LiveBadges index={index} setup={setup} bootIndex={bootIndex} />
            </motion.div>
          </AnimatePresence>
          <div className="preview-overlay">
            <div className="preview-status-head">
              <span>
                <strong>{dynamicPrimary}</strong>
                <span>
                  <Wifi size={14} /> {dynamicStatus}
                </span>
              </span>
              <Sparkles size={18} />
            </div>
            <PreviewLogs index={index} setup={setup} bootIndex={bootIndex} />
            {index === 10 ? <MiniShelf apps={setup.essentialApps} compact /> : null}
            <div className="boot-progress">
              <motion.i
                key={`${index}-${dynamicPrimary}`}
                initial={{ width: 0 }}
                animate={{ width: index === 12 ? `${((bootIndex + 1) / bootSteps.length) * 100}%` : `${progress}%` }}
                transition={{ duration: 0.42, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function SegmentedControl({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="control-group">
      <span>{label}</span>
      <div className="segmented-row">
        {options.map((option) => (
          <button className={cn(option === value && "active")} type="button" key={option} onClick={() => onChange(option)}>
            {option === value ? <Check size={13} /> : null}
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function MiniShelf({ apps, compact = false }: { apps: string[]; compact?: boolean }) {
  return (
    <div className={cn("mini-shelf", compact && "compact")}>
      {apps.slice(0, compact ? 6 : 8).map((app) => (
        <motion.span key={app} layout title={app}>
          {app.slice(0, 1)}
        </motion.span>
      ))}
    </div>
  );
}

function AiMeshPreview({ setup }: { setup: SetupState }) {
  return (
    <div className="ai-mesh-preview">
      <span className="preview-step-label">Step 02 of 14</span>
      <Sparkles size={22} />
      <h3>Connect your intelligences.</h3>
      <p>Nova links models into one command layer and keeps local AI available for private tasks.</p>
      <div className="ai-orbit">
        {aiNames.map((ai, aiIndex) => {
          const active = setup.connectedAis[ai];
          return (
            <motion.span
              className={cn(active && "active")}
              key={ai}
              initial={{ opacity: 0, scale: 0.86 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: aiIndex * 0.05 }}
            >
              <Bot size={18} />
              {ai}
            </motion.span>
          );
        })}
      </div>
      <div className="ai-route-card">
        <strong>{connectedCount(setup)} AIs connected</strong>
        <span>Assistant: {setup.roles.Assistant}</span>
        <span>Builder: {setup.roles["App Builder"]}</span>
        <span>Private: {setup.roles["Private Tasks"]}</span>
      </div>
    </div>
  );
}

function ReviewSummary({ setup, onJump }: { setup: SetupState; onJump: (index: number) => void }) {
  const rows = [
    { label: "Intelligences", value: `${connectedCount(setup)} connected`, step: 1, icon: <Bot size={16} /> },
    { label: "Roles", value: `Builder: ${setup.roles["App Builder"]}`, step: 2, icon: <Sparkles size={16} /> },
    { label: "Style", value: `${setup.vibe}, ${setup.density}`, step: 3, icon: <Palette size={16} /> },
    { label: "Guard", value: `${selectedPermissions(setup).length} permissions`, step: 5, icon: <LockKeyhole size={16} /> },
    { label: "Files", value: setup.fileLocation, step: 8, icon: <HardDrive size={16} /> },
    { label: "Apps", value: `${setup.essentialApps.length} selected`, step: 10, icon: <AppWindow size={16} /> },
  ];

  return (
    <div className="review-grid">
      {rows.map((row) => (
        <button className="review-card" type="button" key={row.label} onClick={() => onJump(row.step)}>
          {row.icon}
          <span>
            <strong>{row.label}</strong>
            <small>{row.value}</small>
          </span>
        </button>
      ))}
    </div>
  );
}

function BootSequence({ bootIndex }: { bootIndex: number }) {
  return (
    <div className="boot-sequence">
      {bootSteps.map((step, stepIndex) => {
        const done = stepIndex < bootIndex;
        const active = stepIndex === bootIndex;
        return (
          <div className={cn("boot-row", done && "done", active && "active")} key={step}>
            <span>{done ? <CheckCircle2 size={16} /> : active ? <Loader2 className="spin" size={16} /> : <Circle size={16} />}</span>
            <strong>{step}</strong>
          </div>
        );
      })}
    </div>
  );
}

function LiveBadges({ index, setup, bootIndex }: { index: number; setup: SetupState; bootIndex: number }) {
  const badges = [
    index === 0 ? setup.connectionState : `${connectedCount(setup)} AIs`,
    index === 5 ? `${selectedPermissions(setup).length} rules` : setup.startingSpace,
    index === 12 ? `${bootIndex + 1}/${bootSteps.length}` : `${setup.essentialApps.length} apps`,
  ];

  return (
    <div className="live-badges">
      {badges.map((badge) => (
        <motion.span key={badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          {badge}
        </motion.span>
      ))}
    </div>
  );
}

function PreviewLogs({ index, setup, bootIndex }: { index: number; setup: SetupState; bootIndex: number }) {
  const logs =
    index === 12
      ? bootSteps.slice(0, bootIndex + 1)
      : index === 13
        ? ["Desktop shell ready", "Nova Command ready", "Guard visible"]
        : memoryChips(setup);

  return (
    <div className="preview-logs">
      {logs.slice(-3).map((log) => (
        <motion.span key={log} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
          <Check size={12} />
          {log}
        </motion.span>
      ))}
    </div>
  );
}
