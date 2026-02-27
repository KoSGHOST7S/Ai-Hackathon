export interface User {
  id: string;
  email: string;
  canvasBaseUrl?: string;
}

export interface Assignment {
  id: string;
  userId: string;
  courseId: string;
  canvasAssignmentId: string;
  title: string;
}