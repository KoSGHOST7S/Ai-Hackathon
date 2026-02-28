import type { Tab } from "@/components/BottomNav";
import type { SubPage } from "@/hooks/useSubPage";
import { storageGet, storageSet } from "./storage";

const UI_SESSION_KEY = "ui_session_v2";

export interface AssignmentRef {
  courseId: string;
  assignmentId: string;
}

export interface AssignmentDetailSession {
  subPage: SubPage | null;
  checkedMilestones: number[];
  wasAnalyzing?: boolean;
}

export interface UiSessionState {
  tab: Tab;
  selectedByTab: Partial<Record<Tab, AssignmentRef | null>>;
  detailByAssignment: Record<string, AssignmentDetailSession>;
}

const DEFAULT_SESSION: UiSessionState = {
  tab: "today",
  selectedByTab: {},
  detailByAssignment: {},
};

function isValidSubPage(value: unknown): value is SubPage | null {
  if (value === null) return true;
  if (typeof value !== "object" || value === null) return false;
  const v = value as { type?: unknown; index?: unknown };
  if (typeof v.type !== "string") return false;
  if (v.type === "criterion" || v.type === "milestone") {
    return typeof v.index === "number";
  }
  return ["description", "chat", "submit", "review"].includes(v.type);
}

function sanitize(input: unknown): UiSessionState {
  if (!input || typeof input !== "object") return DEFAULT_SESSION;
  const raw = input as Record<string, unknown>;

  const tab =
    raw.tab === "today" || raw.tab === "plan" || raw.tab === "me"
      ? raw.tab
      : "today";

  const selectedByTab: Partial<Record<Tab, AssignmentRef | null>> = {};
  const rawByTab = raw.selectedByTab;
  if (rawByTab && typeof rawByTab === "object") {
    for (const t of ["today", "plan", "me"] as Tab[]) {
      const sel = (rawByTab as Record<string, unknown>)[t];
      if (
        sel &&
        typeof sel === "object" &&
        typeof (sel as Record<string, unknown>).courseId === "string" &&
        typeof (sel as Record<string, unknown>).assignmentId === "string"
      ) {
        selectedByTab[t] = {
          courseId: (sel as Record<string, unknown>).courseId as string,
          assignmentId: (sel as Record<string, unknown>).assignmentId as string,
        };
      } else {
        selectedByTab[t] = null;
      }
    }
  }

  const detailByAssignment: Record<string, AssignmentDetailSession> = {};
  if (raw.detailByAssignment && typeof raw.detailByAssignment === "object") {
    for (const [key, value] of Object.entries(
      raw.detailByAssignment as Record<string, unknown>
    )) {
      if (!value || typeof value !== "object") continue;
      const candidate = value as Partial<AssignmentDetailSession>;
      const checked = Array.isArray(candidate.checkedMilestones)
        ? candidate.checkedMilestones.filter(
            (n): n is number => typeof n === "number" && n >= 0
          )
        : [];
      const subPage = isValidSubPage(candidate.subPage)
        ? candidate.subPage
        : null;
      detailByAssignment[key] = {
        checkedMilestones: checked,
        subPage,
        wasAnalyzing: candidate.wasAnalyzing === true,
      };
    }
  }

  return { tab, selectedByTab, detailByAssignment };
}

export async function loadUiSession(): Promise<UiSessionState> {
  const raw = await storageGet(UI_SESSION_KEY);
  if (!raw) return DEFAULT_SESSION;
  try {
    return sanitize(JSON.parse(raw));
  } catch {
    return DEFAULT_SESSION;
  }
}

export async function saveUiSession(session: UiSessionState): Promise<void> {
  await storageSet(UI_SESSION_KEY, JSON.stringify(session));
}
