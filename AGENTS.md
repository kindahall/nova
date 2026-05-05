# AGENTS.md — Nova OS Web Space

## Mission

Build **Nova OS Web Space**, a premium AI-native desktop web prototype.

Nova OS transforms user intentions into **workspaces, software, and automations**.

The first build is not a real OS kernel. It is a polished, interactive web prototype that demonstrates the Nova OS experience and can later evolve into Nova Shell on Linux.

---

## Source of truth

Read these files before making product or design decisions:

1. `plan.md`
2. `images/00_reference_desktop.png`
3. `images/`
4. `images/onboarding/`

The most important visual reference is:

```txt
images/00_reference_desktop.png
```

Follow that image first. The other images are supporting references.

---

## Product direction

Nova OS must feel like:

- a real desktop operating system;
- original, not a macOS or Windows clone;
- calm, futuristic, premium and minimal;
- luminous blue/violet;
- soft glass, frosted panels and rounded windows;
- spacious, elegant and non-crowded.

Nova OS must not feel like:

- a SaaS dashboard;
- a generic web app;
- a control panel poster;
- a clone of macOS;
- a clone of Windows.

---

## Tech stack

Use:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- shadcn/ui only where useful
- lucide-react icons where useful
- localStorage or local state for MVP persistence

No backend is required for the first prototype.

---

## Core components

Create reusable components.

Recommended structure:

```txt
components/
  desktop/
    DesktopShell.tsx
    WindowFrame.tsx
  rail/
    NovaRail.tsx
  command/
    TopCommandBar.tsx
    NovaCommandWindow.tsx
  shelf/
    ActivityShelf.tsx
  windows/
    MySpaceWindow.tsx
    PersonalizeWindow.tsx
    NovaHubWindow.tsx
    AiCenterWindow.tsx
    NovaGuardWindow.tsx
    NovaStoreWindow.tsx
    SpacesWindow.tsx
    OfflineModePanel.tsx
  apps/
    CreateNovaAppWindow.tsx
    GeneratedCrmAppWindow.tsx
  onboarding/
    OnboardingFlow.tsx
    OnboardingStep.tsx
```

The exact structure can be adjusted if needed, but the code must remain clean, modular and easy to extend.

---

## Required screens for MVP

### Desktop

Implement a full-screen Nova OS desktop with:

- scenic blue/violet mountain or lake wallpaper;
- Nova Rail on the left;
- top centered Nova Command pill;
- top-right system status;
- bottom floating Activity Shelf;
- frosted glass windows;
- My Space window;
- Personalize window.

### Onboarding

Implement a clickable onboarding flow with these 14 steps:

1. Connect to the internet
2. Connect your intelligences
3. Assign roles to your AI
4. Tell Nova about you
5. How do you want to sign in?
6. Define Nova’s limits
7. Protect your space
8. Start fresh or restore?
9. Choose where your files live
10. Choose your starting space
11. Pick your essential apps
12. Review your setup
13. Nova is preparing your space
14. Your space is ready

Use images in:

```txt
images/onboarding/
```

as the visual references.

After the last step, route to the desktop.

### Core product windows

Implement these windows:

- Nova Command
- Nova Hub
- AI Center
- Nova Guard
- Create Nova App
- Generated CRM App
- Nova Store
- Spaces
- Offline Mode

Use these files as visual references:

```txt
images/02_nova_command.png
images/03_nova_hub.png
images/04_ai_center.png
images/05_nova_guard.png
images/06_create_nova_app.png
images/07_generated_crm_app.png
images/08_nova_store.png
images/09_spaces.png
images/10_offline_mode.png
```

---

## Design rules

### Layout

Most screens should preserve the Nova OS frame:

- left vertical rail;
- top command pill;
- bottom shelf;
- one or two floating windows.

### Surface

Use:

- frosted glass;
- subtle transparency;
- soft blur;
- soft shadows;
- thin white borders;
- rounded corners;
- gentle violet glow.

### Colors

Use a palette inspired by:

- midnight blue;
- deep indigo;
- Nova violet;
- soft lavender;
- pearl white;
- aurora cyan.

### Interaction

Add subtle animation:

- window fade/scale in;
- hover glow;
- smooth onboarding transitions;
- opening Nova Command;
- app generation progress.

Do not over-animate.

---

## MVP behavior

Static or simulated data is acceptable.

The prototype should simulate:

- connecting AI accounts;
- assigning AI roles;
- asking Nova to create an app;
- generating modules;
- opening a generated CRM app;
- showing permissions in Nova Guard;
- showing Offline Mode;
- navigating Spaces;
- browsing Nova Store.

No real AI backend is needed in the first version.

---

## Main demo scenario

The first flagship demo is:

```txt
I want an app to manage my clients, invoices, and schedule.
```

Nova proposes:

- CRM
- Invoices
- Calendar
- Tasks
- Dashboard

Then Nova opens the generated CRM Nova App.

Reference:

```txt
images/07_generated_crm_app.png
```

---

## Content language

The first prototype can use English UI labels because most references are in English.

Keep labels short, premium and clear.

Avoid long paragraphs in UI.

---

## Accessibility and responsiveness

Prioritize desktop widescreen first.

Minimum requirements:

- app should render cleanly on common laptop and desktop sizes;
- text should be readable;
- buttons should have hover/focus states;
- color contrast should remain acceptable on glass surfaces.

---

## Code quality

Follow these rules:

- TypeScript strict where practical;
- no unnecessary backend;
- no hard-coded unreadable magic everywhere;
- create data arrays for nav items, apps, files and onboarding steps;
- keep components small;
- avoid huge single files;
- use semantic names;
- keep styling consistent.

---

## Commands

Expected commands:

```bash
npm install
npm run dev
npm run build
```

Add or update scripts as needed.

---

## Done means

The first deliverable is complete when:

- `npm run dev` starts successfully;
- `npm run build` passes;
- the onboarding flow is clickable;
- final onboarding step leads to the desktop;
- Nova desktop visually matches the validated direction;
- at least the main windows can be opened or displayed;
- Nova Command can open;
- Create Nova App flow exists;
- generated CRM app appears;
- the product feels like a premium OS prototype.

---

## Important reminder

If there is any conflict between assumptions and references:

1. follow `images/00_reference_desktop.png`;
2. follow `plan.md`;
3. follow the rest of the image pack.

Nova OS must be beautiful, serene, intelligent and original.
