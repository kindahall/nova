# plan.md — Nova OS Codex Blueprint

Version: 1.0  
Date: 2026-05-05  
Status: validated working blueprint  
Owner: Jimignon  
Primary implementation environment: Codex

---

## 1. Project overview

**Nova OS** is a next-generation AI-native operating system experience designed to compete with the feel and ambition of macOS and Windows while remaining visually distinct.

The validated execution strategy is:

- **short term**: build **Nova Web Space**, a premium web prototype that behaves like a desktop OS;
- **mid term**: build **Nova Shell on Linux**;
- **long term**: evolve into a full Nova OS distribution and ecosystem.

### Core promise

> Nova OS transforms user intentions into workspaces, software, and automations.

Short version:

> Tell Nova what you want to do. Nova prepares your system.

---

## 2. The most important design rule

The **main visual reference** is:

- `images/00_reference_desktop.png`

That image is the approved source of truth for the Nova OS visual direction.

### Nova OS must feel like:

- a **real desktop operating system**, not a SaaS dashboard;
- calm, premium, minimal, futuristic;
- luminous blue / violet atmosphere;
- soft scenic background with mountains / water / light horizon;
- frosted glass windows;
- left vertical rail as a signature element;
- centered top command pill;
- bottom floating shelf / dock;
- elegant typography;
- soft glows;
- lots of breathing room.

### Nova OS must **not** feel like:

- a macOS clone;
- a Windows clone;
- a generic startup app;
- a dense analytics dashboard;
- a boring Linux admin desktop.

---

## 3. Product direction validated

### 3.1 Product identity

Nova OS is:

- AI-native;
- multi-model;
- local-first;
- cloud-optional;
- security-aware;
- workspace-driven;
- capable of creating native mini-apps on demand.

### 3.2 Recommended shipping order

1. **Nova Web Space** (interactive browser prototype)  
2. **Nova Shell on Linux**  
3. **Nova OS distribution / ISO**  
4. **Nova ecosystem** (store, agents, templates, devices)

### 3.3 Priority audience

Primary targets:

- entrepreneurs / independents;
- creators;
- developers / builders.

---

## 4. Core product pillars

### Pillar 1 — Beautiful OS-like workspace
A real desktop environment with windows, settings, files, shelves, and spaces.

### Pillar 2 — AI orchestration
Nova routes tasks between multiple AIs and local tools.

### Pillar 3 — App creation
Nova can create lightweight software (“Nova Apps”) from user intent.

### Pillar 4 — Control and trust
Permissions, guardrails, sandboxing, and visible history are built in.

### Pillar 5 — Personalization
The system adapts to the user’s goals, tools, and working style.

---

## 5. Core UI vocabulary

Use these names consistently in product, design, and code.

- **Nova Rail** = left vertical navigation column
- **Nova Command** = centered AI command bar / command surface
- **Activity Shelf** = floating bottom dock / quick launcher
- **My Space** = files / explorer experience
- **Nova Hub** = main home / overview hub
- **AI Center** = connected AI accounts and assigned roles
- **Nova Guard** = permissions and protection controls
- **Nova Store** = apps, packs, agents, templates, connectors
- **Spaces** = workspace grouping system
- **Nova Apps** = apps generated or installed inside Nova OS
- **Nova Sandbox** = isolated runtime for risky actions
- **Nova Ledger** = history of AI actions and approvals
- **Offline Mode** = graceful offline fallback state

---

## 6. Visual system

### 6.1 Colors
Use a luminous palette inspired by the reference image:

- midnight blue
- deep indigo
- violet glow
- lavender white
- aurora cyan accents
- pearl white glass surfaces

### 6.2 Surface style

- glassmorphism / frosted glass;
- translucent windows;
- rounded corners;
- very soft shadows;
- subtle edge glow;
- minimal outlines;
- clean spacing.

### 6.3 Layout structure

Most desktop scenes should have:

- left rail;
- top centered command pill;
- top-right system status;
- bottom activity shelf;
- one or two floating windows.

### 6.4 Typography direction

- clean sans-serif;
- soft, premium, readable;
- no aggressive or corporate styling.

---

## 7. Technical direction for Codex

### 7.1 Delivery target for the first build
Build a **web prototype** that convincingly behaves like Nova OS.

### 7.2 Suggested stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- shadcn/ui where useful
- local state and localStorage at first

### 7.3 Why web first

