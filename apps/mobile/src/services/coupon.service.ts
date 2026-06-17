/**
 * Coupon API client
 * Role: mobile
 * Entry: coupon hooks and screens
 * Exit: typed HTTP calls to /coupons and /redemptions
 */
import type {
  Coupon,
  CouponsPage,
  GenerateQRResponse,
  RedemptionStatus,
  ScanRedemptionResult,
} from "../types/coupon";
import { api } from "./api";

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export interface FetchCouponsParams {
  lat?: number;
  lng?: number;
  page?: number;
  limit?: number;
  filter?: string;
  search?: string;
}

export async function fetchNearbyCoupons(
  params: FetchCouponsParams,
): Promise<CouponsPage> {
  const { data } = await api.get<ApiEnvelope<CouponsPage>>("/coupons/nearby", {
    params,
  });
  return data.data;
}

export async function fetchCouponById(
  id: string,
  lat?: number,
  lng?: number,
): Promise<Coupon> {
  const { data } = await api.get<ApiEnvelope<Coupon>>(`/coupons/${id}`, {
    params: { lat, lng },
  });
  return data.data;
}

export async function generateCouponQr(
  couponId: string,
  lat?: number,
  lng?: number,
): Promise<GenerateQRResponse> {
  const { data } = await api.post<ApiEnvelope<GenerateQRResponse>>(
    "/redemptions/generate-qr",
    { couponId, lat, lng },
  );
  return data.data;
}

export async function fetchRedemptionStatus(
  redemptionId: string,
): Promise<RedemptionStatus> {
  const { data } = await api.get<ApiEnvelope<RedemptionStatus>>(
    `/redemptions/${redemptionId}`,
  );
  return data.data;
}

export async function invalidateRedemption(redemptionId: string): Promise<void> {
  await api.delete(`/redemptions/${redemptionId}`);
}

export async function scanRedemptionQr(
  qrPayload: string,
): Promise<ScanRedemptionResult> {
  const { data } = await api.post<ApiEnvelope<ScanRedemptionResult>>(
    "/redemptions/scan",
    { qrToken: qrPayload },
  );
  return data.data;
}
