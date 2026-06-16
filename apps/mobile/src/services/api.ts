import axios, { type AxiosError } from "axios";
import Constants from "expo-constants";
import type { ApiResponse } from "@driven-rewards/shared";

function resolveBaseUrl(): string {
  const configured = process.env.EXPO_PUBLIC_API_URL;

  if (configured && !configured.includes("localhost")) {
    return configured.replace(/\/$/, "");
  }

  const host = Constants.expoConfig?.hostUri?.split(":")[0];
  if (host && host !== "localhost") {
    return `http://${host}:3050/api/v1`;
  }

  return (configured ?? "http://localhost:3050/api/v1").replace(/\/$/, "");
}

export const API_BASE_URL = resolveBaseUrl();

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

export function setAuthToken(token: string | null): void {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiError = error as AxiosError<ApiResponse>;
    return apiError.response?.data?.error?.message ?? "Connection error. Try again.";
  }
  if (error instanceof Error) return error.message;
  return "Unexpected error. Try again.";
}
