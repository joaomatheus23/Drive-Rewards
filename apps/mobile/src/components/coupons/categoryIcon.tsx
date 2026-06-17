/**
 * Category icon resolver for coupon UI
 */
import type { ReactNode } from "react";
import {
  IconBuildingStore,
  IconCoffee,
  IconDroplet,
  IconGasStation,
  IconShoppingBag,
  IconSteeringWheel,
  IconTool,
  IconToolsKitchen2,
} from "@tabler/icons-react-native";
import type { PartnerCategory } from "../../types/coupon";

export function getCategoryIcon(
  category: PartnerCategory,
  size: number,
  color: string,
): ReactNode {
  const props = { size, color, strokeWidth: 2 as const };

  switch (category) {
    case "cafe":
      return <IconCoffee {...props} />;
    case "gas_station":
      return <IconGasStation {...props} />;
    case "restaurant":
      return <IconToolsKitchen2 {...props} />;
    case "repair_shop":
      return <IconTool {...props} />;
    case "car_wash":
      return <IconDroplet {...props} />;
    case "tire_shop":
      return <IconSteeringWheel {...props} />;
    case "grocery":
      return <IconShoppingBag {...props} />;
    default:
      return <IconBuildingStore {...props} />;
  }
}
