import type {
  ApiResponse,
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  AuthUser,
} from "@driven-rewards/shared";
import { api } from "./api";

export async function loginRequest(payload: LoginRequest): Promise<AuthTokens> {
  const { data } = await api.post<ApiResponse<AuthTokens>>("/auth/login", payload);
  if (!data.success || !data.data) {
    throw new Error(data.error?.message ?? "Login failed");
  }
  return data.data;
}

export async function registerRequest(payload: RegisterRequest): Promise<AuthTokens> {
  const { data } = await api.post<ApiResponse<AuthTokens>>("/auth/register", payload);
  if (!data.success || !data.data) {
    throw new Error(data.error?.message ?? "Registration failed");
  }
  return data.data;
}

export async function updateProfileRequest(
  payload: UpdateProfileRequest,
): Promise<AuthUser> {
  const { data } = await api.patch<ApiResponse<AuthUser>>("/users/me/profile", payload);
  if (!data.success || !data.data) {
    throw new Error(data.error?.message ?? "Failed to update profile");
  }
  return data.data;
}

export async function fetchMeRequest(): Promise<AuthUser> {
  const { data } = await api.get<ApiResponse<AuthUser>>("/users/me");
  if (!data.success || !data.data) {
    throw new Error(data.error?.message ?? "Failed to load profile");
  }
  return data.data;
}
