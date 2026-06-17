/**
 * useCouponDetail
 * Role: mobile
 * Entry: CouponDetailScreen
 * Exit: single coupon with loading and error state
 */
import { useQuery } from "@tanstack/react-query";
import { fetchCouponById } from "../services/coupon.service";
import { useCouponStore } from "../store/couponStore";

export function useCouponDetail(couponId: string) {
  const currentLocation = useCouponStore((s) => s.currentLocation);

  const query = useQuery({
    queryKey: ["coupon", couponId, currentLocation?.lat, currentLocation?.lng],
    queryFn: () =>
      fetchCouponById(couponId, currentLocation?.lat, currentLocation?.lng),
    enabled: Boolean(couponId),
  });

  return {
    coupon: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
