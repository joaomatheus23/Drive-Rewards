/**
 * useLocationTracking
 * Role: mobile
 * Entry: active session screen
 * Exit: foreground GPS watch with batching and offline queue
 */
import { useCallback, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import type { IGpsPoint } from "@driven-rewards/shared";
import { appendGpsRequest } from "../services/session.service";
import { getApiErrorMessage } from "../services/api";
import { useSessionStore } from "../store/sessionStore";

const GPS_QUEUE_KEY = "@session/gps-queue";
const BATCH_SIZE = 20;
const MOVING_INTERVAL_MS = 5000;
const IDLE_INTERVAL_MS = 10000;
const IDLE_SPEED_MS = 5 / 3.6;

interface QueuedBatch {
  sessionId: string;
  points: Array<{
    lat: number;
    lng: number;
    speed?: number;
    accuracy?: number;
    heading?: number;
    altitude?: number;
    recordedAt: string;
  }>;
}

function toGpsPoint(location: Location.LocationObject): IGpsPoint {
  return {
    lat: location.coords.latitude,
    lng: location.coords.longitude,
    speed: location.coords.speed ?? undefined,
    accuracy: location.coords.accuracy ?? undefined,
    heading: location.coords.heading ?? undefined,
    altitude: location.coords.altitude ?? undefined,
    recordedAt: new Date(location.timestamp),
  };
}

async function loadQueue(): Promise<QueuedBatch[]> {
  const raw = await AsyncStorage.getItem(GPS_QUEUE_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as QueuedBatch[];
}

async function saveQueue(queue: QueuedBatch[]): Promise<void> {
  await AsyncStorage.setItem(GPS_QUEUE_KEY, JSON.stringify(queue));
}

export function useLocationTracking(enabled: boolean) {
  const activeSession = useSessionStore((s) => s.activeSession);
  const isTracking = useSessionStore((s) => s.isTracking);
  const addRoutePoint = useSessionStore((s) => s.addRoutePoint);
  const setActiveSession = useSessionStore((s) => s.setActiveSession);

  const bufferRef = useRef<QueuedBatch["points"]>([]);
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);
  const flushInFlightRef = useRef(false);

  const flushBuffer = useCallback(async () => {
    if (!activeSession || bufferRef.current.length === 0 || flushInFlightRef.current) {
      return;
    }

    flushInFlightRef.current = true;
    const batch = bufferRef.current.splice(0, BATCH_SIZE);

    try {
      const result = await appendGpsRequest(activeSession._id, { points: batch });
      setActiveSession(result.session);
    } catch {
      const queue = await loadQueue();
      queue.push({ sessionId: activeSession._id, points: batch });
      await saveQueue(queue);
    } finally {
      flushInFlightRef.current = false;
    }
  }, [activeSession, setActiveSession]);

  const flushOfflineQueue = useCallback(async () => {
    if (!activeSession) return;
    const queue = await loadQueue();
    if (queue.length === 0) return;

    const remaining: QueuedBatch[] = [];
    for (const item of queue) {
      if (item.sessionId !== activeSession._id) {
        remaining.push(item);
        continue;
      }
      try {
        const result = await appendGpsRequest(item.sessionId, { points: item.points });
        setActiveSession(result.session);
      } catch (error) {
        remaining.push(item);
        console.warn(getApiErrorMessage(error));
      }
    }
    await saveQueue(remaining);
  }, [activeSession, setActiveSession]);

  useEffect(() => {
    if (!enabled || !isTracking || !activeSession) {
      subscriptionRef.current?.remove();
      subscriptionRef.current = null;
      return;
    }

    let cancelled = false;

    const start = async () => {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== "granted" || cancelled) return;

      await flushOfflineQueue();

      subscriptionRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 8,
          timeInterval: MOVING_INTERVAL_MS,
        },
        (location) => {
          const point = toGpsPoint(location);
          addRoutePoint(point);

          bufferRef.current.push({
            lat: point.lat,
            lng: point.lng,
            speed: point.speed,
            accuracy: point.accuracy,
            heading: point.heading,
            altitude: point.altitude,
            recordedAt: new Date(point.recordedAt).toISOString(),
          });

          const speedMs = location.coords.speed ?? 0;
          const shouldFlush =
            bufferRef.current.length >= BATCH_SIZE ||
            (bufferRef.current.length > 0 && speedMs < IDLE_SPEED_MS);

          if (shouldFlush) {
            void flushBuffer();
          }
        },
      );
    };

    void start();

    const interval = setInterval(() => {
      void flushBuffer();
    }, IDLE_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
      subscriptionRef.current?.remove();
      subscriptionRef.current = null;
      void flushBuffer();
    };
  }, [
    activeSession,
    addRoutePoint,
    enabled,
    flushBuffer,
    flushOfflineQueue,
    isTracking,
  ]);
}
