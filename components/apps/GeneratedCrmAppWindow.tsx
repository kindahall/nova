"use client";

import { Banknote, CalendarDays, ContactRound, FileText, LayoutDashboard, ListTodo, TrendingUp } from "lucide-react";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import type { NovaSystemActions, NovaSystemState } from "@/lib/nova-system";

type GeneratedCrmAppWindowProps = {
  system: NovaSystemState;
  systemActions: NovaSystemActions;
  onClose?: () => void;
  onFocus?: () => void;
};

const clients = [
  ["Aster Studio", "$12,400", "Proposal due"],
  ["Northline Labs", "$8,950", "Invoice sent"],
  ["Luma Works", "$4,800", "Call tomorrow"],
  ["Solenne Paris", "$3,240", "Design review"],
];

const crmTabs = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Clients", icon: ContactRound },
  { label: "Invoices", icon: Banknote },
  { label: "Calendar", icon: CalendarDays },
  { label: "Tasks", icon: ListTodo },
];

const crmViews: Record<
  string,
  {
    kpis: Array<[string, string]>;
    chart: number[];
    boardTitle: string;
    rows: string[][];
    nextAction: string;
  }
> = {
  Dashboard: {
    kpis: [
      ["Revenue pipeline", "$42.8k"],
      ["Open invoices", "9"],
      ["Meetings", "14"],
      ["Tasks due", "23"],
    ],
    chart: [44, 58, 38, 74, 66, 92, 81],
    boardTitle: "Client queue",
    rows: clients,
    nextAction: "Nova recommends sending two invoice reminders and preparing tomorrow client agenda.",
  },
  Clients: {
    kpis: [
      ["Active clients", "18"],
      ["Hot leads", "6"],
      ["Follow-ups", "11"],
      ["At risk", "2"],
    ],
    chart: [35, 62, 57, 71, 48, 82, 76],
    boardTitle: "Priority clients",
    rows: clients.map((client) => [client[0], client[1], client[2]]),
    nextAction: "Nova would prepare a client brief for Aster Studio and pin the proposal timeline.",
  },
  Invoices: {
    kpis: [
      ["Due this week", "$9.2k"],
      ["Overdue", "3"],
      ["Paid", "$18.6k"],
      ["Drafts", "5"],
    ],
    chart: [30, 42, 64, 59, 75, 49, 88],
    boardTitle: "Invoice queue",
    rows: [
      ["Northline Labs", "$8,950", "Invoice sent"],
      ["Aster Studio", "$4,200", "Draft ready"],
      ["Luma Works", "$1,840", "Reminder due"],
      ["Solenne Paris", "$3,240", "Payment expected"],
    ],
    nextAction: "Nova can draft the overdue reminders, then ask Guard before sending anything externally.",
  },
  Calendar: {
    kpis: [
      ["Today", "4"],
      ["This week", "14"],
      ["Focus blocks", "7"],
      ["Conflicts", "1"],
    ],
    chart: [55, 28, 70, 52, 64, 48, 32],
    boardTitle: "Upcoming agenda",
    rows: [
      ["Aster Studio", "10:30", "Proposal sync"],
      ["Northline Labs", "13:00", "Invoice review"],
      ["Luma Works", "15:20", "Planning call"],
      ["Solenne Paris", "Tomorrow", "Design review"],
    ],
    nextAction: "Nova can batch tomorrow's agendas and attach the latest notes from My Space.",
  },
  Tasks: {
    kpis: [
      ["Due today", "8"],
      ["Blocked", "2"],
      ["Delegated", "5"],
      ["Done", "17"],
    ],
    chart: [20, 36, 48, 66, 74, 81, 94],
    boardTitle: "Task queue",
    rows: [
      ["Send proposal", "High", "Aster Studio"],
      ["Reconcile invoice", "Medium", "Northline Labs"],
      ["Prepare slides", "High", "Luma Works"],
      ["Review scope", "Low", "Solenne Paris"],
    ],
    nextAction: "Nova would group the high-priority work into a two-hour Builder Studio sprint.",
  },
};

export function GeneratedCrmAppWindow({ system, systemActions, onClose, onFocus }: GeneratedCrmAppWindowProps) {
  const view = crmViews[system.crmActiveView] ?? crmViews.Dashboard;

  return (
    <WindowFrame
      title="ClientFlow Nova App"
      subtitle="Generated CRM, invoices, calendar, tasks, and dashboard"
      icon={<LayoutDashboard size={18} />}
      className="window--crm-app"
      tone="dark"
      onClose={onClose}
      onFocus={onFocus}
    >
      <div className="crm-layout">
        <aside className="crm-nav">
          {crmTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                className={system.crmActiveView === tab.label ? "active" : undefined}
                key={tab.label}
                type="button"
                onClick={() => systemActions.setCrmActiveView(tab.label)}
                aria-pressed={system.crmActiveView === tab.label}
              >
                <Icon size={15} /> {tab.label}
              </button>
            );
          })}
        </aside>

        <main className="crm-main">
          <div className="crm-kpis">
            {view.kpis.map((kpi) => (
              <div className="crm-kpi" key={kpi[0]}>
                <span>{kpi[0]}</span>
                <strong>{kpi[1]}</strong>
              </div>
            ))}
          </div>

          <div className="crm-board">
            <div className="glass-card">
              <h3>
                <TrendingUp size={16} /> Revenue forecast
              </h3>
              <div className="chart" aria-label="Revenue forecast chart">
                {view.chart.map((height) => (
                  <span key={height} style={{ height: `${height}%` }} />
                ))}
              </div>
            </div>
            <div className="glass-card">
              <h3>
                <FileText size={16} /> {view.boardTitle}
              </h3>
              <div className="stack-list">
                {view.rows.map((client) => (
                  <div className="client-row" key={client[0]}>
                    <span>
                      <strong>{client[0]}</strong>
                      <span style={{ display: "block", color: "rgba(255,255,255,0.62)", fontSize: 12 }}>{client[2]}</span>
                    </span>
                    <span className="pill green">{client[1]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="wide-grid">
            <div className="glass-card">
              <h3>Next action</h3>
              <p>{view.nextAction}</p>
            </div>
            <div className="glass-card">
              <h3>Guard state</h3>
              <p>This app can read its generated CRM data. Exporting client data still requires approval.</p>
            </div>
          </div>
        </main>
      </div>
    </WindowFrame>
  );
}
