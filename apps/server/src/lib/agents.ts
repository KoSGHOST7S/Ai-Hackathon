const AGENTS_URL = process.env.AGENTS_URL ?? "http://localhost:8000";

export interface AgentsAnalyzeRequest {
  name: string;
  description: string;
  points_possible: number;
  submission_types: string[];
  due_at: string | null;
  grading_type: string;
  allowed_attempts: number | null;
  attachment_names: string[];
  canvas_rubric_summary: string | null;
}

export interface RubricLevel {
  label: string;
  points: number;
  description: string;
}

export interface RubricCriterion {
  name: string;
  description: string;
  weight: number;
  levels: RubricLevel[];
}

export interface Rubric {
  criteria: RubricCriterion[];
  totalPoints: number;
}

export interface Milestone {
  order: number;
  title: string;
  description: string;
  estimatedHours: number;
  deliverable: string;
}

export interface Milestones {
  milestones: Milestone[];
}

export interface AgentsAnalyzeResponse {
  rubric: Rubric;
  milestones: Milestones;
}

export async function callAgentsService(req: AgentsAnalyzeRequest): Promise<AgentsAnalyzeResponse> {
  const res = await fetch(`${AGENTS_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Agents service error ${res.status}: ${body}`);
  }
  return res.json();
}
