/**
 * Session API client
 * Role: mobile
 * Entry: hooks and session store
 * Exit: typed HTTP calls to /sessions endpoints
 */
import type {
  AppendGpsRequest,
  EndSessionRequest,
  ISession,
  SessionSummaryPeriod,
  StartSessionRequest,
} from "@driven-rewards/shared";
import { api } from "./api";

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export async function fetchActiveSession(): Promise<ISession | null> {
  const { data } = await api.get<ApiEnvelope<ISession | null>>("/sessions/active");
  return data.data;
}

export async function startSessionRequest(
  payload: StartSessionRequest,
): Promise<ISession> {
  const { data } = await api.post<ApiEnvelope<ISession>>("/sessions/start", payload);
  return data.data;
}

export async function appendGpsRequest(
  sessionId: string,
  payload: AppendGpsRequest,
): Promise<{ session: ISession; accepted: number; rejected: number }> {
  const { data } = await api.post<
    ApiEnvelope<{ session: ISession; accepted: number; rejected: number }>
  >(`/sessions/${sessionId}/gps`, payload);
  return data.data;
}

export async function pauseSessionRequest(sessionId: string): Promise<ISession> {
  const { data } = await api.post<ApiEnvelope<ISession>>(`/sessions/${sessionId}/pause`);
  return data.data;
}

export async function resumeSessionRequest(sessionId: string): Promise<ISession> {
  const { data } = await api.post<ApiEnvelope<ISession>>(`/sessions/${sessionId}/resume`);
  return data.data;
}

export async function endSessionRequest(
  sessionId: string,
  payload: EndSessionRequest,
): Promise<ISession> {
  const { data } = await api.post<ApiEnvelope<ISession>>(
    `/sessions/${sessionId}/end`,
    payload,
  );
  return data.data;
}

export async function fetchSessionById(sessionId: string): Promise<ISession> {
  const { data } = await api.get<ApiEnvelope<ISession>>(`/sessions/${sessionId}`);
  return data.data;
}

export async function fetchTodaySessionSummary(): Promise<SessionSummaryPeriod> {
  const { data } = await api.get<ApiEnvelope<SessionSummaryPeriod>>("/sessions/summary/today");
  return data.data;
}

export interface SessionsListResult {
  items: ISession[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function fetchSessionsList(params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<SessionsListResult> {
  const { data } = await api.get<ApiEnvelope<SessionsListResult>>("/sessions", {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 5,
      status: params?.status ?? "completed",
    },
  });
  return data.data;
}
