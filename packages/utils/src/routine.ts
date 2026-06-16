import type { DayOfWeek } from "@driven-rewards/shared";
import { ROUTINE } from "./constants.js";

/** Check if two time windows overlap within tolerance (±20 min) */
export function timeWindowsMatch(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
  toleranceMinutes: number = ROUTINE.TIME_TOLERANCE_MINUTES,
): boolean {
  const aMid = (aStart + aEnd) / 2;
  const bMid = (bStart + bEnd) / 2;
  return Math.abs(aMid - bMid) <= toleranceMinutes;
}

/** Check if day sets have sufficient overlap for routine detection */
export function daysOverlap(a: DayOfWeek[], b: DayOfWeek[]): DayOfWeek[] {
  return a.filter((d) => b.includes(d));
}

/** Minutes from midnight for a given Date */
export function minutesFromMidnight(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}
