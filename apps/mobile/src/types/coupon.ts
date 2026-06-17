import type { DriverLevel } from "@driven-rewards/shared";

export type { DriverLevel };

export type CouponType = "percent_off" | "fixed_off" | "free_item" | "bogo";

export type PartnerCategory =
  | "cafe"
  | "gas_station"
  | "restaurant"
  | "repair_shop"
  | "car_wash"
  | "tire_shop"
  | "grocery"
  | "other";

export interface Coupon {
  id: string;
  partnerId: string;
  partnerName: string;
  title: string;
  description?: string;
  type: CouponType;
  value: number;
  category: PartnerCategory;
  minDriverLevel: DriverLevel | "any";
  bonusPoints: number;
  terms: string[];
  expiresAt: string;
  maxUsesPerUser: number;
  usesRemaining: number | null;
  availableHoursStart?: string;
  availableHoursEnd?: string;
  isFeatured: boolean;
  distanceKm?: number;
  isRoutine?: boolean;
  routineEtaMinutes?: number;
  isEligible: boolean;
  ineligibleReason?: string;
}

export type CouponFilterKey =
  | "all"
  | "routine"
  | "nearby"
  | "cafe"
  | "gas"
  | "restaurant"
  | "repair";

export interface CouponFilters {
  filter: CouponFilterKey;
  search: string;
}

export interface CouponsPage {
  items: Coupon[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface GenerateQRResponse {
  redemptionId: string;
  qrToken: string;
  expiresAt: string;
  bonusPoints: number;
  coupon: Coupon;
}

export interface RedemptionStatus {
  id: string;
  status: "pending" | "confirmed" | "expired";
  qrExpiresAt: string;
  bonusPoints: number;
  confirmedAt?: string;
}

export interface ScanRedemptionResult {
  confirmed: true;
  bonusPoints: number;
  driverName: string;
  couponTitle: string;
}

export const CATEGORY_ICON: Record<PartnerCategory, string> = {
  cafe: "coffee",
  gas_station: "gas-station",
  restaurant: "tools-kitchen-2",
  repair_shop: "tool",
  car_wash: "droplet",
  tire_shop: "steering-wheel",
  grocery: "shopping-bag",
  other: "building-store",
};

export const CATEGORY_COLOR: Record<PartnerCategory, string> = {
  cafe: "#10B981",
  gas_station: "#A855F7",
  restaurant: "#EAB308",
  repair_shop: "#60A5FA",
  car_wash: "#34D399",
  tire_shop: "#C084FC",
  grocery: "#FDE047",
  other: "rgba(255,255,255,0.4)",
};

export function displayValue(type: CouponType, value: number): string {
  if (type === "percent_off") return `${value}%`;
  if (type === "fixed_off") return `$${(value / 100).toFixed(0)}`;
  if (type === "free_item") return "Free";
  return "2×1";
}
