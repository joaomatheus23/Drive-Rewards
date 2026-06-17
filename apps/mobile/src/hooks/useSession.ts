/**
 * useSession
 * Role: mobile
 * Entry: session screens and sheets
 * Exit: session lifecycle actions with loading state
 */
import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
  EndSessionRequest,
  ISession,
  SessionPlatform,
  StartSessionRequest,
} from "@driven-rewards/shared";
import {
  endSessionRequest,
  fetchActiveSession,
  pauseSessionRequest,
  resumeSessionRequest,
  startSessionRequest,
} from "../services/session.service";
import { getApiErrorMessage } from "../services/api";
import { useSessionStore } from "../store/sessionStore";

const DEVICE_ID_KEY = "@device/id";

async function resolveDeviceId(): Promise<string> {
  const stored = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (stored) return stored;
  const generated = `device-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  await AsyncStorage.setItem(DEVICE_ID_KEY, generated);
  return generated;
}

export function useSession() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setActiveSession = useSessionStore((s) => s.setActiveSession);
  const setIsTracking = useSessionStore((s) => s.setIsTracking);
  const setCompletedSession = useSessionStore((s) => s.setCompletedSession);
  const resetSession = useSessionStore((s) => s.resetSession);
  const activeSession = useSessionStore((s) => s.activeSession);

  const hydrateActiveSession = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const session = await fetchActiveSession();
      setActiveSession(session);
      setIsTracking(session?.status === "active");
      return session;
    } catch (err) {
      setError(getApiErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, [setActiveSession, setIsTracking]);

  const startSession = useCallback(
    async (platform: SessionPlatform, grossEarnings?: number) => {
      setLoading(true);
      setError(null);
      try {
        const deviceId = await resolveDeviceId();
        const payload: StartSessionRequest = { platform, grossEarnings, deviceId };
        const session = await startSessionRequest(payload);
        setActiveSession(session);
        setIsTracking(true);
        return session;
      } catch (err) {
        setError(getApiErrorMessage(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setActiveSession, setIsTracking],
  );

  const pauseSession = useCallback(async () => {
    if (!activeSession) return null;
    setLoading(true);
    setError(null);
    try {
      const session = await pauseSessionRequest(activeSession._id);
      setActiveSession(session);
      setIsTracking(false);
      return session;
    } catch (err) {
      setError(getApiErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [activeSession, setActiveSession, setIsTracking]);

  const resumeSession = useCallback(async () => {
    if (!activeSession) return null;
    setLoading(true);
    setError(null);
    try {
      const session = await resumeSessionRequest(activeSession._id);
      setActiveSession(session);
      setIsTracking(true);
      return session;
    } catch (err) {
      setError(getApiErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [activeSession, setActiveSession, setIsTracking]);

  const endSession = useCallback(
    async (payload: EndSessionRequest) => {
      if (!activeSession) return null;
      setLoading(true);
      setError(null);
      try {
        const session = await endSessionRequest(activeSession._id, payload);
        setCompletedSession(session);
        setIsTracking(false);
        resetSession();
        return session;
      } catch (err) {
        setError(getApiErrorMessage(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [activeSession, resetSession, setCompletedSession, setIsTracking],
  );

  return {
    loading,
    error,
    activeSession,
    hydrateActiveSession,
    startSession,
    pauseSession,
    resumeSession,
    endSession,
  };
}