Because it is the fastest way to:

- test the concept;
- validate UX;
- demo the product;
- show investors or collaborators;
- turn visuals into something interactive.

---

## 8. How Nova OS works conceptually

### 8.1 AI model strategy
Nova OS is **multi-AI**.

It should be able to connect or simulate:

- Claude
- ChatGPT
- Codex
- Gemini
- Mistral
- Local AI

### 8.2 Role assignment model
Suggested roles:

- ChatGPT / Claude = general assistant
- Codex = app builder / coding
- Gemini = research
- Local AI = private tasks

### 8.3 Nova’s security philosophy

Nova can act, but the user remains in control.

Sensitive actions should be:

- visible;
- permission-based;
- optionally approval-gated;
- reversible when possible.

---

## 9. Validated onboarding flow

The onboarding flow must include these steps, in this order:

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

Important rule: **internet connection is first**, because the smart setup depends on it.

---

## 10. Main screens Codex must recreate

The following images are the official image pack for Codex.

### 10.1 Approved inspiration
- `images/00_reference_desktop.png`  
  Main style reference approved by the user.

### 10.2 Core product screens
- `images/01_desktop_base.png`  
  Nova desktop base with My Space and Personalize.

- `images/02_nova_command.png`  
  Nova Command open state with suggestions and quick actions.

- `images/03_nova_hub.png`  
  Main home hub with overview cards and recent activity.

- `images/04_ai_center.png`  
  Connected AI services and assigned roles.

- `images/05_nova_guard.png`  
  Permissions and recent protected actions.

- `images/06_create_nova_app.png`  
  Nova App creation flow, step-based builder.

- `images/07_generated_crm_app.png`  
  Example generated Nova App (CRM / invoices / revenue dashboard).

- `images/08_nova_store.png`  
  Store for packs, apps, templates, agents and automations.

- `images/09_spaces.png`  
  Workspace grouping system.

- `images/10_offline_mode.png`  
  Offline mode system panel.

These images should be used as **visual targets**, not as final UI exports to reproduce pixel-perfectly.

### 10.3 Onboarding reference screens
The onboarding references are stored in `images/onboarding/` and should be used when building the setup flow.

Files:
- `images/onboarding/01_internet_connection.png`
- `images/onboarding/02_connect_your_intelligences.png`
- `images/onboarding/03_assign_ai_roles.png`
- `images/onboarding/04_tell_nova_about_you.png`
- `images/onboarding/05_sign_in_to_nova.png`
- `images/onboarding/06_define_nova_limits.png`
- `images/onboarding/07_protect_your_space.png`
- `images/onboarding/08_start_fresh_or_restore.png`
- `images/onboarding/09_choose_where_files_live.png`
- `images/onboarding/10_choose_your_starting_space.png`
- `images/onboarding/11_pick_your_essential_apps.png`
- `images/onboarding/12_review_your_setup.png`
- `images/onboarding/13_nova_is_preparing_your_space.png`
- `images/onboarding/14_your_space_is_ready.png`

These do not need to be copied exactly, but their structure, mood, and progression should guide the implementation.


---

## 11. MVP scope for Codex

### 11.1 Must-have features

Codex should build an MVP with these features:

#### Desktop shell
- full-screen Nova desktop;
- scenic wallpaper;
- Nova Rail;
- Nova Command pill;
- Activity Shelf;
- system status area;
- floating windows.

#### Core windows
- My Space window;
- Personalize window;
- Nova Hub;
- AI Center;
- Nova Guard;
- Nova Store;
- Spaces;
- Offline Mode;
- Create Nova App window;
- generated CRM app demo window.

#### Onboarding
- complete multi-step flow;
- local state storage;
- final transition to desktop.

#### AI simulation
- simulated responses;
- no backend required initially;
- demo flows accepted.

---

## 12. App creation scenario to demo first

This is the first flagship workflow Codex should implement:

### User prompt

> I want an app to manage my clients, invoices, and schedule.

### Nova response

Nova proposes these modules:

- CRM
- Invoices
- Calendar
- Tasks
- Dashboard

### Result

Nova generates a CRM-like workspace shown in:

- `images/07_generated_crm_app.png`

This should be the first end-to-end demo because it clearly proves the product concept.

---

## 13. Security / control model to represent in the UI

Nova Guard should expose permissions such as:

