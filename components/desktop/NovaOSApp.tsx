"use client";

import { useState, useSyncExternalStore } from "react";
import type { WindowKey } from "@/data/nova";
import { DesktopShell } from "@/components/desktop/DesktopShell";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

const STORAGE_KEY = "nova-os-onboarding-complete";
const initialWindows: WindowKey[] = ["my-space", "personalize"];
const STORAGE_EVENT = "nova-os-onboarding-changed";

function subscribeToOnboarding(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", callback);
  window.addEventListener(STORAGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(STORAGE_EVENT, callback);
  };
}

function getOnboardingSnapshot() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(STORAGE_KEY) === "true";
}

export function NovaOSApp() {
  const onboardingComplete = useSyncExternalStore(subscribeToOnboarding, getOnboardingSnapshot, () => false);
  const [activeWindows, setActiveWindows] = useState<WindowKey[]>(initialWindows);
  const [commandOpen, setCommandOpen] = useState(false);

  function completeOnboarding() {
    window.localStorage.setItem(STORAGE_KEY, "true");
    window.dispatchEvent(new Event(STORAGE_EVENT));
    setActiveWindows(initialWindows);
  }

  function openWindow(windowKey: WindowKey) {
    setActiveWindows((current) => {
      const next = current.filter((item) => item !== windowKey);
      return [...next, windowKey];
    });
  }

  function closeWindow(windowKey: WindowKey) {
    setActiveWindows((current) => current.filter((item) => item !== windowKey));
  }

  function openCreateApp() {
    setCommandOpen(false);
    openWindow("create-app");
  }

  function openGeneratedCrm() {
    setCommandOpen(false);
    setActiveWindows((current) => {
      const withoutBuilder = current.filter((item) => item !== "create-app" && item !== "crm-app");
      return [...withoutBuilder, "crm-app"];
    });
  }

  return (
    <div className="nova-root">
      {onboardingComplete ? (
        <DesktopShell
          activeWindows={activeWindows}
          commandOpen={commandOpen}
          onOpen={openWindow}
          onClose={closeWindow}
          onOpenCommand={() => setCommandOpen(true)}
          onCloseCommand={() => setCommandOpen(false)}
          onCreateApp={openCreateApp}
          onGenerated={openGeneratedCrm}
        />
      ) : (
        <OnboardingFlow onComplete={completeOnboarding} />
      )}
    </div>
  );
}
