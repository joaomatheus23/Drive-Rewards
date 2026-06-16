import type { AuthUser, UserRole } from "@driven-rewards/shared";
import { router } from "expo-router";
import { create } from "zustand";
import {
  fetchMeRequest,
  loginRequest,
  registerRequest,
  updateProfileRequest,
} from "../services/auth.service";
import { api, getApiErrorMessage, setAuthToken } from "../services/api";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "../services/token-storage";

interface AuthState {
  user: AuthUser | null;
  isHydrated: boolean;
  isLoading: boolean;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (payload: {
    vehicleType?: AuthUser["vehicleType"];
    licensePlate?: string;
    profilePhotoUrl?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  navigateByRole: (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isHydrated: false,
  isLoading: false,

  hydrate: async () => {
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) return;

      setAuthToken(accessToken);
      const user = await fetchMeRequest();
      set({ user });
    } catch {
      await clearTokens();
      setAuthToken(null);
      set({ user: null });
    } finally {
      set({ isHydrated: true });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const tokens = await loginRequest({ email, password });
      await saveTokens(tokens.accessToken, tokens.refreshToken);
      setAuthToken(tokens.accessToken);
      set({ user: tokens.user });
      get().navigateByRole(tokens.user.role);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const tokens = await registerRequest({ name, email, password });
      await saveTokens(tokens.accessToken, tokens.refreshToken);
      setAuthToken(tokens.accessToken);
      set({ user: tokens.user });
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (payload) => {
    const user = await updateProfileRequest(payload);
    set({ user });
  },

  logout: async () => {
    try {
      const token = await getAccessToken();
      if (token) {
        setAuthToken(token);
        await api.post("/auth/logout");
      }
    } catch {
      // ignore network errors on logout
    } finally {
      await clearTokens();
      setAuthToken(null);
      set({ user: null });
      router.replace("/(auth)/login");
    }
  },

  navigateByRole: (role) => {
    if (role === "partner_staff") {
      router.replace("/(staff)/scanner");
      return;
    }
    if (role === "driver") {
      router.replace("/(driver)");
      return;
    }
    router.replace("/(driver)");
  },
}));

export async function restoreSessionToken(): Promise<void> {
  const token = await getAccessToken();
  setAuthToken(token);
  void getRefreshToken();
}
