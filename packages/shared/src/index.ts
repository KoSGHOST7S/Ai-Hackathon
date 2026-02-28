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

export interface SignupRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  jwt: string;
  user: { id: string; email: string };
}

export interface CanvasConfigRequest {
  canvasBaseUrl: string;
  canvasApiKey: string;
}

export interface MeResponse {
  id: string;
  email: string;
  hasCanvasConfig: boolean;
  canvasBaseUrl: string | null;
  canvasName: string | null;
  canvasAvatarUrl: string | null;
}