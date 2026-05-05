# prompt_master_codex.md

Use this as the first prompt to Codex.

---

Build **Nova OS Web Space** as a premium AI-native desktop web prototype.

Read and follow:

- `AGENTS.md`
- `plan.md`
- `images/00_reference_desktop.png`
- the full `images/` folder
- the full `images/onboarding/` folder

The primary approved visual reference is:

```txt
images/00_reference_desktop.png
```

## Goal

Create a believable, beautiful, interactive Nova OS prototype in the browser.

Nova OS must feel like a real premium operating system experience, not a SaaS dashboard.

## Tech stack

Use:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- shadcn/ui only where useful
- lucide-react icons where useful

## Build requirements

Create:

1. Full-screen Nova OS desktop.
2. Scenic blue/violet luminous wallpaper.
3. Left vertical Nova Rail.
4. Top centered Nova Command pill.
5. Top-right system status.
6. Bottom floating Activity Shelf.
7. Frosted glass windows.
8. My Space window.
9. Personalize window.
10. Clickable onboarding flow.
11. Nova Command open state.
12. Nova Hub.
13. AI Center.
14. Nova Guard.
15. Create Nova App flow.
16. Generated CRM App demo.
17. Nova Store.
18. Spaces.
19. Offline Mode.

## Onboarding flow

Implement these 14 steps:

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

After the final step, route to the desktop.

## Main demo flow

User asks Nova:

```txt
I want an app to manage my clients, invoices, and schedule.
```

Nova proposes modules:

- CRM
- Invoices
- Calendar
- Tasks
- Dashboard

Then show a simulated generation state and open the generated CRM Nova App.

## Important design rules

- Do not copy macOS.
- Do not copy Windows.
- Do not create a dense dashboard.
- Keep the interface calm, spacious, premium and original.
- Use glassmorphism, soft blur, rounded corners and blue/violet lighting.
- Use the image folder as visual guidance, not as exact pixel-perfect output.

## Expected result

At the end, `npm run dev` should launch a visually convincing Nova OS Web Space prototype.

The user should be able to:

- complete onboarding;
- land on the Nova desktop;
- open Nova Command;
- view AI Center;
- view Nova Guard;
- view Nova Store;
- create a Nova App;
- see the generated CRM app.
