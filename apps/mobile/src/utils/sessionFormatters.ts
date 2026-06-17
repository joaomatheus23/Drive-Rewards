import type { SessionPlatform } from "@driven-rewards/shared";

const PLATFORM_LABELS: Record<SessionPlatform, string> = {
  uber: "Uber",
  lyft: "Lyft",
  doordash: "DoorDash",
  skip: "Skip",
  ubereats: "UberEats",
  manual: "Manual",
};

export function formatSessionPlatform(platform?: SessionPlatform): string {
  if (!platform) return "Session";
  return PLATFORM_LABELS[platform] ?? platform;
}

export function formatSessionDate(value: Date | string): string {
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}
