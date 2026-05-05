export type WindowKey =
  | "my-space"
  | "personalize"
  | "nova-hub"
  | "ai-center"
  | "nova-guard"
  | "nova-store"
  | "spaces"
  | "offline-mode"
  | "create-app"
  | "crm-app";

export type OnboardingStep = {
  title: string;
  kicker: string;
  body: string;
  reference: string;
  primary: string;
  options: string[];
  status: string;
};

export const onboardingSteps: OnboardingStep[] = [
  {
    title: "Connect to the internet",
    kicker: "Step 01",
    body: "Nova checks connectivity first so the setup can pull intelligence, app packs, and your cloud context when you allow it.",
    reference: "/references/onboarding/01_internet_connection.png",
    primary: "Connected",
    options: ["Nova Cloud", "Local network", "Offline fallback"],
    status: "Cloud services ready",
  },
  {
    title: "Connect your intelligences",
    kicker: "Step 02",
    body: "Bring the AIs you already use into one calm command layer. This prototype simulates the connections locally.",
    reference: "/references/onboarding/02_connect_your_intelligences.png",
    primary: "Connect models",
    options: ["ChatGPT", "Claude", "Gemini", "Mistral", "Local AI"],
    status: "5 providers available",
  },
  {
    title: "Assign roles to your AI",
    kicker: "Step 03",
    body: "Nova routes work to the right intelligence: coding, research, writing, private analysis, or general planning.",
    reference: "/references/onboarding/03_assign_ai_roles.png",
    primary: "Assign roles",
    options: ["Builder", "Researcher", "Assistant", "Private analyst"],
    status: "Roles balanced",
  },
  {
    title: "Tell Nova about you",
    kicker: "Step 04",
    body: "Your space starts with your intent, not a blank dashboard. Nova uses this profile to prepare the right surfaces.",
    reference: "/references/onboarding/04_tell_nova_about_you.png",
    primary: "Creator and builder",
    options: ["Entrepreneur", "Creator", "Developer", "Student"],
    status: "Profile drafted",
  },
  {
    title: "How do you want to sign in?",
    kicker: "Step 05",
    body: "Choose a simple sign-in pattern. For the V1 web prototype, everything stays inside local browser state.",
    reference: "/references/onboarding/05_sign_in_to_nova.png",
    primary: "Passkey",
    options: ["Passkey", "Nova ID", "Local only"],
    status: "Identity local-first",
  },
  {
    title: "Define Nova's limits",
    kicker: "Step 06",
    body: "You decide what Nova can do automatically and what requires approval before it touches your system.",
    reference: "/references/onboarding/06_define_nova_limits.png",
    primary: "Ask before acting",
    options: ["Ask before installs", "Ask before terminal", "Ask before sharing"],
    status: "Approval gates active",
  },
  {
    title: "Protect your space",
    kicker: "Step 07",
    body: "Nova Guard keeps sensitive actions visible, reversible where possible, and grouped into clear permission zones.",
    reference: "/references/onboarding/07_protect_your_space.png",
    primary: "Enable Nova Guard",
    options: ["Files", "Apps", "Terminal", "AI data"],
    status: "Guard enabled",
  },
  {
    title: "Start fresh or restore?",
    kicker: "Step 08",
    body: "Begin with a luminous clean space or restore a previous Nova workspace when the ecosystem grows.",
    reference: "/references/onboarding/08_start_fresh_or_restore.png",
    primary: "Start fresh",
    options: ["Fresh space", "Restore backup", "Import workspace"],
    status: "Fresh setup selected",
  },
  {
    title: "Choose where your files live",
    kicker: "Step 09",
    body: "Keep files local, connect a cloud drive, or blend both. Nova makes the storage model visible.",
    reference: "/references/onboarding/09_choose_where_files_live.png",
    primary: "Local + Nova Drive",
    options: ["Local disk", "Nova Drive", "External drive"],
    status: "Storage mapped",
  },
  {
    title: "Choose your starting space",
    kicker: "Step 10",
    body: "Spaces gather files, apps, agents, and automations around a mission instead of scattering work everywhere.",
    reference: "/references/onboarding/10_choose_your_starting_space.png",
    primary: "Builder Studio",
    options: ["Builder Studio", "Client Work", "Creator Lab"],
    status: "Builder Studio ready",
  },
  {
    title: "Pick your essential apps",
    kicker: "Step 11",
    body: "Choose the apps and system surfaces that should sit on your Activity Shelf from the first boot.",
    reference: "/references/onboarding/11_pick_your_essential_apps.png",
    primary: "Install essentials",
    options: ["My Space", "AI Center", "Nova Store", "Guard", "Builder"],
    status: "Essentials pinned",
  },
  {
    title: "Review your setup",
    kicker: "Step 12",
    body: "Nova summarizes the choices that shape your workspace before the first desktop appears.",
    reference: "/references/onboarding/12_review_your_setup.png",
    primary: "Review",
    options: ["5 AIs", "Guard active", "Builder Studio", "Local-first"],
    status: "Ready to prepare",
  },
  {
    title: "Nova is preparing your space",
    kicker: "Step 13",
    body: "A short simulated boot sequence assembles your files, apps, roles, permissions, and starting workspace.",
    reference: "/references/onboarding/13_nova_is_preparing_your_space.png",
    primary: "Preparing",
    options: ["Indexing files", "Pinning shelf", "Warming agents"],
    status: "System composing",
  },
  {
    title: "Your space is ready",
    kicker: "Step 14",
    body: "The Nova desktop is ready. From here you can open command, inspect Guard, and generate a CRM app.",
    reference: "/references/onboarding/14_your_space_is_ready.png",
    primary: "Enter Nova OS",
    options: ["Desktop shell", "Nova Command", "CRM demo"],
    status: "Welcome to Nova",
  },
];

