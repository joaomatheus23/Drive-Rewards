/**
 * Session Zustand store
 * Role: mobile
 * Entry: session screens and hooks
 * Exit: shared active session, route and live stats state
 */
import type { IGpsPoint, ISession, SessionLiveStats } from "@driven-rewards/shared";
import { create } from "zustand";

const EMPTY_STATS: SessionLiveStats = {
  distanceKm: 0,
  durationMinutes: 0,
  pointsEarned: 0,
  estimatedProfitCAD: 0,
};

interface SessionState {
  activeSession: ISession | null;
  isTracking: boolean;
  routePoints: IGpsPoint[];
  liveStats: SessionLiveStats;
  completedSession: ISession | null;
  setActiveSession: (session: ISession | null) => void;
  setIsTracking: (tracking: boolean) => void;
  updateLiveStats: (stats: Partial<SessionLiveStats>) => void;
  addRoutePoint: (point: IGpsPoint) => void;
  setRoutePoints: (points: IGpsPoint[]) => void;
  setCompletedSession: (session: ISession | null) => void;
  resetSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  activeSession: null,
  isTracking: false,
  routePoints: [],
  liveStats: EMPTY_STATS,
  completedSession: null,

  setActiveSession: (session) =>
    set({
      activeSession: session,
      routePoints: session?.gpsPoints ?? [],
      liveStats: session
        ? {
            distanceKm: session.distanceKm,
            durationMinutes: session.durationMinutes,
            pointsEarned: session.pointsEarned,
            estimatedProfitCAD: session.netProfitCAD,
          }
        : EMPTY_STATS,
    }),

  setIsTracking: (isTracking) => set({ isTracking }),

  updateLiveStats: (stats) =>
    set((state) => ({
      liveStats: { ...state.liveStats, ...stats },
    })),

  addRoutePoint: (point) =>
    set((state) => ({
      routePoints: [...state.routePoints, point],
    })),

  setRoutePoints: (points) => set({ routePoints: points }),

  setCompletedSession: (session) => set({ completedSession: session }),

  resetSession: () =>
    set({
      activeSession: null,
      isTracking: false,
      routePoints: [],
      liveStats: EMPTY_STATS,
    }),
}));
