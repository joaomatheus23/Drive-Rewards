import { useLocalSearchParams } from "expo-router";
import { CouponDetailScreen } from "../../../screens/coupons/CouponDetailScreen";

export default function CouponDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <CouponDetailScreen couponId={id} />;
}
