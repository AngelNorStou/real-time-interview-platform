const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export type InterviewStatus =
  | 'DRAFT'
  | 'SCHEDULED'
  | 'READY'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface InterviewUser {
  id: string;
  clerkId: string;
  name: string | null;
  email: string;
}

export interface Interview {
  id: string;
  title: string;
  description: string | null;
  scheduledAt: string;
  duration: number;
  status: InterviewStatus;
  streamCallId: string | null;
  candidateId: string;
  interviewerId: string;
  candidate: InterviewUser;
  interviewer: InterviewUser;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInterviewInput {
  title: string;
  description?: string;
  scheduledAt: string; // ISO string
  duration: number;
  candidateId: string;
}

export interface UpdateInterviewInput {
  title?: string;
  description?: string;
  scheduledAt?: string;
  duration?: number;
  streamCallId?: string;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function apiFetch<T>(
  path: string,
  token: string | null,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = Array.isArray(body?.message)
      ? body.message.join(', ')
      : (body?.message ?? `Request failed: ${res.status}`);
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const getMyInterviews = (token: string | null) =>
  apiFetch<Interview[]>('/interviews/me', token);

export const getInterview = (id: string, token: string | null) =>
  apiFetch<Interview>(`/interviews/${id}`, token);

export const createInterview = (
  data: CreateInterviewInput,
  token: string | null,
) =>
  apiFetch<Interview>('/interviews', token, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateInterview = (
  id: string,
  data: UpdateInterviewInput,
  token: string | null,
) =>
  apiFetch<Interview>(`/interviews/${id}`, token, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

export const cancelInterview = (id: string, token: string | null) =>
  apiFetch<Interview>(`/interviews/${id}/cancel`, token, { method: 'PATCH' });

export { ApiError };