- access files;
- install apps;
- use terminal;
- modify system;
- send data to AI;
- background actions.

Important:

- the user decides;
- Nova asks when needed;
- the interface should feel safe, elegant, and understandable.

---

## 14. Offline mode expectations

Offline mode should communicate:

- internet-dependent cloud features are unavailable;
- local files still work;
- local apps still work;
- Nova Apps still work if local;
- local AI remains usable if present;
- drafts are safe;
- a reconnect CTA exists.

Reference:

- `images/10_offline_mode.png`

---

## 15. Recommended information architecture

### Global navigation
Use the rail for a limited set of stable destinations:

- Home
- Explore
- Work
- Media
- Connect
- Store
- Settings

### Shelf items
Use the shelf for pinned, quickly accessible items like:

- Nova gem icon / launcher
- world / spaces icon
- files
- notes or document
- app builder / cube
- AI / hub icon
- music
- play / media
- grid

---

## 16. Suggested repository structure

```text
nova-os-webspace/
  AGENTS.md
  README.md
  docs/
    plan.md
  public/
    references/
    wallpapers/
    icons/
  app/
  components/
    desktop/
    rail/
    command/
    shelf/
    windows/
    onboarding/
    apps/
  lib/
  data/
```

Recommended inside the repo:

- put this file at `docs/plan.md`
- copy the whole `images/` folder into `docs/images/` or `public/references/`

---

## 17. Suggested component list

Codex should likely create these components:

- `DesktopShell`
- `NovaRail`
- `TopCommandBar`
- `ActivityShelf`
- `WindowFrame`
- `MySpaceWindow`
- `PersonalizeWindow`
- `NovaCommandWindow`
- `NovaHubWindow`
- `AiCenterWindow`
- `NovaGuardWindow`
- `NovaStoreWindow`
- `SpacesWindow`
- `OfflineModePanel`
- `CreateNovaAppWindow`
- `GeneratedCrmAppWindow`
- `OnboardingFlow`

---

## 18. Implementation order for Codex

Do not build everything at once.

### Phase 1
- desktop shell;
- rail;
- top command pill;
- shelf;
- wallpaper;
- two starter windows.

### Phase 2
- onboarding flow;
- route from onboarding to desktop.

### Phase 3
- Nova Command open state;
- AI Center;
- Nova Hub.

### Phase 4
- Nova Guard;
- Offline Mode;
- Spaces.

### Phase 5
- Create Nova App flow;
- generated CRM app demo.

### Phase 6
- Nova Store;
- polish animations;
- responsive tuning.

---

## 19. Master build prompt for Codex

Use this as the starting prompt for Codex:

```text
Build Nova OS Web Space as a premium AI-native desktop web prototype.

Use the provided plan.md and the images folder as the main source of truth.
The primary approved design inspiration is images/00_reference_desktop.png.

Requirements:
- create a full-screen desktop-like experience
- use a calm blue/violet scenic wallpaper
- implement a left vertical Nova Rail
- implement a top centered Nova Command pill
- implement a bottom floating Activity Shelf
- create frosted glass windows
- recreate the core windows shown in the image pack
- keep the UI minimal, beautiful, premium, and original
- do not make it look like a macOS clone
- do not make it look like a Windows clone
- use reusable React / TypeScript components
- static data is acceptable for the MVP
- the onboarding flow must exist and route to the desktop
- the app creation flow must generate a simulated CRM app demo
```

---

## 20. Non-goals for the first version

Do **not** prioritize these in V1:

- real OS kernel development;
- ISO installer;
- advanced backend;
- multi-user sync;
- full cloud infra;
- deep security implementation;
- Windows or macOS compatibility layers.

V1 goal is:

> a believable, beautiful, interactive Nova OS prototype.

---

## 21. Definition of success

The first Codex deliverable is successful if:

- the user immediately recognizes the validated Nova OS style;
- the product feels like a desktop OS, not a web dashboard;
- onboarding is clickable;
- at least one Nova App creation flow exists;
- the CRM demo app opens;
- the main windows feel coherent;
- the UI is visually premium and stable.

---

## 22. Final reminder for Codex

If there is any conflict between general assumptions and the images in this package:

1. follow the approved **reference desktop** first;
2. follow the other generated screen images second;
3. keep the overall system calm, clean, and original.

Nova OS is not supposed to be loud.  
It is supposed to feel **futuristic, serene, intelligent, and beautiful**.
