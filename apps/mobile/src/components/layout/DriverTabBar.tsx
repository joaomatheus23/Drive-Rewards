/**
 * DriverTabBar
 * Role: driver
 * Entry: driver tabs layout
 * Exit: tab navigation
 */
import {
  IconHome,
  IconMap,
  IconTicket,
  IconUser,
} from "@tabler/icons-react-native";
import { TabBar } from "./TabBar";

const DRIVER_TABS = [
  { key: "index", label: "Home", icon: IconHome },
  { key: "session", label: "Session", icon: IconMap },
  { key: "coupons", label: "Coupons", icon: IconTicket },
  { key: "profile", label: "Profile", icon: IconUser },
];

interface DriverTabBarProps {
  state: { index: number; routes: { name: string }[] };
  navigation: { navigate: (name: string) => void };
}

export function DriverTabBar({ state, navigation }: DriverTabBarProps) {
  const activeKey = state.routes[state.index]?.name ?? "index";

  return (
    <TabBar
      tabs={DRIVER_TABS}
      activeKey={activeKey}
      onTabPress={(key) => navigation.navigate(key)}
    />
  );
}
