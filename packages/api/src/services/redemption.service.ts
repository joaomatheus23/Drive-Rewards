/**
 * Redemption QR flow
 * Role: api
 * Entry: redemption routes
 * Exit: QR generation and status polling
 */
import { randomUUID } from "node:crypto";
import { parseRedemptionQrPayload } from "@driven-rewards/utils";
import { Coupon } from "../models/coupon.model.js";
import { Partner } from "../models/partner.model.js";
import { Redemption } from "../models/redemption.model.js";
import { User } from "../models/user.model.js";
import { getDriverCouponById } from "./coupon.service.js";

const QR_TTL_MS = 15 * 60 * 1000;

export interface GenerateQrResult {
  redemptionId: string;
  qrToken: string;
  expiresAt: string;
  bonusPoints: number;
  coupon: Awaited<ReturnType<typeof getDriverCouponById>>;
}

export interface RedemptionStatusDto {
  id: string;
  status: "pending" | "confirmed" | "expired";
  qrExpiresAt: string;
  bonusPoints: number;
  confirmedAt?: string;
}

export async function generateCouponQr(
  userId: string,
  couponId: string,
  lat?: number,
  lng?: number,
): Promise<GenerateQrResult> {
  const coupon = await getDriverCouponById(userId, couponId, lat, lng);
  if (!coupon.isEligible) {
    throw new Error(coupon.ineligibleReason ?? "Not eligible for this coupon");
  }

  const dbCoupon = await Coupon.findById(couponId);
  const partner = await Partner.findById(dbCoupon?.partnerId);
  if (!dbCoupon || !partner) throw new Error("Coupon not found");

  const qrToken = randomUUID();
  const qrExpiresAt = new Date(Date.now() + QR_TTL_MS);
  const commissionAmount = Math.round((dbCoupon.value / 100) * partner.commissionRate);

  const redemption = await Redemption.create({
    userId,
    couponId: dbCoupon._id,
    partnerId: partner._id,
    commissionAmount,
    redeemedAt: new Date(),
    status: "pending",
    qrToken,
    qrExpiresAt,
    bonusPoints: coupon.bonusPoints,
  });

  return {
    redemptionId: redemption._id.toString(),
    qrToken,
    expiresAt: qrExpiresAt.toISOString(),
    bonusPoints: coupon.bonusPoints,
    coupon,
  };
}

export async function getRedemptionStatus(
  userId: string,
  redemptionId: string,
): Promise<RedemptionStatusDto> {
  const redemption = await Redemption.findOne({ _id: redemptionId, userId });
  if (!redemption) throw new Error("Redemption not found");

  if (
    redemption.status === "pending" &&
    redemption.qrExpiresAt &&
    redemption.qrExpiresAt <= new Date()
  ) {
    redemption.status = "expired";
    await redemption.save();
  }

  return {
    id: redemption._id.toString(),
    status: redemption.status as RedemptionStatusDto["status"],
    qrExpiresAt: redemption.qrExpiresAt?.toISOString() ?? new Date().toISOString(),
    bonusPoints: redemption.bonusPoints ?? 0,
    confirmedAt:
      redemption.status === "confirmed" ? redemption.redeemedAt.toISOString() : undefined,
  };
}

export interface ScanRedemptionResult {
  confirmed: true;
  bonusPoints: number;
  driverName: string;
  couponTitle: string;
}

export async function confirmRedemptionByToken(
  qrTokenOrPayload: string,
  partnerId?: string,
): Promise<ScanRedemptionResult> {
  const qrToken = parseRedemptionQrPayload(qrTokenOrPayload);
  const redemption = await Redemption.findOne({ qrToken, status: "pending" });
  if (!redemption) throw new Error("Invalid or expired QR code");
  if (redemption.qrExpiresAt && redemption.qrExpiresAt <= new Date()) {
    redemption.status = "expired";
    await redemption.save();
    throw new Error("QR code expired");
  }

  if (partnerId && redemption.partnerId.toString() !== partnerId) {
    throw new Error("This QR code is not valid at this location");
  }

  const [coupon, driver] = await Promise.all([
    Coupon.findById(redemption.couponId).select("title"),
    User.findById(redemption.userId).select("name"),
  ]);

  redemption.status = "confirmed";
  await redemption.save();

  await Coupon.findByIdAndUpdate(redemption.couponId, { $inc: { redemptionCount: 1 } });

  if (redemption.bonusPoints > 0) {
    await User.findByIdAndUpdate(redemption.userId, {
      $inc: { points: redemption.bonusPoints },
    });
  }

  return {
    confirmed: true,
    bonusPoints: redemption.bonusPoints ?? 0,
    driverName: driver?.name ?? "Driver",
    couponTitle: coupon?.title ?? "Coupon",
  };
}

export async function invalidateRedemption(userId: string, redemptionId: string): Promise<void> {
  const redemption = await Redemption.findOne({ _id: redemptionId, userId, status: "pending" });
  if (!redemption) return;
  redemption.status = "expired";
  await redemption.save();
}
