/**
 * Coupon Zustand store
 * Role: mobile
 * Entry: coupons screens and hooks
 * Exit: shared location, filters and active redemption state
 */
import type { CouponFilterKey, CouponType } from "../types/coupon";
import { create } from "zustand";

export interface CouponLocation {
  lat: number;
  lng: number;
}

export interface ActiveRedemption {
  redemptionId: string;
  qrToken: string;
  expiresAt: string;
  bonusPoints: number;
  partnerName: string;
  title: string;
  type: CouponType;
  value: number;
}

interface CouponState {
  currentLocation: CouponLocation | null;
  filter: CouponFilterKey;
  search: string;
  activeRedemptionId: string | null;
  activeRedemption: ActiveRedemption | null;
  setCurrentLocation: (location: CouponLocation | null) => void;
  setFilter: (filter: CouponFilterKey) => void;
  setSearch: (search: string) => void;
  setActiveRedemptionId: (id: string | null) => void;
  setActiveRedemption: (redemption: ActiveRedemption | null) => void;
}

export const useCouponStore = create<CouponState>((set) => ({
  currentLocation: null,
  filter: "all",
  search: "",
  activeRedemptionId: null,
  activeRedemption: null,

  setCurrentLocation: (currentLocation) => set({ currentLocation }),
  setFilter: (filter) => set({ filter }),
  setSearch: (search) => set({ search }),
  setActiveRedemptionId: (activeRedemptionId) => set({ activeRedemptionId }),
  setActiveRedemption: (activeRedemption) =>
    set({
      activeRedemption,
      activeRedemptionId: activeRedemption?.redemptionId ?? null,
    }),
}));
