import { ROUTINE } from "./constants.js";

const EARTH_RADIUS_METERS = 6_371_000;

/** Haversine distance between two coordinates in meters */
export function haversineDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_METERS * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Check if a point is inside a circular geofence */
export function isInsideGeofence(
  lat: number,
  lng: number,
  centerLat: number,
  centerLng: number,
  radiusMeters: number = ROUTINE.GEOFENCE_RADIUS_METERS,
): boolean {
  return (
    haversineDistanceMeters(lat, lng, centerLat, centerLng) <= radiusMeters
  );
}

/** Convert minutes-from-midnight to HH:MM string */
export function minutesToTimeString(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
