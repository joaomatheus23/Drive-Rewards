/**
 * Driver coupon API DTOs and listing logic
 * Role: api
 * Entry: coupon routes
 * Exit: enriched coupon payloads for mobile
 */
import type { DriverLevel } from "@driven-rewards/shared";
import { haversineKm } from "@driven-rewards/utils";
import type { CouponDocument } from "../models/coupon.model.js";
import { Coupon } from "../models/coupon.model.js";
import type { PartnerDocument } from "../models/partner.model.js";
import { Partner } from "../models/partner.model.js";
import { Redemption } from "../models/redemption.model.js";
import { User } from "../models/user.model.js";

export type PartnerCategory =
  | "cafe"
  | "gas_station"
  | "restaurant"
  | "repair_shop"
  | "car_wash"
  | "tire_shop"
  | "grocery"
  | "other";

export type MobileCouponType = "percent_off" | "fixed_off" | "free_item" | "bogo";

export interface DriverCouponDto {
  id: string;
  partnerId: string;
  partnerName: string;
  title: string;
  description?: string;
  type: MobileCouponType;
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

const LEVEL_RANK: Record<DriverLevel | "any", number> = {
  any: 0,
  bronze: 1,
  silver: 2,
  gold: 3,
  platinum: 4,
};

function mapCouponType(type: string): MobileCouponType {
  if (type === "percentage") return "percent_off";
  if (type === "fixed") return "fixed_off";
  if (type === "bogo") return "bogo";
  return "free_item";
}

function isWithinHours(start?: string, end?: string): boolean {
  if (!start || !end) return true;
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;
  if (startMin <= endMin) return minutes >= startMin && minutes <= endMin;
  return minutes >= startMin || minutes <= endMin;
}

async function countUserRedemptions(userId: string, couponId: string): Promise<number> {
  return Redemption.countDocuments({
    userId,
    couponId,
    status: { $in: ["pending", "confirmed"] },
  });
}

export async function buildDriverCouponDto(
  coupon: CouponDocument,
  partner: PartnerDocument,
  userId: string,
  driverLevel: DriverLevel,
  lat?: number,
  lng?: number,
): Promise<DriverCouponDto> {
  const partnerLat = partner.location.coordinates[1];
  const partnerLng = partner.location.coordinates[0];
  const distanceKm =
    lat !== undefined && lng !== undefined
      ? Number(haversineKm(lat, lng, partnerLat, partnerLng).toFixed(1))
      : undefined;

  const isRoutine = distanceKm !== undefined && distanceKm <= 2;
  const routineEtaMinutes = isRoutine ? Math.max(2, Math.round(distanceKm * 3)) : undefined;

  const userUses = await countUserRedemptions(userId, coupon._id.toString());
  const maxUses = coupon.maxUsesPerUser ?? 1;
  const usesRemaining = maxUses > 0 ? Math.max(0, maxUses - userUses) : null;

  let isEligible = true;
  let ineligibleReason: string | undefined;

  const minLevel = (coupon.minDriverLevel ?? "any") as DriverLevel | "any";
  if (LEVEL_RANK[driverLevel] < LEVEL_RANK[minLevel]) {
    isEligible = false;
    ineligibleReason = `Requires ${minLevel} level or higher`;
  } else if (!coupon.isActive || coupon.expiresAt <= new Date()) {
    isEligible = false;
    ineligibleReason = "Coupon expired";
  } else if (coupon.redemptionLimit > 0 && coupon.redemptionCount >= coupon.redemptionLimit) {
    isEligible = false;
    ineligibleReason = "No redemptions left";
  } else if (usesRemaining !== null && usesRemaining <= 0) {
    isEligible = false;
    ineligibleReason = "You already used this coupon";
  } else if (!isWithinHours(coupon.availableHoursStart, coupon.availableHoursEnd)) {
    isEligible = false;
    ineligibleReason = "Outside available hours";
  }

  return {
    id: coupon._id.toString(),
    partnerId: partner._id.toString(),
    partnerName: partner.name,
    title: coupon.title,
    description: coupon.description,
    type: mapCouponType(coupon.type),
    value: coupon.value,
    category: (coupon.category ?? "other") as PartnerCategory,
    minDriverLevel: minLevel,
    bonusPoints: coupon.bonusPoints ?? 25,
    terms: coupon.terms ?? [],
    expiresAt: coupon.expiresAt.toISOString(),
    maxUsesPerUser: maxUses,
    usesRemaining,
    availableHoursStart: coupon.availableHoursStart,
    availableHoursEnd: coupon.availableHoursEnd,
    isFeatured: coupon.isFeatured ?? false,
    distanceKm,
    isRoutine,
    routineEtaMinutes,
    isEligible,
    ineligibleReason,
  };
}

export interface ListCouponsQuery {
  lat?: number;
  lng?: number;
  page: number;
  limit: number;
  filter?: string;
  search?: string;
}

export async function listNearbyCoupons(
  userId: string,
  query: ListCouponsQuery,
): Promise<{ items: DriverCouponDto[]; total: number; page: number; limit: number; hasMore: boolean }> {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const driverLevel = (user.level ?? "bronze") as DriverLevel;
  const coupons = await Coupon.find({ isActive: true, expiresAt: { $gt: new Date() } })
    .sort({ isFeatured: -1, expiresAt: 1 })
    .lean(false);

  const partnerIds = [...new Set(coupons.map((c) => c.partnerId.toString()))];
  const partners = await Partner.find({ _id: { $in: partnerIds }, isActive: true });
  const partnerMap = new Map(partners.map((p) => [p._id.toString(), p]));

  let items: DriverCouponDto[] = [];
  for (const coupon of coupons) {
    const partner = partnerMap.get(coupon.partnerId.toString());
    if (!partner) continue;
    const dto = await buildDriverCouponDto(
      coupon,
      partner,
      userId,
      driverLevel,
      query.lat,
      query.lng,
    );
    items.push(dto);
  }

  if (query.search?.trim()) {
    const term = query.search.trim().toLowerCase();
    items = items.filter(
      (c) =>
        c.title.toLowerCase().includes(term) ||
        c.partnerName.toLowerCase().includes(term),
    );
  }

  const filter = query.filter ?? "all";
  if (filter === "routine") {
    items = items.filter((c) => c.isRoutine);
  } else if (filter === "nearby") {
    items = items.filter((c) => c.distanceKm !== undefined && c.distanceKm <= 5);
  } else if (filter === "cafe") {
    items = items.filter((c) => c.category === "cafe");
  } else if (filter === "gas") {
    items = items.filter((c) => c.category === "gas_station");
  } else if (filter === "restaurant") {
    items = items.filter((c) => c.category === "restaurant");
  } else if (filter === "repair") {
    items = items.filter((c) => c.category === "repair_shop");
  }

  items.sort((a, b) => {
    if (a.isRoutine !== b.isRoutine) return a.isRoutine ? -1 : 1;
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
    return (a.distanceKm ?? 999) - (b.distanceKm ?? 999);
  });

  const total = items.length;
  const skip = (query.page - 1) * query.limit;
  const pageItems = items.slice(skip, skip + query.limit);

  return {
    items: pageItems,
    total,
    page: query.page,
    limit: query.limit,
    hasMore: skip + query.limit < total,
  };
}

export async function getDriverCouponById(
  userId: string,
  couponId: string,
  lat?: number,
  lng?: number,
): Promise<DriverCouponDto> {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const coupon = await Coupon.findById(couponId);
  if (!coupon || !coupon.isActive) throw new Error("Coupon not found");

  const partner = await Partner.findById(coupon.partnerId);
  if (!partner) throw new Error("Partner not found");

  return buildDriverCouponDto(
    coupon,
    partner,
    userId,
    (user.level ?? "bronze") as DriverLevel,
    lat,
    lng,
  );
}
