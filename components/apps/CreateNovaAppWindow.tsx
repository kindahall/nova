"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Code2, DatabaseZap, PanelsTopLeft, Play, Sparkles, WandSparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { crmModules, generationSteps } from "@/data/nova";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import { cn } from "@/lib/utils";

type CreateNovaAppWindowProps = {
  onClose?: () => void;
  onMinimize?: () => void;
  onFocus?: () => void;
  onGenerated: () => void;
};

export function CreateNovaAppWindow({ onClose, onMinimize, onFocus, onGenerated }: CreateNovaAppWindowProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isGenerating) {
      return;
    }

    if (step >= generationSteps.length) {
      const openTimer = window.setTimeout(onGenerated, 650);
      return () => window.clearTimeout(openTimer);
    }

    const timer = window.setTimeout(() => setStep((current) => current + 1), step === 0 ? 700 : 900);
    return () => window.clearTimeout(timer);
  }, [isGenerating, onGenerated, step]);

  function startGeneration() {
    setStep(0);
    setIsGenerating(true);
  }

  return (
    <WindowFrame
      title="Create Nova App"
      subtitle="Intent to software"
      icon={<WandSparkles size={18} />}
      className="window--create-app"
      tone="dark"
      windowKey="create-app"
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
    >
      <div className="builder-layout">
        <main className="builder-canvas">
          <div className="glass-card">
            <h3>Intention</h3>
            <div className="prompt-surface">I want an app to manage my clients, invoices, and schedule.</div>
          </div>

          <div className="glass-card">
            <h3>Nova proposes modules</h3>
            <div className="module-list">
              {crmModules.map((module) => (
                <span className="module-chip" key={module}>
                  <PanelsTopLeft size={14} />
                  {module}
                </span>
              ))}
            </div>
          </div>

          <div className="glass-card">
            <h3>Generation plan</h3>
            <div className="timeline">
              {generationSteps.map((item, index) => (
                <div className={cn("timeline-row", step > index && "done")} key={item}>
                  <span className="timeline-dot">{step > index ? <Check size={14} /> : index + 1}</span>
                  <span>{item}</span>
                  <span className={step > index ? "pill green" : "pill"}>{step > index ? "Done" : "Queued"}</span>
                </div>
              ))}
            </div>
          </div>
        </main>

        <aside className="builder-preview">
          <div className="preview-header">
            <strong>Live build</strong>
            <span className="pill">{isGenerating ? "Generating" : "Ready"}</span>
          </div>
          <div className="preview-body">
            <div className="glass-card" style={{ minHeight: 94 }}>
              <DatabaseZap size={18} />
              <h3>Data model</h3>
              <p>Clients, invoices, tasks, appointments, and revenue metrics.</p>
            </div>
            <div className="mini-bars">
              {[78, 52, 88, 64].map((width) => (
                <span className="mini-bar" key={width}>
                  <i style={{ width: isGenerating ? `${Math.min(width + step * 4, 96)}%` : `${width}%` }} />
                </span>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="glass-card"
              >
                <Code2 size={18} />
                <h3>{isGenerating ? generationSteps[Math.min(step, generationSteps.length - 1)] : "Ready to compose"}</h3>
                <p>Nova keeps this as a visible, reversible generation sequence.</p>
              </motion.div>
            </AnimatePresence>
            <button className="primary-button" type="button" onClick={startGeneration} disabled={isGenerating && step < generationSteps.length}>
              {isGenerating ? <Sparkles size={16} /> : <Play size={16} />}
              {isGenerating ? "Generating..." : "Generate app"}
            </button>
          </div>
        </aside>
      </div>
    </WindowFrame>
  );
}
