export type Status = "Urgent" | "In Progress" | "Queued" | "Done";

export interface Assignment {
  id: string;
  title: string;
  course: string;
  dueLabel: string;
  dueDate: string;
  status: Status;
}

export interface Stats {
  pending: number;
  dueToday: number;
  doneThisWeek: number;
}

export interface UserProfile {
  name: string;
  email: string;
  school: string;
  initials: string;
}
