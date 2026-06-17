/**
 * useDriverTabBarPadding
 * Role: mobile
 * Entry: driver tab screens with floating tab bar overlay
 * Exit: bottom padding to keep CTAs above the tab bar
 */
import { Layout } from "../theme";

export function useDriverTabBarPadding(): number {
  return Layout.tabBar.reservedBottom;
}
