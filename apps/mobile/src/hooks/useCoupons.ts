/**
 * useCoupons
 * Role: mobile
 * Entry: CouponsScreen list
 * Exit: paginated coupon data with refresh and infinite scroll
 */
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchNearbyCoupons } from "../services/coupon.service";
import { useCouponStore } from "../store/couponStore";

const PAGE_SIZE = 10;

export function useCoupons() {
  const currentLocation = useCouponStore((s) => s.currentLocation);
  const filter = useCouponStore((s) => s.filter);
  const search = useCouponStore((s) => s.search);

  const query = useInfiniteQuery({
    queryKey: ["coupons", filter, search, currentLocation?.lat, currentLocation?.lng],
    queryFn: ({ pageParam }) =>
      fetchNearbyCoupons({
        page: pageParam,
        limit: PAGE_SIZE,
        filter: filter === "all" ? undefined : filter,
        search: search.trim() || undefined,
        lat: currentLocation?.lat,
        lng: currentLocation?.lng,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });

  const coupons = query.data?.pages.flatMap((page) => page.items) ?? [];

  return {
    coupons,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    isFetchingNextPage: query.isFetchingNextPage,
    error: query.error,
    refetch: query.refetch,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage ?? false,
  };
}
