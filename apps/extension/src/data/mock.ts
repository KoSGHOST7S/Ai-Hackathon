import type { Assignment, Stats, UserProfile } from "@/types";

export const user: UserProfile = {
  name: "Jordan Mint",
  email: "jordan@assignmint.mock",
  school: "Mint Valley University",
  initials: "JM",
};

export const assignments: Assignment[] = [
  {
    id: "a1",
    title: "Marketing Plan Draft",
    course: "BUS 301",
    dueLabel: "Today 8:00 PM",
    dueDate: "2026-02-27T20:00:00",
    status: "Urgent",
  },
  {
    id: "a2",
    title: "User Interview Notes",
    course: "UXD 220",
    dueLabel: "Tomorrow 10:00 AM",
    dueDate: "2026-02-28T10:00:00",
    status: "In Progress",
  },
  {
    id: "a3",
    title: "Data Viz Reflection",
    course: "STAT 110",
    dueLabel: "Mon 5:00 PM",
    dueDate: "2026-03-02T17:00:00",
    status: "Queued",
  },
];

export const stats: Stats = {
  pending: 12,
  dueToday: 3,
  doneThisWeek: 19,
};
