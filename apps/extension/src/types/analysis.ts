export interface CanvasAssignment {
  id: number;
  name: string;
  description: string | null;
  due_at: string | null;
  points_possible: number;
  submission_types: string[];
  workflow_state: string;
  courseId?: string;
  courseName?: string;
  courseCode?: string;
}

export interface RubricLevel     { label: string; points: number; description: string; }
export interface RubricCriterion { name: string; description: string; weight: number; levels: RubricLevel[]; }
export interface Rubric           { criteria: RubricCriterion[]; totalPoints: number; }
export interface Milestone        { order: number; title: string; description: string; estimatedHours: number; deliverable: string; }
export interface Milestones       { milestones: Milestone[]; }
export interface AnalysisResult   { rubric: Rubric; milestones: Milestones; }