export const folders = [
  { name: "Work", count: "12 items", tone: "violet" },
  { name: "Design", count: "8 items", tone: "blue" },
  { name: "Media", count: "47 items", tone: "cyan" },
  { name: "Docs", count: "21 items", tone: "lavender" },
  { name: "Archive", count: "6 items", tone: "indigo" },
];

export const recentFiles = [
  ["Nova_Concept.pdf", "PDF Document", "May 20, 10:21 AM", "4.3 MB"],
  ["Project_Plan.nova", "Nova Document", "May 19, 4:08 PM", "28.6 MB"],
  ["Landscape_01.png", "PNG Image", "May 18, 2:33 PM", "5.7 MB"],
  ["Music_Draft.mp3", "MP3 Audio", "May 18, 9:15 AM", "7.8 MB"],
  ["Notes.txt", "Text Document", "May 17, 11:42 AM", "1.2 KB"],
];

export const aiProviders = [
  { name: "ChatGPT", role: "General assistant", state: "Connected", level: 92 },
  { name: "Codex", role: "App builder", state: "Connected", level: 88 },
  { name: "Gemini", role: "Research", state: "Connected", level: 79 },
  { name: "Claude", role: "Writing and strategy", state: "Connected", level: 84 },
  { name: "Local AI", role: "Private tasks", state: "Local", level: 63 },
];

export const guardPermissions = [
  { name: "Access files", mode: "Ask for protected folders", enabled: true },
  { name: "Install apps", mode: "Require approval", enabled: true },
  { name: "Use terminal", mode: "Approval each session", enabled: true },
  { name: "Modify system", mode: "Blocked by default", enabled: false },
  { name: "Send data to AI", mode: "Ask when sensitive", enabled: true },
  { name: "Background actions", mode: "Visible ledger", enabled: true },
];

export const storeItems = [
  ["Founder Pack", "CRM, invoices, pitch room", "Installed"],
  ["Creator Studio", "Scripts, shoots, publishing", "Add"],
  ["Developer Lab", "Repos, terminals, agents", "Add"],
  ["Automation Desk", "Recurring tasks and alerts", "Add"],
];

export const spaces = [
  ["Builder Studio", "4 apps", "12 automations", "Active"],
  ["Client Work", "7 apps", "3 automations", "Warm"],
  ["Creator Lab", "5 apps", "8 automations", "Quiet"],
];

export const crmModules = ["CRM", "Invoices", "Calendar", "Tasks", "Dashboard"];

export const generationSteps = [
  "Reading intention",
  "Designing data model",
  "Composing CRM modules",
  "Adding invoice workflow",
  "Opening generated Nova App",
];

export const ledger = [
  ["09:42", "Nova asked before reading Documents/Clients", "Approved"],
  ["09:39", "Codex generated CRM module shell", "Visible"],
  ["09:36", "Gemini summarized market notes", "Private"],
];
