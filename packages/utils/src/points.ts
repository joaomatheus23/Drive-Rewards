import { POINTS } from "./constants.js";
import type { DriverLevel } from "@driven-rewards/shared";

/** Calculate points earned for a given distance */
export function pointsForKm(km: number): number {
  return Math.floor(km * POINTS.PER_KM);
}

/** Determine driver level from total points */
export function levelFromPoints(points: number): DriverLevel {
  if (points >= POINTS.LEVELS.platinum) return "platinum";
  if (points >= POINTS.LEVELS.gold) return "gold";
  if (points >= POINTS.LEVELS.silver) return "silver";
  return "bronze";
}
