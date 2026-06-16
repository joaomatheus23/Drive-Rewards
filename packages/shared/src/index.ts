/** JWT role claims — determines which app/interface the user sees after login */
export type UserRole =
  | "driver"
  | "partner_owner"
  | "partner_staff"
  | "admin"
  | "super_admin";

/** Subscription tier for partner businesses */
export type PartnerPlan = "free" | "basic" | "premium" | "enterprise";

/** Coupon discount type */
export type CouponType = "percentage" | "fixed" | "bogo" | "free_item";

/** Points ledger entry type */
export type PointsLedgerType =
  | "session"
  | "redemption"
  | "bonus"
  | "referral"
  | "adjustment";

/** Driver gamification level */
export type DriverLevel = "bronze" | "silver" | "gold" | "platinum";

/** Days of the week (0 = Sunday) */
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** GeoJSON Point for geofencing */
export interface GeoPoint {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

/** Geofence circle around a partner location */
export interface Geofence {
  center: GeoPoint;
  radiusMeters: number;
}

/** Time window for routine detection (minutes from midnight) */
export interface TimeWindow {
  startMinutes: number;
  endMinutes: number;
}

/** JWT access token payload */
export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  partnerId?: string;
}

/** Standard API response envelope */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

/** Pagination query params */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/** Paginated list response */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export * from "./models/user.js";
export * from "./models/partner.js";
export * from "./models/coupon.js";
export * from "./models/redemption.js";
export * from "./models/session.js";
export * from "./models/routine.js";
export * from "./models/notification.js";
export * from "./models/points-ledger.js";
export * from "./auth.js";
